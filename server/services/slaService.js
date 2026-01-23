const SLAReport = require("../models/SLAReport");
const Check = require("../models/Check");
const Api = require("../models/Api");
const Notification = require("../models/Notification");
const { calculatePercentile } = require("../utils/statistics");

const evaluateSLACompliance = async (api, check) => {
  if (!api.sla || !api.sla.enabled) return null;
  const breaches = [];
  if (api.sla.responseTimeP95 && check.responseTime > api.sla.responseTimeP95) {
    breaches.push({
      metric: "responseTime",
      target: api.sla.responseTimeP95,
      actual: check.responseTime,
    });
  }
  if (!check.success) {
    breaches.push({
      metric: "availability",
      target: "success",
      actual: check.error || "failure",
    });
  }
  return breaches.length > 0 ? breaches : null;
};

const generateSLAReport = async (apiId, userId, periodType = "daily") => {
  const api = await Api.findById(apiId);
  if (!api) throw new Error("API not found");
  const { start, end } = calculatePeriod(periodType);
  const checks = await Check.find({
    apiId,
    timestamp: { $gte: start, $lte: end },
  })
    .sort({ timestamp: 1 })
    .lean();
  if (checks.length === 0) {
    return null;
  }
  const responseTimes = checks.map((c) => c.responseTime);
  const successfulChecks = checks.filter((c) => c.success).length;
  const failedChecks = checks.length - successfulChecks;
  const targets = {
    uptime: api.sla?.uptimeTarget || 99.9,
    responseTimeP95: api.sla?.responseTimeP95 || 500,
    errorRate: api.sla?.errorRateMax || 1,
  };
  const metrics = {
    uptime: Number(((successfulChecks / checks.length) * 100).toFixed(3)),
    avgResponseTime: Number(
      (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(
        2,
      ),
    ),
    p95ResponseTime: Number(calculatePercentile(responseTimes, 95).toFixed(2)),
    p99ResponseTime: Number(calculatePercentile(responseTimes, 99).toFixed(2)),
    errorRate: Number(((failedChecks / checks.length) * 100).toFixed(3)),
    totalChecks: checks.length,
    successfulChecks,
    failedChecks,
  };
  const compliance = {
    uptimeCompliant: metrics.uptime >= targets.uptime,
    responseTimeCompliant: metrics.p95ResponseTime <= targets.responseTimeP95,
    errorRateCompliant: metrics.errorRate <= targets.errorRate,
    overall: false,
  };
  compliance.overall =
    compliance.uptimeCompliant &&
    compliance.responseTimeCompliant &&
    compliance.errorRateCompliant;
  const incidents = await detectIncidents(checks, api);
  const report = await SLAReport.create({
    apiId,
    userId,
    period: { start, end, type: periodType },
    metrics,
    targets,
    compliance,
    incidents,
  });
  if (!compliance.overall) {
    await createSLABreachNotification(api, userId, report);
  }
  return report;
};

const calculatePeriod = (periodType) => {
  const now = new Date();
  let start, end;
  switch (periodType) {
    case "daily":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "weekly":
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      end = now;
      break;
    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      end = now;
      break;
    default:
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      end = now;
  }
  return { start, end };
};

const detectIncidents = async (checks, api) => {
  const incidents = [];
  let incidentStart = null;
  for (const check of checks) {
    if (!check.success && !incidentStart) {
      incidentStart = {
        timestamp: check.timestamp,
        type: check.errorType || "failure",
      };
    } else if (check.success && incidentStart) {
      incidents.push({
        timestamp: incidentStart.timestamp,
        duration: check.timestamp - incidentStart.timestamp,
        type: incidentStart.type,
        description: `${api.name} was unavailable`,
      });
      incidentStart = null;
    }
  }
  if (incidentStart) {
    incidents.push({
      timestamp: incidentStart.timestamp,
      duration: Date.now() - incidentStart.timestamp,
      type: incidentStart.type,
      description: `${api.name} ongoing incident`,
    });
  }
  return incidents;
};

const createSLABreachNotification = async (api, userId, report) => {
  const breaches = [];
  if (!report.compliance.uptimeCompliant)
    breaches.push(
      `Uptime: ${report.metrics.uptime}% (target: ${report.targets.uptime}%)`,
    );
  if (!report.compliance.responseTimeCompliant)
    breaches.push(
      `P95 Response: ${report.metrics.p95ResponseTime}ms (target: ${report.targets.responseTimeP95}ms)`,
    );
  if (!report.compliance.errorRateCompliant)
    breaches.push(
      `Error Rate: ${report.metrics.errorRate}% (target: ${report.targets.errorRate}%)`,
    );
  await Notification.create({
    userId,
    type: "sla_breach",
    message: `SLA breach detected for "${api.name}": ${breaches.join(", ")}`,
    metadata: {
      apiId: api._id,
      severity: breaches.length > 1 ? "critical" : "high",
      data: { reportId: report._id, breaches },
    },
  });
};

const getSLAReports = async (apiId, options = {}) => {
  const { limit = 30, periodType } = options;
  const query = { apiId };
  if (periodType) query["period.type"] = periodType;
  return SLAReport.find(query).sort({ generatedAt: -1 }).limit(limit).lean();
};

const getSLASummary = async (userId) => {
  const apis = await Api.find({ userId, "sla.enabled": true })
    .select("_id name")
    .lean();
  const summaries = await Promise.all(
    apis.map(async (api) => {
      const latestReport = await SLAReport.findOne({ apiId: api._id })
        .sort({ generatedAt: -1 })
        .lean();
      return {
        apiId: api._id,
        apiName: api.name,
        latestReport: latestReport
          ? {
              compliance: latestReport.compliance.overall,
              uptime: latestReport.metrics.uptime,
              generatedAt: latestReport.generatedAt,
            }
          : null,
      };
    }),
  );
  return summaries;
};

module.exports = {
  evaluateSLACompliance,
  generateSLAReport,
  getSLAReports,
  getSLASummary,
};
