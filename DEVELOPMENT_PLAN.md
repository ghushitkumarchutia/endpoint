# Endpoint - API Intelligence Platform

> **Target Level:** Fresher/Placement-Ready Project (IIT-Level Standard)  
> **Complexity:** Advanced Intermediate (Impressive & Industry-Relevant)  
> **Project Name:** Endpoint

---

## 🎯 Project Overview

### What This System Does

An **intelligent API monitoring and analytics platform** that goes far beyond basic uptime checking. Endpoint tracks API behavior patterns, predicts failures before they happen, analyzes costs, validates contracts, detects performance regressions, and provides AI-powered root cause analysis - all through a conversational natural language interface.

### Why Companies Will Value This

- Shows understanding of **real-world enterprise problems** (API reliability, cost optimization)
- Demonstrates **MERN stack proficiency** with advanced patterns
- Includes **AI/ML integration** (Gemini-powered insights, predictions, NLP queries)
- Has **data visualization**, **statistical analysis**, and **background job processing**
- Features **SLA compliance tracking** - critical for enterprise contracts
- Implements **predictive analytics** - proactive vs reactive monitoring
- Shows **systems thinking** with dependency mapping and root cause analysis

---

## 📚 Tech Stack

### Frontend

| Package               | Version | Purpose                        |
| --------------------- | ------- | ------------------------------ |
| React                 | 18.3.1  | UI library                     |
| Vite                  | 6.0.7   | Build tool & dev server        |
| React Router DOM      | 7.1.1   | Page navigation                |
| Axios                 | 1.7.9   | HTTP requests to backend       |
| Recharts              | 2.15.0  | Charts & data visualization    |
| TailwindCSS           | 3.4.17  | Styling framework              |
| React Hook Form       | 7.54.2  | Form handling                  |
| React Hot Toast       | 2.4.1   | Toast notifications            |
| Lucide React          | 0.469.0 | Icon library                   |
| date-fns              | 4.1.0   | Date formatting                |
| React Flow            | 11.x    | Dependency graph visualization |
| @tanstack/react-query | 5.x     | Server state management        |

### Backend

| Package           | Version  | Purpose                      |
| ----------------- | -------- | ---------------------------- |
| Node.js           | 20.x LTS | Runtime environment          |
| Express.js        | 4.21.2   | Web framework                |
| MongoDB           | 8.x      | Database (use MongoDB Atlas) |
| Mongoose          | 8.9.5    | MongoDB ODM                  |
| node-cron         | 3.0.3    | Scheduled background jobs    |
| axios             | 1.7.9    | HTTP client for API calls    |
| ajv               | 8.17.1   | JSON Schema validation       |
| bcryptjs          | 2.4.3    | Password hashing             |
| jsonwebtoken      | 9.0.2    | JWT authentication           |
| cors              | 2.8.5    | CORS middleware              |
| express-validator | 7.2.1    | Input validation             |
| dotenv            | 16.4.7   | Environment variables        |
| nodemailer        | 6.9.16   | Email notifications          |
| pdfkit            | 0.15.x   | PDF report generation        |

### AI Integration

| Service   | Model            | Purpose                                              |
| --------- | ---------------- | ---------------------------------------------------- |
| Google AI | gemini-1.5-flash | Anomaly insights, root cause analysis, NLP queries   |
| Google AI | gemini-1.5-flash | Predictive analysis, regression diagnosis            |
| Google AI | gemini-1.5-flash | Contract violation explanations, SLA recommendations |

