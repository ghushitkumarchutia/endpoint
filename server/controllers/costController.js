const {
  getCostAnalytics,
  getMonthlyProjection,
} = require("../services/costService");
const Api = require("../models/Api");
const CostRecord = require("../models/CostRecord");
const mongoose = require("mongoose");
const { getOrSet, CACHE_TTL } = require("../utils/cache");

const getCostDashboard = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy } = req.query;

    // Cache cost dashboard for 5 minutes
    const cacheKey = `cost_dashboard_${req.user._id}_${startDate || ""}_${endDate || ""}_${groupBy || ""}`;
    const data = await getOrSet(
      cacheKey,
      async () => {
        const analytics = await getCostAnalytics(req.user._id, {
          startDate,
          endDate,
          groupBy,
        });
        const projection = await getMonthlyProjection(req.user._id);
        return {
          analytics,
          projection,
        };
      },
      CACHE_TTL.MEDIUM,
    );

    res.json({
      success: true,
      data,
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
  getApiCosts,
  updateCostConfig,
  getCostRecords,
};
