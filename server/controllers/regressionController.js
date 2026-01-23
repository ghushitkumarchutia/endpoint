const {
  getRegressions,
  updateRegressionStatus,
  getRegressionTrend,
} = require("../services/regressionService");
const Api = require("../models/Api");
const PerformanceRegression = require("../models/PerformanceRegression");
const { getOrSet, invalidate, CACHE_TTL } = require("../utils/cache");

const getDashboard = async (req, res, next) => {
  try {
    const { status } = req.query;

    // Cache regression dashboard for 1 minute
    const cacheKey = `regression_dashboard_${req.user._id}_${status || "all"}`;
    const data = await getOrSet(
      cacheKey,
      async () => {
        const regressions = await getRegressions(req.user._id, {
          status: status || undefined,
          limit: 50,
        });
        const activeCount = regressions.filter(
          (r) => r.status === "active",
        ).length;
        const investigatingCount = regressions.filter(
          (r) => r.status === "investigating",
        ).length;
        return {
          summary: {
            total: regressions.length,
            active: activeCount,
            investigating: investigatingCount,
            resolved: regressions.filter((r) => r.status === "resolved").length,
          },
          regressions,
        };
      },
      CACHE_TTL.SHORT,
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getApiRegressions = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const { days } = req.query;
    const api = await Api.findOne({ _id: apiId, userId: req.user._id });
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }
    const [regressions, trend] = await Promise.all([
      getRegressions(req.user._id, { apiId, limit: 20 }),
      getRegressionTrend(apiId, parseInt(days) || 30),
    ]);
    res.json({
      success: true,
      data: {
        apiId,
        apiName: api.name,
        regressions,
        trend,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRegressionById = async (req, res, next) => {
  try {
    const { regressionId } = req.params;
    const regression = await PerformanceRegression.findById(regressionId)
      .populate("apiId", "name url")
      .lean();
    if (!regression) {
      return res
        .status(404)
        .json({ success: false, message: "Regression not found" });
    }
    const api = await Api.findOne({
      _id: regression.apiId._id,
      userId: req.user._id,
    });
    if (!api) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({
      success: true,
      data: regression,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { regressionId } = req.params;
    const { status } = req.body;
    const validStatuses = [
      "active",
      "investigating",
      "resolved",
      "false_positive",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }
    const regression = await PerformanceRegression.findById(regressionId);
    if (!regression) {
      return res
        .status(404)
        .json({ success: false, message: "Regression not found" });
    }
    const api = await Api.findOne({
      _id: regression.apiId,
      userId: req.user._id,
    });
    if (!api) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const updated = await updateRegressionStatus(regressionId, status);

    // Invalidate regression dashboard cache
    const keysToInvalidate = [
      `regression_dashboard_${req.user._id}_all`,
      `regression_dashboard_${req.user._id}_${status}`,
    ];
    invalidate(keysToInvalidate);

    res.json({
      success: true,
      message: `Regression status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getApiRegressions,
  getRegressionById,
  updateStatus,
};