> **Note:** Use Gemini API - it has a generous free tier. Get API key from [Google AI Studio](https://aistudio.google.com/)

**Backend Package:**

```bash
npm install @google/generative-ai
```

### Dev Tools

| Tool     | Purpose                         |
| -------- | ------------------------------- |
| Nodemon  | Auto-restart during development |
| ESLint   | Code quality                    |
| Prettier | Code formatting                 |

---

## 🎨 Features & Functionalities

### 1. Landing Page

**Why:** First impression matters - shows UI/UX skills.

**What to Build:**

- Hero section with tagline & CTA buttons
- Features showcase (3-4 key features with icons)
- How it works section (simple 3-step flow)
- Testimonials or stats section
- Footer with links

**Design Tips:**

- Gradient backgrounds for modern look
- Smooth scroll animations
- Clean, minimal design
- Mobile responsive

---

### 2. User Authentication

**Why:** Every company expects you to implement secure auth.

**What to Build:**

- User registration (name, email, password)
- Login/Logout with JWT tokens
- **Password reset via email** (forgot password)
- Protected routes (dashboard only for logged-in users)
- Token stored in localStorage

**Password Reset Flow:**

```
User clicks "Forgot Password" → Enters email
→ Backend generates random reset token → Saves with 1-hour expiry
→ Sends email with reset link (Nodemailer + Gmail SMTP)
→ User clicks link → Enters new password
→ Backend verifies token → Updates password → Deletes token
```

**Auth Flow:**

```
User registers → Password hashed (bcrypt) → Saved to MongoDB
User logs in → Credentials verified → JWT generated → Sent to frontend
Every request → JWT in Authorization header → Backend verifies
```

---

### 3. API Registration & Management

**Why:** Core CRUD functionality - basic requirement for any developer.

**What to Build:**

- Add APIs to monitor:
  - Name, URL, HTTP Method
  - Headers (API keys)
  - Request body (for POST)
  - Check frequency (5m, 15m, 30m, 1h)
- Edit/Delete APIs
- Enable/Disable monitoring
- Category tags (Payment, Database, etc.)

**MongoDB Schema:**

```javascript
{
  userId: ObjectId,
  name: String,
  description: String,
  url: String,
  method: String, // GET, POST, PUT, DELETE, PATCH
  headers: Object,
  body: Object,
  checkFrequency: Number, // 60000, 300000, 900000, 1800000, 3600000
  timeout: Number, // 5000-60000ms
  isActive: Boolean,
  baselineSchema: Object,
  expectedStatusCode: Number,
  alertsEnabled: Boolean,
  lastChecked: Date,
  lastSuccessAt: Date,
  lastFailureAt: Date,
  consecutiveFailures: Number,
  category: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

### 4. Automated Monitoring Engine

**Why:** Shows understanding of background jobs & scheduling.

**What to Build:**

- Background job runs every minute (node-cron)
- Checks APIs based on their frequency setting
- Records response time, status code, response body
- Handles timeouts and errors gracefully

**How It Works:**

```javascript
// Every minute
cron.schedule("* * * * *", async () => {
  const apisToCheck = await API.find({
    isActive: true,
    $or: [
      { lastChecked: null },
      { lastChecked: { $lt: Date.now() - checkFrequency } },
    ],
  });

  for (const api of apisToCheck) {
    // Make request, save result, update lastChecked
  }
});
```

---

### 5. Response Pattern Analysis

**Why:** Demonstrates data analysis skills.

**What to Build:**

- Track response time history
- Calculate metrics:
  - Average response time
  - Success rate (%)
  - Error count
- Display trends on charts
- Show response time spikes

**Simple Calculations:**

```javascript
const avgResponseTime =
  checks.reduce((a, b) => a + b.responseTime, 0) / checks.length;
const successRate = (successfulChecks / totalChecks) * 100;
```

---

### 6. Schema Drift Detection

**Why:** Advanced feature that shows understanding of data structures.

**What to Build:**

- Save first successful response as "baseline schema"
- Compare new responses against baseline
- Detect: new fields added, fields removed, type changes
- Show visual diff of changes

**How It Works:**

```
First check → Generate JSON Schema → Save as baseline
Later checks → Validate against baseline → If different, flag as "drift"
```

**Example:**

```javascript
// Baseline response
{ "userId": 123, "name": "John" }

// New response (has new field)
{ "userId": 123, "name": "John", "email": "john@example.com" }

// Detection: "email" field added (type: string)
```

---

### 7. Anomaly Detection

**Why:** Shows algorithmic thinking beyond basic CRUD.

**What to Build:**

- Flag when response time is unusually high (> 2x average)
- Flag when error rate increases
- Severity levels: Low, Medium, High
- Store anomalies for review

**Simple Algorithm:**

```javascript
const avg = calculateAverage(last50Checks);
const stdDev = calculateStdDev(last50Checks);

if (currentResponseTime > avg + 2 * stdDev) {
  createAnomaly({
    type: "response_time_spike",
    severity: "high",
    currentValue: currentResponseTime,
    expectedValue: avg,
  });
}
```

---

### 8. AI-Powered Insights (Gemini)

**Why:** Hot skill - shows you can integrate modern AI.

**What to Build:**

- When anomaly detected, call Gemini API
- Get explanation of possible causes
- Show AI insights in dashboard

**Simple Integration:**

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `
API "${apiName}" has response time of ${current}ms (normal is ${normal}ms).
Time: ${timestamp}. Give 2-3 possible causes in simple terms.
`;

const result = await model.generateContent(prompt);
const insight = result.response.text();
```

**AI Response Example:**

> "The Payment API is responding 3x slower than normal. Possible causes:
>
> 1. High traffic during peak hours
> 2. Database queries taking longer
> 3. Network latency issues"

---

### 9. Visual Dashboard

**Why:** Companies want developers who can build good UIs.

**What to Build:**

- Dashboard showing all monitored APIs
- Status cards: Healthy (green), Warning (yellow), Down (red)
- Line chart for response time trends
- List of recent anomalies
- Click on API → detailed view

**Key Components:**

- `Dashboard.jsx` - Main overview page
- `ApiCard.jsx` - Individual API status card
- `ResponseTimeChart.jsx` - Recharts line chart
- `AnomalyList.jsx` - Recent anomalies table

---

### 10. Alert System

**Why:** Real applications need notifications.

**What to Build:**

- In-app notifications (bell icon with count)
- Email notifications for high-severity anomalies
- Mark notifications as read
- Notification preferences per API

**Simple Flow:**

```
Anomaly detected → Create notification → Send email → Update badge count
User clicks bell → Show notifications → Mark as read
```

---

### 11. API Testing Playground (Bonus)

**Why:** Adds practical utility, shows initiative.

**What to Build:**

- Simple form: URL, Method, Headers, Body
- Send test request through backend (avoids CORS)
- Display formatted JSON response
- Copy request as cURL command

---

### 12. API Cost Tracking & Budget Alerts

**Why:** Companies get unexpected $10,000+ AI API bills. This shows financial awareness.

**What to Build:**

- Track cost per API call (token-based, per-request, or data-transfer pricing)
- Real-time spending dashboard with charts
- Monthly budget limits with alert thresholds
- Cost optimization suggestions via AI
- Cost breakdown by API and time period

**Implementation:**

```javascript
// API Model Addition
{
  costTracking: {
    enabled: Boolean,
    pricingModel: String,     // 'TOKEN_BASED', 'PER_REQUEST', 'DATA_TRANSFER'
    costPerRequest: Number,   // For per-request pricing
    inputTokenCost: Number,   // For token-based (like OpenAI)
    outputTokenCost: Number,
    costPerMB: Number,        // For data transfer pricing
    monthlyBudget: Number,
    alertThreshold: Number    // 0.8 = alert at 80%
  }
}

// CostRecord Model
{
  apiId: ObjectId,
  checkId: ObjectId,
  cost: Number,
  timestamp: Date,
  metadata: {
    tokensUsed: Number,
    dataTransferred: Number
  }
}
```

**Dashboard Features:**

- "You've spent $47.32 this month on OpenAI API"
- "At current rate, you'll spend $89 this month"
- "Top 3 most expensive APIs"
- AI suggestions: "Switch to GPT-3.5 for simple queries → Save 90%"

---

### 13. Consumer-Driven Contract Testing

**Why:** Goes beyond "API works" to "API fulfills its promise" - shows microservices understanding.

**What to Build:**

- Define expected response contracts (required fields, field types, response time SLA)
- Validate every check against the contract
- Track contract violations with severity levels
- AI explains what the violation means for consumers

**Implementation:**

```javascript
// API Model Addition
{
  responseContract: {
    enabled: Boolean,
    requiredFields: [String],
    fieldTypes: Object,       // { "amount": "number", "status": "string" }
    maxResponseTime: Number,
    expectedStatusCodes: [Number]
  }
}

// ContractViolation Model
{
  apiId: ObjectId,
  checkId: ObjectId,
  violations: [{
    type: String,           // 'MISSING_FIELD', 'TYPE_MISMATCH', 'SLA_BREACH'
    field: String,
    expected: Mixed,
    actual: Mixed,
    severity: String
  }],
  aiExplanation: String,
  createdAt: Date
}
```

**Contract Violation Alert:**

```
⚠️ CONTRACT VIOLATION: Payment API
─────────────────────────────────
Missing Field: transactionId (CRITICAL)
Type Mismatch: amount (expected: number, got: string)

AI Analysis: "The transactionId field is missing which will
break payment confirmation flows. The amount type change
may cause calculation errors in your billing system."
```

---

### 14. SLA Tracking & Compliance Reports

**Why:** Legal requirement for enterprise contracts. Shows business awareness.

**What to Build:**

- Define SLA targets (uptime %, response time P95, error rate)
- Track compliance over time (daily, weekly, monthly)
- Generate professional PDF reports
- Alert on SLA breaches

**Implementation:**

```javascript
// API Model Addition
{
  sla: {
    enabled: Boolean,
    targets: {
      uptime: Number,           // 99.9
      responseTimeP95: Number,  // 200ms
      errorRate: Number         // 0.1%
    },
    reportingPeriod: String,    // 'daily', 'weekly', 'monthly'
    alertOnBreach: Boolean
  }
}

// SLAReport Model
{
  apiId: ObjectId,
  period: { start: Date, end: Date },
  metrics: {
    uptime: Number,
    avgResponseTime: Number,
    p95ResponseTime: Number,
    errorRate: Number,
    totalChecks: Number
  },
  compliance: {
    uptimeCompliant: Boolean,
    responseTimeCompliant: Boolean,
    errorRateCompliant: Boolean
  },
  incidents: [{
    timestamp: Date,
    duration: Number,
    type: String
  }],
  generatedAt: Date
}
```

**SLA Dashboard:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Payment API - January 2026 SLA Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Status: ✅ COMPLIANT

┌─────────────────┬──────────┬──────────┬────────┐
│ Metric          │ Target   │ Achieved │ Status │
├─────────────────┼──────────┼──────────┼────────┤
│ Uptime          │ 99.9%    │ 99.94%   │   ✅   │
│ P95 Resp. Time  │ <200ms   │ 187ms    │   ✅   │
│ Error Rate      │ <0.1%    │ 0.06%    │   ✅   │
└─────────────────┴──────────┴──────────┴────────┘

[Download PDF Report]
```

---

### 15. Performance Regression Detection

**Why:** Uses statistics (T-test, percentiles) - shows data science knowledge.

**What to Build:**

- Compare recent performance vs historical baseline
- Detect statistically significant degradation
- Pinpoint when regression started
- AI diagnoses the likely cause

**Implementation:**

```javascript
// Statistical Analysis
async function detectPerformanceRegression(apiId) {
  const checks = await Check.find({ apiId }).sort({ timestamp: -1 }).limit(1000);

  // Split: 70% baseline, 30% current
  const baseline = checks.slice(Math.floor(checks.length * 0.3));
  const current = checks.slice(0, Math.floor(checks.length * 0.3));

  // Calculate stats
  const baselineStats = {
    mean: calculateMean(baseline),
    stdDev: calculateStdDev(baseline),
    p95: calculatePercentile(baseline, 95)
  };

  const currentStats = { /* same calculations */ };

  // T-test for statistical significance
  const tTestResult = performTTest(baseline, current);

  if (tTestResult.pValue < 0.05 && currentStats.mean > baselineStats.mean * 1.3) {
    // 30% degradation with 95% confidence
    return { detected: true, degradation: percentage, confidence: pValue };
  }
}

// PerformanceRegression Model
{
  apiId: ObjectId,
  detectedAt: Date,
  baselinePeriod: { start: Date, end: Date },
  baselineStats: Object,
  currentStats: Object,
  degradationPercent: Number,
  confidenceLevel: Number,
  aiDiagnosis: String,
  status: String         // 'active', 'resolved', 'acknowledged'
}
```

**Regression Alert:**

```
⚠️ PERFORMANCE REGRESSION DETECTED

Payment API
─────────────────────────────────
Baseline (Jan 1-15):   245ms average
Current (Jan 16-23):   387ms average
Degradation:           +58% slower
Confidence:            97.3%

AI Analysis: "Database query N+1 problem likely introduced.
Response times correlate with increased query count."

Suggested Actions:
→ Review recent code deployments
→ Check database query logs
→ Consider adding query caching
```

---

### 16. Automated Root Cause Analysis

**Why:** Saves hours of debugging. Shows correlation and AI problem-solving skills.

**What to Build:**

- When failure occurs, gather all context automatically
- Check if other APIs failed simultaneously (correlation)
- Check for recent changes/deployments
- AI analyzes all signals to suggest root cause

**Implementation:**

```javascript
// RootCauseAnalysis Model
{
  failedCheckId: ObjectId,
  apiId: ObjectId,
  analyzedAt: Date,
  context: {
    error: String,
    statusCode: Number,
    responseTime: Number,
    timestamp: Date
  },
  correlatedFailures: [{
    apiId: ObjectId,
    apiName: String,
    failedAt: Date
  }],
  possibleCauses: [{
    cause: String,
    confidence: String,      // 'HIGH', 'MEDIUM', 'LOW'
    evidence: String,
    recommendation: String
  }],
  aiAnalysis: String,
  similarPastIncidents: [ObjectId]
}
```

**Root Cause Dashboard:**

```
🔍 ROOT CAUSE ANALYSIS

Payment API Failed at 14:35:22
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Top Likely Causes:

1. 🔴 Network Outage (95% confidence)
   ├─ Evidence: 5 other APIs failed simultaneously
   └─ ACTION: Check network connectivity

2. 🟡 Database Timeout (60% confidence)
   ├─ Evidence: Response time was 8,900ms
   └─ ACTION: Check database connection pool

Similar Past Incidents:
• Oct 15: Same pattern → Network issue resolved in 12min
```

---

### 17. Predictive Failure Forecasting (AI-Powered)

**Why:** Proactive vs reactive monitoring. Shows ML application thinking.

**What to Build:**

- Analyze response time trends
- Detect degradation patterns before failure
- Check for cyclic failure patterns (same time daily)
- AI predicts probability of failure in next hour

**Implementation:**

```javascript
// PredictiveAlert Model
{
  apiId: ObjectId,
  createdAt: Date,
  failureProbability: Number,    // 0-1
  predictedFailureTime: Date,
  earlyWarningSignals: [{
    type: String,               // 'DEGRADING_PERFORMANCE', 'INCREASING_ERRORS', 'CYCLIC_PATTERN'
    confidence: Number,
    message: String,
    estimatedImpact: String
  }],
  aiPrediction: String,
  recommendedActions: [String],
  status: String                // 'active', 'dismissed', 'failure_occurred', 'averted'
}
```

**Predictive Alert:**

```
🔮 PREDICTIVE ALERT

Payment API - Failure Predicted
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Failure Probability (next hour): 73%

Early Warning Signals:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟡 Response time degrading steadily
   Current: 890ms → Predicted: 2,400ms in 45min

🔴 Error rate climbing
   Current: 18% → Normal: 1.2%

🟢 Cyclic pattern detected
   API typically fails at 3 PM daily

Recommended Preventive Actions:
1. Scale database connections
2. Enable query caching
3. Alert on-call engineer

[Take Preventive Action] [Dismiss]
```

---

### 18. Natural Language Query Interface

**Why:** Makes monitoring accessible. Shows advanced AI integration.

**What to Build:**

- Ask questions in plain English
- AI parses intent and executes appropriate queries
- Returns natural language answers with data
- Suggests relevant visualizations

**Implementation:**

```javascript
// NLQuery endpoint
async function processNaturalLanguageQuery(userId, query) {
  // Gemini parses the query intent
  const intent = await aiService.parseQueryIntent(query, userAPIs);

  // Execute based on intent type
  switch (intent.type) {
    case "LIST_FAILURES":
      return getFailedAPIs(userId, intent.timeRange);
    case "COST_QUERY":
      return getCostBreakdown(userId, intent.timeRange);
    case "PERFORMANCE_QUERY":
      return getPerformanceStats(userId, intent.apiName);
    case "DIAGNOSIS":
      return diagnoseIssue(intent.apiId);
  }

  // Generate natural language response
  return aiService.generateResponse(query, data);
}
```

**Example Queries:**

```
User: "Which APIs are costing me the most?"

Response: "Your top 3 most expensive APIs this month are:
1. OpenAI GPT-4 API - $47.32 (2,840 requests)
2. Google Maps API - $23.18 (15,240 requests)
3. SendGrid Email - $8.94 (3,200 emails)

💡 Tip: Switching to GPT-3.5-turbo could save ~$35/month."
```

```
User: "Why is my payment API failing?"

Response: "The Payment API has failed 12 times in the past hour.

Root cause analysis suggests:
→ Database connection timeout (85% confidence)
→ Response times spiked from 200ms to 8,900ms

I recommend:
1. Check database connection pool
2. Review recent deployments"
```

---

### 19. API Dependency Visualization

**Why:** Visual impact in demos. Shows systems thinking.

**What to Build:**

- Interactive graph showing API dependencies
- Color-coded by health status
- Shows impact of failures ("If Stripe fails, what breaks?")
- AI predicts cascading failure impact

**Implementation:**

```javascript
// APIDependency Model
{
  apiId: ObjectId,
  dependsOn: [{
    apiId: ObjectId,
    relationship: String,     // 'calls', 'authenticates_with', 'requires'
    strength: Number          // Based on call frequency
  }],
  dependents: [ObjectId],     // APIs that depend on this one
  criticalPath: Boolean,
  updatedAt: Date
}

// Frontend: React Flow for visualization
// Color coding: Green (healthy), Yellow (degraded), Red (down)
// Edge thickness = dependency strength
```

**AI Impact Prediction:**

```
"If Stripe API fails, 3 services will be affected:
- Payment Processing (CRITICAL)
- Subscription Management (HIGH)
- Invoice Generation (MEDIUM)"
```

---

### 20. Webhook Testing Receiver

**Why:** Practical developer utility. Enables webhook debugging.

**What to Build:**

- Generate unique webhook URLs
- Capture and display incoming payloads
- Inspect headers, body, timing
- Useful for testing webhook integrations

**Implementation:**

```javascript
// WebhookEndpoint Model
{
  userId: ObjectId,
  uniqueId: String,
  url: String,              // https://endpoint.app/webhooks/{uniqueId}
  receivedPayloads: [{
    headers: Object,
    body: Object,
    method: String,
    receivedAt: Date,
    sourceIP: String
  }],
  isActive: Boolean,
  expiresAt: Date,
  createdAt: Date
}

// Route: POST /webhooks/:uniqueId
// Captures any incoming webhook and stores it
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                       │
│                    React + Vite + TailwindCSS                            │
│                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Dashboard │  │ API      │  │ Details  │  │ NL Query │  │ Cost     │  │
│  │  Page    │  │ Forms    │  │  Page    │  │ Chat     │  │ Dashboard│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ SLA      │  │Dependency│  │Regression│  │ Webhook  │                 │
│  │ Reports  │  │ Graph    │  │ Alerts   │  │ Tester   │                 │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                 │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │ HTTP (Axios)
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                        │
│                     Node.js + Express                                    │
│                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Auth    │  │   API    │  │Analytics │  │   Cost   │  │   SLA    │  │
│  │ Routes   │  │ Routes   │  │ Routes   │  │ Routes   │  │ Routes   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Insights │  │ Webhook  │  │ NL Query │  │Dependency│                 │
│  │ Routes   │  │ Routes   │  │ Routes   │  │ Routes   │                 │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                 │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                  Background Jobs (node-cron)                      │   │
│  │  • Monitoring Service - Checks APIs every minute                  │   │
│  │  • Cost Calculator - Tracks spending per check                    │   │
│  │  • Contract Validator - Validates response contracts              │   │
│  │  • Anomaly Detector - Detects anomalies & schema drift            │   │
│  │  • Regression Detector - Statistical performance analysis         │   │
│  │  • Predictive Engine - Forecasts failures using patterns          │   │
│  │  • SLA Calculator - Updates compliance metrics                    │   │
│  │  • Dependency Mapper - Updates API relationships                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      AI Services (Gemini)                         │   │
│  │  • Anomaly Insights - Explains detected anomalies                 │   │
│  │  • Root Cause Analysis - Investigates failures                    │   │
│  │  • Predictive Analysis - Forecasts issues                         │   │
│  │  • NL Query Parser - Understands natural language                 │   │
│  │  • Cost Optimizer - Suggests cost savings                         │   │
│  │  • Regression Diagnosis - Explains performance drops              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   MongoDB     │   │  Gemini AI    │   │   External    │
│   Atlas       │   │  API          │   │   APIs        │
│               │   │               │   │  (monitored)  │
│  • Users      │   │  • Insights   │   │               │
│  • APIs       │   │  • Queries    │   │  • Payment    │
│  • Checks     │   │  • Analysis   │   │  • Weather    │
│  • Anomalies  │   │  • Predictions│   │  • Maps       │
│  • Costs      │   │               │   │  • AI APIs    │
│  • SLAReports │   │               │   │               │
│  • Contracts  │   │               │   │               │
│  • Webhooks   │   │               │   │               │
└───────────────┘   └───────────────┘   └───────────────┘
```

## 🗄️ Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,           // unique
  password: String,        // hashed
  resetToken: String,      // for password reset (optional)
  resetTokenExpiry: Date,  // token expiry time (optional)
  createdAt: Date
}
```

### APIs Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,     // ref: User
  name: String,
  description: String,
  url: String,
  method: String,
  headers: Object,
  body: Object,
  checkFrequency: Number, // 60000, 300000, 900000, 1800000, 3600000
  timeout: Number,        // 5000-60000ms
  isActive: Boolean,
  baselineSchema: Object,
  expectedStatusCode: Number,
  alertsEnabled: Boolean,
  lastChecked: Date,
  lastSuccessAt: Date,
  lastFailureAt: Date,
  consecutiveFailures: Number,
  category: String,
  tags: [String],

  // NEW: Cost Tracking
  costTracking: {
    enabled: Boolean,
    pricingModel: String,     // 'TOKEN_BASED', 'PER_REQUEST', 'DATA_TRANSFER'
    costPerRequest: Number,
    inputTokenCost: Number,
    outputTokenCost: Number,
    costPerMB: Number,
    monthlyBudget: Number,
    alertThreshold: Number
  },

  // NEW: Response Contract
  responseContract: {
    enabled: Boolean,
    requiredFields: [String],
    fieldTypes: Object,
    maxResponseTime: Number,
    expectedStatusCodes: [Number]
  },

  // NEW: SLA Configuration
  sla: {
    enabled: Boolean,
    targets: {
      uptime: Number,
      responseTimeP95: Number,
      errorRate: Number
    },
    reportingPeriod: String,
    alertOnBreach: Boolean
  },

  createdAt: Date,
  updatedAt: Date
}
```

### Checks Collection

```javascript
{
  _id: ObjectId,
  apiId: ObjectId,      // ref: API
  timestamp: Date,
  responseTime: Number, // in ms
  statusCode: Number,
  success: Boolean,
  responseBody: Object,
  responseSize: Number,
  error: String,
  errorType: String,    // 'timeout', 'network', 'server', 'client'

  // NEW: Cost tracking per check
  cost: Number,
  tokensUsed: {
    input: Number,
    output: Number
  }
}
```

### Anomalies Collection

```javascript
{
  _id: ObjectId,
  apiId: ObjectId,      // ref: API
  checkId: ObjectId,    // ref: Check
  type: String,         // 'response_time_spike', 'error_spike', 'schema_drift', 'downtime'
  severity: String,     // 'low', 'medium', 'high'
  currentValue: Number,
  expectedValue: Number,
  aiInsight: String,
  acknowledged: Boolean,
  createdAt: Date
}
```

### Notifications Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,     // ref: User
  anomalyId: ObjectId,  // ref: Anomaly (optional)
  type: String,         // 'anomaly', 'budget_alert', 'sla_breach', 'contract_violation', 'prediction'
  message: String,
  read: Boolean,
  metadata: Object,     // Additional context
  createdAt: Date
}
```

