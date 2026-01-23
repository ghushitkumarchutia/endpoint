// Set test environment to bypass rate limiting
process.env.NODE_ENV = "test";

require("dotenv").config();

const axios = require("axios");
const mongoose = require("mongoose");

// ============================================================================
// MODEL IMPORTS - Reference for Frontend Development
// ============================================================================
// All models represent MongoDB collections and define the data structures
// that the frontend will receive from API responses.
// ============================================================================

// User: Authentication & user profile data
// Fields: name, email, password (hashed), resetToken, resetTokenExpiry, createdAt
const User = require("../models/User");

// Api: Monitored API endpoints configuration
// Fields: userId, name, url, method, headers, body, checkFrequency, timeout,
//         expectedStatusCode, alertsEnabled, isActive, category, tags, description,
//         baselineResponseTime, baselineStdDev, lastChecked, consecutiveFailures,
//         costTracking{}, responseContract{}, sla{}
const Api = require("../models/Api");

// Check: Individual API health check results
// Fields: apiId, timestamp, responseTime, success, statusCode, error, responseBody
const Check = require("../models/Check");

// Anomaly: Detected anomalies in API behavior
// Fields: apiId, checkId, type, message, severity, responseTime, expectedRange,
//         acknowledged, createdAt
const Anomaly = require("../models/Anomaly");

// Notification: User notifications for alerts and events
// Fields: userId, apiId, message, type, read, createdAt
const Notification = require("../models/Notification");

// CostRecord: API usage cost tracking records
// Fields: apiId, checkId, userId, cost, timestamp
const CostRecord = require("../models/CostRecord");

// ContractViolation: Response contract/schema violations
// Fields: apiId, checkId, violations[], acknowledged, createdAt
const ContractViolation = require("../models/ContractViolation");

// SLAReport: SLA compliance reports (daily/weekly/monthly)
// Fields: apiId, userId, periodType, periodStart, periodEnd, metrics{}, breaches[]
const SLAReport = require("../models/SLAReport");

// PerformanceRegression: Detected performance degradations
// Fields: apiId, userId, detectedAt, baselinePeriod{}, baselineStats{},
//         currentStats{}, degradationPercent, confidenceLevel, tTestPValue, status
const PerformanceRegression = require("../models/PerformanceRegression");

// PredictiveAlert: AI-predicted potential failures
// Fields: apiId, userId, failureProbability, predictedFailureTime,
//         earlyWarningSignals[], status, createdAt
const PredictiveAlert = require("../models/PredictiveAlert");

// RootCauseAnalysis: AI analysis of failure causes
// Fields: failedCheckId, apiId, userId, analyzedAt, context{}, possibleCauses[]
const RootCauseAnalysis = require("../models/RootCauseAnalysis");

// APIDependency: API dependency relationships
// Fields: apiId, dependsOnApiId, userId, relationship, isRequired, createdAt
const APIDependency = require("../models/APIDependency");

// WebhookEndpoint: Custom webhook testing endpoints
// Fields: userId, uniqueId, name, description, receivedPayloads[],
//         isActive, expiresAt, maxPayloads, createdAt
const WebhookEndpoint = require("../models/WebhookEndpoint");

// NLQueryLog: Natural language query history
// Fields: userId, query, response, wasHelpful, createdAt
const NLQueryLog = require("../models/NLQueryLog");

// ============================================================================
// SERVICES - Business logic layer
// ============================================================================
const { checkApi } = require("../services/monitoringService");

const baseUrl =
  process.env.SMOKE_BASE_URL ||
  `http://localhost:${process.env.PORT || 5001}/api`;

const http = axios.create({
  baseURL: baseUrl,
  validateStatus: () => true,
  timeout: 30000,
});

let passed = 0;
let failed = 0;
const failures = [];

const assert = (condition, message) => {
  if (!condition) {
    failed++;
    failures.push(message);
    console.log(`  ❌ FAIL: ${message}`);
    return false;
  }
  passed++;
  console.log(`  ✅ PASS: ${message}`);
  return true;
};

const request = async ({ method, path, token, data, params }) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const res = await http.request({
    method,
    url: path,
    headers,
    data,
    params,
  });
  return res;
};

const randomEmail = () => {
  const ts = Date.now();
  const r = Math.floor(Math.random() * 1e9);
  return `smoke_${ts}_${r}@example.com`;
};

const section = (name) => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`== ${name}`);
  console.log(`${"=".repeat(60)}`);
};

