const {
  getViolationHistory,
  getViolationStats,
  acknowledgeViolation,
} = require("../services/contractService");
const Api = require("../models/Api");
const ContractViolation = require("../models/ContractViolation");
const { getOrSet, invalidate, CACHE_TTL } = require("../utils/cache");

const getViolations = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const { limit, startDate, endDate, acknowledged } = req.query;
    const api = await Api.findOne({ _id: apiId, userId: req.user._id });
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }
    const violations = await getViolationHistory(apiId, {
      limit: parseInt(limit) || 50,
      startDate,
      endDate,
      acknowledged:
        acknowledged === "true"
          ? true
          : acknowledged === "false"
            ? false
            : undefined,
    });
    res.json({
      success: true,
      data: { apiId, apiName: api.name, violations },
    });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const { days } = req.query;
    const api = await Api.findOne({ _id: apiId, userId: req.user._id });
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }

    // Cache violation stats for 2 minutes
    const cacheKey = `violation_stats_${apiId}_${days || 7}`;
    const stats = await getOrSet(
      cacheKey,
      async () => getViolationStats(apiId, parseInt(days) || 7),
      CACHE_TTL.SHORT,
    );

    res.json({
      success: true,
      data: { apiId, apiName: api.name, stats },
    });
  } catch (error) {
    next(error);
  }
};

const acknowledge = async (req, res, next) => {
  try {
    const { violationId } = req.params;
    const violation =
      await ContractViolation.findById(violationId).populate("apiId");
    if (!violation) {
      return res
        .status(404)
        .json({ success: false, message: "Violation not found" });
    }
    const api = await Api.findOne({
      _id: violation.apiId._id,
      userId: req.user._id,
    });
    if (!api) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const updated = await acknowledgeViolation(violationId);

    // Invalidate violation stats cache
    invalidate(`violation_stats_${violation.apiId._id}_7`);

    res.json({
      success: true,
      message: "Violation acknowledged",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const updateContractConfig = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const { enabled, schema, strictMode, expectedResponseTime } = req.body;
    const api = await Api.findOneAndUpdate(
      { _id: apiId, userId: req.user._id },
      {
        responseContract: {
          enabled: enabled ?? false,
          schema: schema ?? null,
          strictMode: strictMode ?? false,
          expectedResponseTime: expectedResponseTime ?? null,
        },
      },
      { new: true },
    );
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }
    res.json({
      success: true,
      message: "Contract configuration updated",
      data: { responseContract: api.responseContract },
    });
  } catch (error) {
    next(error);
  }
};

const getAllViolations = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, acknowledged } = req.query;
    const apis = await Api.find({ userId: req.user._id }).select("_id").lean();
    const apiIds = apis.map((a) => a._id);
    const query = { apiId: { $in: apiIds } };
    if (acknowledged === "true" || acknowledged === "false") {
      query.acknowledged = acknowledged === "true";
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [violations, total] = await Promise.all([
      ContractViolation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("apiId", "name")
        .lean(),
      ContractViolation.countDocuments(query),
    ]);
    res.json({
      success: true,
      data: {
        violations,
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
  getViolations,
  getStats,
  acknowledge,
  updateContractConfig,
  getAllViolations,
};