### NEW: CostRecords Collection

```javascript
{
  _id: ObjectId,
  apiId: ObjectId,      // ref: API
  checkId: ObjectId,    // ref: Check
  cost: Number,
  timestamp: Date,
  metadata: {
    tokensUsed: Number,
    dataTransferred: Number,
    requestType: String
  }
}
```

### NEW: ContractViolations Collection

```javascript
{
  _id: ObjectId,
  apiId: ObjectId,      // ref: API
  checkId: ObjectId,    // ref: Check
  violations: [{
    type: String,         // 'MISSING_FIELD', 'TYPE_MISMATCH', 'SLA_BREACH', 'STATUS_MISMATCH'
    field: String,
    expected: Mixed,
    actual: Mixed,
    severity: String      // 'low', 'medium', 'high', 'critical'
  }],
  aiExplanation: String,
  acknowledged: Boolean,
  createdAt: Date
}
```

### NEW: SLAReports Collection

```javascript
{
  _id: ObjectId,
  apiId: ObjectId,      // ref: API
  period: {
    start: Date,
    end: Date,
    type: String        // 'daily', 'weekly', 'monthly'
  },
  metrics: {
    uptime: Number,
    avgResponseTime: Number,
    p95ResponseTime: Number,
    p99ResponseTime: Number,
    errorRate: Number,
    totalChecks: Number,
    successfulChecks: Number,
    failedChecks: Number
  },
  compliance: {
    overall: Boolean,
    uptimeCompliant: Boolean,
    responseTimeCompliant: Boolean,
    errorRateCompliant: Boolean
  },
  incidents: [{
    timestamp: Date,
    duration: Number,
    type: String,
    description: String
  }],
  generatedAt: Date
}
```

