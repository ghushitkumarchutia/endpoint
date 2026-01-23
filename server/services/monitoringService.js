const cron = require("node-cron");
const axios = require("axios");
const Api = require("../models/Api");
const Check = require("../models/Check");
const { generateSchema } = require("./schemaService");
const { detectAnomaly, detectSchemaDrift } = require("./anomalyService");
const { sanitizeObject } = require("../utils/helpers");
const { recordCost } = require("./costService");
const { validateContract } = require("./contractService");
const { evaluateSLACompliance } = require("./slaService");
const { detectRegression } = require("./regressionService");
const { analyzeFailure } = require("./rootCauseService");
const { analyzeForPrediction } = require("./predictiveService");

const CONFIG = {
  MAX_CONCURRENT_CHECKS: 10,
  CHECK_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000,
  MAX_RESPONSE_SIZE: 1024 * 1024,
  CYCLE_LOCK_TIMEOUT: 5 * 60 * 1000,
};

let isMonitoringActive = false;
let cronJob = null;
let isCycleRunning = false;
let cycleStartTime = null;

const determineErrorType = (error) => {
  if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
    return "timeout";
  }
  if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
    return "network";
  }
  if (error.response) {
    const status = error.response.status;
    if (status >= 500) return "server";
    if (status >= 400) return "client";
  }
  return "network";
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Truncate response body if too large
 */
const truncateResponseBody = (body) => {
  if (!body) return null;
  const stringified = JSON.stringify(body);
  if (stringified.length > CONFIG.MAX_RESPONSE_SIZE) {
    return {
      _truncated: true,
      _originalSize: stringified.length,
      _message: "Response body truncated due to size limit",
    };
  }
  return body;
};

/**
 * Check a single API with retry logic
 */