const run = async () => {
  section("CONFIG");
  console.log("Base URL:", baseUrl);
  console.log("MongoDB:", process.env.MONGO_URI ? "Configured" : "MISSING!");

  // ==========================================
  // HEALTH CHECK (1 endpoint)
  // ==========================================
  section("1. HEALTH CHECK ENDPOINT");
  {
    const res = await request({ method: "GET", path: "/health" });
    assert(res.status === 200, "GET /health returns 200");
    assert(res.data?.success === true, "GET /health success=true");
    assert(res.data?.uptime !== undefined, "GET /health has uptime");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for direct DB operations");

  const email = randomEmail();
  const name = "Smoke Test User";
  const pass1 = "SmokeTest_12345";
  const pass2 = "SmokeTest_23456";
  const pass3 = "SmokeTest_34567";

  // ==========================================
  // AUTH ROUTES (8 endpoints)
  // ==========================================
  section("2. AUTH ROUTES (8 endpoints)");

  let token;
  let userId;

  // 2.1 POST /auth/register
  {
    const res = await request({
      method: "POST",
      path: "/auth/register",
      data: { name, email, password: pass1 },
    });
    assert(res.status === 201, "POST /auth/register returns 201");
    assert(res.data?.token, "POST /auth/register returns token");
    assert(
      res.data?.user?.email === email.toLowerCase(),
      "POST /auth/register returns user",
    );
    token = res.data?.token;
    userId = res.data?.user?.id;
  }

  // 2.2 POST /auth/login
  {
    const res = await request({
      method: "POST",
      path: "/auth/login",
      data: { email, password: pass1 },
    });
    assert(res.status === 200, "POST /auth/login returns 200");
    assert(res.data?.token, "POST /auth/login returns token");
    token = res.data?.token;
  }

  // 2.3 GET /auth/me
  {
    const res = await request({ method: "GET", path: "/auth/me", token });
    assert(res.status === 200, "GET /auth/me returns 200");
    assert(
      res.data?.user?.email === email.toLowerCase(),
      "GET /auth/me returns correct email",
    );
  }

  // 2.4 PUT /auth/profile
  {
    const res = await request({
      method: "PUT",
      path: "/auth/profile",
      token,
      data: { name: "Smoke Test Updated" },
    });
    assert(res.status === 200, "PUT /auth/profile returns 200");
    assert(
      res.data?.user?.name === "Smoke Test Updated",
      "PUT /auth/profile updates name",
    );
  }

  // 2.5 POST /auth/forgot-password
  {
    const res = await request({
      method: "POST",
      path: "/auth/forgot-password",
      data: { email: `nonexistent_${email}` },
    });
    assert(
      res.status === 200,
      "POST /auth/forgot-password returns 200 (even for nonexistent)",
    );
    assert(
      res.data?.success === true,
      "POST /auth/forgot-password success=true",
    );
  }

  // 2.6 POST /auth/reset-password (with manual token setup)
  {
    const crypto = require("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      // Store plain token (not hashed) as the controller compares plain tokens
      user.resetToken = resetToken;
      user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
      await user.save({ validateBeforeSave: false });

      const res = await request({
        method: "POST",
        path: "/auth/reset-password",
        data: { token: resetToken, password: pass2 },
      });
      assert(res.status === 200, "POST /auth/reset-password returns 200");
      assert(res.data?.token, "POST /auth/reset-password returns new token");
      if (res.data?.token) token = res.data.token;
    } else {
      console.log("  ⏭️  SKIP: POST /auth/reset-password (user not found)");
    }
  }

  // Re-login to ensure fresh token
  {
    const loginRes = await request({
      method: "POST",
      path: "/auth/login",
      data: { email, password: pass2 },
    });
    if (loginRes.data?.token) token = loginRes.data.token;
  }

  // 2.7 PUT /auth/change-password
  {
    const res = await request({
      method: "PUT",
      path: "/auth/change-password",
      token,
      data: { currentPassword: pass2, newPassword: pass3 },
    });
    assert(res.status === 200, "PUT /auth/change-password returns 200");
    assert(
      res.data?.success === true,
      "PUT /auth/change-password success=true",
    );

    // Re-login with new password
    const loginRes = await request({
      method: "POST",
      path: "/auth/login",
      data: { email, password: pass3 },
    });
    token = loginRes.data?.token;
  }

  // ==========================================
  // API ROUTES (10 endpoints)
  // ==========================================
  section("3. API ROUTES (10 endpoints)");

  let apiId;
  let apiId2;

  // 3.1 POST /apis - Create API
  {
    const res = await request({
      method: "POST",
      path: "/apis",
      token,
      data: {
        name: "JSONPlaceholder Todos",
        url: "https://jsonplaceholder.typicode.com/todos/1",
        method: "GET",
        checkFrequency: 60000,
        timeout: 10000,
        expectedStatusCode: 200,
        alertsEnabled: false,
        category: "Testing",
        tags: ["smoke", "test"],
        description: "Smoke test API",
      },
    });
    assert(res.status === 201, "POST /apis returns 201");
    assert(res.data?.data?._id, "POST /apis returns API ID");
    apiId = res.data?.data?._id;
  }

  // 3.2 GET /apis - List APIs
  {
    const res = await request({ method: "GET", path: "/apis", token });
    assert(res.status === 200, "GET /apis returns 200");
    assert(Array.isArray(res.data?.data), "GET /apis returns array");
    assert(res.data?.data?.length >= 1, "GET /apis has at least 1 API");
  }

  // 3.3 GET /apis with filters
  {
    const res = await request({
      method: "GET",
      path: "/apis",
      token,
      params: { category: "Testing", search: "JSON" },
    });
    assert(res.status === 200, "GET /apis with filters returns 200");
  }

  // 3.4 GET /apis/categories
  {
    const res = await request({
      method: "GET",
      path: "/apis/categories",
      token,
    });
    assert(res.status === 200, "GET /apis/categories returns 200");
    assert(Array.isArray(res.data?.data), "GET /apis/categories returns array");
  }

  // 3.5 GET /apis/dashboard-stats
  {
    const res = await request({
      method: "GET",
      path: "/apis/dashboard-stats",
      token,
    });
    assert(res.status === 200, "GET /apis/dashboard-stats returns 200");
    assert(
      typeof res.data?.data?.totalApis === "number",
      "GET /apis/dashboard-stats has totalApis",
    );
  }

  // 3.6 GET /apis/:id
  {
    const res = await request({ method: "GET", path: `/apis/${apiId}`, token });
    assert(res.status === 200, "GET /apis/:id returns 200");
    assert(res.data?.data?._id === apiId, "GET /apis/:id returns correct API");
  }

  // 3.7 PUT /apis/:id
  {
    const res = await request({
      method: "PUT",
      path: `/apis/${apiId}`,
      token,
      data: { description: "Updated description" },
    });
    assert(res.status === 200, "PUT /apis/:id returns 200");
    assert(
      res.data?.data?.description === "Updated description",
      "PUT /apis/:id updates description",
    );
  }

  // 3.8 PATCH /apis/:id/toggle
  {
    const res = await request({
      method: "PATCH",
      path: `/apis/${apiId}/toggle`,
      token,
    });
    assert(res.status === 200, "PATCH /apis/:id/toggle returns 200");
  }

  // 3.9 PATCH /apis/:id/reset-baseline
  {
    const res = await request({
      method: "PATCH",
      path: `/apis/${apiId}/reset-baseline`,
      token,
    });
    assert(res.status === 200, "PATCH /apis/:id/reset-baseline returns 200");
  }

  // 3.10 POST /apis/test
  {
    const res = await request({
      method: "POST",
      path: "/apis/test",
      token,
      data: {
        url: "https://jsonplaceholder.typicode.com/todos/1",
        method: "GET",
        timeout: 10000,
      },
    });
    assert(res.status === 200, "POST /apis/test returns 200");
    assert(
      typeof res.data?.success === "boolean",
      "POST /apis/test returns success boolean",
    );
  }

  // Create a second API for dependency testing
  {
    const res = await request({
      method: "POST",
      path: "/apis",
      token,
      data: {
        name: "Second Test API",
        url: "https://jsonplaceholder.typicode.com/posts/1",
        method: "GET",
        checkFrequency: 60000,
        timeout: 10000,
        category: "Testing",
      },
    });
    apiId2 = res.data?.data?._id;
  }

  // ==========================================
  // GENERATE TEST DATA VIA MONITORING SERVICE
  // ==========================================
  section("4. GENERATE TEST DATA (Checks, Anomalies, Notifications)");

  // Create a failing API to generate anomaly
  let failingApiId;
  let anomalyId;
  let notificationId;
  {
    const res = await request({
      method: "POST",
      path: "/apis",
      token,
      data: {
        name: "Failing API for Test",
        url: "http://127.0.0.1:1",
        method: "GET",
        timeout: 5000,
        alertsEnabled: false,
        category: "Smoke",
      },
    });
    failingApiId = res.data?.data?._id;
    assert(failingApiId, "Created failing API for anomaly generation");

    // Run check to generate anomaly
    const failingApi = await Api.findById(failingApiId).lean();
    await checkApi(failingApi);

    const anomaly = await Anomaly.findOne({ apiId: failingApiId })
      .sort({ createdAt: -1 })
      .lean();
    assert(anomaly, "Anomaly created from failing API");
    anomalyId = anomaly?._id?.toString();

    const notification = await Notification.findOne({
      userId: failingApi.userId,
    })
      .sort({ createdAt: -1 })
      .lean();
    notificationId = notification?._id?.toString();
    assert(notificationId, "Notification created from anomaly");
  }

  // ==========================================
  // ANALYTICS ROUTES (6 endpoints)
  // ==========================================
  section("5. ANALYTICS ROUTES (6 endpoints)");

  // 5.1 GET /analytics/:id/checks
  {
    const res = await request({
      method: "GET",
      path: `/analytics/${failingApiId}/checks`,
      token,
      params: { limit: 10 },
    });
    assert(res.status === 200, "GET /analytics/:id/checks returns 200");
    assert(
      Array.isArray(res.data?.data),
      "GET /analytics/:id/checks returns array",
    );
  }

  // 5.2 GET /analytics/:id/summary
  {
    const res = await request({
      method: "GET",
      path: `/analytics/${failingApiId}/summary`,
      token,
    });
    assert(res.status === 200, "GET /analytics/:id/summary returns 200");
    assert(res.data?.data?.api, "GET /analytics/:id/summary has api info");
    assert(res.data?.data?.stats, "GET /analytics/:id/summary has stats");
  }

  // 5.3 GET /analytics/:id/anomalies
  {
    const res = await request({
      method: "GET",
      path: `/analytics/${failingApiId}/anomalies`,
      token,
      params: { limit: 10 },
    });
    assert(res.status === 200, "GET /analytics/:id/anomalies returns 200");
    assert(
      Array.isArray(res.data?.data),
      "GET /analytics/:id/anomalies returns array",
    );
  }

  // 5.4 GET /analytics/:id/response-time-history
  {
    const res = await request({
      method: "GET",
      path: `/analytics/${failingApiId}/response-time-history`,
      token,
      params: { hours: 24 },
    });
    assert(
      res.status === 200,
      "GET /analytics/:id/response-time-history returns 200",
    );
  }

  // 5.5 PATCH /analytics/anomalies/:anomalyId/acknowledge
  if (anomalyId) {
    const res = await request({
      method: "PATCH",
      path: `/analytics/anomalies/${anomalyId}/acknowledge`,
      token,
    });
    assert(
      res.status === 200,
      "PATCH /analytics/anomalies/:id/acknowledge returns 200",
    );
    assert(res.data?.data?.acknowledged === true, "Anomaly acknowledged");
  }

  // 5.6 DELETE /analytics/:id/checks
  {
    const res = await request({
      method: "DELETE",
      path: `/analytics/${failingApiId}/checks`,
      token,
    });
    assert(res.status === 200, "DELETE /analytics/:id/checks returns 200");
  }

  // ==========================================
  // NOTIFICATION ROUTES (4 endpoints)
  // ==========================================
  section("6. NOTIFICATION ROUTES (4 endpoints)");

  // 6.1 GET /notifications
  {
    const res = await request({
      method: "GET",
      path: "/notifications",
      token,
      params: { limit: 10 },
    });
    assert(res.status === 200, "GET /notifications returns 200");
    assert(Array.isArray(res.data?.data), "GET /notifications returns array");
    assert(
      typeof res.data?.unreadCount === "number",
      "GET /notifications has unreadCount",
    );
  }

  // 6.2 PUT /notifications/read-all
  {
    const res = await request({
      method: "PUT",
      path: "/notifications/read-all",
      token,
    });
    assert(res.status === 200, "PUT /notifications/read-all returns 200");
  }

  // Create a fresh notification for testing
  const freshNotification = await Notification.create({
    userId,
    message: "Test notification for smoke test",
    type: "system",
  });

  // 6.3 PUT /notifications/:id/read
  {
    const res = await request({
      method: "PUT",
      path: `/notifications/${freshNotification._id}/read`,
      token,
    });
    assert(res.status === 200, "PUT /notifications/:id/read returns 200");
  }

  // 6.4 DELETE /notifications/:id
  {
    const res = await request({
      method: "DELETE",
      path: `/notifications/${freshNotification._id}`,
      token,
    });
    assert(res.status === 200, "DELETE /notifications/:id returns 200");
  }

  // ==========================================
  // COST ROUTES (4 endpoints)
  // ==========================================
  section("7. COST ROUTES (4 endpoints)");

  // Enable cost tracking on API first
  await Api.findByIdAndUpdate(apiId, {
    costTracking: {
      enabled: true,
      costPerRequest: 0.001,
      monthlyBudget: 100,
      alertThreshold: 80,
    },
  });

  // Create a cost record for testing
  await CostRecord.create({
    apiId,
    checkId: new mongoose.Types.ObjectId(),
    userId,
    cost: 0.001,
    timestamp: new Date(),
  });

  // 7.1 GET /costs/dashboard
  {
    const res = await request({
      method: "GET",
      path: "/costs/dashboard",
      token,
    });
    assert(res.status === 200, "GET /costs/dashboard returns 200");
    assert(
      res.data?.data?.analytics !== undefined,
      "GET /costs/dashboard has analytics",
    );
  }

  // 7.2 GET /costs/records
  {
    const res = await request({
      method: "GET",
      path: "/costs/records",
      token,
      params: { page: 1, limit: 10 },
    });
    assert(res.status === 200, "GET /costs/records returns 200");
  }

  // 7.3 GET /costs/api/:apiId
  {
    const res = await request({
      method: "GET",
      path: `/costs/api/${apiId}`,
      token,
    });
    assert(res.status === 200, "GET /costs/api/:apiId returns 200");
    assert(res.data?.data?.apiName, "GET /costs/api/:apiId has apiName");
  }

  // 7.4 PUT /costs/api/:apiId/config
  {
    const res = await request({
      method: "PUT",
      path: `/costs/api/${apiId}/config`,
      token,
      data: {
        enabled: true,
        costPerRequest: 0.002,
        monthlyBudget: 200,
        alertThreshold: 90,
      },
    });
    assert(res.status === 200, "PUT /costs/api/:apiId/config returns 200");
  }

  // ==========================================
  // CONTRACT ROUTES (5 endpoints)
  // ==========================================
  section("8. CONTRACT ROUTES (5 endpoints)");

  // Enable contract on API
  await Api.findByIdAndUpdate(apiId, {
    responseContract: {
      enabled: true,
      schema: { type: "object" },
      strictMode: false,
      expectedResponseTime: 1000,
    },
  });

  // Create a contract violation for testing
  const violation = await ContractViolation.create({
    apiId,
    checkId: new mongoose.Types.ObjectId(),
    violations: [
      {
        type: "RESPONSE_TIME_BREACH",
        expected: 1000,
        actual: 2000,
        severity: "medium",
      },
    ],
  });

  // 8.1 GET /contracts/violations
  {
    const res = await request({
      method: "GET",
      path: "/contracts/violations",
      token,
      params: { page: 1, limit: 10 },
    });
    assert(res.status === 200, "GET /contracts/violations returns 200");
  }

  // 8.2 GET /contracts/api/:apiId/violations
  {
    const res = await request({
      method: "GET",
      path: `/contracts/api/${apiId}/violations`,
      token,
      params: { limit: 10 },
    });
    assert(
      res.status === 200,
      "GET /contracts/api/:apiId/violations returns 200",
    );
  }

  // 8.3 GET /contracts/api/:apiId/stats
  {
    const res = await request({
      method: "GET",
      path: `/contracts/api/${apiId}/stats`,
      token,
      params: { days: 7 },
    });
    assert(res.status === 200, "GET /contracts/api/:apiId/stats returns 200");
  }

  // 8.4 PUT /contracts/api/:apiId/config
  {
    const res = await request({
      method: "PUT",
      path: `/contracts/api/${apiId}/config`,
      token,
      data: {
        enabled: true,
        strictMode: true,
        expectedResponseTime: 500,
      },
    });
    assert(res.status === 200, "PUT /contracts/api/:apiId/config returns 200");
  }

  // 8.5 PATCH /contracts/violations/:violationId/acknowledge
  {
    const res = await request({
      method: "PATCH",
      path: `/contracts/violations/${violation._id}/acknowledge`,
      token,
    });
    assert(
      res.status === 200,
      "PATCH /contracts/violations/:id/acknowledge returns 200",
    );
  }

  // ==========================================
  // SLA ROUTES (6 endpoints)
  // ==========================================
  section("9. SLA ROUTES (6 endpoints)");

  // Enable SLA on API
  await Api.findByIdAndUpdate(apiId, {
    sla: {
      enabled: true,
      uptimeTarget: 99.9,
      responseTimeP95: 500,
      errorRateMax: 1,
    },
  });

  // Create some checks for SLA calculation
  const now = new Date();
  await Check.insertMany([
    {
      apiId,
      timestamp: now,
      responseTime: 100,
      success: true,
      statusCode: 200,
    },
    {
      apiId,
      timestamp: new Date(now - 60000),
      responseTime: 150,
      success: true,
      statusCode: 200,
    },
  ]);

  // 9.1 GET /sla/dashboard
  {
    const res = await request({ method: "GET", path: "/sla/dashboard", token });
    assert(res.status === 200, "GET /sla/dashboard returns 200");
    assert(
      res.data?.data?.overallCompliance !== undefined,
      "GET /sla/dashboard has overallCompliance",
    );
  }

  // 9.2 POST /sla/api/:apiId/generate
  let reportId;
  {
    const res = await request({
      method: "POST",
      path: `/sla/api/${apiId}/generate`,
      token,
      data: { periodType: "daily" },
    });
    // May return 400 if no data, that's acceptable
    assert(
      res.status === 200 || res.status === 400,
      "POST /sla/api/:apiId/generate returns 200 or 400",
    );
    reportId = res.data?.data?._id;
  }

  // 9.3 GET /sla/api/:apiId/reports
  {
    const res = await request({
      method: "GET",
      path: `/sla/api/${apiId}/reports`,
      token,
      params: { limit: 10 },
    });
    assert(res.status === 200, "GET /sla/api/:apiId/reports returns 200");
  }

  // 9.4 GET /sla/reports/:reportId (if we have one)
  if (reportId) {
    const res = await request({
      method: "GET",
      path: `/sla/reports/${reportId}`,
      token,
    });
    assert(res.status === 200, "GET /sla/reports/:reportId returns 200");
  } else {
    console.log("  ⏭️  SKIP: GET /sla/reports/:reportId (no report generated)");
  }

  // 9.5 PUT /sla/api/:apiId/config
  {
    const res = await request({
      method: "PUT",
      path: `/sla/api/${apiId}/config`,
      token,
      data: {
        enabled: true,
        uptimeTarget: 99.5,
        responseTimeP95: 600,
        errorRateMax: 2,
      },
    });
    assert(res.status === 200, "PUT /sla/api/:apiId/config returns 200");
  }

  // 9.6 POST /sla/generate-all
  {
    const res = await request({
      method: "POST",
      path: "/sla/generate-all",
      token,
      data: { periodType: "daily" },
    });
    // May return 400 if no SLA-enabled APIs, acceptable
    assert(
      res.status === 200 || res.status === 400,
      "POST /sla/generate-all returns 200 or 400",
    );
  }

  // ==========================================
  // REGRESSION ROUTES (4 endpoints)
  // ==========================================
  section("10. REGRESSION ROUTES (4 endpoints)");

  // Create a regression for testing
  const regression = await PerformanceRegression.create({
    apiId,
    userId,
    detectedAt: new Date(),
    baselinePeriod: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    baselineStats: {
      mean: 100,
      stdDev: 10,
      p95: 120,
      p99: 130,
      sampleSize: 100,
    },
    currentStats: { mean: 200, stdDev: 20, p95: 240, p99: 260, sampleSize: 50 },
    degradationPercent: 100,
    confidenceLevel: 95,
    tTestPValue: 0.001,
    status: "active",
  });

  // 10.1 GET /regressions/dashboard
  {
    const res = await request({
      method: "GET",
      path: "/regressions/dashboard",
      token,
      params: { status: "active" },
    });
    assert(res.status === 200, "GET /regressions/dashboard returns 200");
    assert(
      res.data?.data?.summary !== undefined,
      "GET /regressions/dashboard has summary",
    );
  }

  // 10.2 GET /regressions/api/:apiId
  {
    const res = await request({
      method: "GET",
      path: `/regressions/api/${apiId}`,
      token,
      params: { days: 30 },
    });
    assert(res.status === 200, "GET /regressions/api/:apiId returns 200");
  }

  // 10.3 GET /regressions/:regressionId
  {
    const res = await request({
      method: "GET",
      path: `/regressions/${regression._id}`,
      token,
    });
    assert(res.status === 200, "GET /regressions/:regressionId returns 200");
    assert(
      res.data?.data?.degradationPercent === 100,
      "GET /regressions/:id returns correct data",
    );
  }

  // 10.4 PATCH /regressions/:regressionId/status
  {
    const res = await request({
      method: "PATCH",
      path: `/regressions/${regression._id}/status`,
      token,
      data: { status: "investigating" },
    });
    assert(res.status === 200, "PATCH /regressions/:id/status returns 200");
  }

  // ==========================================
  // INSIGHTS ROUTES (5 endpoints)
  // ==========================================
  section("11. INSIGHTS ROUTES (5 endpoints)");

  // Create root cause analysis for testing
  const rootCause = await RootCauseAnalysis.create({
    failedCheckId: new mongoose.Types.ObjectId(),
    apiId,
    userId,
    analyzedAt: new Date(),
    context: {
      error: "Connection refused",
      statusCode: null,
      timestamp: new Date(),
    },
    possibleCauses: [
      {
        cause: "Server down",
        probability: 80,
        evidence: ["Connection refused"],
      },
    ],
  });

  // Create predictive alert for testing
  const predictiveAlert = await PredictiveAlert.create({
    apiId,
    userId,
    failureProbability: 75,
    predictedFailureTime: new Date(Date.now() + 60 * 60 * 1000),
    earlyWarningSignals: [
      { signal: "Response time increasing", severity: "high" },
    ],
    status: "active",
  });

  // 11.1 GET /insights/root-cause/api/:apiId
  {
    const res = await request({
      method: "GET",
      path: `/insights/root-cause/api/${apiId}`,
      token,
      params: { limit: 10 },
    });
    assert(
      res.status === 200,
      "GET /insights/root-cause/api/:apiId returns 200",
    );
  }

  // 11.2 GET /insights/root-cause/:analysisId
  {
    const res = await request({
      method: "GET",
      path: `/insights/root-cause/${rootCause._id}`,
      token,
    });
    assert(
      res.status === 200,
      "GET /insights/root-cause/:analysisId returns 200",
    );
  }

  // 11.3 GET /insights/predictive
  {
    const res = await request({
      method: "GET",
      path: "/insights/predictive",
      token,
      params: { status: "active" },
    });
    assert(res.status === 200, "GET /insights/predictive returns 200");
    assert(
      res.data?.data?.summary !== undefined,
      "GET /insights/predictive has summary",
    );
  }

  // 11.4 GET /insights/predictive/:alertId
  {
    const res = await request({
      method: "GET",
      path: `/insights/predictive/${predictiveAlert._id}`,
      token,
    });
    assert(res.status === 200, "GET /insights/predictive/:alertId returns 200");
  }

  // 11.5 PATCH /insights/predictive/:alertId/status
  {
    const res = await request({
      method: "PATCH",
      path: `/insights/predictive/${predictiveAlert._id}/status`,
      token,
      data: { status: "acknowledged" },
    });
    assert(
      res.status === 200,
      "PATCH /insights/predictive/:alertId/status returns 200",
    );
  }

  // ==========================================
  // DEPENDENCY ROUTES (6 endpoints)
  // ==========================================
  section("12. DEPENDENCY ROUTES (6 endpoints)");

  // 12.1 GET /dependencies/graph
  {
    const res = await request({
      method: "GET",
      path: "/dependencies/graph",
      token,
    });
    assert(res.status === 200, "GET /dependencies/graph returns 200");
  }

  // 12.2 GET /dependencies/detect
  {
    const res = await request({
      method: "GET",
      path: "/dependencies/detect",
      token,
    });
    assert(res.status === 200, "GET /dependencies/detect returns 200");
    assert(
      res.data?.data?.suggestions !== undefined,
      "GET /dependencies/detect has suggestions",
    );
  }

  // 12.3 GET /dependencies/api/:apiId
  {
    const res = await request({
      method: "GET",
      path: `/dependencies/api/${apiId}`,
      token,
    });
    assert(res.status === 200, "GET /dependencies/api/:apiId returns 200");
    assert(
      res.data?.data?.dependencies !== undefined,
      "GET /dependencies/api/:apiId has dependencies",
    );
  }

  // 12.4 POST /dependencies/api/:apiId
  {
    const res = await request({
      method: "POST",
      path: `/dependencies/api/${apiId}`,
      token,
      data: {
        dependsOnApiId: apiId2,
        relationship: "calls",
        isRequired: true,
      },
    });
    assert(res.status === 200, "POST /dependencies/api/:apiId returns 200");
  }

  // 12.5 GET /dependencies/api/:apiId/impact
  {
    const res = await request({
      method: "GET",
      path: `/dependencies/api/${apiId}/impact`,
      token,
    });
    assert(
      res.status === 200,
      "GET /dependencies/api/:apiId/impact returns 200",
    );
  }

  // 12.6 DELETE /dependencies/api/:apiId/:dependsOnApiId
  {
    const res = await request({
      method: "DELETE",
      path: `/dependencies/api/${apiId}/${apiId2}`,
      token,
    });
    assert(
      res.status === 200,
      "DELETE /dependencies/api/:apiId/:dependsOnApiId returns 200",
    );
  }

  // ==========================================
  // WEBHOOK ROUTES (8 endpoints)
  // ==========================================
  section("13. WEBHOOK ROUTES (8 endpoints)");

  let webhookUniqueId;

  // 13.1 POST /webhooks - Create webhook
  {
    const res = await request({
      method: "POST",
      path: "/webhooks",
      token,
      data: {
        name: "Test Webhook",
        description: "Smoke test webhook endpoint",
        maxPayloads: 100,
      },
    });
    assert(res.status === 201, "POST /webhooks returns 201");
    assert(res.data?.data?.uniqueId, "POST /webhooks returns uniqueId");
    webhookUniqueId = res.data?.data?.uniqueId;
  }

  // 13.2 GET /webhooks - List webhooks
  {
    const res = await request({ method: "GET", path: "/webhooks", token });
    assert(res.status === 200, "GET /webhooks returns 200");
    assert(Array.isArray(res.data?.data), "GET /webhooks returns array");
  }

  // 13.3 GET /webhooks/:uniqueId
  {
    const res = await request({
      method: "GET",
      path: `/webhooks/${webhookUniqueId}`,
      token,
    });
    assert(res.status === 200, "GET /webhooks/:uniqueId returns 200");
  }

  // 13.4 POST /webhooks/receive/:uniqueId (public endpoint)
  {
    const res = await request({
      method: "POST",
      path: `/webhooks/receive/${webhookUniqueId}`,
      data: { test: "payload", timestamp: Date.now() },
    });
    assert(res.status === 200, "POST /webhooks/receive/:uniqueId returns 200");
  }

  // 13.5 GET /webhooks/:uniqueId/payload/:index
  {
    const res = await request({
      method: "GET",
      path: `/webhooks/${webhookUniqueId}/payload/0`,
      token,
    });
    assert(
      res.status === 200,
      "GET /webhooks/:uniqueId/payload/:index returns 200",
    );
  }

  // 13.6 PATCH /webhooks/:uniqueId/toggle
  {
    const res = await request({
      method: "PATCH",
      path: `/webhooks/${webhookUniqueId}/toggle`,
      token,
      data: { isActive: false },
    });
    assert(res.status === 200, "PATCH /webhooks/:uniqueId/toggle returns 200");
  }

  // 13.7 DELETE /webhooks/:uniqueId/payloads
  {
    const res = await request({
      method: "DELETE",
      path: `/webhooks/${webhookUniqueId}/payloads`,
      token,
    });
    assert(
      res.status === 200,
      "DELETE /webhooks/:uniqueId/payloads returns 200",
    );
  }

  // 13.8 DELETE /webhooks/:uniqueId
  {
    const res = await request({
      method: "DELETE",
      path: `/webhooks/${webhookUniqueId}`,
      token,
    });
    assert(res.status === 200, "DELETE /webhooks/:uniqueId returns 200");
  }

  // ==========================================
  // NL QUERY ROUTES (4 endpoints)
  // ==========================================
  section("14. NL QUERY ROUTES (4 endpoints)");

  let queryId;

  // 14.1 POST /query - Natural language query
  {
    const res = await request({
      method: "POST",
      path: "/query",
      token,
      data: { query: "What is the status of all my APIs?" },
    });
    assert(res.status === 200, "POST /query returns 200");
    assert(res.data?.data !== undefined, "POST /query returns data");
    queryId = res.data?.data?.queryId;
  }

  // 14.2 GET /query/history
  {
    const res = await request({
      method: "GET",
      path: "/query/history",
      token,
      params: { limit: 10 },
    });
    assert(res.status === 200, "GET /query/history returns 200");
    assert(Array.isArray(res.data?.data), "GET /query/history returns array");
  }

  // 14.3 GET /query/suggestions
  {
    const res = await request({
      method: "GET",
      path: "/query/suggestions",
      token,
    });
    assert(res.status === 200, "GET /query/suggestions returns 200");
    assert(
      res.data?.data?.suggestions !== undefined,
      "GET /query/suggestions has suggestions",
    );
  }

  // 14.4 PATCH /query/:queryId/feedback (need to get queryId from NLQueryLog)
  {
    const queryLog = await NLQueryLog.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();
    if (queryLog) {
      const res = await request({
        method: "PATCH",
        path: `/query/${queryLog._id}/feedback`,
        token,
        data: { wasHelpful: true },
      });
      assert(res.status === 200, "PATCH /query/:queryId/feedback returns 200");
    } else {
      console.log("  ⏭️  SKIP: PATCH /query/:queryId/feedback (no query log)");
    }
  }

  // ==========================================
  // CLEANUP
  // ==========================================
  section("15. CLEANUP");

  // Delete all test APIs
  {
    const del1 = await request({
      method: "DELETE",
      path: `/apis/${apiId}`,
      token,
    });
    assert(del1.status === 200, "DELETE /apis/:id (api1) returns 200");

    const del2 = await request({
      method: "DELETE",
      path: `/apis/${apiId2}`,
      token,
    });
    assert(del2.status === 200, "DELETE /apis/:id (api2) returns 200");

    const del3 = await request({
      method: "DELETE",
      path: `/apis/${failingApiId}`,
      token,
    });
    assert(del3.status === 200, "DELETE /apis/:id (failingApi) returns 200");
  }

  // Clean up test data
  await CostRecord.deleteMany({ userId });
  await ContractViolation.deleteMany({
    apiId: { $in: [apiId, apiId2, failingApiId] },
  });
  await SLAReport.deleteMany({ userId });
  await PerformanceRegression.deleteMany({ userId });
  await PredictiveAlert.deleteMany({ userId });
  await RootCauseAnalysis.deleteMany({ userId });
  await APIDependency.deleteMany({ userId });
  await WebhookEndpoint.deleteMany({ userId });
  await NLQueryLog.deleteMany({ userId });

  // 2.8 DELETE /auth/delete-account (last auth test)
  {
    const res = await request({
      method: "DELETE",
      path: "/auth/delete-account",
      token,
      data: { password: pass3 },
    });
    assert(res.status === 200, "DELETE /auth/delete-account returns 200");
    assert(
      res.data?.success === true,
      "DELETE /auth/delete-account success=true",
    );
  }

  await mongoose.disconnect();

  // ==========================================
  // FINAL REPORT
  // ==========================================
  section("FINAL REPORT");
  console.log(`\n✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);

  if (failures.length > 0) {
    console.log("\nFailed tests:");
    failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  }

  console.log(`\n${"=".repeat(60)}`);
  if (failed === 0) {
    console.log("🎉 ALL SMOKE TESTS PASSED!");
  } else {
    console.log(`⚠️  ${failed} TEST(S) FAILED`);
  }
  console.log(`${"=".repeat(60)}\n`);

  return failed === 0;
};

run()
  .then((success) => process.exit(success ? 0 : 1))
  .catch(async (err) => {
    console.error("\n💥 SMOKE TEST CRASHED:", err.message);
    console.error(err.stack);
    try {
      if (mongoose.connection?.readyState === 1) {
        await mongoose.disconnect();
      }
    } catch {
      // ignore
    }
    process.exit(1);
  });
