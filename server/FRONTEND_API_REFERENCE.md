# Endpoint API Intelligence Platform - Frontend API Reference

> **Complete API Documentation for Frontend Development**  
> Server: Express 5.2.1 | Database: MongoDB/Mongoose 9.1.5 | Auth: JWT  
> Base URL: `http://localhost:5001/api`

---

## Table of Contents

1. [Authentication & Setup](#1-authentication--setup)
2. [API Response Format](#2-api-response-format)
3. [Error Handling](#3-error-handling)
4. [Rate Limiting](#4-rate-limiting)
5. [Data Models](#5-data-models)
6. [API Endpoints](#6-api-endpoints)
   - [Health Check](#61-health-check)
   - [Auth Routes](#62-auth-routes-8-endpoints)
   - [API Routes](#63-api-routes-10-endpoints)
   - [Analytics Routes](#64-analytics-routes-6-endpoints)
   - [Notification Routes](#65-notification-routes-4-endpoints)
   - [Cost Routes](#66-cost-routes-4-endpoints)
   - [Contract Routes](#67-contract-routes-5-endpoints)
   - [SLA Routes](#68-sla-routes-6-endpoints)
   - [Regression Routes](#69-regression-routes-4-endpoints)
   - [Insights Routes](#610-insights-routes-5-endpoints)
   - [Dependency Routes](#611-dependency-routes-6-endpoints)
   - [Webhook Routes](#612-webhook-routes-8-endpoints)
   - [Natural Language Query Routes](#613-natural-language-query-routes-4-endpoints)
7. [WebSocket/Real-time Events](#7-websocketreal-time-events)
8. [Frontend State Management Recommendations](#8-frontend-state-management-recommendations)
9. [UI Components Mapping](#9-ui-components-mapping)

---

## 1. Authentication & Setup

### Token Storage

```javascript
// Store token in localStorage or secure cookie
localStorage.setItem("token", response.token);

// Include in all authenticated requests
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};
```

### Axios Instance Setup

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
```

---

## 2. API Response Format

### Success Response

```typescript
{
  success: true,
  data: T,                    // The actual data
  count?: number,             // For list endpoints
  total?: number,             // Total count for pagination
  page?: number,              // Current page
  pages?: number,             // Total pages
  message?: string            // Optional success message
}
```

### Error Response

```typescript
{
  success: false,
  message: string,            // Human-readable error
  errors?: Array<{            // Validation errors
    msg: string,
    param: string,
    location: string
  }>
}
```

---

## 3. Error Handling

### HTTP Status Codes

| Code | Meaning             | Frontend Action                   |
| ---- | ------------------- | --------------------------------- |
| 200  | Success             | Display data                      |
| 201  | Created             | Show success, redirect            |
| 400  | Bad Request         | Show validation errors            |
| 401  | Unauthorized        | Redirect to login                 |
| 403  | Forbidden           | Show access denied                |
| 404  | Not Found           | Show not found message            |
| 429  | Rate Limited        | Show retry message with countdown |
| 500  | Server Error        | Show generic error, log details   |
| 502  | Bad Gateway         | External service error            |
| 503  | Service Unavailable | Database/service down             |

### Error Types from Server

```typescript
// Validation Error
{ success: false, message: "Name is required" }

// Duplicate Entry
{ success: false, message: "Duplicate email value entered" }

// Invalid ID
{ success: false, message: "Invalid ID format" }

// JWT Errors
{ success: false, message: "Invalid token" }
{ success: false, message: "Token expired" }

// Rate Limiting
{ success: false, message: "Too many requests, please try again later" }
```

---

## 4. Rate Limiting

| Endpoint Category               | Limit        | Window   |
| ------------------------------- | ------------ | -------- |
| General API                     | 100 requests | 1 minute |
| Auth (login/register)           | 10 requests  | 1 minute |
| Password Reset                  | 3 requests   | 1 hour   |
| AI/NL Query                     | 30 requests  | 1 minute |
| Webhooks                        | 60 requests  | 1 minute |
| Heavy Operations (SLA generate) | 10 requests  | 1 minute |

**Frontend Implementation:**

```javascript
// Handle rate limiting
if (error.response?.status === 429) {
  const retryAfter = error.response.headers["retry-after"] || 60;
  showToast(`Rate limited. Try again in ${retryAfter} seconds`);
}
```

---

## 5. Data Models

### 5.1 User

```typescript
interface User {
  id: string; // MongoDB ObjectId
  name: string; // Max 50 chars
  email: string; // Unique, lowercase
  createdAt: Date;
}
```

### 5.2 Api (Monitored Endpoint)

```typescript
interface Api {
  _id: string;
  userId: string;
  name: string; // Max 100 chars
  description: string; // Max 500 chars
  url: string; // Valid URL
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers: Record<string, string>; // Custom headers
  body: object | null; // Request body for POST/PUT/PATCH
  checkFrequency: number; // 60000 | 300000 | 900000 | 1800000 | 3600000 (ms)
  timeout: number; // 5000-60000 (ms)
  expectedStatusCode: number; // Default: 200
  alertsEnabled: boolean;
  isActive: boolean;
  category: string; // Default: "General"
  tags: string[];
  baselineSchema: object | null; // Auto-captured response schema
  lastChecked: Date | null;
  lastSuccessAt: Date | null;
  lastFailureAt: Date | null;
  consecutiveFailures: number;

  // Cost Tracking Config
  costTracking: {
    enabled: boolean;
    costPerRequest: number; // Default: 0
    costPerToken: number; // Default: 0
    monthlyBudget: number | null;
    alertThreshold: number; // Default: 80 (%)
  };

  // Response Contract Config
  responseContract: {
    enabled: boolean;
    schema: object | null; // JSON Schema
    strictMode: boolean;
    expectedResponseTime: number | null; // ms
  };

  // SLA Config
  sla: {
    enabled: boolean;
    uptimeTarget: number; // Default: 99.9 (%)
    responseTimeP95: number; // Default: 500 (ms)
    errorRateMax: number; // Default: 1 (%)
  };

  createdAt: Date;
  updatedAt: Date;

  // Computed fields (from GET /apis)
  status?: "healthy" | "warning" | "down" | "unknown";
  uptime?: number; // Percentage
  avgResponseTime?: number; // ms
}
```

### 5.3 Check (Health Check Result)

```typescript
interface Check {
  _id: string;
  apiId: string;
  timestamp: Date;
  responseTime: number; // ms
  statusCode: number | null;
  success: boolean;
  responseBody: object | null;
  responseSize: number; // bytes
  error: string | null;
  errorType: "timeout" | "network" | "server" | "client" | null;
  cost: number;
  tokensUsed: {
    input: number;
    output: number;
  };
}
```

### 5.4 Anomaly

```typescript
interface Anomaly {
  _id: string;
  apiId: string;
  checkId: string;
  type: "response_time_spike" | "error_spike" | "schema_drift" | "downtime";
  severity: "low" | "medium" | "high";
  currentValue: number | null;
  expectedValue: number | null;
  aiInsight: string | null; // AI-generated explanation
  acknowledged: boolean;
  createdAt: Date;
}
```

### 5.5 Notification

```typescript
interface Notification {
  _id: string;
  userId: string;
  anomalyId: string | null;
  message: string;
  type:
    | "anomaly"
    | "sla_breach"
    | "cost_alert"
    | "predictive_alert"
    | "contract_violation"
    | "performance_regression"
    | "system";
  metadata: {
    apiId: string | null;
    severity: "low" | "medium" | "high" | "critical";
    actionUrl: string | null;
    data: any;
  };
  read: boolean;
  createdAt: Date;
}
```

### 5.6 CostRecord

```typescript
interface CostRecord {
  _id: string;
  apiId: string;
  checkId: string;
  userId: string;
  cost: number;
  timestamp: Date;
  metadata: {
    tokensUsed: {
      input: number;
      output: number;
    };
    dataTransferredBytes: number;
    requestType: string | null;
  };
}
```

### 5.7 ContractViolation

```typescript
interface ContractViolation {
  _id: string;
  apiId: string;
  checkId: string;
  violations: Array<{
    type:
      | "MISSING_FIELD"
      | "TYPE_MISMATCH"
      | "STATUS_MISMATCH"
      | "RESPONSE_TIME_BREACH";
    field: string | null;
    expected: any;
    actual: any;
    severity: "low" | "medium" | "high" | "critical";
  }>;
  aiExplanation: string | null;
  acknowledged: boolean;
  createdAt: Date;
}
```

### 5.8 SLAReport

```typescript
interface SLAReport {
  _id: string;
  apiId: string;
  userId: string;
  period: {
    start: Date;
    end: Date;
    type: "daily" | "weekly" | "monthly";
  };
  metrics: {
    uptime: number; // Percentage
    avgResponseTime: number; // ms
    p95ResponseTime: number; // ms
    p99ResponseTime: number; // ms
    errorRate: number; // Percentage
    totalChecks: number;
    successfulChecks: number;
    failedChecks: number;
  };
  targets: {
    uptime: number;
    responseTimeP95: number;
    errorRate: number;
  };
  compliance: {
    overall: boolean;
    uptimeCompliant: boolean;
    responseTimeCompliant: boolean;
    errorRateCompliant: boolean;
  };
  incidents: Array<{
    timestamp: Date;
    duration: number; // ms
    type: string;
    description: string;
  }>;
  generatedAt: Date;
}
```

### 5.9 PerformanceRegression

```typescript
interface PerformanceRegression {
  _id: string;
  apiId: string;
  userId: string;
  detectedAt: Date;
  baselinePeriod: {
    start: Date;
    end: Date;
  };
  baselineStats: {
    mean: number;
    stdDev: number;
    p95: number;
    p99: number;
    sampleSize: number;
  };
  currentStats: {
    mean: number;
    stdDev: number;
    p95: number;
    p99: number;
    sampleSize: number;
  };
  degradationPercent: number;
  confidenceLevel: number; // 0-100
  tTestPValue: number;
  aiDiagnosis: string | null;
  status: "active" | "investigating" | "resolved" | "false_positive";
  resolvedAt: Date | null;
}
```

### 5.10 PredictiveAlert

```typescript
interface PredictiveAlert {
  _id: string;
  apiId: string;
  userId: string;
  createdAt: Date;
  failureProbability: number; // 0-100
  predictedFailureTime: Date | null;
  earlyWarningSignals: Array<{
    signal: string;
    severity: "low" | "medium" | "high" | "critical";
    value: any;
    threshold: any;
    detectedAt: Date;
  }>;
  aiPrediction: string | null;
  recommendedActions: Array<{
    action: string;
    priority: "low" | "medium" | "high" | "urgent";
    estimatedImpact: string;
  }>;
  status: "active" | "acknowledged" | "mitigated" | "expired" | "false_alarm";
  expiresAt: Date;
}
```

### 5.11 RootCauseAnalysis

```typescript
interface RootCauseAnalysis {
  _id: string;
  failedCheckId: string;
  apiId: string;
  userId: string;
  analyzedAt: Date;
  context: {
    error: string | null;
    statusCode: number | null;
    responseTime: number | null;
    timestamp: Date;
  };
  correlatedFailures: Array<{
    apiId: string;
    apiName: string;
    failureTime: Date;
    timeDelta: number; // ms
  }>;
  possibleCauses: Array<{
    cause: string;
    probability: number; // 0-100
    evidence: string[];
  }>;
  aiAnalysis: string | null;
  timeline: Array<{
    timestamp: Date;
    event: string;
    severity: "info" | "warning" | "error" | "critical";
  }>;
  similarPastIncidents: Array<{
    checkId: string;
    timestamp: Date;
    similarity: number; // 0-100
    resolution: string;
  }>;
}
```

### 5.12 APIDependency

```typescript
interface APIDependency {
  _id: string;
  apiId: string;
  userId: string;
  dependsOn: Array<{
    apiId: string;
    apiName: string;
    relationship: "calls" | "auth_depends" | "data_depends" | "sequential";
    isRequired: boolean;
  }>;
  dependents: Array<{
    apiId: string;
    apiName: string;
    relationship: "calls" | "auth_depends" | "data_depends" | "sequential";
  }>;
  criticalPath: {
    isCritical: boolean;
    impactScore: number; // 0-100
    affectedServices: number;
  };
  lastUpdated: Date;
  autoDetected: boolean;
}
```

### 5.13 WebhookEndpoint

```typescript
interface WebhookEndpoint {
  _id: string;
  userId: string;
  uniqueId: string; // 32 char hex string
  name: string; // Max 100 chars
  description: string | null; // Max 500 chars
  receivedPayloads: Array<{
    receivedAt: Date;
    method: string;
    headers: Record<string, string>;
    body: any;
    queryParams: Record<string, string>;
    sourceIp: string;
  }>;
  isActive: boolean;
  expiresAt: Date; // Default: 7 days from creation
  maxPayloads: number; // 1-1000, default: 100
  createdAt: Date;

  // Computed
  url?: string; // Full webhook URL
  payloadCount?: number;
}
```

### 5.14 NLQueryLog

```typescript
interface NLQueryLog {
  _id: string;
  userId: string;
  query: string; // Max 500 chars
  parsedIntent: {
    type:
      | "status_check"
      | "performance_query"
      | "error_analysis"
      | "comparison"
      | "trend_analysis"
      | "list_apis"
      | "cost_query"
      | "sla_query"
      | "unknown";
    entities: {
      apiNames: string[];
      timeRange: {
        start: Date;
        end: Date;
        relative: string;
      };
      metrics: string[];
      filters: Record<string, any>;
    };
    confidence: number; // 0-100
  };
  response: string | null;
  data: any;
  executionTime: number; // ms
  wasHelpful: boolean | null;
  createdAt: Date;
}
```

---

## 6. API Endpoints

### 6.1 Health Check

#### GET /health

Check if server is running.

**Auth Required:** No

**Response:**

```json
{
  "success": true,
  "message": "Endpoint API is running",
  "timestamp": "2026-01-23T10:30:00.000Z",
  "uptime": 3600.5,
  "memoryUsage": 45.67
}
```

---

### 6.2 Auth Routes (8 endpoints)

#### POST /auth/register

Create new user account.

**Auth Required:** No  
**Rate Limit:** 10/min

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation:**

- `name`: Required, non-empty
- `email`: Required, valid email format
- `password`: Required, min 6 characters

**Response (201):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**

- 400: "Email already registered"
- 400: "Name is required" / "Please enter a valid email" / "Password must be at least 6 characters"

---

#### POST /auth/login

Authenticate user.

**Auth Required:** No  
**Rate Limit:** 10/min

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**

- 400: "Please provide email and password"
- 401: "Invalid credentials"

---

#### GET /auth/me

Get current user profile.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

#### PUT /auth/profile

Update user profile.

**Auth Required:** Yes

**Request Body:**

```json
{
  "name": "John Smith"
}
```

**Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "email": "john@example.com"
  }
}
```

---

#### PUT /auth/change-password

Change password.

**Auth Required:** Yes

**Request Body:**

```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewSecurePass456"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**

- 400: "Current password and new password are required"
- 400: "New password must be at least 6 characters"
- 401: "Current password is incorrect"

---

#### POST /auth/forgot-password

Request password reset email.

**Auth Required:** No  
**Rate Limit:** 3/hour

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "If email exists, reset link has been sent"
}
```

**Note:** Always returns success to prevent email enumeration.

---

#### POST /auth/reset-password

Reset password with token from email.

**Auth Required:** No  
**Rate Limit:** 3/hour

**Request Body:**

```json
{
  "token": "a1b2c3d4e5f6...",
  "password": "NewPassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password reset successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**

- 400: "Token and password are required"
- 400: "Invalid or expired reset token"

---

#### DELETE /auth/delete-account

Permanently delete user account and all data.

**Auth Required:** Yes

**Request Body:**

```json
{
  "password": "CurrentPassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Errors:**

- 400: "Password is required to delete account"
- 401: "Password is incorrect"

---

### 6.3 API Routes (10 endpoints)

#### GET /apis

List all user's monitored APIs.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| category | string | Filter by category |
| status | string | Filter: "healthy", "warning", "down", "all" |
| search | string | Search in name, url, description (max 100 chars) |

**Response (200):**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Payment API",
      "description": "Handles payment processing",
      "url": "https://api.example.com/payments",
      "method": "GET",
      "isActive": true,
      "category": "Finance",
      "tags": ["critical", "production"],
      "lastChecked": "2026-01-23T10:30:00.000Z",
      "status": "healthy",
      "uptime": 99.5,
      "avgResponseTime": 245
    }
  ]
}
```

---

#### GET /apis/categories

Get all unique categories.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": ["Finance", "Auth", "General", "Testing"]
}
```

---

#### GET /apis/dashboard-stats

Get dashboard overview statistics.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalApis": 10,
    "activeApis": 8,
    "healthyCount": 6,
    "warningCount": 1,
    "downCount": 1,
    "unreadNotifications": 5,
    "unacknowledgedAnomalies": 3
  }
}
```

---

#### POST /apis

Create new monitored API.

**Auth Required:** Yes

**Request Body:**

```json
{
  "name": "Payment API",
  "description": "Handles payment processing",
  "url": "https://api.example.com/payments",
  "method": "GET",
  "headers": {
    "X-API-Key": "secret-key"
  },
  "body": null,
  "checkFrequency": 300000,
  "timeout": 30000,
  "expectedStatusCode": 200,
  "alertsEnabled": true,
  "category": "Finance",
  "tags": ["critical", "production"]
}
```

**Validation:**

- `name`: Required
- `url`: Required, valid URL
- `method`: Optional, one of: GET, POST, PUT, DELETE, PATCH
- `timeout`: Optional, 5000-60000
- `checkFrequency`: Optional, one of: 60000, 300000, 900000, 1800000, 3600000

**Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Payment API",
    "url": "https://api.example.com/payments",
    "method": "GET",
    "isActive": true,
    "createdAt": "2026-01-23T10:30:00.000Z"
  }
}
```

---

#### POST /apis/test

Test an API endpoint without saving.

**Auth Required:** Yes

**Request Body:**

```json
{
  "url": "https://api.example.com/health",
  "method": "GET",
  "headers": {},
  "body": null,
  "timeout": 10000
}
```

**Response (200) - Success:**

```json
{
  "success": true,
  "data": {
    "statusCode": 200,
    "responseTime": 156,
    "headers": { "content-type": "application/json" },
    "body": { "status": "ok" },
    "size": 45
  }
}
```

**Response (200) - Failure:**

```json
{
  "success": false,
  "data": {
    "statusCode": null,
    "responseTime": 30000,
    "error": "timeout of 30000ms exceeded",
    "body": null
  }
}
```

---

#### GET /apis/:id

Get single API details.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Payment API",
    "description": "Handles payment processing",
    "url": "https://api.example.com/payments",
    "method": "GET",
    "headers": {},
    "body": null,
    "checkFrequency": 300000,
    "timeout": 30000,
    "expectedStatusCode": 200,
    "alertsEnabled": true,
    "isActive": true,
    "category": "Finance",
    "tags": ["critical"],
    "lastChecked": "2026-01-23T10:30:00.000Z",
    "consecutiveFailures": 0,
    "costTracking": {
      "enabled": false,
      "costPerRequest": 0,
      "monthlyBudget": null,
      "alertThreshold": 80
    },
    "responseContract": {
      "enabled": false,
      "schema": null,
      "strictMode": false,
      "expectedResponseTime": null
    },
    "sla": {
      "enabled": true,
      "uptimeTarget": 99.9,
      "responseTimeP95": 500,
      "errorRateMax": 1
    },
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-23T10:30:00.000Z"
  }
}
```

---

#### PUT /apis/:id

Update API configuration.

**Auth Required:** Yes

**Request Body:** (all fields optional)

```json
{
  "name": "Updated Payment API",
  "description": "Updated description",
  "url": "https://api.example.com/v2/payments",
  "method": "POST",
  "headers": { "Authorization": "Bearer token" },
  "body": { "test": true },
  "checkFrequency": 60000,
  "timeout": 15000,
  "expectedStatusCode": 201,
  "alertsEnabled": false,
  "category": "Payments",
  "tags": ["v2", "production"],
  "isActive": true
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* Updated API object */
  }
}
```

---

#### DELETE /apis/:id

Delete API and all related data.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "message": "API deleted successfully"
}
```

---

#### PATCH /apis/:id/toggle

Toggle API active/inactive status.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "isActive": false
  }
}
```

---

#### PATCH /apis/:id/reset-baseline

Reset baseline schema (will be recaptured on next check).

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "message": "Baseline schema reset. New baseline will be captured on next check.",
  "data": {
    /* API object with baselineSchema: null */
  }
}
```

---

### 6.4 Analytics Routes (6 endpoints)

#### GET /analytics/:id/checks

Get health check history for an API.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 100 | Max records (1-500) |
| page | number | 1 | Page number |

**Response (200):**

```json
{
  "success": true,
  "count": 50,
  "total": 1000,
  "page": 1,
  "pages": 20,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "apiId": "507f1f77bcf86cd799439012",
      "timestamp": "2026-01-23T10:30:00.000Z",
      "responseTime": 156,
      "statusCode": 200,
      "success": true,
      "error": null
    }
  ]
}
```

---

#### GET /analytics/:id/summary

Get API analytics summary with 24h/7d/30d stats.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "api": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Payment API",
      "description": "Handles payments",
      "url": "https://api.example.com/payments",
      "method": "GET",
      "isActive": true,
      "alertsEnabled": true,
      "lastChecked": "2026-01-23T10:30:00.000Z",
      "lastSuccessAt": "2026-01-23T10:30:00.000Z",
      "lastFailureAt": "2026-01-20T05:15:00.000Z",
      "consecutiveFailures": 0
    },
    "stats": {
      "last24h": {
        "uptime": 99.8,
        "avgResponseTime": 245,
        "minResponseTime": 120,
        "maxResponseTime": 890,
        "p95ResponseTime": 450,
        "p99ResponseTime": 650,
        "totalChecks": 288,
        "successCount": 287,
        "errorCount": 1
      },
      "last7d": {
        "uptime": 99.5,
        "avgResponseTime": 260,
        "minResponseTime": 100,
        "maxResponseTime": 1200,
        "p95ResponseTime": 500,
        "p99ResponseTime": 750,
        "totalChecks": 2016,
        "successCount": 2006,
        "errorCount": 10
      },
      "last30d": {
        "uptime": 99.2,
        "avgResponseTime": 280,
        "minResponseTime": 90,
        "maxResponseTime": 2000,
        "p95ResponseTime": 550,
        "p99ResponseTime": 900,
        "totalChecks": 8640,
        "successCount": 8571,
        "errorCount": 69
      }
    },
    "anomalyCount": 3,
    "recentAnomalies": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "type": "response_time_spike",
        "severity": "medium",
        "aiInsight": "Response time increased 3x from baseline",
        "createdAt": "2026-01-23T10:00:00.000Z"
      }
    ]
  }
}
```

---

#### GET /analytics/:id/anomalies

Get anomalies for an API.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| limit | number | Max records (default: 50) |
| page | number | Page number |
| type | string | Filter: response_time_spike, error_spike, schema_drift, downtime |
| severity | string | Filter: low, medium, high |

**Response (200):**

```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "apiId": "507f1f77bcf86cd799439011",
      "checkId": "507f1f77bcf86cd799439014",
      "type": "response_time_spike",
      "severity": "medium",
      "currentValue": 1500,
      "expectedValue": 300,
      "aiInsight": "5x increase detected. Possible database slowdown.",
      "acknowledged": false,
      "createdAt": "2026-01-23T10:00:00.000Z"
    }
  ]
}
```

---

#### GET /analytics/:id/response-time-history

Get response time data points for charts.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| hours | number | 24 | Time range (1-168) |

**Response (200):**

```json
{
  "success": true,
  "count": 288,
  "data": [
    {
      "timestamp": "2026-01-22T10:30:00.000Z",
      "responseTime": 156,
      "success": true,
      "statusCode": 200
    },
    {
      "timestamp": "2026-01-22T10:35:00.000Z",
      "responseTime": 189,
      "success": true,
      "statusCode": 200
    }
  ]
}
```

---

#### PATCH /analytics/anomalies/:anomalyId/acknowledge

Mark anomaly as acknowledged.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "acknowledged": true
  }
}
```

---

#### DELETE /analytics/:id/checks

Clear all check history for an API.

**Auth Required:** Yes  
**Rate Limit:** 10/min (heavy operation)

**Response (200):**

```json
{
  "success": true,
  "message": "Deleted 1500 check records"
}
```

---

### 6.5 Notification Routes (4 endpoints)

#### GET /notifications

Get user's notifications.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 50 | Max records (1-100) |
| page | number | 1 | Page number |
| unreadOnly | boolean | false | Only unread |

**Response (200):**

```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "unreadCount": 5,
  "page": 1,
  "pages": 8,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "message": "High severity anomaly detected on Payment API",
      "type": "anomaly",
      "metadata": {
        "apiId": "507f1f77bcf86cd799439011",
        "severity": "high",
        "actionUrl": "/analytics/507f1f77bcf86cd799439011"
      },
      "read": false,
      "createdAt": "2026-01-23T10:00:00.000Z",
      "anomalyId": {
        "_id": "507f1f77bcf86cd799439013",
        "type": "response_time_spike",
        "severity": "high",
        "aiInsight": "Critical slowdown detected"
      }
    }
  ]
}
```

---

#### PUT /notifications/read-all

Mark all notifications as read.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

#### PUT /notifications/:id/read

Mark single notification as read.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "read": true
  }
}
```

---

#### DELETE /notifications/:id

Delete a notification.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

### 6.6 Cost Routes (4 endpoints)

#### GET /costs/dashboard

Get cost analytics dashboard.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| startDate | ISO date | Start of range |
| endDate | ISO date | End of range |
| groupBy | string | "hour", "day", "week", "month" |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalCost": 125.5,
      "avgDailyCost": 4.18,
      "topApis": [{ "apiId": "...", "apiName": "Payment API", "cost": 45.2 }],
      "costOverTime": [{ "date": "2026-01-22", "cost": 4.5 }]
    },
    "projection": {
      "projectedMonthlyCost": 130.0,
      "trend": "stable",
      "apisOverBudget": []
    }
  }
}
```

---

#### GET /costs/records

Get detailed cost records.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 50 | Max records |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "records": [
      {
        "_id": "507f1f77bcf86cd799439016",
        "apiId": { "_id": "...", "name": "Payment API" },
        "cost": 0.002,
        "timestamp": "2026-01-23T10:30:00.000Z",
        "metadata": {
          "tokensUsed": { "input": 100, "output": 50 }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 500,
      "pages": 10
    }
  }
}
```

---

#### GET /costs/api/:apiId

Get cost analytics for specific API.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "apiId": "507f1f77bcf86cd799439011",
    "apiName": "Payment API",
    "analytics": {
      "totalCost": 45.20,
      "avgDailyCost": 1.50,
      "costOverTime": [...]
    },
    "projection": {
      "projectedMonthlyCost": 46.50
    },
    "costTracking": {
      "enabled": true,
      "costPerRequest": 0.001,
      "monthlyBudget": 50,
      "alertThreshold": 80
    }
  }
}
```

---

#### PUT /costs/api/:apiId/config

Update cost tracking configuration.

**Auth Required:** Yes

**Request Body:**

```json
{
  "enabled": true,
  "costPerRequest": 0.002,
  "costPerToken": 0.0001,
  "monthlyBudget": 100,
  "alertThreshold": 90
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Cost tracking configuration updated",
  "data": {
    "costTracking": {
      "enabled": true,
      "costPerRequest": 0.002,
      "costPerToken": 0.0001,
      "monthlyBudget": 100,
      "alertThreshold": 90
    }
  }
}
```

---

### 6.7 Contract Routes (5 endpoints)

#### GET /contracts/violations

Get all contract violations across all APIs.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 50 | Max records |
| acknowledged | boolean | - | Filter by status |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "violations": [
      {
        "_id": "507f1f77bcf86cd799439017",
        "apiId": { "_id": "...", "name": "Payment API" },
        "violations": [
          {
            "type": "RESPONSE_TIME_BREACH",
            "expected": 500,
            "actual": 1500,
            "severity": "high"
          }
        ],
        "aiExplanation": "Response time 3x over contract limit",
        "acknowledged": false,
        "createdAt": "2026-01-23T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 25,
      "pages": 1
    }
  }
}
```

---

#### GET /contracts/api/:apiId/violations

Get violations for specific API.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "apiId": "507f1f77bcf86cd799439011",
    "apiName": "Payment API",
    "violations": [...]
  }
}
```

---

#### GET /contracts/api/:apiId/stats

Get violation statistics.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| days | number | 7 | Time range |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "apiId": "507f1f77bcf86cd799439011",
    "apiName": "Payment API",
    "stats": {
      "totalViolations": 15,
      "unacknowledged": 5,
      "byType": {
        "RESPONSE_TIME_BREACH": 10,
        "SCHEMA_MISMATCH": 3,
        "STATUS_MISMATCH": 2
      },
      "bySeverity": {
        "high": 5,
        "medium": 8,
        "low": 2
      },
      "trend": [{ "date": "2026-01-22", "count": 3 }]
    }
  }
}
```

---

#### PUT /contracts/api/:apiId/config

Update response contract configuration.

**Auth Required:** Yes

**Request Body:**

```json
{
  "enabled": true,
  "schema": {
    "type": "object",
    "properties": {
      "status": { "type": "string" },
      "data": { "type": "object" }
    },
    "required": ["status"]
  },
  "strictMode": false,
  "expectedResponseTime": 500
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Contract configuration updated",
  "data": {
    "responseContract": {
      "enabled": true,
      "schema": {...},
      "strictMode": false,
      "expectedResponseTime": 500
    }
  }
}
```

---

#### PATCH /contracts/violations/:violationId/acknowledge

Acknowledge a violation.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "message": "Violation acknowledged",
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "acknowledged": true
  }
}
```

