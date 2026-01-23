const axios = require("axios");
const Api = require("../models/Api");
const Check = require("../models/Check");
const Anomaly = require("../models/Anomaly");
const Notification = require("../models/Notification");
const {
  getOrSet,
  CACHE_KEYS,
  CACHE_TTL,
  invalidateUserCache,
} = require("../utils/cache");

const getApis = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;

    const query = { userId: req.user._id };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { url: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const apis = await Api.find(query).sort({ createdAt: -1 }).lean();

    // Process in batches for efficiency
    const batchSize = 20;
    const apisWithStats = [];

    for (let i = 0; i < apis.length; i += batchSize) {
      const batch = apis.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (api) => {
          const recentChecks = await Check.find({ apiId: api._id })
            .sort({ timestamp: -1 })
            .limit(10)
            .select("success responseTime timestamp")
            .lean();

          const successCount = recentChecks.filter((c) => c.success).length;
          const uptime =
            recentChecks.length > 0
              ? (successCount / recentChecks.length) * 100
              : 100;
          const avgResponseTime =
            recentChecks.length > 0
              ? Math.round(
                  recentChecks.reduce((sum, c) => sum + c.responseTime, 0) /
                    recentChecks.length,
                )
              : 0;

          const latestCheck = recentChecks[0];

          let apiStatus = "healthy";
          if (!latestCheck) apiStatus = "unknown";
          else if (!latestCheck.success) apiStatus = "down";
          else if (uptime < 90) apiStatus = "warning";

          if (status && status !== "all" && apiStatus !== status) {
            return null;
          }

          return {
            ...api,
            status: apiStatus,
            uptime: Math.round(uptime),
            avgResponseTime,
            lastChecked: api.lastChecked,
          };
        }),
      );
      apisWithStats.push(...batchResults);
    }

    const filteredApis = apisWithStats.filter((api) => api !== null);

    res.status(200).json({
      success: true,
      count: filteredApis.length,
      data: filteredApis,
    });
  } catch (error) {
    next(error);
  }
};

const getApi = async (req, res, next) => {
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

    res.status(200).json({
      success: true,
      data: api,
    });
  } catch (error) {
    next(error);
  }
};

const createApi = async (req, res, next) => {
  try {
    const {
      name,
      description,
      url,
      method,
      headers,
      body,
      checkFrequency,
      timeout,
      expectedStatusCode,
      alertsEnabled,
      category,
      tags,
    } = req.body;

    const api = await Api.create({
      userId: req.user._id,
      name,
      description: description || "",
      url,
      method: method || "GET",
      headers: headers || {},
      body: body || null,
      checkFrequency: checkFrequency || 300000,
      timeout: timeout || 30000,
      expectedStatusCode: expectedStatusCode || 200,
      alertsEnabled: alertsEnabled !== false,
      category: category || "General",
      tags: tags || [],
    });

    // Invalidate user's cached data
    invalidateUserCache(req.user._id);

    res.status(201).json({
      success: true,
      data: api,
    });
  } catch (error) {
    next(error);
  }
};

const updateApi = async (req, res, next) => {
  try {
    const {
      name,
      description,
      url,
      method,
      headers,
      body,
      checkFrequency,
      timeout,
      expectedStatusCode,
      alertsEnabled,
      category,
      tags,
      isActive,
    } = req.body;

    let api = await Api.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "API not found",
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (url !== undefined) updateData.url = url;
    if (method !== undefined) updateData.method = method;
    if (headers !== undefined) updateData.headers = headers;
    if (body !== undefined) updateData.body = body;
    if (checkFrequency !== undefined)
      updateData.checkFrequency = checkFrequency;
    if (timeout !== undefined) updateData.timeout = timeout;
    if (expectedStatusCode !== undefined)
      updateData.expectedStatusCode = expectedStatusCode;
    if (alertsEnabled !== undefined) updateData.alertsEnabled = alertsEnabled;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (isActive !== undefined) updateData.isActive = isActive;

    api = await Api.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    // Invalidate user's cached data
    invalidateUserCache(req.user._id);

    res.status(200).json({
      success: true,
      data: api,
    });
  } catch (error) {
    next(error);
  }
};