### NEW: PerformanceRegressions Collection

```javascript
{
  _id: ObjectId,
  apiId: ObjectId,      // ref: API
  detectedAt: Date,
  baselinePeriod: {
    start: Date,
    end: Date
  },
  baselineStats: {
    mean: Number,
    stdDev: Number,
    p95: Number,
    p99: Number
  },
  currentStats: {
    mean: Number,
    stdDev: Number,
    p95: Number,
    p99: Number
  },
  degradationPercent: Number,
  confidenceLevel: Number,   // 0-1
  tTestPValue: Number,
  aiDiagnosis: String,
  status: String,           // 'active', 'resolved', 'acknowledged'
  resolvedAt: Date
}
```

### NEW: RootCauseAnalyses Collection

```javascript
{
  _id: ObjectId,
  failedCheckId: ObjectId,  // ref: Check
  apiId: ObjectId,          // ref: API
  analyzedAt: Date,
  context: {
    error: String,
    statusCode: Number,
    responseTime: Number,
    timestamp: Date
  },
  correlatedFailures: [{
    apiId: ObjectId,
    apiName: String,
    failedAt: Date,
    error: String
  }],
  possibleCauses: [{
    cause: String,
    confidence: String,     // 'HIGH', 'MEDIUM', 'LOW'
    evidence: String,
    recommendation: String
  }],
  aiAnalysis: String,
  timeline: [{
    timestamp: Date,
    event: String
  }],
  similarPastIncidents: [ObjectId]
}
```