---

### 6.8 SLA Routes (6 endpoints)

#### GET /sla/dashboard

Get SLA compliance dashboard.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "overallCompliance": "95.5",
    "apisWithSLA": 8,
    "compliantApis": 7,
    "nonCompliantApis": 1,
    "details": [
      {
        "apiId": "507f1f77bcf86cd799439011",
        "apiName": "Payment API",
        "slaConfig": {
          "enabled": true,
          "uptimeTarget": 99.9,
          "responseTimeP95": 500,
          "errorRateMax": 1
        },
        "latestReport": {
          "metrics": {
            "uptime": 99.5,
            "p95ResponseTime": 450,
            "errorRate": 0.5
          },
          "compliance": true
        }
      }
    ]
  }
}
```

---

#### POST /sla/api/:apiId/generate

Generate SLA report for an API.

**Auth Required:** Yes  
**Rate Limit:** 10/min (heavy operation)

**Request Body:**

```json
{
  "periodType": "daily"
}
```

**Values:** "daily", "weekly", "monthly"

**Response (200):**

```json
{
  "success": true,
  "message": "SLA report generated",
  "data": {
    "_id": "507f1f77bcf86cd799439018",
    "apiId": "507f1f77bcf86cd799439011",
    "period": {
      "start": "2026-01-22T00:00:00.000Z",
      "end": "2026-01-22T23:59:59.999Z",
      "type": "daily"
    },
    "metrics": {
      "uptime": 99.8,
      "avgResponseTime": 245,
      "p95ResponseTime": 450,
      "p99ResponseTime": 650,
      "errorRate": 0.2,
      "totalChecks": 288,
      "successfulChecks": 287,
      "failedChecks": 1
    },
    "targets": {
      "uptime": 99.9,
      "responseTimeP95": 500,
      "errorRate": 1
    },
    "compliance": {
      "overall": false,
      "uptimeCompliant": false,
      "responseTimeCompliant": true,
      "errorRateCompliant": true
    },
    "incidents": [
      {
        "timestamp": "2026-01-22T15:30:00.000Z",
        "duration": 300000,
        "type": "downtime",
        "description": "API unreachable for 5 minutes"
      }
    ],
    "generatedAt": "2026-01-23T10:00:00.000Z"
  }
}
```

---

#### GET /sla/api/:apiId/reports

Get SLA report history for an API.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 30 | Max records |
| periodType | string | - | Filter: daily, weekly, monthly |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "apiId": "507f1f77bcf86cd799439011",
    "apiName": "Payment API",
    "slaConfig": {...},
    "reports": [...]
  }
}
```

