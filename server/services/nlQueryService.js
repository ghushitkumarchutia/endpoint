const NLQueryLog = require("../models/NLQueryLog");
const Api = require("../models/Api");
const Check = require("../models/Check");
const SLAReport = require("../models/SLAReport");
const CostRecord = require("../models/CostRecord");
const { parseNaturalLanguageQuery } = require("./aiService");
const { calculateMean, calculatePercentile } = require("../utils/statistics");

const processQuery = async (userId, query) => {
  const startTime = Date.now();
  const apis = await Api.find({ userId }).select("_id name url").lean();
  const parsedIntent = await parseNaturalLanguageQuery(query, apis);
  let response = "";
  let data = null;
  try {
    const result = await executeQuery(userId, parsedIntent, apis);
    response = result.response;
    data = result.data;
  } catch (error) {
    response = `I couldn't process that query. Error: ${error.message}`;
  }
  const executionTime = Date.now() - startTime;
  await NLQueryLog.create({
    userId,
    query,
    parsedIntent,
    response,
    data,
    executionTime,
  });
  return { response, data, parsedIntent, executionTime };
};

const executeQuery = async (userId, intent, apis) => {
  const apiMap = new Map(apis.map((a) => [a.name.toLowerCase(), a]));
  switch (intent.type) {
    case "status_check":
      return await handleStatusCheck(userId, intent, apiMap, apis);
    case "performance_query":
      return await handlePerformanceQuery(userId, intent, apiMap, apis);
    case "error_analysis":
      return await handleErrorAnalysis(userId, intent, apiMap, apis);
    case "list_apis":
      return handleListApis(apis);
    case "cost_query":
      return await handleCostQuery(userId, intent, apiMap);
    case "sla_query":
      return await handleSLAQuery(userId, intent, apiMap);
    case "trend_analysis":
      return await handleTrendAnalysis(userId, intent, apiMap, apis);
    case "comparison":
      return await handleComparison(userId, intent, apiMap);
    default:
      return {
        response:
          "I'm not sure what you're asking. Try asking about API status, performance, errors, costs, or SLA compliance.",
        data: null,
      };
  }
};

const handleStatusCheck = async (userId, intent, apiMap, apis) => {
  const targetApis = getTargetApis(intent, apiMap, apis);
  if (targetApis.length === 0) {
    return { response: "I couldn't find the API you mentioned.", data: null };
  }
  const statuses = await Promise.all(
    targetApis.map(async (api) => {
      const lastCheck = await Check.findOne({ apiId: api._id })
        .sort({ timestamp: -1 })
        .lean();
      return {
        name: api.name,
        status: lastCheck?.success ? "UP" : "DOWN",
        lastChecked: lastCheck?.timestamp || null,
        responseTime: lastCheck?.responseTime || null,
      };
    }),
  );
  const upCount = statuses.filter((s) => s.status === "UP").length;
  const response =
    targetApis.length === 1
      ? `${statuses[0].name} is currently ${statuses[0].status}${statuses[0].responseTime ? ` with ${statuses[0].responseTime}ms response time` : ""}.`
      : `${upCount} of ${targetApis.length} APIs are UP.`;
  return { response, data: { statuses } };
};

const handlePerformanceQuery = async (userId, intent, apiMap, apis) => {
  const targetApis = getTargetApis(intent, apiMap, apis);
  const timeRange = getTimeRange(intent.entities?.timeRange);
  const performanceData = await Promise.all(
    targetApis.map(async (api) => {
      const checks = await Check.find({
        apiId: api._id,
        timestamp: { $gte: timeRange.start },
        success: true,
      })
        .select("responseTime")
        .lean();
      const times = checks.map((c) => c.responseTime);
      return {
        name: api.name,
        avgResponseTime:
          times.length > 0 ? Math.round(calculateMean(times)) : null,
        p95:
          times.length > 0 ? Math.round(calculatePercentile(times, 95)) : null,
        sampleSize: times.length,
      };
    }),
  );
  const validData = performanceData.filter((p) => p.avgResponseTime !== null);
  if (validData.length === 0) {
    return {
      response: "No performance data available for the specified time range.",
      data: null,
    };
  }
  const response =
    validData.length === 1
      ? `${validData[0].name} has an average response time of ${validData[0].avgResponseTime}ms (P95: ${validData[0].p95}ms) over the last ${timeRange.label}.`
      : `Performance summary: ${validData.map((p) => `${p.name}: ${p.avgResponseTime}ms avg`).join(", ")}.`;
  return { response, data: { performance: validData } };
};