### NEW: PredictiveAlerts Collection

```javascript
{
  _id: ObjectId,
  apiId: ObjectId,          // ref: API
  createdAt: Date,
  failureProbability: Number,  // 0-1
  predictedFailureTime: Date,
  earlyWarningSignals: [{
    type: String,           // 'DEGRADING_PERFORMANCE', 'INCREASING_ERRORS', 'CYCLIC_PATTERN'
    confidence: Number,
    message: String,
    estimatedImpact: String
  }],
  aiPrediction: String,
  recommendedActions: [String],
  status: String,           // 'active', 'dismissed', 'failure_occurred', 'averted'
  resolvedAt: Date
}
```

### NEW: APIDependencies Collection

```javascript
{
  _id: ObjectId,
  apiId: ObjectId,          // ref: API
  userId: ObjectId,         // ref: User
  dependsOn: [{
    apiId: ObjectId,
    relationship: String,   // 'calls', 'authenticates_with', 'requires'
    strength: Number,       // 1-10 based on call frequency
    description: String
  }],
  dependents: [ObjectId],   // APIs that depend on this one
  criticalPath: Boolean,
  lastUpdated: Date
}
```

### NEW: WebhookEndpoints Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,         // ref: User
  uniqueId: String,         // UUID for URL
  name: String,
  url: String,              // Full URL: https://endpoint.app/webhooks/{uniqueId}
  receivedPayloads: [{
    headers: Object,
    body: Object,
    method: String,
    receivedAt: Date,
    sourceIP: String,
    contentType: String
  }],
  isActive: Boolean,
  expiresAt: Date,
  maxPayloads: Number,      // Limit stored payloads
  createdAt: Date
}
```

### NEW: NLQueryLogs Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,         // ref: User
  query: String,
  parsedIntent: {
    type: String,
    entities: Object,
    confidence: Number
  },
  response: String,
  data: Object,
  executionTime: Number,
  createdAt: Date
}
```