---

#### GET /sla/reports/:reportId

Get specific SLA report.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* Full SLAReport object */
  }
}
```

---

#### PUT /sla/api/:apiId/config

Update SLA configuration.

**Auth Required:** Yes

**Request Body:**

```json
{
  "enabled": true,
  "uptimeTarget": 99.5,
  "responseTimeP95": 600,
  "errorRateMax": 2
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "SLA configuration updated",
  "data": {
    "sla": {
      "enabled": true,
      "uptimeTarget": 99.5,
      "responseTimeP95": 600,
      "errorRateMax": 2
    }
  }
}
```

---

#### POST /sla/generate-all

Generate reports for all SLA-enabled APIs.

**Auth Required:** Yes  
**Rate Limit:** 10/min (heavy operation)

**Request Body:**

```json
{
  "periodType": "daily"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Generated 5 of 6 SLA reports",
  "data": {
    "results": [
      {
        "apiId": "507f1f77bcf86cd799439011",
        "apiName": "Payment API",
        "success": true,
        "reportId": "507f1f77bcf86cd799439018"
      },
      {
        "apiId": "507f1f77bcf86cd799439012",
        "apiName": "Auth API",
        "success": false,
        "error": "No data available"
      }
    ]
  }
}
```

---

### 6.9 Regression Routes (4 endpoints)

#### GET /regressions/dashboard

Get performance regressions dashboard.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter: active, investigating, resolved, false_positive |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 10,
      "active": 3,
      "investigating": 2,
      "resolved": 5
    },
    "regressions": [
      {
        "_id": "507f1f77bcf86cd799439019",
        "apiId": { "_id": "...", "name": "Payment API", "url": "..." },
        "detectedAt": "2026-01-23T08:00:00.000Z",
        "degradationPercent": 45,
        "confidenceLevel": 95,
        "status": "active",
        "baselineStats": {
          "mean": 200,
          "p95": 350
        },
        "currentStats": {
          "mean": 290,
          "p95": 510
        }
      }
    ]
  }
}
```

