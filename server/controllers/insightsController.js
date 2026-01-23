const {
  getRootCauseAnalyses,
  getRootCauseById,
} = require("../services/rootCauseService");
const {
  getAlerts,
  updateAlertStatus,
} = require("../services/predictiveService");
const Api = require("../models/Api");
const PredictiveAlert = require("../models/PredictiveAlert");
const { getOrSet, invalidate, CACHE_TTL } = require("../utils/cache");

const getRootCauses = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const { limit } = req.query;
    const api = await Api.findOne({ _id: apiId, userId: req.user._id });
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }
    const analyses = await getRootCauseAnalyses(apiId, {
      limit: parseInt(limit) || 20,
    });
    res.json({
      success: true,
      data: {
        apiId,
        apiName: api.name,
        analyses,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRootCauseDetail = async (req, res, next) => {
  try {
    const { analysisId } = req.params;
    const analysis = await getRootCauseById(analysisId);
    if (!analysis) {
      return res
        .status(404)
        .json({ success: false, message: "Analysis not found" });
    }
    const api = await Api.findOne({
      _id: analysis.apiId._id,
      userId: req.user._id,
    });
    if (!api) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

const getPredictiveAlerts = async (req, res, next) => {
  try {
    const { status, apiId } = req.query;
    const options = { limit: 50 };
    if (status) options.status = status;
    if (apiId) {
      const api = await Api.findOne({ _id: apiId, userId: req.user._id });
      if (!api) {
        return res
          .status(404)
          .json({ success: false, message: "API not found" });
      }
      options.apiId = apiId;
    }

    // Cache predictive alerts for 1 minute
    const cacheKey = `predictive_alerts_${req.user._id}_${status || "all"}_${apiId || "all"}`;
    const data = await getOrSet(
      cacheKey,
      async () => {
        const alerts = await getAlerts(req.user._id, options);
        const activeCount = alerts.filter((a) => a.status === "active").length;
        const criticalCount = alerts.filter(
          (a) => a.status === "active" && a.failureProbability >= 70,
        ).length;
        return {
          summary: {
            total: alerts.length,
            active: activeCount,
            critical: criticalCount,
          },
          alerts,
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

const getAlertById = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const alert = await PredictiveAlert.findById(alertId)
      .populate("apiId", "name url")
      .lean();
    if (!alert) {
      return res
        .status(404)
        .json({ success: false, message: "Alert not found" });
    }
    const api = await Api.findOne({
      _id: alert.apiId._id,
      userId: req.user._id,
    });
    if (!api) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

const updateAlert = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const { status } = req.body;
    const validStatuses = [
      "active",
      "acknowledged",
      "mitigated",
      "expired",
      "false_alarm",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }
    const alert = await PredictiveAlert.findById(alertId);
    if (!alert) {
      return res
        .status(404)
        .json({ success: false, message: "Alert not found" });
    }
    const api = await Api.findOne({ _id: alert.apiId, userId: req.user._id });
    if (!api) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const updated = await updateAlertStatus(alertId, status);

    // Invalidate predictive alerts cache for this user
    const keysToInvalidate = [
      `predictive_alerts_${req.user._id}_all_all`,
      `predictive_alerts_${req.user._id}_${status}_all`,
      `predictive_alerts_${req.user._id}_all_${alert.apiId._id}`,
    ];
    invalidate(keysToInvalidate);

    res.json({
      success: true,
      message: `Alert status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRootCauses,
  getRootCauseDetail,
  getPredictiveAlerts,
  getAlertById,
  updateAlert,
};
