const CostRecord = require("../models/CostRecord");
const Api = require("../models/Api");
const Notification = require("../models/Notification");
const User = require("../models/User");

const calculateRequestCost = (api, check) => {
  if (!api.costTracking || !api.costTracking.enabled) return 0;
  let cost = api.costTracking.costPerRequest || 0;
  if (api.costTracking.costPerToken && check.tokensUsed) {
    const totalTokens =
      (check.tokensUsed.input || 0) + (check.tokensUsed.output || 0);
    cost += api.costTracking.costPerToken * totalTokens;
  }
  return Number(cost.toFixed(6));
};

const recordCost = async (api, check, userId) => {
  if (!api.costTracking || !api.costTracking.enabled) return null;
  const cost = calculateRequestCost(api, check);
  if (cost <= 0) return null;
  const costRecord = await CostRecord.create({
    apiId: api._id,
    checkId: check._id,
    userId,
    cost,
    metadata: {
      tokensUsed: {
        input: check.tokensUsed?.input || 0,
        output: check.tokensUsed?.output || 0,
      },
      dataTransferredBytes: check.responseSize || 0,
      requestType: api.method,
    },
  });
  await checkBudgetThreshold(api, userId);
  return costRecord;
};

const checkBudgetThreshold = async (api, userId) => {
  if (!api.costTracking.monthlyBudget) return;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const monthlyCost = await CostRecord.aggregate([
    {
      $match: {
        apiId: api._id,
        timestamp: { $gte: startOfMonth },
      },
    },
    { $group: { _id: null, total: { $sum: "$cost" } } },
  ]);
  const totalCost = monthlyCost[0]?.total || 0;
  const threshold = api.costTracking.alertThreshold || 80;
  const percentUsed = (totalCost / api.costTracking.monthlyBudget) * 100;
  if (percentUsed >= threshold) {
    const user = await User.findById(userId).select("costSettings.currency");
    const currency = user?.costSettings?.currency || "USD";
    const currencySymbols = { USD: "$", INR: "₹", EUR: "€", GBP: "£" };
    const symbol = currencySymbols[currency] || "$";

    const existingAlert = await Notification.findOne({
      userId,
      type: "cost_alert",
      "metadata.apiId": api._id,
      createdAt: { $gte: startOfMonth },
      "metadata.data.threshold": threshold,
    });
    if (!existingAlert) {
      await Notification.create({
        userId,
        type: "cost_alert",
        message: `API "${api.name}" has reached ${percentUsed.toFixed(1)}% of monthly budget (${symbol}${totalCost.toFixed(2)}/${symbol}${api.costTracking.monthlyBudget})`,
        metadata: {
          apiId: api._id,
          severity: percentUsed >= 100 ? "critical" : "high",
          data: {
            totalCost,
            budget: api.costTracking.monthlyBudget,
            percentUsed,
            threshold,
          },
        },
      });
    }
  }
};

const getCostAnalytics = async (userId, options = {}) => {
  const { apiId, startDate, endDate, groupBy = "day" } = options;
  const match = { userId };
  if (apiId) match.apiId = apiId;
  if (startDate || endDate) {
    match.timestamp = {};
    if (startDate) match.timestamp.$gte = new Date(startDate);
    if (endDate) match.timestamp.$lte = new Date(endDate);
  }
  const dateFormat =
    groupBy === "hour"
      ? { $dateToString: { format: "%Y-%m-%d %H:00", date: "$timestamp" } }
      : groupBy === "month"
        ? { $dateToString: { format: "%Y-%m", date: "$timestamp" } }
        : { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } };
  const [timeSeries, byApi, summary] = await Promise.all([
    CostRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: dateFormat,
          total: { $sum: "$cost" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    CostRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$apiId",
          total: { $sum: "$cost" },
          count: { $sum: 1 },
          avgCost: { $avg: "$cost" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]),
    CostRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalCost: { $sum: "$cost" },
          totalRequests: { $sum: 1 },
          avgCostPerRequest: { $avg: "$cost" },
        },
      },
    ]),
  ]);
  const apiIds = byApi.map((a) => a._id);
  const apis = await Api.find({ _id: { $in: apiIds } })
    .select("name")
    .lean();
  const apiMap = new Map(apis.map((a) => [a._id.toString(), a.name]));
  return {
    timeSeries: timeSeries.map((t) => ({
      date: t._id,
      cost: t.total,
      requests: t.count,
    })),
    byApi: byApi.map((a) => ({
      apiId: a._id,
      apiName: apiMap.get(a._id.toString()) || "Unknown",
      totalCost: Number(a.total.toFixed(4)),
      requests: a.count,
      avgCostPerRequest: Number(a.avgCost.toFixed(6)),
    })),
    summary: summary[0] || {
      totalCost: 0,
      totalRequests: 0,
      avgCostPerRequest: 0,
    },
  };
};

const getMonthlyProjection = async (userId, apiId = null) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysPassed = now.getDate();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const match = { userId, timestamp: { $gte: startOfMonth } };
  if (apiId) match.apiId = apiId;
  const result = await CostRecord.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: "$cost" } } },
  ]);
  const currentCost = result[0]?.total || 0;
  const dailyAverage = currentCost / daysPassed;
  const projectedTotal = dailyAverage * daysInMonth;
  return {
    currentCost: Number(currentCost.toFixed(4)),
    daysPassed,
    daysRemaining: daysInMonth - daysPassed,
    dailyAverage: Number(dailyAverage.toFixed(4)),
    projectedMonthlyTotal: Number(projectedTotal.toFixed(4)),
  };
};

const generateOptimizationTips = (
  analytics,
  costSettings,
  projection = null,
) => {
  const tips = [];
  const { summary, byApi } = analytics;
  const budget = costSettings?.monthlyBudget || 0;
  const currency = costSettings?.currency || "USD";

  const currencySymbols = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
  };
  const symbol = currencySymbols[currency] || "$";

  if (budget > 0) {
    if (summary.totalCost > budget) {
      tips.push({
        type: "critical",
        title: "Budget Exceeded",
        message: `You've exceeded your monthly budget of ${symbol}${budget}. Review your costliest APIs.`,
      });
    } else if (
      projection &&
      projection.projectedMonthlyTotal > budget &&
      summary.totalCost < budget
    ) {
      tips.push({
        type: "warning",
        title: "Projected Overrun",
        message: `At current usage, you are projected to exceed your budget by ${symbol}${(
          projection.projectedMonthlyTotal - budget
        ).toFixed(2)}.`,
      });
    }
  }

  if (byApi.length > 0) {
    const expensiveApi = byApi.find((api) => api.avgCostPerRequest > 0.05);
    if (expensiveApi) {
      tips.push({
        type: "info",
        title: "High Cost per Request",
        message: `API "${expensiveApi.apiName}" averages ${symbol}${expensiveApi.avgCostPerRequest.toFixed(4)} per request. Consider optimizing payload size or caching.`,
      });
    }
  }

  if (tips.length === 0) {
    tips.push({
      type: "success",
      title: "On Track",
      message: "Your API spending is within optimal limits. Good job!",
    });
  }

  return tips;
};

module.exports = {
  calculateRequestCost,
  recordCost,
  getCostAnalytics,
  getMonthlyProjection,
  generateOptimizationTips,
};