---

#### GET /regressions/api/:apiId

Get regressions for specific API.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| days | number | 30 | Time range |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "apiId": "507f1f77bcf86cd799439011",
    "apiName": "Payment API",
    "regressions": [...],
    "trend": {
      "avgDegradation": 25,
      "regressionCount": 3,
      "dates": ["2026-01-15", "2026-01-20", "2026-01-23"]
    }
  }
}
```

---

#### GET /regressions/:regressionId

Get specific regression details.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439019",
    "apiId": { "_id": "...", "name": "Payment API", "url": "..." },
    "detectedAt": "2026-01-23T08:00:00.000Z",
    "baselinePeriod": {
      "start": "2026-01-16T00:00:00.000Z",
      "end": "2026-01-22T23:59:59.999Z"
    },
    "baselineStats": {
      "mean": 200,
      "stdDev": 30,
      "p95": 350,
      "p99": 400,
      "sampleSize": 2016
    },
    "currentStats": {
      "mean": 290,
      "stdDev": 50,
      "p95": 510,
      "p99": 600,
      "sampleSize": 288
    },
    "degradationPercent": 45,
    "confidenceLevel": 95,
    "tTestPValue": 0.0001,
    "aiDiagnosis": "Performance degradation correlates with increased database query times",
    "status": "active"
  }
}
```

