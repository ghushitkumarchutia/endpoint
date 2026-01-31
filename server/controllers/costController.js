const {
  getCostAnalytics,
  getMonthlyProjection,
  generateOptimizationTips,
} = require("../services/costService");
const Api = require("../models/Api");
const CostRecord = require("../models/CostRecord");
const User = require("../models/User");
const mongoose = require("mongoose");

const getCostDashboard = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    const userId = req.user._id;

    // Use lean() to get a plain JavaScript object
    const user = await User.findById(userId).lean();

    const costSettings = {
      monthlyBudget: user?.costSettings?.monthlyBudget || 0,
      alertThreshold: user?.costSettings?.alertThreshold || 80,
      currency: user?.costSettings?.currency || "USD",
    };

    const [analytics, projection] = await Promise.all([
      getCostAnalytics(userId, { startDate, endDate, groupBy }),
      getMonthlyProjection(userId),
    ]);

    const totalCost = analytics.summary.totalCost || 0;
    const projectedCost = projection.projectedMonthlyTotal || 0;
    const budget = costSettings.monthlyBudget || 0;

    const overages = budget > 0 && totalCost > budget ? totalCost - budget : 0;

    const costTrend =
      totalCost > 0
        ? projectedCost > totalCost
          ? "increasing"
          : "stable"
        : "neutral";

    const topCostApis = analytics.byApi.map((api) => ({
      apiId: api.apiId,
      name: api.apiName,
      requests: api.requests,
      cost: api.totalCost,
    }));

    const costByApi = analytics.byApi.map((api) => ({
      name: api.apiName,
      value: api.totalCost,
    }));

    const optimizationTips = generateOptimizationTips(
      analytics,
      costSettings,
      projection,
    );

    // Construct the flat dashboard object the frontend expects
    const dashboardData = {
      totalCost,
      projectedCost,
      overages,
      costTrend,
      config: {
        budget: costSettings.monthlyBudget,
        alertThreshold: costSettings.alertThreshold,
        currency: costSettings.currency || "USD",
      },
      topCostApis,
      costByApi,
      optimizationTips,
      lastUpdated: new Date(),
    };

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};

const updateGlobalCostConfig = async (req, res, next) => {
  try {
    const { budget, alertThreshold, currency } = req.body;

    const update = {};
    if (budget !== undefined) update["costSettings.monthlyBudget"] = budget;
    if (alertThreshold !== undefined)
      update["costSettings.alertThreshold"] = alertThreshold;
    if (currency !== undefined) update["costSettings.currency"] = currency;

    // Use findByIdAndUpdate for atomic update
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Cost configuration updated",
      data: {
        budget: user.costSettings.monthlyBudget,
        alertThreshold: user.costSettings.alertThreshold,
        currency: user.costSettings.currency,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getApiCosts = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const { startDate, endDate, groupBy } = req.query;
    const api = await Api.findOne({ _id: apiId, userId: req.user._id });
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }
    const analytics = await getCostAnalytics(req.user._id, {
      apiId: new mongoose.Types.ObjectId(apiId),
      startDate,
      endDate,
      groupBy,
    });
    const projection = await getMonthlyProjection(
      req.user._id,
      new mongoose.Types.ObjectId(apiId),
    );
    res.json({
      success: true,
      data: {
        apiId,
        apiName: api.name,
        analytics,
        projection,
        costTracking: api.costTracking,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCostConfig = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const {
      enabled,
      costPerRequest,
      costPerToken,
      monthlyBudget,
      alertThreshold,
    } = req.body;
    const api = await Api.findOneAndUpdate(
      { _id: apiId, userId: req.user._id },
      {
        costTracking: {
          enabled: enabled ?? false,
          costPerRequest: costPerRequest ?? 0,
          costPerToken: costPerToken ?? 0,
          monthlyBudget: monthlyBudget ?? null,
          alertThreshold: alertThreshold ?? 80,
        },
      },
      { new: true },
    );
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }
    res.json({
      success: true,
      message: "Cost tracking configuration updated",
      data: { costTracking: api.costTracking },
    });
  } catch (error) {
    next(error);
  }
};

const getCostRecords = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const query = { userId: req.user._id };
    if (apiId) {
      const api = await Api.findOne({ _id: apiId, userId: req.user._id });
      if (!api) {
        return res
          .status(404)
          .json({ success: false, message: "API not found" });
      }
      query.apiId = apiId;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [records, total] = await Promise.all([
      CostRecord.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("apiId", "name")
        .lean(),
      CostRecord.countDocuments(query),
    ]);
    res.json({
      success: true,
      data: {
        records,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCostDashboard,
  updateGlobalCostConfig,
  getApiCosts,
  updateCostConfig,
  getCostRecords,
};
