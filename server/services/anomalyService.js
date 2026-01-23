const Anomaly = require("../models/Anomaly");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { calculateAverage, calculateStdDev } = require("../utils/helpers");
const { generateAnomalyInsight } = require("./aiService");
const { sendAnomalyAlertEmail } = require("./emailService");
const { compareSchemas } = require("./schemaService");

const detectAnomaly = async (api, check, checksHistory) => {
  if (!check.success) {
    return await createAnomaly(api, check, "downtime", "high", 0, 100);
  }

  if (checksHistory.length < 5) {
    return null;
  }

  const responseTimes = checksHistory.map((c) => c.responseTime);
  const avg = calculateAverage(responseTimes);
  const stdDev = calculateStdDev(responseTimes);

  if (check.responseTime > avg + 2 * stdDev && check.responseTime > avg * 2) {
    let severity = "low";
    if (check.responseTime > avg * 3) severity = "high";
    else if (check.responseTime > avg * 2) severity = "medium";

    return await createAnomaly(
      api,
      check,
      "response_time_spike",
      severity,
      check.responseTime,
      Math.round(avg),
    );
  }

  return null;
};

const createAnomaly = async (
  api,
  check,
  type,
  severity,
  currentValue,
  expectedValue,
) => {
  let aiInsight = "Unable to generate AI insight at this time.";

  try {
    aiInsight = await generateAnomalyInsight(
      api.name,
      type,
      currentValue,
      expectedValue,
    );
  } catch (error) {
    console.error("AI insight generation failed:", error.message);
  }

  const anomaly = await Anomaly.create({
    apiId: api._id,
    checkId: check._id,
    type,
    severity,
    currentValue,
    expectedValue,
    aiInsight,
  });

  let user = null;
  try {
    user = await User.findById(api.userId).select("email").lean();
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
  }

  try {
    await Notification.create({
      userId: api.userId,
      anomalyId: anomaly._id,
      message: `${severity.toUpperCase()}: ${api.name} - ${type.replace(/_/g, " ")}`,
    });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }

  if (severity === "high" && user?.email) {
    // Fire and forget email - don't block on email failure
    sendAnomalyAlertEmail(user.email, api.name, type, severity).catch(
      (emailError) => {
        console.error("Failed to send alert email:", emailError.message);
      },
    );
  }

  return anomaly;
};

const detectSchemaDrift = async (api, check, currentSchema) => {
  if (!api.baselineSchema || !currentSchema) {
    return null;
  }

  const changes = compareSchemas(api.baselineSchema, currentSchema);

  if (changes.length > 0) {
    return await createAnomaly(
      api,
      check,
      "schema_drift",
      "medium",
      changes.length,
      0,
    );
  }

  return null;
};

module.exports = {
  detectAnomaly,
  detectSchemaDrift,
};