const deleteApi = async (req, res, next) => {
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

    await Check.deleteMany({ apiId: api._id });
    await Anomaly.deleteMany({ apiId: api._id });
    await Notification.deleteMany({
      anomalyId: {
        $in: await Anomaly.find({ apiId: api._id }).distinct("_id"),
      },
    });
    await Api.findByIdAndDelete(api._id);

    // Invalidate user's cached data
    invalidateUserCache(req.user._id);

    res.status(200).json({
      success: true,
      message: "API deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleActive = async (req, res, next) => {
  try {
    let api = await Api.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "API not found",
      });
    }

    api = await Api.findByIdAndUpdate(
      req.params.id,
      { isActive: !api.isActive },
      { new: true },
    );

    // Invalidate user's cached data
    invalidateUserCache(req.user._id);

    res.status(200).json({
      success: true,
      data: api,
    });
  } catch (error) {
    next(error);
  }
};

const resetBaseline = async (req, res, next) => {
  try {
    let api = await Api.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "API not found",
      });
    }

    api = await Api.findByIdAndUpdate(
      req.params.id,
      { baselineSchema: null },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message:
        "Baseline schema reset. New baseline will be captured on next check.",
      data: api,
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    // Cache categories for 5 minutes
    const cacheKey = `categories_${req.user._id}`;
    const categories = await getOrSet(
      cacheKey,
      async () => {
        return Api.distinct("category", { userId: req.user._id });
      },
      CACHE_TTL.MEDIUM,
    );

    res.status(200).json({
      success: true,
      data: categories.filter((c) => c),
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    // Cache dashboard stats for 1 minute (short TTL for real-time data)
    const cacheKey = CACHE_KEYS.DASHBOARD_STATS(req.user._id);
    const data = await getOrSet(
      cacheKey,
      async () => {
        const apis = await Api.find({ userId: req.user._id })
          .select("_id isActive")
          .lean();

        const totalApis = apis.length;
        const activeApis = apis.filter((a) => a.isActive).length;

        // Batch process API health checks
        const apiIds = apis.map((a) => a._id);

        // Get latest checks for all APIs in one query
        const latestChecks = await Check.aggregate([
          { $match: { apiId: { $in: apiIds } } },
          { $sort: { timestamp: -1 } },
          {
            $group: {
              _id: "$apiId",
              latestCheck: { $first: "$$ROOT" },
              recentChecks: { $push: "$$ROOT" },
            },
          },
          {
            $project: {
              _id: 1,
              latestCheck: 1,
              recentChecks: { $slice: ["$recentChecks", 10] },
            },
          },
        ]);

        let healthyCount = 0;
        let warningCount = 0;
        let downCount = 0;

        for (const item of latestChecks) {
          if (!item.latestCheck) continue;
          if (!item.latestCheck.success) {
            downCount++;
          } else {
            const successRate =
              item.recentChecks.filter((c) => c.success).length /
              item.recentChecks.length;
            if (successRate < 0.9) {
              warningCount++;
            } else {
              healthyCount++;
            }
          }
        }

        const [unreadNotifications, unacknowledgedAnomalies] =
          await Promise.all([
            Notification.countDocuments({
              userId: req.user._id,
              read: false,
            }),
            Anomaly.countDocuments({
              apiId: { $in: apiIds },
              acknowledged: false,
            }),
          ]);

        return {
          totalApis,
          activeApis,
          healthyCount,
          warningCount,
          downCount,
          unreadNotifications,
          unacknowledgedAnomalies,
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

const testApi = async (req, res, next) => {
  try {
    const { url, method, headers, body, timeout } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const startTime = Date.now();

    try {
      const config = {
        method: method || "GET",
        url,
        headers: headers || {},
        timeout: timeout || 30000,
      };

      if (["POST", "PUT", "PATCH"].includes(method) && body) {
        config.data = body;
      }

      const response = await axios(config);
      const responseTime = Date.now() - startTime;

      res.status(200).json({
        success: true,
        data: {
          statusCode: response.status,
          responseTime,
          headers: response.headers,
          body: response.data,
          size: JSON.stringify(response.data).length,
        },
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;

      res.status(200).json({
        success: false,
        data: {
          statusCode: error.response?.status || null,
          responseTime,
          error: error.message,
          body: error.response?.data || null,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApis,
  getApi,
  createApi,
  updateApi,
  deleteApi,
  toggleActive,
  resetBaseline,
  getCategories,
  getDashboardStats,
  testApi,
};