const handleErrorAnalysis = async (userId, intent, apiMap, apis) => {
  const targetApis = getTargetApis(intent, apiMap, apis);
  const timeRange = getTimeRange(intent.entities?.timeRange);
  const errorData = await Promise.all(
    targetApis.map(async (api) => {
      const [totalChecks, failedChecks] = await Promise.all([
        Check.countDocuments({
          apiId: api._id,
          timestamp: { $gte: timeRange.start },
        }),
        Check.countDocuments({
          apiId: api._id,
          timestamp: { $gte: timeRange.start },
          success: false,
        }),
      ]);
      const recentErrors = await Check.find({
        apiId: api._id,
        timestamp: { $gte: timeRange.start },
        success: false,
      })
        .sort({ timestamp: -1 })
        .limit(5)
        .select("error errorType timestamp statusCode")
        .lean();
      return {
        name: api.name,
        totalChecks,
        failedChecks,
        errorRate:
          totalChecks > 0 ? ((failedChecks / totalChecks) * 100).toFixed(2) : 0,
        recentErrors,
      };
    }),
  );
  const totalErrors = errorData.reduce((sum, e) => sum + e.failedChecks, 0);
  const response =
    totalErrors === 0
      ? `No errors found in the last ${timeRange.label}.`
      : `Found ${totalErrors} errors across ${targetApis.length} API(s). ${errorData
          .filter((e) => e.failedChecks > 0)
          .map((e) => `${e.name}: ${e.errorRate}% error rate`)
          .join(", ")}.`;
  return { response, data: { errors: errorData } };
};

const handleListApis = (apis) => {
  const response =
    apis.length === 0
      ? "You don't have any APIs configured yet."
      : `You have ${apis.length} API(s): ${apis.map((a) => a.name).join(", ")}.`;
  return {
    response,
    data: { apis: apis.map((a) => ({ id: a._id, name: a.name, url: a.url })) },
  };
};

const handleCostQuery = async (userId, intent, apiMap) => {
  const timeRange = getTimeRange(intent.entities?.timeRange);
  const apiNames = intent.entities?.apiNames || [];
  const match = { userId, timestamp: { $gte: timeRange.start } };
  if (apiNames.length > 0) {
    const targetApis = apiNames
      .map((name) => apiMap.get(name.toLowerCase()))
      .filter(Boolean);
    if (targetApis.length > 0) {
      match.apiId = { $in: targetApis.map((a) => a._id) };
    }
  }
  const costData = await CostRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalCost: { $sum: "$cost" },
        requests: { $sum: 1 },
      },
    },
  ]);
  const total = costData[0] || { totalCost: 0, requests: 0 };
  const response = `Total cost over the last ${timeRange.label}: $${total.totalCost.toFixed(4)} across ${total.requests} requests.`;
  return { response, data: { cost: total } };
};

const handleSLAQuery = async (userId, intent, apiMap) => {
  const apiNames = intent.entities?.apiNames || [];
  let query = { userId };
  if (apiNames.length > 0) {
    const targetApis = apiNames
      .map((name) => apiMap.get(name.toLowerCase()))
      .filter(Boolean);
    if (targetApis.length > 0) {
      query.apiId = { $in: targetApis.map((a) => a._id) };
    }
  }
  const reports = await SLAReport.find(query)
    .sort({ generatedAt: -1 })
    .limit(5)
    .populate("apiId", "name")
    .lean();
  if (reports.length === 0) {
    return { response: "No SLA reports available.", data: null };
  }
  const compliant = reports.filter((r) => r.compliance.overall).length;
  const response = `${compliant} of ${reports.length} recent SLA reports show compliance. Latest uptime: ${reports[0].metrics.uptime}%.`;
  return {
    response,
    data: {
      reports: reports.map((r) => ({
        apiName: r.apiId?.name || "Unknown",
        compliance: r.compliance.overall,
        uptime: r.metrics.uptime,
        period: r.period.type,
      })),
    },
  };
};