---

#### PATCH /regressions/:regressionId/status

Update regression status.

**Auth Required:** Yes

**Request Body:**

```json
{
  "status": "investigating"
}
```

**Values:** "active", "investigating", "resolved", "false_positive"

**Response (200):**

```json
{
  "success": true,
  "message": "Regression status updated to investigating",
  "data": {
    "_id": "507f1f77bcf86cd799439019",
    "status": "investigating"
  }
}
```

---

### 6.10 Insights Routes (5 endpoints)

#### GET /insights/root-cause/api/:apiId

Get root cause analyses for an API.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 20 | Max records |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "apiId": "507f1f77bcf86cd799439011",
    "apiName": "Payment API",
    "analyses": [
      {
        "_id": "507f1f77bcf86cd79943901a",
        "analyzedAt": "2026-01-23T10:00:00.000Z",
        "context": {
          "error": "Connection refused",
          "statusCode": null,
          "responseTime": null,
          "timestamp": "2026-01-23T09:55:00.000Z"
        },
        "possibleCauses": [
          {
            "cause": "Server overload",
            "probability": 75,
            "evidence": ["High CPU usage", "Memory exhaustion"]
          },
          {
            "cause": "Network issues",
            "probability": 20,
            "evidence": ["Increased latency"]
          }
        ],
        "aiAnalysis": "Most likely cause is server overload based on..."
      }
    ]
  }
}
```

---

#### GET /insights/root-cause/:analysisId

Get specific root cause analysis.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd79943901a",
    "failedCheckId": "...",
    "apiId": { "_id": "...", "name": "Payment API", "url": "..." },
    "analyzedAt": "2026-01-23T10:00:00.000Z",
    "context": {...},
    "correlatedFailures": [
      {
        "apiId": "507f1f77bcf86cd799439012",
        "apiName": "Database API",
        "failureTime": "2026-01-23T09:54:00.000Z",
        "timeDelta": -60000
      }
    ],
    "possibleCauses": [...],
    "aiAnalysis": "...",
    "timeline": [
      {
        "timestamp": "2026-01-23T09:50:00.000Z",
        "event": "Response time started increasing",
        "severity": "warning"
      },
      {
        "timestamp": "2026-01-23T09:55:00.000Z",
        "event": "Connection refused",
        "severity": "critical"
      }
    ],
    "similarPastIncidents": [
      {
        "checkId": "...",
        "timestamp": "2026-01-15T14:00:00.000Z",
        "similarity": 85,
        "resolution": "Server restart resolved the issue"
      }
    ]
  }
}
```

