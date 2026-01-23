const {
  generateSLAReport,
  getSLAReports,
  getSLASummary,
} = require("../services/slaService");
const Api = require("../models/Api");
const SLAReport = require("../models/SLAReport");
const { getOrSet, CACHE_TTL } = require("../utils/cache");

const getDashboard = async (req, res, next) => {
  try {
    // Cache SLA dashboard for 5 minutes
    const cacheKey = `sla_dashboard_${req.user._id}`;
    const data = await getOrSet(
      cacheKey,
      async () => {
        const summary = await getSLASummary(req.user._id);
        const compliant = summary.filter(
          (s) => s.latestReport?.compliance,
        ).length;
        const total = summary.filter((s) => s.latestReport).length;
        return {
          overallCompliance:
            total > 0 ? ((compliant / total) * 100).toFixed(1) : 100,
          apisWithSLA: summary.length,
          compliantApis: compliant,
          nonCompliantApis: total - compliant,
          details: summary,
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

const generateReport = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const { periodType } = req.body;
    const api = await Api.findOne({ _id: apiId, userId: req.user._id });
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }
    const report = await generateSLAReport(
      apiId,
      req.user._id,
      periodType || "daily",
    );
    if (!report) {
      return res.status(400).json({
        success: false,
        message: "No data available for the specified period",
      });
    }
    res.json({
      success: true,
      message: "SLA report generated",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const { limit, periodType } = req.query;
    const api = await Api.findOne({ _id: apiId, userId: req.user._id });
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }
    const reports = await getSLAReports(apiId, {
      limit: parseInt(limit) || 30,
      periodType,
    });
    res.json({
      success: true,
      data: {
        apiId,
        apiName: api.name,
        slaConfig: api.sla,
        reports,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const report = await SLAReport.findById(reportId).populate(
      "apiId",
      "name url",
    );
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    const api = await Api.findOne({
      _id: report.apiId._id,
      userId: req.user._id,
    });
    if (!api) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const updateSLAConfig = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const { enabled, uptimeTarget, responseTimeP95, errorRateMax } = req.body;
    const api = await Api.findOneAndUpdate(
      { _id: apiId, userId: req.user._id },
      {
        sla: {
          enabled: enabled ?? false,
          uptimeTarget: uptimeTarget ?? 99.9,
          responseTimeP95: responseTimeP95 ?? 500,
          errorRateMax: errorRateMax ?? 1,
        },
      },
      { new: true },
    );
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }
    res.json({
      success: true,
      message: "SLA configuration updated",
      data: { sla: api.sla },
    });
  } catch (error) {
    next(error);
  }
};

const generateAllReports = async (req, res, next) => {
  try {
    const { periodType } = req.body;
    const apis = await Api.find({
      userId: req.user._id,
      "sla.enabled": true,
    }).select("_id name");
    if (apis.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No APIs with SLA enabled found",
      });
    }
    const results = await Promise.all(
      apis.map(async (api) => {
        try {
          const report = await generateSLAReport(
            api._id,
            req.user._id,
            periodType || "daily",
          );
          return {
            apiId: api._id,
            apiName: api.name,
            success: !!report,
            reportId: report?._id || null,
          };
        } catch {
          return {
            apiId: api._id,
            apiName: api.name,
            success: false,
            error: "Generation failed",
          };
        }
      }),
    );
    const successCount = results.filter((r) => r.success).length;
    res.json({
      success: true,
      message: `Generated ${successCount} of ${apis.length} SLA reports`,
      data: { results },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  generateReport,
  getReports,
  getReportById,
  updateSLAConfig,
  generateAllReports,
};
