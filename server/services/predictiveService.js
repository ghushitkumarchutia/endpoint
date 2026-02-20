const PredictiveAlert = require("../models/PredictiveAlert");
const Check = require("../models/Check");
const Notification = require("../models/Notification");
const { calculateMean, calculateStdDev } = require("../utils/statistics");
const { generatePredictiveAnalysis } = require("./aiService");

const ANALYSIS_WINDOW_HOURS = 6;
const MIN_CHECKS = 5;

const analyzeForPrediction = async (api, userId) => {
  const windowStart = new Date(
    Date.now() - ANALYSIS_WINDOW_HOURS * 60 * 60 * 1000,
  );
  const recentChecks = await Check.find({
    apiId: api._id,
    timestamp: { $gte: windowStart },
  })
    .sort({ timestamp: -1 })
    .lean();
  if (recentChecks.length < MIN_CHECKS) return null;
  const signals = detectWarningSignals(recentChecks, api);
  if (signals.length === 0) return null;
  const existingAlert = await PredictiveAlert.findOne({
    apiId: api._id,
    status: "active",
    createdAt: { $gte: windowStart },
  });
  if (existingAlert) {
    existingAlert.earlyWarningSignals = signals;
    await existingAlert.save();
    return existingAlert;
  }
  const failureProbability = calculateFailureProbability(signals);
  if (failureProbability < 30) return null;
  const responseTimes = recentChecks.map((c) => c.responseTime);
  const errorCount = recentChecks.filter((c) => !c.success).length;
  const recentMetrics = {
    avgResponseTime: calculateMean(responseTimes).toFixed(0),
    errorRate: ((errorCount / recentChecks.length) * 100).toFixed(1),
    trend: detectTrend(responseTimes),
  };
  const aiPrediction = await generatePredictiveAnalysis(
    api.name,
    signals,
    recentMetrics,
  );
  const recommendedActions = generateRecommendations(signals);
  const alert = await PredictiveAlert.create({
    apiId: api._id,
    userId,
    failureProbability,
    predictedFailureTime: estimateFailureTime(signals, failureProbability),
    earlyWarningSignals: signals,
    aiPrediction,
    recommendedActions,
  });
  await Notification.create({
    userId,
    type: "predictive_alert",
    message: `Potential failure predicted for "${api.name}" with ${failureProbability}% probability`,
    metadata: {
      apiId: api._id,
      severity:
        failureProbability >= 70
          ? "critical"
          : failureProbability >= 50
            ? "high"
            : "medium",
      data: { alertId: alert._id, probability: failureProbability },
    },
  });
  return alert;
};

const detectWarningSignals = (checks, api) => {
  const signals = [];
  const responseTimes = checks.map((c) => c.responseTime);
  const mean = calculateMean(responseTimes);
  const stdDev = calculateStdDev(responseTimes, mean);
  const recentMean = calculateMean(
    responseTimes.slice(0, Math.ceil(responseTimes.length / 3)),
  );
  if (recentMean > mean * 1.3) {
    signals.push({
      signal: "Response time increasing trend",
      severity: recentMean > mean * 1.5 ? "high" : "medium",
      value: recentMean.toFixed(0),
      threshold: mean.toFixed(0),
      detectedAt: new Date(),
    });
  }
  if (stdDev > mean * 0.5) {
    signals.push({
      signal: "High response time variability",
      severity: stdDev > mean ? "high" : "medium",
      value: stdDev.toFixed(0),
      threshold: (mean * 0.5).toFixed(0),
      detectedAt: new Date(),
    });
  }
  const recentFailures = checks.slice(0, 10).filter((c) => !c.success).length;
  if (recentFailures >= 2) {
    signals.push({
      signal: "Increasing error rate",
      severity:
        recentFailures >= 4
          ? "critical"
          : recentFailures >= 3
            ? "high"
            : "medium",
      value: recentFailures,
      threshold: 1,
      detectedAt: new Date(),
    });
  }
  const timeouts = checks
    .slice(0, 10)
    .filter((c) => c.errorType === "timeout").length;
  if (timeouts >= 2) {
    signals.push({
      signal: "Multiple timeouts detected",
      severity: timeouts >= 3 ? "high" : "medium",
      value: timeouts,
      threshold: 1,
      detectedAt: new Date(),
    });
  }
  if (api.consecutiveFailures >= 2) {
    signals.push({
      signal: "Consecutive failures pattern",
      severity: api.consecutiveFailures >= 3 ? "critical" : "high",
      value: api.consecutiveFailures,
      threshold: 1,
      detectedAt: new Date(),
    });
  }
  return signals;
};

const calculateFailureProbability = (signals) => {
  let probability = 0;
  const severityWeights = { low: 10, medium: 20, high: 35, critical: 50 };
  for (const signal of signals) {
    probability += severityWeights[signal.severity] || 10;
  }
  return Math.min(Math.round(probability), 95);
};

const detectTrend = (values) => {
  if (values.length < 3) return "stable";
  const firstHalf = values.slice(Math.floor(values.length / 2));
  const secondHalf = values.slice(0, Math.floor(values.length / 2));
  const firstMean = calculateMean(firstHalf);
  const secondMean = calculateMean(secondHalf);
  const change = ((secondMean - firstMean) / firstMean) * 100;
  if (change > 15) return "degrading";
  if (change < -15) return "improving";
  return "stable";
};

const estimateFailureTime = (signals, probability) => {
  if (probability < 50) return null;
  const criticalSignals = signals.filter(
    (s) => s.severity === "critical" || s.severity === "high",
  );
  const hoursToFailure =
    criticalSignals.length >= 2 ? 1 : criticalSignals.length === 1 ? 3 : 6;
  return new Date(Date.now() + hoursToFailure * 60 * 60 * 1000);
};

const generateRecommendations = (signals) => {
  const recommendations = [];
  const signalTypes = signals.map((s) => s.signal);
  if (signalTypes.some((s) => s.includes("Response time"))) {
    recommendations.push({
      action: "Review server resource utilization and scale if needed",
      priority: "high",
      estimatedImpact: "May prevent response time degradation",
    });
  }
  if (
    signalTypes.some((s) => s.includes("error rate") || s.includes("failures"))
  ) {
    recommendations.push({
      action: "Check application logs for recurring errors",
      priority: "urgent",
      estimatedImpact: "Identify and fix root cause of errors",
    });
  }
  if (signalTypes.some((s) => s.includes("timeout"))) {
    recommendations.push({
      action: "Verify downstream dependencies and network connectivity",
      priority: "high",
      estimatedImpact: "Reduce timeout occurrences",
    });
  }
  recommendations.push({
    action: "Prepare incident response team for potential outage",
    priority: "medium",
    estimatedImpact: "Faster recovery if failure occurs",
  });
  return recommendations;
};

const getAlerts = async (userId, options = {}) => {
  const { status, apiId, limit = 50 } = options;
  const query = { userId };
  if (status) query.status = status;
  if (apiId) query.apiId = apiId;
  return PredictiveAlert.find(query)
    .populate("apiId", "name url")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

const updateAlertStatus = async (alertId, status) => {
  return PredictiveAlert.findByIdAndUpdate(alertId, { status }, { new: true });
};

module.exports = {
  analyzeForPrediction,
  getAlerts,
  updateAlertStatus,
};