---

#### GET /insights/predictive

Get predictive failure alerts.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter: active, acknowledged, mitigated, expired, false_alarm |
| apiId | string | Filter by API |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 5,
      "active": 3,
      "critical": 1
    },
    "alerts": [
      {
        "_id": "507f1f77bcf86cd79943901b",
        "apiId": { "_id": "...", "name": "Payment API", "url": "..." },
        "failureProbability": 75,
        "predictedFailureTime": "2026-01-23T18:00:00.000Z",
        "earlyWarningSignals": [
          {
            "signal": "Response time trend increasing",
            "severity": "high",
            "value": 15,
            "threshold": 10,
            "detectedAt": "2026-01-23T10:00:00.000Z"
          }
        ],
        "aiPrediction": "High probability of failure within 8 hours based on...",
        "recommendedActions": [
          {
            "action": "Scale up server resources",
            "priority": "high",
            "estimatedImpact": "Could reduce failure probability by 40%"
          }
        ],
        "status": "active",
        "createdAt": "2026-01-23T10:00:00.000Z"
      }
    ]
  }
}
```

---

#### GET /insights/predictive/:alertId

Get specific predictive alert.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* Full PredictiveAlert object */
  }
}
```

---

#### PATCH /insights/predictive/:alertId/status

Update predictive alert status.

**Auth Required:** Yes

**Request Body:**

```json
{
  "status": "acknowledged"
}
```

**Values:** "active", "acknowledged", "mitigated", "expired", "false_alarm"

**Response (200):**

```json
{
  "success": true,
  "message": "Alert status updated to acknowledged",
  "data": {
    "_id": "507f1f77bcf86cd79943901b",
    "status": "acknowledged"
  }
}
```

---

### 6.11 Dependency Routes (6 endpoints)

#### GET /dependencies/graph