---

## 🛠️ Development Phases

### Phase 1: Setup & Auth ✅ (COMPLETED)

- [x] Initialize React + Vite frontend
- [x] Initialize Express backend
- [x] Setup MongoDB Atlas
- [x] Implement user registration
- [x] Implement login/logout with JWT
- [x] Password reset with email (Nodemailer + Gmail)
- [x] Setup protected routes

### Phase 2: Landing Page (Days 1-2)

- [ ] Design landing page layout
- [ ] Hero section with CTA
- [ ] Features showcase section (highlight new AI features)
- [ ] How it works section
- [ ] Responsive design

### Phase 3: Core CRUD ✅ (COMPLETED)

- [x] API registration form
- [x] List user's APIs
- [x] Edit/Delete APIs
- [x] Enable/Disable toggle

### Phase 4: Monitoring Engine ✅ (COMPLETED)

- [x] Setup node-cron job
- [x] Implement API checking logic
- [x] Store check results
- [x] Handle errors & timeouts

### Phase 5: Analysis Features ✅ (COMPLETED)

- [x] Response time statistics
- [x] Schema baseline creation
- [x] Schema drift detection
- [x] Basic anomaly detection algorithm

### Phase 6: AI Integration ✅ (PARTIALLY COMPLETED)

- [x] Setup Gemini API
- [x] Generate anomaly explanations
- [x] Store and display insights

### Phase 7: Dashboard & UI (Days 3-5)

- [ ] Design dashboard layout
- [ ] API status cards
- [ ] Response time charts
- [ ] Anomaly list view
- [ ] Detailed API view

### Phase 8: Notifications ✅ (COMPLETED)

- [x] In-app notification system
- [x] Email alerts (nodemailer)
- [ ] Notification preferences UI

### Phase 9: API Testing Playground (Days 6-7)

- [ ] Playground form UI
- [ ] Test API through backend
- [ ] Display formatted response
- [ ] Copy as cURL command

---

## 🚀 NEW FEATURES DEVELOPMENT PHASES

### Phase 10: Cost Tracking System (Days 8-10)

**Backend:**

- [ ] Create CostRecord model
- [ ] Add costTracking fields to API model
- [ ] Create costController.js
- [ ] Create costService.js (calculate costs per check)
- [ ] Create costRoutes.js
- [ ] Integrate cost calculation in monitoringService
- [ ] Add budget alert notifications

**Frontend:**

- [ ] Create CostDashboard.jsx page
- [ ] Create CostChart.jsx component
- [ ] Create CostBreakdown.jsx component
- [ ] Create BudgetAlert.jsx component
- [ ] Update ApiForm with cost tracking fields
- [ ] Add costService.js

### Phase 11: Contract Testing (Days 11-13)

**Backend:**

- [ ] Create ContractViolation model
- [ ] Add responseContract fields to API model
- [ ] Create contractService.js (validate contracts)
- [ ] Integrate contract validation in monitoringService
- [ ] AI explanation for violations
- [ ] Contract violation notifications

**Frontend:**

- [ ] Create ContractForm.jsx component
- [ ] Create ContractViolationList.jsx component
- [ ] Update ApiForm with contract fields
- [ ] Display contract status on ApiCard

### Phase 12: SLA Tracking (Days 14-16)

**Backend:**

- [ ] Create SLAReport model
- [ ] Add sla fields to API model
- [ ] Create slaService.js (calculate compliance)
- [ ] Create slaController.js
- [ ] Create slaRoutes.js
- [ ] Daily SLA calculation cron job
- [ ] PDF report generation (pdfkit)
- [ ] SLA breach notifications

**Frontend:**

- [ ] Create SLADashboard.jsx page
- [ ] Create SLAChart.jsx component
- [ ] Create SLAReportCard.jsx component
- [ ] Update ApiForm with SLA targets
- [ ] Download PDF report functionality

### Phase 13: Performance Regression Detection (Days 17-19)

**Backend:**

- [ ] Create PerformanceRegression model
- [ ] Create regressionService.js (statistical analysis)
- [ ] Implement T-test calculation in helpers.js
- [ ] Integrate with monitoringService (daily check)
- [ ] AI diagnosis for regressions
- [ ] Regression alert notifications

**Frontend:**

- [ ] Create RegressionAlert.jsx component
- [ ] Create RegressionTimeline.jsx component
- [ ] Display regression status on ApiDetails page

### Phase 14: Root Cause Analysis (Days 20-22)

**Backend:**

- [ ] Create RootCauseAnalysis model
- [ ] Create rootCauseService.js
- [ ] Correlation detection (concurrent failures)
- [ ] Pattern matching rules
- [ ] AI-powered analysis integration
- [ ] Link to similar past incidents

**Frontend:**

- [ ] Create RootCauseReport.jsx component
- [ ] Create FailureTimeline.jsx component
- [ ] Create CorrelatedFailures.jsx component
- [ ] Add RCA view to ApiDetails page

### Phase 15: Predictive Failure Alerts (Days 23-25)

**Backend:**

- [ ] Create PredictiveAlert model
- [ ] Create predictiveService.js
- [ ] Pattern detection algorithms
- [ ] Cyclic failure detection
- [ ] AI prediction integration
- [ ] Predictive alert notifications

**Frontend:**

- [ ] Create PredictiveAlertCard.jsx component
- [ ] Create WarningSignals.jsx component
- [ ] Add predictions to Dashboard
- [ ] Create PredictiveAlerts.jsx page

### Phase 16: Natural Language Query (Days 26-28)

**Backend:**