const handleTrendAnalysis = async (userId, intent, apiMap, apis) => {
  const targetApis = getTargetApis(intent, apiMap, apis);
  const api = targetApis[0];
  if (!api) {
    return {
      response: "Please specify which API you want to analyze.",
      data: null,
    };
  }
  const days = [7, 6, 5, 4, 3, 2, 1, 0];
  const trends = await Promise.all(
    days.map(async (daysAgo) => {
      const start = new Date();
      start.setDate(start.getDate() - daysAgo);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const checks = await Check.find({
        apiId: api._id,
        timestamp: { $gte: start, $lt: end },
        success: true,
      })
        .select("responseTime")
        .lean();
      return {
        date: start.toISOString().split("T")[0],
        avgResponseTime:
          checks.length > 0
            ? Math.round(calculateMean(checks.map((c) => c.responseTime)))
            : null,
        checkCount: checks.length,
      };
    }),
  );
  const validTrends = trends.filter((t) => t.avgResponseTime !== null);
  if (validTrends.length < 2) {
    return { response: "Not enough data for trend analysis.", data: null };
  }
  const first = validTrends[0].avgResponseTime;
  const last = validTrends[validTrends.length - 1].avgResponseTime;
  const change = ((last - first) / first) * 100;
  const trend =
    change > 10 ? "degrading" : change < -10 ? "improving" : "stable";
  const response = `${api.name} performance is ${trend} over the last week. Response time changed from ${first}ms to ${last}ms (${change > 0 ? "+" : ""}${change.toFixed(1)}%).`;
  return {
    response,
    data: { trends: validTrends, trend, changePercent: change },
  };
};

const handleComparison = async (userId, intent, apiMap) => {
  const apiNames = intent.entities?.apiNames || [];
  if (apiNames.length < 2) {
    return {
      response: "Please specify at least two APIs to compare.",
      data: null,
    };
  }
  const targetApis = apiNames
    .map((name) => apiMap.get(name.toLowerCase()))
    .filter(Boolean);
  if (targetApis.length < 2) {
    return { response: "Could not find the APIs you mentioned.", data: null };
  }
  const timeRange = getTimeRange(intent.entities?.timeRange);
  const comparisons = await Promise.all(
    targetApis.map(async (api) => {
      const checks = await Check.find({
        apiId: api._id,
        timestamp: { $gte: timeRange.start },
      }).lean();
      const successful = checks.filter((c) => c.success);
      const times = successful.map((c) => c.responseTime);
      return {
        name: api.name,
        avgResponseTime:
          times.length > 0 ? Math.round(calculateMean(times)) : null,
        uptime:
          checks.length > 0
            ? ((successful.length / checks.length) * 100).toFixed(2)
            : null,
        totalChecks: checks.length,
      };
    }),
  );
  const sorted = [...comparisons].sort(
    (a, b) => (a.avgResponseTime || Infinity) - (b.avgResponseTime || Infinity),
  );
  const response = `Comparison: ${sorted.map((c) => `${c.name} (${c.avgResponseTime || "N/A"}ms, ${c.uptime || "N/A"}% uptime)`).join(" vs ")}.`;
  return { response, data: { comparison: comparisons } };
};

const getTargetApis = (intent, apiMap, allApis) => {
  const apiNames = intent.entities?.apiNames || [];
  if (apiNames.length === 0) return allApis.slice(0, 5);
  return apiNames.map((name) => apiMap.get(name.toLowerCase())).filter(Boolean);
};

const getTimeRange = (timeRange) => {
  const now = new Date();
  let start;
  let label = "24 hours";
  if (timeRange?.relative) {
    switch (timeRange.relative) {
      case "last hour":
        start = new Date(now.getTime() - 60 * 60 * 1000);
        label = "hour";
        break;
      case "today":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        label = "today";
        break;
      case "this week":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        label = "week";
        break;
      case "this month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        label = "month";
        break;
      default:
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  } else {
    start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }
  return { start, end: now, label };
};

const markQueryHelpful = async (queryId, wasHelpful) => {
  return NLQueryLog.findByIdAndUpdate(queryId, { wasHelpful }, { new: true });
};

const getQueryHistory = async (userId, limit = 20) => {
  return NLQueryLog.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("query response parsedIntent.type executionTime createdAt")
    .lean();
};

module.exports = {
  processQuery,
  markQueryHelpful,
  getQueryHistory,
};