const checkApi = async (api, retryCount = 0) => {
  const startTime = Date.now();
  let check;

  try {
    const config = {
      method: api.method,
      url: api.url,
      headers: api.headers || {},
      timeout: Math.min(api.timeout || CONFIG.CHECK_TIMEOUT, 60000),
      maxContentLength: CONFIG.MAX_RESPONSE_SIZE,
      maxBodyLength: CONFIG.MAX_RESPONSE_SIZE,
      validateStatus: () => true, // Don't throw on any status code
    };

    if (["POST", "PUT", "PATCH"].includes(api.method) && api.body) {
      config.data = api.body;
    }

    const response = await axios(config);
    const responseTime = Date.now() - startTime;

    const rawBody =
      typeof response.data === "object"
        ? response.data
        : { data: response.data };
    const sanitizedBody = truncateResponseBody(sanitizeObject(rawBody));
    const responseSize = JSON.stringify(rawBody).length;

    const isExpectedStatus = api.expectedStatusCode
      ? response.status === api.expectedStatusCode
      : response.status >= 200 && response.status < 400;

    check = await Check.create({
      apiId: api._id,
      responseTime,
      statusCode: response.status,
      success: isExpectedStatus,
      responseBody: sanitizedBody,
      responseSize: Math.min(responseSize, CONFIG.MAX_RESPONSE_SIZE),
      error: isExpectedStatus ? null : `Unexpected status: ${response.status}`,
      errorType: isExpectedStatus ? null : "client",
    });

    const updateData = {
      lastChecked: new Date(),
      lastSuccessAt: new Date(),
      consecutiveFailures: 0,
    };

    if (!api.baselineSchema && sanitizedBody && !sanitizedBody._truncated) {
      updateData.baselineSchema = generateSchema(sanitizedBody);
    }

    await Api.findByIdAndUpdate(api._id, updateData);

    if (api.baselineSchema && sanitizedBody && !sanitizedBody._truncated) {
      const currentSchema = generateSchema(sanitizedBody);
      await detectSchemaDrift(api, check, currentSchema);
    }
  } catch (error) {
    // Retry logic for transient failures
    if (
      retryCount < CONFIG.RETRY_ATTEMPTS &&
      (error.code === "ECONNABORTED" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNRESET")
    ) {
      await sleep(CONFIG.RETRY_DELAY * (retryCount + 1));
      return checkApi(api, retryCount + 1);
    }

    const responseTime = Date.now() - startTime;
    const errorType = determineErrorType(error);

    check = await Check.create({
      apiId: api._id,
      responseTime,
      statusCode: error.response?.status || null,
      success: false,
      error: error.message.substring(0, 500), // Limit error message length
      errorType,
      responseSize: error.response?.data
        ? Math.min(
            JSON.stringify(error.response.data).length,
            CONFIG.MAX_RESPONSE_SIZE,
          )
        : 0,
    });

    await Api.findByIdAndUpdate(api._id, {
      lastChecked: new Date(),
      lastFailureAt: new Date(),
      $inc: { consecutiveFailures: 1 },
    });
  }

  // Get check history with limit for analysis
  const checksHistory = await Check.find({ apiId: api._id })
    .sort({ timestamp: -1 })
    .limit(50)
    .select("responseTime success timestamp errorType")
    .lean();

  await detectAnomaly(api, check, checksHistory);

  // Run additional integrations with individual error handling
  await runIntegrations(api, check, checksHistory);

  return check;
};

/**
 * Run integrations with isolated error handling
 */
const runIntegrations = async (api, check, checksHistory) => {
  const integrations = [
    {
      name: "costTracking",
      condition: api.costTracking?.enabled,
      fn: () => recordCost(api, check, api.userId),
    },
    {
      name: "contractValidation",
      condition: api.responseContract?.enabled,
      fn: () => validateContract(api, check),
    },
    {
      name: "slaCompliance",
      condition: api.sla?.enabled,
      fn: () => evaluateSLACompliance(api, check),
    },
    {
      name: "rootCauseAnalysis",
      condition: !check.success,
      fn: () => analyzeFailure(check, api, api.userId),
    },
    {
      name: "predictiveAnalysis",
      condition: true,
      fn: () => analyzeForPrediction(api, api.userId),
    },
    {
      name: "regressionDetection",
      condition: checksHistory.length >= 10,
      fn: () => detectRegression(api, api.userId),
    },
  ];

  for (const integration of integrations) {
    if (integration.condition) {
      try {
        await integration.fn();
      } catch (error) {
        console.error(
          `[${api.name}] ${integration.name} error:`,
          error.message,
        );
      }
    }
  }
};

/**
 * Process APIs in batches with concurrency limit
 */
const processBatch = async (apis) => {
  const results = [];

  for (let i = 0; i < apis.length; i += CONFIG.MAX_CONCURRENT_CHECKS) {
    const batch = apis.slice(i, i + CONFIG.MAX_CONCURRENT_CHECKS);

    const batchPromises = batch.map(async (api) => {
      try {
        await checkApi(api);
        return { apiId: api._id, success: true };
      } catch (error) {
        console.error(`Error checking API ${api.name}:`, error.message);
        return { apiId: api._id, success: false, error: error.message };
      }
    });

    const batchResults = await Promise.allSettled(batchPromises);
    results.push(
      ...batchResults.map((r) =>
        r.status === "fulfilled" ? r.value : r.reason,
      ),
    );
  }

  return results;
};

/**
 * Main monitoring cycle - runs every minute
 */
const runMonitoringCycle = async () => {
  // Prevent concurrent cycles
  if (isCycleRunning) {
    // Check if previous cycle is stuck
    if (
      cycleStartTime &&
      Date.now() - cycleStartTime > CONFIG.CYCLE_LOCK_TIMEOUT
    ) {
      console.warn(
        "Previous monitoring cycle appears stuck. Allowing new cycle...",
      );
      isCycleRunning = false;
    } else {
      console.log("Monitoring cycle already running, skipping...");
      return;
    }
  }

  isCycleRunning = true;
  cycleStartTime = Date.now();

  try {
    const now = Date.now();

    // Fetch only APIs that need checking (optimized query)
    const apisToCheck = await Api.find({
      isActive: true,
      $or: [
        { lastChecked: null },
        {
          $expr: {
            $gte: [
              { $subtract: [now, { $toLong: "$lastChecked" }] },
              "$checkFrequency",
            ],
          },
        },
      ],
    })
      .select(
        "_id name url method headers body timeout checkFrequency expectedStatusCode " +
          "baselineSchema userId costTracking responseContract sla consecutiveFailures lastChecked",
      )
      .lean();

    if (apisToCheck.length === 0) {
      return;
    }

    console.log(`Monitoring ${apisToCheck.length} APIs...`);

    await processBatch(apisToCheck);

    const duration = Date.now() - cycleStartTime;
    console.log(
      `Monitoring cycle completed: ${apisToCheck.length} APIs in ${duration}ms`,
    );
  } catch (error) {
    console.error("Monitoring cycle error:", error.message);
  } finally {
    isCycleRunning = false;
    cycleStartTime = null;
  }
};

/**
 * Start the monitoring service
 */
const startMonitoring = () => {
  if (isMonitoringActive) {
    console.log("Monitoring service already active");
    return;
  }

  isMonitoringActive = true;

  cronJob = cron.schedule("* * * * *", async () => {
    if (!isMonitoringActive) return;

    try {
      await runMonitoringCycle();
    } catch (error) {
      console.error("Monitoring cycle error:", error.message);
    }
  });

  console.log("Monitoring service started");
};

/**
 * Stop the monitoring service gracefully
 */
const stopMonitoring = () => {
  isMonitoringActive = false;

  if (cronJob) {
    cronJob.stop();
    cronJob = null;
  }

  console.log("Monitoring service stopped");
};

/**
 * Trigger a manual check for a specific API
 */
const triggerManualCheck = async (apiId) => {
  const api = await Api.findById(apiId).lean();
  if (!api) {
    throw new Error("API not found");
  }
  await checkApi(api);
  return { message: "Check completed" };
};

/**
 * Get monitoring service status
 */
const getMonitoringStatus = () => {
  return {
    isActive: isMonitoringActive,
    isCycleRunning,
    cycleStartTime,
    config: CONFIG,
  };
};

module.exports = {
  startMonitoring,
  stopMonitoring,
  runMonitoringCycle,
  checkApi,
  triggerManualCheck,
  getMonitoringStatus,
};