- [ ] Create NLQueryLog model
- [ ] Create nlQueryService.js
- [ ] Gemini intent parsing
- [ ] Query execution engine
- [ ] Response generation
- [ ] Create nlQueryController.js
- [ ] Create nlQueryRoutes.js

**Frontend:**

- [ ] Create NLQueryChat.jsx component
- [ ] Create QueryResponse.jsx component
- [ ] Add chat interface to Dashboard
- [ ] Quick query suggestions

### Phase 17: Dependency Visualization (Days 29-31)

**Backend:**

- [ ] Create APIDependency model
- [ ] Create dependencyService.js
- [ ] Auto-detect dependencies (URL patterns)
- [ ] Create dependencyController.js
- [ ] Create dependencyRoutes.js
- [ ] AI impact prediction

**Frontend:**

- [ ] Create DependencyGraph.jsx page (React Flow)
- [ ] Create DependencyNode.jsx component
- [ ] Create ImpactAnalysis.jsx component
- [ ] Interactive graph with health colors

### Phase 18: Webhook Testing (Days 32-33)

**Backend:**

- [ ] Create WebhookEndpoint model
- [ ] Create webhookController.js
- [ ] Create webhookRoutes.js
- [ ] Webhook receiver endpoint
- [ ] Auto-cleanup expired webhooks

**Frontend:**

- [ ] Create WebhookTester.jsx page
- [ ] Create PayloadViewer.jsx component
- [ ] Create WebhookURL.jsx component
- [ ] Copy URL functionality

### Phase 19: Polish & Integration (Days 34-36)

- [ ] Error handling across all new features
- [ ] Loading states for all components
- [ ] Responsive design for new pages
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Code cleanup and documentation

### Phase 20: Deployment (Days 37-38)

- [ ] Update backend on Render
- [ ] Update frontend on Vercel
- [ ] Configure new environment variables
- [ ] Final testing on production
- [ ] Create demo video
- [ ] Update README with new features

---

## 🚀 Deployment Guide

### Backend Deployment (Render)