Get full dependency graph for visualization.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Payment API",
        "type": "api"
      },
      { "id": "507f1f77bcf86cd799439012", "name": "Auth API", "type": "api" }
    ],
    "edges": [
      {
        "source": "507f1f77bcf86cd799439011",
        "target": "507f1f77bcf86cd799439012",
        "relationship": "auth_depends",
        "isRequired": true
      }
    ],
    "criticalPaths": [
      { "apiId": "507f1f77bcf86cd799439012", "impactScore": 85 }
    ]
  }
}
```

---

#### GET /dependencies/detect

Auto-detect potential dependencies from failure patterns.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "message": "Found 3 potential dependencies",
  "data": {
    "suggestions": [
      {
        "apiId": "507f1f77bcf86cd799439011",
        "apiName": "Payment API",
        "dependsOnApiId": "507f1f77bcf86cd799439012",
        "dependsOnApiName": "Auth API",
        "confidence": 80,
        "occurrences": 4
      }
    ]
  }
}
```

---

#### GET /dependencies/api/:apiId

Get dependencies for specific API.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "apiId": "507f1f77bcf86cd799439011",
    "apiName": "Payment API",
    "dependencies": {
      "dependsOn": [
        {
          "apiId": "507f1f77bcf86cd799439012",
          "apiName": "Auth API",
          "relationship": "auth_depends",
          "isRequired": true
        }
      ],
      "dependents": [
        {
          "apiId": "507f1f77bcf86cd799439013",
          "apiName": "Checkout API",
          "relationship": "calls"
        }
      ],
      "criticalPath": {
        "isCritical": true,
        "impactScore": 75,
        "affectedServices": 3
      }
    }
  }
}
```

---

#### POST /dependencies/api/:apiId

Add a dependency relationship.

**Auth Required:** Yes

**Request Body:**

```json
{
  "dependsOnApiId": "507f1f77bcf86cd799439012",
  "relationship": "auth_depends",
  "isRequired": true
}
```

**Values for relationship:** "calls", "auth_depends", "data_depends", "sequential"

**Response (200):**

```json
{
  "success": true,
  "message": "Dependency added successfully",
  "data": {
    /* Updated APIDependency object */
  }
}
```

**Errors:**

- 400: "dependsOnApiId is required"
- 400: "API cannot depend on itself"
- 404: "API not found or access denied"

---

#### DELETE /dependencies/api/:apiId/:dependsOnApiId

Remove a dependency.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "message": "Dependency removed successfully"
}
```

---

#### GET /dependencies/api/:apiId/impact

Analyze impact if this API fails.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "apiId": "507f1f77bcf86cd799439011",
    "apiName": "Payment API",
    "impact": {
      "directDependents": 2,
      "totalAffected": 5,
      "affectedApis": [
        {
          "apiId": "507f1f77bcf86cd799439013",
          "apiName": "Checkout API",
          "impactLevel": "high",
          "relationship": "calls"
        }
      ],
      "cascadeDepth": 3,
      "criticalityScore": 85
    }
  }
}
```

---

### 6.12 Webhook Routes (8 endpoints)

#### POST /webhooks

Create a webhook testing endpoint.

**Auth Required:** Yes

**Request Body:**

```json
{
  "name": "Payment Webhook",
  "description": "Receives payment notifications",
  "maxPayloads": 100
}
```

**Validation:**

- `name`: Required, max 100 chars
- `description`: Optional, max 500 chars
- `maxPayloads`: Optional, 1-1000 (default: 100)

**Response (201):**

```json
{
  "success": true,
  "message": "Webhook endpoint created",
  "data": {
    "id": "507f1f77bcf86cd79943901c",
    "uniqueId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "name": "Payment Webhook",
    "url": "http://localhost:5001/api/webhooks/receive/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "expiresAt": "2026-01-30T10:00:00.000Z"
  }
}
```

---

#### ALL /webhooks/receive/:uniqueId

**PUBLIC ENDPOINT** - Receive webhook payload (any HTTP method).

**Auth Required:** No  
**Rate Limit:** 60/min per uniqueId

**Response (200):**

```json
{
  "success": true,
  "message": "Payload received",
  "endpointName": "Payment Webhook",
  "totalPayloads": 5
}
```

**Errors:**

- 404: "Endpoint not found or inactive"
- 404: "Endpoint has expired"

---

#### GET /webhooks

List all user's webhook endpoints.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd79943901c",
      "uniqueId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "name": "Payment Webhook",
      "description": "Receives payment notifications",
      "isActive": true,
      "expiresAt": "2026-01-30T10:00:00.000Z",
      "maxPayloads": 100,
      "createdAt": "2026-01-23T10:00:00.000Z",
      "url": "http://localhost:5001/api/webhooks/receive/a1b2c3d4...",
      "payloadCount": 5
    }
  ]
}
```

---

#### GET /webhooks/:uniqueId

Get webhook endpoint with received payloads.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd79943901c",
    "uniqueId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "name": "Payment Webhook",
    "description": "Receives payment notifications",
    "isActive": true,
    "expiresAt": "2026-01-30T10:00:00.000Z",
    "maxPayloads": 100,
    "url": "http://localhost:5001/api/webhooks/receive/a1b2c3d4...",
    "payloads": [
      {
        "_id": "507f1f77bcf86cd79943901d",
        "receivedAt": "2026-01-23T10:30:00.000Z",
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "x-webhook-signature": "sha256=..."
        },
        "body": {
          "event": "payment.completed",
          "amount": 100.0
        },
        "queryParams": {},
        "sourceIp": "192.168.1.1"
      }
    ]
  }
}
```

---

#### GET /webhooks/:uniqueId/payload/:index

Get specific payload by index.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "receivedAt": "2026-01-23T10:30:00.000Z",
    "method": "POST",
    "headers": {...},
    "body": {...},
    "queryParams": {},
    "sourceIp": "192.168.1.1"
  }
}
```

---

#### PATCH /webhooks/:uniqueId/toggle

Activate/deactivate webhook endpoint.

**Auth Required:** Yes

**Request Body:**

```json
{
  "isActive": false
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Endpoint deactivated",
  "data": {
    "isActive": false
  }
}
```

---

#### DELETE /webhooks/:uniqueId/payloads

Clear all received payloads.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "message": "Payloads cleared"
}
```

---

#### DELETE /webhooks/:uniqueId

Delete webhook endpoint.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "message": "Endpoint deleted"
}
```

---

### 6.13 Natural Language Query Routes (4 endpoints)

#### POST /query

Ask a natural language question about your APIs.

**Auth Required:** Yes  
**Rate Limit:** 30/min

**Request Body:**

```json
{
  "query": "What's the status of my Payment API?"
}
```

**Validation:**

- `query`: Required, max 500 chars

**Response (200):**

