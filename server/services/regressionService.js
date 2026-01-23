const PerformanceRegression = require("../models/PerformanceRegression");
const Check = require("../models/Check");
const Notification = require("../models/Notification");
const {
  calculateMean,
  calculateStdDev,
  calculatePercentile,
  welchTTest,
} = require("../utils/statistics");
const { diagnosePerformanceRegression } = require("./aiService");

const BASELINE_DAYS = 7;
const CURRENT_HOURS = 24;
const MIN_SAMPLES = 10;
const SIGNIFICANCE_LEVEL = 0.05;
const DEGRADATION_THRESHOLD = 20;

const detectRegression = async (api, userId) => {
  const now = new Date();
  const baselineStart = new Date(
    now.getTime() - BASELINE_DAYS * 24 * 60 * 60 * 1000,
  );
  const currentStart = new Date(now.getTime() - CURRENT_HOURS * 60 * 60 * 1000);
  const [baselineChecks, currentChecks] = await Promise.all([
    Check.find({
      apiId: api._id,
      timestamp: { $gte: baselineStart, $lt: currentStart },
      success: true,
    })
      .select("responseTime")
      .lean(),
    Check.find({
      apiId: api._id,
      timestamp: { $gte: currentStart },
      success: true,
    })
      .select("responseTime")
      .lean(),
  ]);
  if (
    baselineChecks.length < MIN_SAMPLES ||
    currentChecks.length < MIN_SAMPLES
  ) {
    return null;
  }
  const baselineTimes = baselineChecks.map((c) => c.responseTime);
  const currentTimes = currentChecks.map((c) => c.responseTime);
  const baselineStats = {
    mean: calculateMean(baselineTimes),
    stdDev: calculateStdDev(baselineTimes),
    p95: calculatePercentile(baselineTimes, 95),
    p99: calculatePercentile(baselineTimes, 99),
    sampleSize: baselineTimes.length,
  };
  const currentStats = {
    mean: calculateMean(currentTimes),
    stdDev: calculateStdDev(currentTimes),
    p95: calculatePercentile(currentTimes, 95),
    p99: calculatePercentile(currentTimes, 99),
    sampleSize: currentTimes.length,
  };
  const tTestResult = welchTTest(currentTimes, baselineTimes);
  const degradationPercent =
    ((currentStats.mean - baselineStats.mean) / baselineStats.mean) * 100;
  if (
    degradationPercent < DEGRADATION_THRESHOLD ||
    tTestResult.pValue > SIGNIFICANCE_LEVEL
  ) {
    return null;
  }
  const existingRegression = await PerformanceRegression.findOne({
    apiId: api._id,
    status: { $in: ["active", "investigating"] },
    detectedAt: { $gte: currentStart },
  });
  if (existingRegression) {
    return existingRegression;
  }
  const aiDiagnosis = await diagnosePerformanceRegression(
    api.name,
    baselineStats,
    currentStats,
    degradationPercent,
  );
  const regression = await PerformanceRegression.create({
    apiId: api._id,
    userId,
    baselinePeriod: { start: baselineStart, end: currentStart },
    baselineStats,
    currentStats,
    degradationPercent: Number(degradationPercent.toFixed(2)),
    confidenceLevel: Number(((1 - tTestResult.pValue) * 100).toFixed(2)),
    tTestPValue: tTestResult.pValue,
    aiDiagnosis,
  });
  await Notification.create({
    userId,
    type: "performance_regression",
    message: `Performance regression detected for "${api.name}": ${degradationPercent.toFixed(1)}% slower (${baselineStats.mean.toFixed(0)}ms → ${currentStats.mean.toFixed(0)}ms)`,
    metadata: {
      apiId: api._id,
      severity: degradationPercent > 50 ? "critical" : "high",
      data: { regressionId: regression._id, degradationPercent },
    },
  });
  return regression;
};

const getRegressions = async (userId, options = {}) => {
  const { status, apiId, limit = 50 } = options;
  const query = { userId };
  if (status) query.status = status;
  if (apiId) query.apiId = apiId;
  return PerformanceRegression.find(query)
    .populate("apiId", "name url")
    .sort({ detectedAt: -1 })
    .limit(limit)
    .lean();
};

const updateRegressionStatus = async (regressionId, status) => {
  const update = { status };
  if (status === "resolved" || status === "false_positive") {
    update.resolvedAt = new Date();
  }
  return PerformanceRegression.findByIdAndUpdate(regressionId, update, {
    new: true,
  });
};

const getRegressionTrend = async (apiId, days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const regressions = await PerformanceRegression.find({
    apiId,
    detectedAt: { $gte: since },
  })
    .select("detectedAt degradationPercent status")
    .sort({ detectedAt: 1 })
    .lean();
  return {
    total: regressions.length,
    resolved: regressions.filter((r) => r.status === "resolved").length,
    falsePositives: regressions.filter((r) => r.status === "false_positive")
      .length,
    avgDegradation:
      regressions.length > 0
        ? Number(
            (
              regressions.reduce((sum, r) => sum + r.degradationPercent, 0) /
              regressions.length
            ).toFixed(2),
          )
        : 0,
    timeline: regressions.map((r) => ({
      date: r.detectedAt,
      degradation: r.degradationPercent,
      status: r.status,
    })),
  };
};

module.exports = {
  detectRegression,
  getRegressions,
  updateRegressionStatus,
  getRegressionTrend,
};
