const RootCauseAnalysis = require("../models/RootCauseAnalysis");
const Check = require("../models/Check");
const Api = require("../models/Api");
const { analyzeRootCause } = require("./aiService");

const CORRELATION_WINDOW_MS = 5 * 60 * 1000;

const analyzeFailure = async (check, api, userId) => {
  if (check.success) return null;
  const existing = await RootCauseAnalysis.findOne({
    failedCheckId: check._id,
  });
  if (existing) return existing;
  const context = {
    error: check.error,
    statusCode: check.statusCode,
    responseTime: check.responseTime,
    timestamp: check.timestamp,
  };
  const correlatedFailures = await findCorrelatedFailures(
    api._id,
    userId,
    check.timestamp,
  );
  const timeline = await buildTimeline(api._id, check.timestamp);
  const possibleCauses = determinePossibleCauses(check, correlatedFailures);
  const similarPastIncidents = await findSimilarIncidents(api._id, check);
  const aiAnalysis = await analyzeRootCause(
    api.name,
    context,
    correlatedFailures,
  );
  const rca = await RootCauseAnalysis.create({
    failedCheckId: check._id,
    apiId: api._id,
    userId,
    context,
    correlatedFailures,
    possibleCauses,
    aiAnalysis,
    timeline,
    similarPastIncidents,
  });
  return rca;
};

const findCorrelatedFailures = async (excludeApiId, userId, timestamp) => {
  const windowStart = new Date(timestamp.getTime() - CORRELATION_WINDOW_MS);
  const windowEnd = new Date(timestamp.getTime() + CORRELATION_WINDOW_MS);
  const userApis = await Api.find({ userId, _id: { $ne: excludeApiId } })
    .select("_id name")
    .lean();
  const apiMap = new Map(userApis.map((a) => [a._id.toString(), a.name]));
  const failures = await Check.find({
    apiId: { $in: userApis.map((a) => a._id) },
    timestamp: { $gte: windowStart, $lte: windowEnd },
    success: false,
  })
    .select("apiId timestamp")
    .lean();
  return failures.map((f) => ({
    apiId: f.apiId,
    apiName: apiMap.get(f.apiId.toString()) || "Unknown",
    failureTime: f.timestamp,
    timeDelta: f.timestamp - timestamp,
  }));
};

const buildTimeline = async (apiId, failureTime) => {
  const windowStart = new Date(failureTime.getTime() - 30 * 60 * 1000);
  const checks = await Check.find({
    apiId,
    timestamp: { $gte: windowStart, $lte: failureTime },
  })
    .sort({ timestamp: 1 })
    .select("timestamp success responseTime statusCode error")
    .lean();
  const timeline = [];
  let prevResponseTime = null;
  for (const check of checks) {
    if (!check.success) {
      timeline.push({
        timestamp: check.timestamp,
        event: `Failed: ${check.error || `Status ${check.statusCode}`}`,
        severity: "error",
      });
    } else if (
      prevResponseTime &&
      check.responseTime > prevResponseTime * 1.5
    ) {
      timeline.push({
        timestamp: check.timestamp,
        event: `Response time spike: ${prevResponseTime}ms → ${check.responseTime}ms`,
        severity: "warning",
      });
    }
    prevResponseTime = check.responseTime;
  }
  return timeline;
};

const determinePossibleCauses = (check, correlatedFailures) => {
  const causes = [];
  if (check.errorType === "timeout") {
    causes.push({
      cause: "Server overload or network congestion",
      probability: 70,
      evidence: ["Request timed out"],
    });
    causes.push({
      cause: "Downstream service delay",
      probability: 50,
      evidence: ["Timeout suggests waiting for external resource"],
    });
  } else if (check.errorType === "network") {
    causes.push({
      cause: "Network connectivity issue",
      probability: 80,
      evidence: ["Network error detected"],
    });
    causes.push({
      cause: "DNS resolution failure",
      probability: 40,
      evidence: ["Could be DNS-related network issue"],
    });
  } else if (check.statusCode >= 500) {
    causes.push({
      cause: "Internal server error",
      probability: 75,
      evidence: [`Status code ${check.statusCode}`],
    });
    causes.push({
      cause: "Backend service crash or restart",
      probability: 50,
      evidence: ["5xx errors often indicate server-side issues"],
    });
  } else if (check.statusCode === 429) {
    causes.push({
      cause: "Rate limiting triggered",
      probability: 90,
      evidence: ["Status code 429 indicates rate limit"],
    });
  } else if (check.statusCode >= 400) {
    causes.push({
      cause: "Client-side request error",
      probability: 60,
      evidence: [`Status code ${check.statusCode}`],
    });
  }
  if (correlatedFailures.length > 0) {
    causes.push({
      cause: "Cascading failure from dependent service",
      probability: 65,
      evidence: [
        `${correlatedFailures.length} other API(s) failed within 5 minutes`,
      ],
    });
  }
  if (causes.length === 0) {
    causes.push({
      cause: "Unknown failure",
      probability: 50,
      evidence: [check.error || "No specific error information"],
    });
  }
  return causes.sort((a, b) => b.probability - a.probability);
};

const findSimilarIncidents = async (apiId, check) => {
  const query = { apiId, success: false, _id: { $ne: check._id } };
  if (check.errorType) query.errorType = check.errorType;
  if (check.statusCode) query.statusCode = check.statusCode;
  const similar = await Check.find(query)
    .sort({ timestamp: -1 })
    .limit(5)
    .select("_id timestamp")
    .lean();
  const rcas = await RootCauseAnalysis.find({
    failedCheckId: { $in: similar.map((s) => s._id) },
  })
    .select("failedCheckId possibleCauses")
    .lean();
  const rcaMap = new Map(rcas.map((r) => [r.failedCheckId.toString(), r]));
  return similar.map((s) => {
    const rca = rcaMap.get(s._id.toString());
    return {
      checkId: s._id,
      timestamp: s.timestamp,
      similarity: calculateSimilarity(check, s),
      resolution: rca?.possibleCauses?.[0]?.cause || null,
    };
  });
};

const calculateSimilarity = (check1, check2) => {
  let score = 50;
  if (check1.errorType === check2.errorType) score += 25;
  if (check1.statusCode === check2.statusCode) score += 25;
  return Math.min(score, 100);
};

const getRootCauseAnalyses = async (apiId, options = {}) => {
  const { limit = 20 } = options;
  return RootCauseAnalysis.find({ apiId })
    .sort({ analyzedAt: -1 })
    .limit(limit)
    .lean();
};

const getRootCauseById = async (id) => {
  return RootCauseAnalysis.findById(id)
    .populate("apiId", "name url")
    .populate("failedCheckId")
    .lean();
};

module.exports = {
  analyzeFailure,
  getRootCauseAnalyses,
  getRootCauseById,
};