**Platform:** [Render](https://render.com) (Free tier available)

**Steps:**

1. Push your `server/` code to a GitHub repository
2. Go to Render Dashboard → New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Name:** `endpoint-backend`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node app.js`

**Environment Variables (set in Render dashboard):**

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/endpoint
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-gemini-api-key
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=https://your-frontend.vercel.app
PORT=10000
```

> **Note:** For Gmail, use [App Passwords](https://support.google.com/accounts/answer/185833) (not your regular password)

---

### Frontend Deployment (Vercel)

**Platform:** [Vercel](https://vercel.com) (Free tier available)

**Steps:**

1. Push your `client/` code to a GitHub repository
2. Go to Vercel Dashboard → Add New → Project
3. Import your GitHub repo
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

**Environment Variables (set in Vercel dashboard):**

```
VITE_API_URL=https://endpoint-backend.onrender.com/api
```

---

### Important Configuration

**1. Update Backend CORS (server/app.js):**

```javascript
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
```

**2. Update Frontend API URL (client/src/services/api.js):**

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
```

**3. Add start script (server/package.json):**

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

---

### Deployment Checklist

- [ ] MongoDB Atlas cluster created (free M0 tier)
- [ ] MongoDB network access allows `0.0.0.0/0` (for Render)
- [ ] Gemini API key obtained from Google AI Studio
- [ ] Gmail App Password created for email service
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set on both platforms
- [ ] CORS configured to allow Vercel domain
- [ ] Test password reset email flow in production
- [ ] Verify all API endpoints work

---

## 📝 API Endpoints

### Auth Routes

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| POST   | /api/auth/register        | Register new user         |
| POST   | /api/auth/login           | Login user                |
| GET    | /api/auth/me              | Get current user          |
| PUT    | /api/auth/profile         | Update profile name       |
| PUT    | /api/auth/change-password | Change password           |
| POST   | /api/auth/forgot-password | Send password reset email |
| POST   | /api/auth/reset-password  | Reset password with token |
| DELETE | /api/auth/delete-account  | Delete account            |

### API Routes

| Method | Endpoint                     | Description              |
| ------ | ---------------------------- | ------------------------ |
| GET    | /api/apis                    | Get user's APIs          |
| POST   | /api/apis                    | Add new API              |
| GET    | /api/apis/categories         | Get all categories       |
| GET    | /api/apis/dashboard-stats    | Get dashboard statistics |
| POST   | /api/apis/test               | Test an API endpoint     |
| GET    | /api/apis/:id                | Get single API           |
| PUT    | /api/apis/:id                | Update API               |
| DELETE | /api/apis/:id                | Delete API               |
| PATCH  | /api/apis/:id/toggle         | Toggle active status     |
| PATCH  | /api/apis/:id/reset-baseline | Reset schema baseline    |

### Analytics Routes

| Method | Endpoint                                        | Description            |
| ------ | ----------------------------------------------- | ---------------------- |
| GET    | /api/analytics/:id/checks                       | Get check history      |
| GET    | /api/analytics/:id/summary                      | Get API statistics     |
| GET    | /api/analytics/:id/anomalies                    | Get anomaly list       |
| GET    | /api/analytics/:id/response-time-history        | Get response time data |
| DELETE | /api/analytics/:id/checks                       | Clear check history    |
| PATCH  | /api/analytics/anomalies/:anomalyId/acknowledge | Acknowledge anomaly    |

### Notification Routes

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | /api/notifications          | Get user notifications |
| PUT    | /api/notifications/read-all | Mark all as read       |
| PUT    | /api/notifications/:id/read | Mark single as read    |
| DELETE | /api/notifications/:id      | Delete notification    |

### NEW: Cost Routes

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| GET    | /api/costs/summary        | Get overall cost summary      |
| GET    | /api/costs/:apiId         | Get cost details for API      |
| GET    | /api/costs/:apiId/history | Get cost history over time    |
| GET    | /api/costs/breakdown      | Get cost breakdown by API     |
| GET    | /api/costs/projections    | Get projected monthly costs   |
| POST   | /api/costs/optimize       | Get AI cost optimization tips |

### NEW: SLA Routes

| Method | Endpoint                           | Description                |
| ------ | ---------------------------------- | -------------------------- |
| GET    | /api/sla/:apiId/status             | Get current SLA status     |
| GET    | /api/sla/:apiId/reports            | Get SLA reports history    |
| GET    | /api/sla/:apiId/reports/:period    | Get specific period report |
| GET    | /api/sla/:apiId/download/:reportId | Download PDF report        |
| POST   | /api/sla/:apiId/generate           | Generate SLA report        |

### NEW: Insights Routes (AI-Powered)

| Method | Endpoint                                  | Description                 |
| ------ | ----------------------------------------- | --------------------------- |
| GET    | /api/insights/:apiId/root-cause           | Get root cause analysis     |
| GET    | /api/insights/:apiId/predictions          | Get predictive alerts       |
| GET    | /api/insights/:apiId/regressions          | Get performance regressions |
| GET    | /api/insights/:apiId/contracts            | Get contract violations     |
| PATCH  | /api/insights/regressions/:id/acknowledge | Acknowledge regression      |
| PATCH  | /api/insights/predictions/:id/dismiss     | Dismiss prediction          |

### NEW: NL Query Routes

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| POST   | /api/query             | Process natural language query |
| GET    | /api/query/history     | Get query history              |
| GET    | /api/query/suggestions | Get query suggestions          |

### NEW: Dependency Routes

| Method | Endpoint                        | Description                 |
| ------ | ------------------------------- | --------------------------- |
| GET    | /api/dependencies               | Get all API dependencies    |
| GET    | /api/dependencies/:apiId        | Get dependencies for API    |
| POST   | /api/dependencies/:apiId        | Add dependency manually     |
| DELETE | /api/dependencies/:apiId/:depId | Remove dependency           |
| GET    | /api/dependencies/:apiId/impact | Get failure impact analysis |
| POST   | /api/dependencies/auto-detect   | Auto-detect dependencies    |

### NEW: Webhook Routes

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| GET    | /api/webhooks              | Get user's webhook endpoints |
| POST   | /api/webhooks              | Create new webhook endpoint  |
| GET    | /api/webhooks/:id          | Get webhook details          |
| GET    | /api/webhooks/:id/payloads | Get received payloads        |
| DELETE | /api/webhooks/:id          | Delete webhook endpoint      |
| DELETE | /api/webhooks/:id/payloads | Clear payloads               |
| POST   | /webhooks/:uniqueId        | Webhook receiver (public)    |

---

## ✅ Key Points for Placement Interviews

### 1. **Explain the Architecture:**

- Frontend-Backend separation (MERN stack)
- RESTful API design with proper HTTP methods
- Background job processing with node-cron
- Event-driven monitoring system
- AI integration for intelligent insights

### 2. **Security Knowledge:**

- Password hashing with bcrypt (salt rounds)
- JWT-based authentication with expiry
- Protected routes (frontend & backend)
- Input validation with express-validator
- CORS configuration for cross-origin requests

### 3. **Database Design:**

- MongoDB schema design with relationships
- Proper indexing for query performance
- References vs embedding decisions
- TTL indexes for data cleanup (Checks collection)
- Aggregation pipelines for analytics

### 4. **AI/ML Integration:**

- Gemini API integration for multiple use cases
- Prompt engineering for specific outputs
- Natural language query parsing
- AI-powered root cause analysis
- Predictive failure forecasting (pattern detection)

### 5. **Statistical Analysis:**

- Standard deviation for anomaly detection
- T-test for regression detection
- Percentile calculations (P95, P99)
- Moving averages for trend analysis
- Statistical confidence levels

### 6. **Problem-Solving Features:**

- Contract testing (microservices understanding)
- SLA compliance tracking (business awareness)
- Cost optimization (financial awareness)
- Root cause analysis (debugging skills)
- Predictive alerts (proactive thinking)

### 7. **Frontend Skills:**

- React hooks & state management
- Data visualization with Recharts
- Graph visualization with React Flow
- Responsive design with TailwindCSS
- Form handling with React Hook Form

### 8. **Backend Architecture:**

- Controller-Service-Model pattern
- Middleware chain (auth, validation, error handling)
- Background services isolation
- PDF generation for reports
- Webhook handling

---

## 🎯 Interview Talking Points

### For Cost Tracking Feature:

> "I noticed companies struggle with unexpected AI API bills, so I built real-time cost tracking with budget alerts and AI-powered optimization suggestions. It tracks costs per request, projects monthly spending, and warns before exceeding budgets."

### For Contract Testing:

> "Instead of just checking if an API returns 200, I validate the response contract - does it have the required fields with correct types? This catches breaking changes before they reach production. It's inspired by Pact's consumer-driven contract testing."

### For Root Cause Analysis:

> "When failures occur, the system correlates multiple signals - checks if other APIs failed simultaneously, looks at response time patterns, and uses AI to suggest the most likely cause with confidence levels. It even links to similar past incidents."

### For Predictive Alerts:

> "I implemented pattern-based prediction using statistical analysis. The system detects degradation trends, increasing error rates, and cyclic patterns to warn 'this API will likely fail in 40 minutes' - giving time for preventive action."

### For SLA Tracking:

> "Enterprise contracts require SLA compliance proof. My system tracks uptime, P95 response times, and error rates against defined targets, generates professional PDF reports, and alerts on breaches - essential for B2B software."

### For Natural Language Queries:

> "Non-technical stakeholders can ask questions like 'Why is my payment API failing?' or 'Which APIs cost the most?' - the AI parses the intent, executes the right queries, and responds in natural language."

---

## 💡 Technical Depth to Highlight

| Area                     | Concepts Demonstrated                                          |
| ------------------------ | -------------------------------------------------------------- |
| **Statistics**           | T-tests, percentiles, standard deviation, confidence intervals |
| **AI Integration**       | Multi-use Gemini API, prompt engineering, NLP                  |
| **Systems Thinking**     | Dependency mapping, cascading failure analysis                 |
| **Business Acumen**      | Cost optimization, SLA compliance, contract testing            |
| **Proactive Monitoring** | Predictive alerts, regression detection                        |
| **Full-Stack**           | MERN stack, background jobs, real-time data                    |

---

## 🚀 Good Luck!

This project demonstrates **IIT-level thinking** applied to real-world problems:

| Problem              | Your Solution                            |
| -------------------- | ---------------------------------------- |
| Unexpected API costs | Cost Tracker with AI optimization        |
| Breaking API changes | Contract Testing with validation         |
| Debugging time       | Root Cause Analysis with correlation     |
| Outages              | Predictive Alerts with pattern detection |
| SLA compliance       | Automated tracking with PDF reports      |
| Complex queries      | Natural Language Interface               |
| System understanding | Dependency Visualization                 |

You're not just building CRUD operations - you're demonstrating:

- **Problem-solving ability** (real enterprise problems)
- **Industry awareness** (SLA, contracts, costs)
- **Technical depth** (statistics, AI, architecture)
- **Innovation mindset** (predictive vs reactive)

Build it step by step, understand each part deeply, and you'll ace those placement interviews! 🎯