```json
{
  "success": true,
  "data": {
    "queryId": "507f1f77bcf86cd79943901e",
    "query": "What's the status of my Payment API?",
    "parsedIntent": {
      "type": "status_check",
      "entities": {
        "apiNames": ["Payment API"],
        "timeRange": null,
        "metrics": ["status", "uptime"]
      },
      "confidence": 95
    },
    "response": "Your Payment API is currently healthy with 99.5% uptime in the last 24 hours. Average response time is 245ms.",
    "data": {
      "api": {
        "name": "Payment API",
        "status": "healthy",
        "uptime": 99.5,
        "avgResponseTime": 245
      }
    },
    "executionTime": 156
  }
}
```

---

#### GET /query/history

Get query history.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 20 | Max records |

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd79943901e",
      "query": "What's the status of my Payment API?",
      "response": "Your Payment API is currently healthy...",
      "wasHelpful": true,
      "createdAt": "2026-01-23T10:30:00.000Z"
    }
  ]
}
```

---

#### GET /query/suggestions

Get example queries.

**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "suggestions": [
      "What's the status of all my APIs?",
      "Show me the performance of Payment API this week",
      "Which APIs had the most errors today?",
      "Compare response times between Auth API and User API",
      "What are my total costs this month?",
      "Is my Authentication Service meeting SLA targets?",
      "Show me the trend for Main API over the last week",
      "List all my APIs"
    ]
  }
}
```

---

#### PATCH /query/:queryId/feedback

Provide feedback on query helpfulness.

**Auth Required:** Yes

**Request Body:**

```json
{
  "wasHelpful": true
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Feedback recorded"
}
```

---

## 7. WebSocket/Real-time Events

**Note:** The current backend uses polling. For real-time updates, implement polling on frontend:

```javascript
// Recommended polling intervals
const POLLING_INTERVALS = {
  dashboardStats: 30000, // 30 seconds
  notifications: 15000, // 15 seconds
  apiStatus: 60000, // 1 minute
  analytics: 120000, // 2 minutes
};

// Example polling hook
function usePolling(fetchFn, interval) {
  useEffect(() => {
    fetchFn(); // Initial fetch
    const id = setInterval(fetchFn, interval);
    return () => clearInterval(id);
  }, []);
}
```

---

## 8. Frontend State Management Recommendations

### Global State (Context/Redux)

- User authentication state
- Current user profile
- Notification count
- Dashboard stats
- Selected API (for detail views)

### Local State

- Form inputs
- Modal visibility
- Table pagination
- Filter selections

### Cache Strategy (React Query / SWR)

```javascript
const queryConfig = {
  // Stale time (when to refetch in background)
  staleTime: {
    dashboardStats: 30 * 1000, // 30 seconds
    apiList: 60 * 1000, // 1 minute
    apiDetail: 60 * 1000, // 1 minute
    analytics: 2 * 60 * 1000, // 2 minutes
    notifications: 30 * 1000, // 30 seconds
  },

  // Cache time (how long to keep in memory)
  cacheTime: {
    apiList: 5 * 60 * 1000, // 5 minutes
    analytics: 10 * 60 * 1000, // 10 minutes
  },
};
```

---

## 9. UI Components Mapping

### Pages Required

| Page          | Route          | Key API Endpoints                               |
| ------------- | -------------- | ----------------------------------------------- |
| Login         | /login         | POST /auth/login                                |
| Register      | /register      | POST /auth/register                             |
| Dashboard     | /              | GET /apis/dashboard-stats, GET /apis            |
| API List      | /apis          | GET /apis, GET /apis/categories                 |
| API Detail    | /apis/:id      | GET /apis/:id, GET /analytics/:id/summary       |
| API Create    | /apis/new      | POST /apis, POST /apis/test                     |
| API Edit      | /apis/:id/edit | GET /apis/:id, PUT /apis/:id                    |
| Analytics     | /analytics/:id | GET /analytics/:id/checks, /summary, /anomalies |
| Notifications | /notifications | GET /notifications                              |
| Costs         | /costs         | GET /costs/dashboard, /records                  |
| SLA Dashboard | /sla           | GET /sla/dashboard                              |
| Regressions   | /regressions   | GET /regressions/dashboard                      |
| Insights      | /insights      | GET /insights/predictive, /root-cause           |
| Dependencies  | /dependencies  | GET /dependencies/graph                         |
| Webhooks      | /webhooks      | GET /webhooks, POST /webhooks                   |
| Settings      | /settings      | GET /auth/me, PUT /auth/profile                 |

### Key Components

```
├── Layout/
│   ├── Navbar (notifications badge, user menu)
│   ├── Sidebar (navigation)
│   └── Footer
├── Auth/
│   ├── LoginForm
│   ├── RegisterForm
│   ├── ForgotPasswordForm
│   └── ResetPasswordForm
├── Dashboard/
│   ├── StatsCards (healthy/warning/down counts)
│   ├── ApiStatusList
│   └── RecentAnomalies
├── API/
│   ├── ApiCard
│   ├── ApiForm (create/edit)
│   ├── ApiTestPanel
│   └── ApiStatusBadge
├── Analytics/
│   ├── ResponseTimeChart
│   ├── UptimeChart
│   ├── ChecksTable
│   └── AnomalyList
├── Notifications/
│   ├── NotificationList
│   └── NotificationItem
├── Costs/
│   ├── CostChart
│   ├── CostTable
│   └── BudgetProgress
├── SLA/
│   ├── ComplianceCard
│   ├── SLAReportList
│   └── MetricsDisplay
├── Insights/
│   ├── PredictiveAlertCard
│   ├── RootCauseTimeline
│   └── RecommendationsList
├── Dependencies/
│   ├── DependencyGraph (visualization)
│   └── ImpactAnalysis
├── Webhooks/
│   ├── WebhookCard
│   ├── PayloadViewer
│   └── WebhookForm
└── Common/
    ├── DataTable
    ├── Pagination
    ├── SearchInput
    ├── StatusBadge
    ├── LoadingSpinner
    ├── ErrorMessage
    └── ConfirmDialog
```

---

## Quick Reference Card

### Authentication Header

```
Authorization: Bearer <token>
```

### Base URL

```
http://localhost:5001/api
```

### Common Response Codes

- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid/expired token)
- 404: Not Found
- 429: Rate Limited
- 500: Server Error

### Check Frequency Options (ms)

- 60000 (1 min)
- 300000 (5 min)
- 900000 (15 min)
- 1800000 (30 min)
- 3600000 (1 hour)

### API Status Values

- "healthy" - All recent checks passed
- "warning" - Uptime < 90%
- "down" - Latest check failed
- "unknown" - No checks yet

### Anomaly Types

- response_time_spike
- error_spike
- schema_drift
- downtime

### Severity Levels

- low
- medium
- high
- critical

---

_Document Generated: January 23, 2026_  
_API Version: 1.0.0_  
_Total Endpoints: 66_
