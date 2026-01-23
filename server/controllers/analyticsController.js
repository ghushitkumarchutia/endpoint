const Check = require("../models/Check");
const Anomaly = require("../models/Anomaly");
const Api = require("../models/Api");
const { calculateAverage, calculatePercentile } = require("../utils/helpers");
const { getOrSet, CACHE_TTL } = require("../utils/cache");

const getChecks = async (req, res, next) => {
  try {
    const api = await Api.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "API not found",
      });
    }

    const limit = parseInt(req.query.limit) || 100;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const checks = await Check.find({ apiId: api._id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Check.countDocuments({ apiId: api._id });

    res.status(200).json({
      success: true,
      count: checks.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: checks,
    });
  } catch (error) {
    next(error);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const api = await Api.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "API not found",
      });
    }

    // Cache summary for 2 minutes
    const cacheKey = `api_summary_${api._id}`;
    const data = await getOrSet(
      cacheKey,
      async () => {
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const last7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const last30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Optimize: Fetch all checks in one query and filter in memory
        const allChecks = await Check.find({
          apiId: api._id,
          timestamp: { $gte: last30d },
        })
          .select("timestamp responseTime success")
          .lean();

        const checks24h = allChecks.filter((c) => c.timestamp >= last24h);
        const checks7d = allChecks.filter((c) => c.timestamp >= last7d);

        const calculateStats = (checks) => {
          if (checks.length === 0) {
            return {
              uptime: 100,
              avgResponseTime: 0,
              minResponseTime: 0,
              maxResponseTime: 0,
              p95ResponseTime: 0,
              p99ResponseTime: 0,
              totalChecks: 0,
              successCount: 0,
              errorCount: 0,
            };
          }

          const responseTimes = checks.map((c) => c.responseTime);
          const successCount = checks.filter((c) => c.success).length;
          const uptime = (successCount / checks.length) * 100;
          const avgResponseTime = calculateAverage(responseTimes);
          const minResponseTime = Math.min(...responseTimes);
          const maxResponseTime = Math.max(...responseTimes);
          const p95ResponseTime = calculatePercentile(responseTimes, 95);
          const p99ResponseTime = calculatePercentile(responseTimes, 99);

          return {
            uptime: Math.round(uptime * 100) / 100,
            avgResponseTime: Math.round(avgResponseTime),
            minResponseTime: Math.round(minResponseTime),
            maxResponseTime: Math.round(maxResponseTime),
            p95ResponseTime: Math.round(p95ResponseTime),
            p99ResponseTime: Math.round(p99ResponseTime),
            totalChecks: checks.length,
            successCount,
            errorCount: checks.length - successCount,
          };
        };

        const [anomalyCount, recentAnomalies] = await Promise.all([
          Anomaly.countDocuments({
            apiId: api._id,
            acknowledged: false,
          }),
          Anomaly.find({ apiId: api._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),
        ]);

        return {
          api: {
            id: api._id,
            name: api.name,
            description: api.description,
            url: api.url,
            method: api.method,
            isActive: api.isActive,
            alertsEnabled: api.alertsEnabled,
            lastChecked: api.lastChecked,
            lastSuccessAt: api.lastSuccessAt,
            lastFailureAt: api.lastFailureAt,
            consecutiveFailures: api.consecutiveFailures,
          },
          stats: {
            last24h: calculateStats(checks24h),
            last7d: calculateStats(checks7d),
            last30d: calculateStats(allChecks),
          },
          anomalyCount,
          recentAnomalies,
        };
      },
      CACHE_TTL.SHORT,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAnomalies = async (req, res, next) => {
  try {
    const api = await Api.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "API not found",
      });
    }

    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const { type, severity } = req.query;

    const query = { apiId: api._id };
    if (type) query.type = type;
    if (severity) query.severity = severity;

    const anomalies = await Anomaly.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Anomaly.countDocuments(query);

    res.status(200).json({
      success: true,
      count: anomalies.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: anomalies,
    });
  } catch (error) {
    next(error);
  }
};

const acknowledgeAnomaly = async (req, res, next) => {
  try {
    const anomaly = await Anomaly.findById(req.params.anomalyId);

    if (!anomaly) {
      return res.status(404).json({
        success: false,
        message: "Anomaly not found",
      });
    }

    const api = await Api.findOne({
      _id: anomaly.apiId,
      userId: req.user._id,
    });

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "Not authorized",
      });
    }

    anomaly.acknowledged = true;
    await anomaly.save();

    res.status(200).json({
      success: true,
      data: anomaly,
    });
  } catch (error) {
    next(error);
  }
};

const getResponseTimeHistory = async (req, res, next) => {
  try {
    const api = await Api.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "API not found",
      });
    }

    const hours = parseInt(req.query.hours) || 24;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const checks = await Check.find({
      apiId: api._id,
      timestamp: { $gte: since },
    })
      .sort({ timestamp: 1 })
      .select("timestamp responseTime success statusCode")
      .lean();

    res.status(200).json({
      success: true,
      count: checks.length,
      data: checks,
    });
  } catch (error) {
    next(error);
  }
};

const clearChecks = async (req, res, next) => {
  try {
    const api = await Api.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "API not found",
      });
    }

    const result = await Check.deleteMany({ apiId: api._id });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} check records`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChecks,
  getSummary,
  getAnomalies,
  acknowledgeAnomaly,
  getResponseTimeHistory,
  clearChecks,
};
