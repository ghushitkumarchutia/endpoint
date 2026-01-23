# Endpoint - API Intelligence Platform - Project Structure

> **Level:** Advanced Fresher/Placement-Ready (IIT-Level Features)  
> **Goal:** Cover advanced concepts that differentiate you from average candidates

---

## 📂 Complete Project Structure

```
endpoint/
│
├── client/                          # FRONTEND (React + Vite)
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/                  # Static assets
│   │   │   └── images/
│   │   │       └── logo.svg
│   │   │
│   │   ├── components/              # Reusable UI Components
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   │   ├── Footer.jsx       # Footer component
│   │   │   │   ├── Button.jsx       # Reusable button
│   │   │   │   ├── Input.jsx        # Form input component
│   │   │   │   ├── Modal.jsx        # Modal/popup component
│   │   │   │   ├── Loader.jsx       # Loading spinner
│   │   │   │   ├── ProtectedRoute.jsx  # Route guard for auth
│   │   │   │   └── ConfidenceBadge.jsx # Confidence level indicator
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── ApiCard.jsx      # Single API status card
│   │   │   │   ├── StatsCard.jsx    # Statistics display card
│   │   │   │   ├── AnomalyList.jsx  # List of anomalies
│   │   │   │   ├── NotificationBell.jsx  # Bell icon with badge
│   │   │   │   ├── AlertBanner.jsx  # Predictive alert banner
│   │   │   │   └── QuickActions.jsx # Quick action buttons
│   │   │   │
│   │   │   ├── charts/
│   │   │   │   ├── ResponseTimeChart.jsx  # Line chart (Recharts)
│   │   │   │   ├── StatusPieChart.jsx     # Pie chart for status
│   │   │   │   ├── CostBreakdownChart.jsx # Cost by API (Bar/Pie)
│   │   │   │   ├── SLAGaugeChart.jsx      # SLA compliance gauge
│   │   │   │   ├── RegressionChart.jsx    # Before/After comparison
│   │   │   │   └── TrendChart.jsx         # Trend line with prediction
│   │   │   │
│   │   │   ├── forms/
│   │   │   │   ├── ApiForm.jsx      # Add/Edit API form
│   │   │   │   ├── TestApiForm.jsx  # API testing playground form
│   │   │   │   ├── ContractForm.jsx # Define response contract
│   │   │   │   ├── SLAForm.jsx      # Configure SLA targets
│   │   │   │   ├── BudgetForm.jsx   # Set cost budgets
│   │   │   │   └── WebhookForm.jsx  # Configure webhook endpoint
│   │   │   │
│   │   │   ├── cost/                # Cost Tracking Components
│   │   │   │   ├── CostDashboard.jsx    # Cost overview dashboard
│   │   │   │   ├── CostCard.jsx         # Single API cost card
│   │   │   │   ├── BudgetProgress.jsx   # Budget usage progress bar
│   │   │   │   ├── CostProjection.jsx   # Monthly projection card
│   │   │   │   └── OptimizationTips.jsx # AI cost suggestions
│   │   │   │
│   │   │   ├── contract/            # Contract Testing Components
│   │   │   │   ├── ContractViewer.jsx   # View/edit contracts
│   │   │   │   ├── ViolationList.jsx    # Contract violations list
│   │   │   │   ├── ViolationCard.jsx    # Single violation details
│   │   │   │   └── SchemaEditor.jsx     # JSON schema editor
│   │   │   │
│   │   │   ├── sla/                 # SLA Tracking Components
│   │   │   │   ├── SLADashboard.jsx     # SLA overview
│   │   │   │   ├── SLACard.jsx          # Single API SLA status
│   │   │   │   ├── SLAHistory.jsx       # Historical compliance
│   │   │   │   └── SLABadge.jsx         # SLA status indicator
│   │   │   │
│   │   │   ├── regression/          # Regression Detection Components
│   │   │   │   ├── RegressionAlert.jsx  # Regression warning card
│   │   │   │   ├── RegressionDetail.jsx # Detailed comparison
│   │   │   │   ├── BaselineCard.jsx     # Current baseline info
│   │   │   │   └── StatComparison.jsx   # Statistical comparison view
│   │   │   │
│   │   │   ├── insights/            # AI Insights Components
│   │   │   │   ├── RootCauseCard.jsx    # Root cause analysis result
│   │   │   │   ├── CorrelationList.jsx  # Related failures list
│   │   │   │   ├── PredictiveCard.jsx   # Prediction alert card
│   │   │   │   ├── InsightTimeline.jsx  # Timeline of insights
│   │   │   │   └── ConfidenceBar.jsx    # Confidence indicator
│   │   │   │
│   │   │   ├── nlquery/             # Natural Language Components
│   │   │   │   ├── NLQueryChat.jsx      # Chat-like query interface
│   │   │   │   ├── QueryInput.jsx       # Natural language input
│   │   │   │   ├── QueryResult.jsx      # AI response display
│   │   │   │   ├── SuggestedQueries.jsx # Example queries
│   │   │   │   └── QueryHistory.jsx     # Past queries list
│   │   │   │
│   │   │   ├── dependency/          # Dependency Graph Components
│   │   │   │   ├── DependencyGraph.jsx  # React Flow graph
│   │   │   │   ├── ApiNode.jsx          # Custom node for API
│   │   │   │   ├── DependencyEdge.jsx   # Custom edge styling
│   │   │   │   ├── GraphControls.jsx    # Zoom/filter controls
│   │   │   │   └── ImpactHighlight.jsx  # Cascading failure viz
│   │   │   │
│   │   │   ├── webhook/             # Webhook Testing Components
│   │   │   │   ├── WebhookTester.jsx    # Webhook test interface
│   │   │   │   ├── PayloadEditor.jsx    # JSON payload editor
│   │   │   │   ├── ResponseViewer.jsx   # Webhook response display
│   │   │   │   └── WebhookHistory.jsx   # Past webhook tests
│   │   │   │
│   │   │   └── landing/
│   │   │       ├── Hero.jsx         # Hero section
│   │   │       ├── Features.jsx     # Features showcase
│   │   │       └── HowItWorks.jsx   # Steps section
│   │   │
│   │   ├── pages/                   # Page Components
│   │   │   ├── LandingPage.jsx      # Public landing page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── ForgotPassword.jsx   # Forgot password page
│   │   │   ├── ResetPassword.jsx    # Reset password page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── ApiDetails.jsx       # Single API detail view
│   │   │   ├── AddApi.jsx           # Add new API page
│   │   │   ├── Notifications.jsx    # All notifications page
│   │   │   ├── Playground.jsx       # API testing playground
│   │   │   ├── CostTracking.jsx     # Cost tracking page
│   │   │   ├── Contracts.jsx        # Contract testing page
│   │   │   ├── SLATracking.jsx      # SLA compliance page
│   │   │   ├── Insights.jsx         # AI insights page
│   │   │   ├── QueryInterface.jsx   # NL query page
│   │   │   ├── Dependencies.jsx     # Dependency graph page
│   │   │   ├── Webhooks.jsx         # Webhook testing page
│   │   │   ├── Reports.jsx          # PDF reports page
│   │   │   └── NotFound.jsx         # 404 page
│   │   │
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.jsx      # Auth state management
│   │   │   └── ThemeContext.jsx     # Theme toggle (optional)
│   │   │
│   │   ├── hooks/                   # Custom Hooks
│   │   │   ├── useAuth.js           # Auth hook
│   │   │   ├── useFetch.js          # Data fetching hook
│   │   │   ├── useCosts.js          # Cost data hook
│   │   │   ├── useSLA.js            # SLA data hook
│   │   │   ├── useInsights.js       # Insights data hook
│   │   │   ├── useDependencies.js   # Dependencies hook
│   │   │   └── useNLQuery.js        # Natural language query hook
│   │   │
│   │   ├── services/                # API Services
│   │   │   ├── api.js               # Axios instance setup
│   │   │   ├── authService.js       # Auth API calls
│   │   │   ├── apiService.js        # API CRUD calls
│   │   │   ├── analyticsService.js  # Analytics API calls
│   │   │   ├── notificationService.js  # Notification API calls
│   │   │   ├── costService.js       # Cost tracking API calls
│   │   │   ├── contractService.js   # Contract testing API calls
│   │   │   ├── slaService.js        # SLA tracking API calls
│   │   │   ├── insightsService.js   # Root cause & predictions API
│   │   │   ├── queryService.js      # Natural language query API
│   │   │   ├── dependencyService.js # Dependency graph API
│   │   │   └── webhookService.js    # Webhook testing API
│   │   │
│   │   ├── utils/                   # Utility Functions
│   │   │   ├── formatDate.js        # Date formatting (date-fns)
│   │   │   ├── formatCurrency.js    # Currency formatting
│   │   │   ├── calculateStats.js    # Statistical calculations
│   │   │   └── constants.js         # App constants
│   │   │
│   │   ├── App.jsx                  # Main App with routes
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles + Tailwind
│   │
│   ├── .env.local                   # Frontend env variables
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── postcss.config.js            # PostCSS config
│   └── vite.config.js               # Vite configuration
│
├── server/                          # BACKEND (Node.js + Express)
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── controllers/                 # Request Handlers
│   │   ├── authController.js        # Auth logic (register, login, reset)
│   │   ├── apiController.js         # API CRUD logic
│   │   ├── analyticsController.js   # Stats & analytics logic
│   │   ├── notificationController.js  # Notification logic
│   │   ├── costController.js        # Cost tracking logic
│   │   ├── contractController.js    # Contract testing logic
│   │   ├── slaController.js         # SLA tracking logic
│   │   ├── insightsController.js    # Root cause & predictions
│   │   ├── nlQueryController.js     # Natural language queries
│   │   ├── dependencyController.js  # Dependency mapping
│   │   └── webhookController.js     # Webhook testing
│   │
│   ├── middleware/                  # Express Middleware
│   │   ├── auth.js                  # JWT verification
│   │   ├── errorHandler.js          # Global error handler
│   │   └── validate.js              # Input validation handler
│   │
│   ├── models/                      # Mongoose Models (Original)
│   │   ├── User.js                  # User schema
│   │   ├── Api.js                   # API schema (extended)
│   │   ├── Check.js                 # Check result schema
│   │   ├── Anomaly.js               # Anomaly schema
│   │   ├── Notification.js          # Notification schema
│   │   │                            # New Models (Advanced)
│   │   ├── CostRecord.js            # API cost records
│   │   ├── ContractViolation.js     # Contract violations
│   │   ├── SLAReport.js             # SLA compliance reports
│   │   ├── PerformanceRegression.js # Performance regressions
│   │   ├── RootCauseAnalysis.js     # Root cause analyses
│   │   ├── PredictiveAlert.js       # Predictive failure alerts
│   │   ├── APIDependency.js         # API dependency mappings
│   │   ├── WebhookEndpoint.js       # Webhook configurations
│   │   └── NLQueryLog.js            # Natural language query logs
│   │
│   ├── routes/                      # Express Routes
│   │   ├── authRoutes.js            # /api/auth/*
│   │   ├── apiRoutes.js             # /api/apis/*
│   │   ├── analyticsRoutes.js       # /api/analytics/*
│   │   ├── notificationRoutes.js    # /api/notifications/*
│   │   ├── costRoutes.js            # /api/costs/*
│   │   ├── contractRoutes.js        # /api/contracts/*
│   │   ├── slaRoutes.js             # /api/sla/*
│   │   ├── insightsRoutes.js        # /api/insights/*
│   │   ├── nlQueryRoutes.js         # /api/query/*
│   │   ├── dependencyRoutes.js      # /api/dependencies/*
│   │   └── webhookRoutes.js         # /api/webhooks/*
│   │
│   ├── services/                    # Business Logic
│   │   ├── monitoringService.js     # Background job (node-cron)
│   │   ├── anomalyService.js        # Anomaly detection logic
│   │   ├── schemaService.js         # Schema comparison (ajv)
│   │   ├── aiService.js             # Gemini AI integration (extended)
│   │   ├── emailService.js          # Nodemailer setup
│   │   ├── costService.js           # Cost calculation & tracking
│   │   ├── contractService.js       # Contract validation
│   │   ├── slaService.js            # SLA calculation & reports
│   │   ├── regressionService.js     # Performance regression detection
│   │   ├── rootCauseService.js      # Root cause correlation
│   │   ├── predictiveService.js     # Predictive failure analysis
│   │   ├── nlQueryService.js        # NL query processing
│   │   ├── dependencyService.js     # Dependency mapping
│   │   └── pdfService.js            # PDF report generation
│   │
│   ├── utils/                       # Utility Functions
│   │   ├── helpers.js               # Helper functions
│   │   └── statistics.js            # T-test, percentiles, confidence
│   │
│   ├── .env                         # Backend env variables
│   ├── app.js                       # Express app setup
│   └── package.json                 # Backend dependencies
│
├── .env.example                     # Example env file
├── .gitignore                       # Git ignore file
├── DEVELOPMENT_PLAN.md              # Complete development guide
├── PROJECT_STRUCTURE.md             # This file
└── README.md                        # Project documentation
```

---

## 📁 Frontend Files Detail

### Components - Common

| File                  | Purpose                                            |
| --------------------- | -------------------------------------------------- |
| `Navbar.jsx`          | Top navigation with logo, links, auth buttons      |
| `Footer.jsx`          | Footer with links and copyright                    |
| `Button.jsx`          | Reusable button with variants (primary, secondary) |
| `Input.jsx`           | Form input with label and error display            |
| `Modal.jsx`           | Popup modal for confirmations                      |
| `Loader.jsx`          | Loading spinner component                          |
| `ProtectedRoute.jsx`  | HOC to protect authenticated routes                |
| `ConfidenceBadge.jsx` | AI confidence level indicator (High/Medium/Low)    |

### Components - Dashboard

| File                   | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `ApiCard.jsx`          | Card showing API name, status, response time |
| `StatsCard.jsx`        | Small card for metrics (uptime %, avg time)  |
| `AnomalyList.jsx`      | Table of recent anomalies                    |
| `NotificationBell.jsx` | Bell icon with unread count badge            |
| `AlertBanner.jsx`      | Predictive alert warning banner              |
| `QuickActions.jsx`     | Quick action buttons (test, refresh, etc.)   |

### Components - Charts

| File                     | Purpose                            |
| ------------------------ | ---------------------------------- |
| `ResponseTimeChart.jsx`  | Line chart using Recharts          |
| `StatusPieChart.jsx`     | Pie chart for success/error ratio  |
| `CostBreakdownChart.jsx` | Cost distribution by API (Bar/Pie) |
| `SLAGaugeChart.jsx`      | Gauge chart for SLA compliance %   |
| `RegressionChart.jsx`    | Before/After comparison chart      |
| `TrendChart.jsx`         | Trend line with prediction overlay |

### Components - Forms

| File               | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `ApiForm.jsx`      | Form to add/edit monitored APIs               |
| `TestApiForm.jsx`  | Playground form for testing APIs              |
| `ContractForm.jsx` | Define expected response contract/schema      |
| `SLAForm.jsx`      | Configure SLA targets (uptime, response time) |
| `BudgetForm.jsx`   | Set cost budgets and alert thresholds         |
| `WebhookForm.jsx`  | Configure webhook endpoint and payload        |

### Components - Cost Tracking

| File                   | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `CostDashboard.jsx`    | Overview of all API costs                  |
| `CostCard.jsx`         | Single API cost summary card               |
| `BudgetProgress.jsx`   | Progress bar showing budget usage          |
| `CostProjection.jsx`   | Monthly cost projection card               |
| `OptimizationTips.jsx` | AI-generated cost optimization suggestions |

### Components - Contract Testing

| File                 | Purpose                            |
| -------------------- | ---------------------------------- |
| `ContractViewer.jsx` | View and edit response contracts   |
| `ViolationList.jsx`  | List of contract violations        |
| `ViolationCard.jsx`  | Single violation details with diff |
| `SchemaEditor.jsx`   | JSON schema editor with validation |

### Components - SLA Tracking

| File               | Purpose                           |
| ------------------ | --------------------------------- |
| `SLADashboard.jsx` | Overview of all SLA compliance    |
| `SLACard.jsx`      | Single API SLA status card        |
| `SLAHistory.jsx`   | Historical compliance trend       |
| `SLABadge.jsx`     | Green/Yellow/Red SLA status badge |

### Components - Regression Detection

| File                   | Purpose                             |
| ---------------------- | ----------------------------------- |
| `RegressionAlert.jsx`  | Performance regression warning card |
| `RegressionDetail.jsx` | Detailed before/after comparison    |
| `BaselineCard.jsx`     | Current baseline statistics         |
| `StatComparison.jsx`   | Side-by-side statistical comparison |

### Components - AI Insights

| File                  | Purpose                            |
| --------------------- | ---------------------------------- |
| `RootCauseCard.jsx`   | Root cause analysis result display |
| `CorrelationList.jsx` | List of related failures           |
| `PredictiveCard.jsx`  | Predictive alert with timeline     |
| `InsightTimeline.jsx` | Timeline view of AI insights       |
| `ConfidenceBar.jsx`   | Visual confidence level indicator  |

### Components - Natural Language Query

| File                   | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `NLQueryChat.jsx`      | Chat-like interface for queries         |
| `QueryInput.jsx`       | Natural language input with suggestions |
| `QueryResult.jsx`      | AI response with data visualization     |
| `SuggestedQueries.jsx` | Example queries to get started          |
| `QueryHistory.jsx`     | Past queries and responses              |

### Components - Dependency Graph

| File                  | Purpose                           |
| --------------------- | --------------------------------- |
| `DependencyGraph.jsx` | React Flow interactive graph      |
| `ApiNode.jsx`         | Custom node component for API     |
| `DependencyEdge.jsx`  | Custom edge with status colors    |
| `GraphControls.jsx`   | Zoom, filter, and layout controls |
| `ImpactHighlight.jsx` | Cascading failure visualization   |

### Components - Webhook Testing

| File                 | Purpose                   |
| -------------------- | ------------------------- |
| `WebhookTester.jsx`  | Webhook test interface    |
| `PayloadEditor.jsx`  | JSON payload editor       |
| `ResponseViewer.jsx` | Webhook response display  |
| `WebhookHistory.jsx` | Past webhook test results |

### Components - Landing

| File             | Purpose                              |
| ---------------- | ------------------------------------ |
| `Hero.jsx`       | Landing page hero with tagline & CTA |
| `Features.jsx`   | Feature cards with icons             |
| `HowItWorks.jsx` | 3-step process section               |

### Pages

| File                 | Route                    | Purpose                               |
| -------------------- | ------------------------ | ------------------------------------- |
| `LandingPage.jsx`    | `/`                      | Public landing page                   |
| `Login.jsx`          | `/login`                 | User login                            |
| `Register.jsx`       | `/register`              | User registration                     |
| `ForgotPassword.jsx` | `/forgot-password`       | Enter email for reset                 |
| `ResetPassword.jsx`  | `/reset-password/:token` | Enter new password                    |
| `Dashboard.jsx`      | `/dashboard`             | Main dashboard (protected)            |
| `ApiDetails.jsx`     | `/api/:id`               | Single API analytics                  |
| `AddApi.jsx`         | `/add-api`               | Add new API form                      |
| `Notifications.jsx`  | `/notifications`         | All notifications list                |
| `Playground.jsx`     | `/playground`            | API testing tool                      |
| `CostTracking.jsx`   | `/costs`                 | Cost tracking dashboard               |
| `Contracts.jsx`      | `/contracts`             | Contract testing page                 |
| `SLATracking.jsx`    | `/sla`                   | SLA compliance dashboard              |
| `Insights.jsx`       | `/insights`              | AI insights (root cause, predictions) |
| `QueryInterface.jsx` | `/query`                 | Natural language query interface      |
| `Dependencies.jsx`   | `/dependencies`          | Dependency graph visualization        |
| `Webhooks.jsx`       | `/webhooks`              | Webhook testing page                  |
| `Reports.jsx`        | `/reports`               | PDF report generation                 |
| `NotFound.jsx`       | `*`                      | 404 error page                        |

### Services

| File                     | Functions                                                                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api.js`                 | Axios instance with base URL & interceptors                                                                                                                      |
| `authService.js`         | `login()`, `register()`, `updateProfile()`, `changePassword()`, `forgotPassword()`, `resetPassword()`, `deleteAccount()`, `getMe()`                              |
| `apiService.js`          | `getApis()`, `getApi()`, `createApi()`, `updateApi()`, `deleteApi()`, `toggleActive()`, `resetBaseline()`, `getCategories()`, `getDashboardStats()`, `testApi()` |
| `analyticsService.js`    | `getChecks()`, `getSummary()`, `getAnomalies()`, `getResponseTimeHistory()`, `clearChecks()`, `acknowledgeAnomaly()`                                             |
| `notificationService.js` | `getNotifications()`, `markAsRead()`, `markAllAsRead()`, `deleteNotification()`                                                                                  |
| `costService.js`         | `getCosts()`, `getCostsByApi()`, `getBudgetStatus()`, `updateBudget()`, `getCostProjection()`, `getOptimizationTips()`                                           |
| `contractService.js`     | `getContract()`, `updateContract()`, `getViolations()`, `validateResponse()`, `dismissViolation()`                                                               |
| `slaService.js`          | `getSLAStatus()`, `getSLAHistory()`, `updateSLATargets()`, `generateSLAReport()`, `downloadPDFReport()`                                                          |
| `insightsService.js`     | `getRootCause()`, `getCorrelations()`, `getPredictions()`, `getRegressions()`, `acknowledgeAlert()`                                                              |
| `queryService.js`        | `executeQuery()`, `getQueryHistory()`, `getSuggestedQueries()`                                                                                                   |
| `dependencyService.js`   | `getDependencies()`, `addDependency()`, `removeDependency()`, `getImpactAnalysis()`                                                                              |
| `webhookService.js`      | `getWebhooks()`, `createWebhook()`, `testWebhook()`, `getWebhookHistory()`, `deleteWebhook()`                                                                    |

---

## 📁 Backend Files Detail

### Controllers

| File                        | Functions                                                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `authController.js`         | `register`, `login`, `getMe`, `updateProfile`, `changePassword`, `forgotPassword`, `resetPassword`, `deleteAccount`                          |
| `apiController.js`          | `getApis`, `getApi`, `createApi`, `updateApi`, `deleteApi`, `toggleActive`, `resetBaseline`, `getCategories`, `getDashboardStats`, `testApi` |
| `analyticsController.js`    | `getChecks`, `getSummary`, `getAnomalies`, `acknowledgeAnomaly`, `getResponseTimeHistory`, `clearChecks`                                     |
| `notificationController.js` | `getNotifications`, `markAsRead`, `markAllAsRead`, `deleteNotification`                                                                      |
| `costController.js`         | `getCosts`, `getCostsByApi`, `recordCost`, `getBudgetStatus`, `updateBudget`, `getCostProjection`, `getOptimizationTips`                     |
| `contractController.js`     | `getContract`, `updateContract`, `getViolations`, `validateResponse`, `dismissViolation`, `getViolationStats`                                |
| `slaController.js`          | `getSLAStatus`, `getSLAByApi`, `getSLAHistory`, `updateSLATargets`, `checkSLABreach`, `generateSLAReport`, `downloadPDFReport`               |
| `insightsController.js`     | `getRootCause`, `getCorrelations`, `getPredictions`, `getRegressions`, `acknowledgeAlert`, `getInsightsSummary`                              |
| `nlQueryController.js`      | `executeQuery`, `getQueryHistory`, `getSuggestedQueries`, `parseIntent`                                                                      |
| `dependencyController.js`   | `getDependencies`, `addDependency`, `removeDependency`, `getImpactAnalysis`, `getDependencyGraph`, `detectDependencies`                      |
| `webhookController.js`      | `getWebhooks`, `createWebhook`, `updateWebhook`, `deleteWebhook`, `testWebhook`, `getWebhookHistory`, `retryWebhook`                         |

### Models (Mongoose Schemas)

#### Original Models

| File              | Fields                                                                                                                                                                                                                                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `User.js`         | `name`, `email`, `password`, `resetToken`, `resetTokenExpiry`, `createdAt`                                                                                                                                                                                                                                                             |
| `Api.js`          | `userId`, `name`, `description`, `url`, `method`, `headers`, `body`, `checkFrequency`, `timeout`, `isActive`, `baselineSchema`, `expectedStatusCode`, `alertsEnabled`, `lastChecked`, `lastSuccessAt`, `lastFailureAt`, `consecutiveFailures`, `category`, `tags`, `costTracking`, `responseContract`, `sla`, `createdAt`, `updatedAt` |
| `Check.js`        | `apiId`, `timestamp`, `responseTime`, `statusCode`, `success`, `responseBody`, `responseSize`, `error`, `errorType`                                                                                                                                                                                                                    |
| `Anomaly.js`      | `apiId`, `checkId`, `type`, `severity`, `currentValue`, `expectedValue`, `aiInsight`, `acknowledged`, `createdAt`                                                                                                                                                                                                                      |
| `Notification.js` | `userId`, `anomalyId`, `message`, `read`, `createdAt`                                                                                                                                                                                                                                                                                  |

#### New Models (Advanced Features)

| File                       | Fields                                                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `CostRecord.js`            | `apiId`, `userId`, `timestamp`, `requestCount`, `costPerRequest`, `totalCost`, `period`, `breakdown`                               |
| `ContractViolation.js`     | `apiId`, `checkId`, `timestamp`, `violationType`, `expectedSchema`, `actualResponse`, `missingFields`, `typeErrors`, `resolved`    |
| `SLAReport.js`             | `apiId`, `userId`, `period`, `uptimePercentage`, `avgResponseTime`, `p95ResponseTime`, `errorRate`, `breaches`, `compliance`       |
| `PerformanceRegression.js` | `apiId`, `detectedAt`, `metric`, `baselineValue`, `currentValue`, `degradationPercent`, `statisticalSignificance`, `windowSize`    |
| `RootCauseAnalysis.js`     | `apiId`, `anomalyId`, `timestamp`, `primaryCause`, `confidence`, `correlatedFailures`, `evidence`, `aiExplanation`, `resolved`     |
| `PredictiveAlert.js`       | `apiId`, `predictedAt`, `failureType`, `likelihood`, `expectedTime`, `pattern`, `recommendation`, `acknowledged`                   |
| `APIDependency.js`         | `sourceApiId`, `targetApiId`, `userId`, `dependencyType`, `strength`, `detectedAt`, `isManual`, `metadata`                         |
| `WebhookEndpoint.js`       | `userId`, `apiId`, `url`, `method`, `headers`, `payload`, `triggerOn`, `isActive`, `lastTriggered`, `successCount`, `failureCount` |
| `NLQueryLog.js`            | `userId`, `query`, `parsedIntent`, `executedAction`, `response`, `timestamp`, `successful`                                         |

### Services

| File                   | Purpose                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| `monitoringService.js` | Runs every minute with node-cron, checks APIs due for monitoring           |
| `anomalyService.js`    | Calculates avg/stdDev, detects response time spikes, creates anomalies     |
| `schemaService.js`     | Generates JSON schema, compares with baseline using ajv                    |
| `aiService.js`         | Calls Gemini API for anomaly insights, root cause, predictions, NL queries |
| `emailService.js`      | Sends password reset emails and alert notifications using Nodemailer       |
| `costService.js`       | Calculates request costs, tracks budgets, generates projections            |
| `contractService.js`   | Validates responses against contracts, detects violations                  |
| `slaService.js`        | Calculates uptime, response times, error rates against SLA targets         |
| `regressionService.js` | Detects performance regressions using T-test statistical analysis          |
| `rootCauseService.js`  | Correlates failures, identifies patterns, determines root cause            |
| `predictiveService.js` | Analyzes patterns to predict potential failures before they occur          |
| `nlQueryService.js`    | Parses natural language, executes database queries, formats responses      |
| `dependencyService.js` | Maps API dependencies, calculates cascading impact                         |
| `pdfService.js`        | Generates PDF reports for SLA compliance using pdfkit                      |

### Routes

| File                    | Endpoints                                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authRoutes.js`         | `POST /register`, `POST /login`, `GET /me`, `PUT /profile`, `PUT /change-password`, `POST /forgot-password`, `POST /reset-password`, `DELETE /delete-account`       |
| `apiRoutes.js`          | `GET /`, `POST /`, `GET /categories`, `GET /dashboard-stats`, `POST /test`, `GET /:id`, `PUT /:id`, `DELETE /:id`, `PATCH /:id/toggle`, `PATCH /:id/reset-baseline` |
| `analyticsRoutes.js`    | `GET /:id/checks`, `GET /:id/summary`, `GET /:id/anomalies`, `GET /:id/response-time-history`, `DELETE /:id/checks`, `PATCH /anomalies/:anomalyId/acknowledge`      |
| `notificationRoutes.js` | `GET /`, `PUT /read-all`, `PUT /:id/read`, `DELETE /:id`                                                                                                            |
| `costRoutes.js`         | `GET /`, `GET /:apiId`, `GET /budget/status`, `PUT /budget`, `GET /projection`, `GET /optimization-tips`                                                            |
| `contractRoutes.js`     | `GET /:apiId`, `PUT /:apiId`, `GET /:apiId/violations`, `POST /:apiId/validate`, `PATCH /violations/:id/dismiss`                                                    |
| `slaRoutes.js`          | `GET /`, `GET /:apiId`, `GET /:apiId/history`, `PUT /:apiId/targets`, `GET /:apiId/report`, `GET /:apiId/report/pdf`                                                |
| `insightsRoutes.js`     | `GET /root-cause/:anomalyId`, `GET /correlations/:apiId`, `GET /predictions`, `GET /regressions`, `PATCH /alerts/:id/acknowledge`                                   |
| `nlQueryRoutes.js`      | `POST /execute`, `GET /history`, `GET /suggestions`                                                                                                                 |
| `dependencyRoutes.js`   | `GET /`, `POST /`, `DELETE /:id`, `GET /graph`, `GET /:apiId/impact`                                                                                                |
| `webhookRoutes.js`      | `GET /`, `POST /`, `PUT /:id`, `DELETE /:id`, `POST /:id/test`, `GET /:id/history`, `POST /:id/retry`                                                               |

---

## ⚙️ Configuration Files

### Frontend: `.env.local`

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend: `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/endpoint
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRE=7d
GEMINI_API_KEY=your-gemini-api-key
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=http://localhost:5173
```

### `vite.config.js`

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
```

### `tailwind.config.js`

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

## 📦 Dependencies

### Frontend (`client/package.json`)

```json
{
  "name": "endpoint-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.1",
    "axios": "^1.7.9",
    "recharts": "^2.15.0",
    "react-hook-form": "^7.54.2",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.469.0",
    "date-fns": "^4.1.0",
    "@xyflow/react": "^12.0.0",
    "@tanstack/react-query": "^5.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.7",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
```

### Backend (`server/package.json`)

```json
{
  "name": "endpoint-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.21.2",
    "mongoose": "^8.9.5",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.2.1",
    "axios": "^1.7.9",
    "node-cron": "^3.0.3",
    "ajv": "^8.17.1",
    "nodemailer": "^6.9.16",
    "@google/generative-ai": "^0.21.0",
    "pdfkit": "^0.15.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

---

## 🚀 Quick Start Commands

### Setup Frontend

```bash
cd client
npm install
npm run dev     # Runs on http://localhost:5173
```

### Setup Backend

```bash
cd server
npm install
npm run dev     # Runs on http://localhost:5000
```

### Initialize Project

```bash
# Create frontend
npm create vite@latest client -- --template react
cd client
npm install react-router-dom axios recharts react-hook-form react-hot-toast lucide-react date-fns @xyflow/react @tanstack/react-query
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Create backend
mkdir server && cd server
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken express-validator axios node-cron ajv nodemailer @google/generative-ai pdfkit
npm install -D nodemon
```

---

## 📋 File Count Summary

| Category                         | Count          |
| -------------------------------- | -------------- |
| Frontend Components - Common     | 8 files        |
| Frontend Components - Dashboard  | 6 files        |
| Frontend Components - Charts     | 6 files        |
| Frontend Components - Forms      | 6 files        |
| Frontend Components - Cost       | 5 files        |
| Frontend Components - Contract   | 4 files        |
| Frontend Components - SLA        | 4 files        |
| Frontend Components - Regression | 4 files        |
| Frontend Components - Insights   | 5 files        |
| Frontend Components - NL Query   | 5 files        |
| Frontend Components - Dependency | 5 files        |
| Frontend Components - Webhook    | 4 files        |
| Frontend Components - Landing    | 3 files        |
| Frontend Pages                   | 19 files       |
| Frontend Services                | 12 files       |
| Frontend Hooks                   | 7 files        |
| Frontend Utils                   | 4 files        |
| Backend Controllers              | 11 files       |
| Backend Models                   | 14 files       |
| Backend Routes                   | 11 files       |
| Backend Services                 | 14 files       |
| Backend Middleware               | 3 files        |
| Backend Utils                    | 2 files        |
| Config Files                     | 8 files        |
| **Total**                        | **~160 files** |

---

## 🎯 Feature-to-File Mapping

| Feature                      | Backend Files                                                                | Frontend Files                                             |
| ---------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Cost Tracking**            | `costController.js`, `costService.js`, `CostRecord.js`                       | `CostDashboard.jsx`, `CostCard.jsx`, `CostTracking.jsx`    |
| **Contract Testing**         | `contractController.js`, `contractService.js`, `ContractViolation.js`        | `ContractViewer.jsx`, `ViolationList.jsx`, `Contracts.jsx` |
| **SLA Tracking**             | `slaController.js`, `slaService.js`, `SLAReport.js`, `pdfService.js`         | `SLADashboard.jsx`, `SLACard.jsx`, `SLATracking.jsx`       |
| **Regression Detection**     | `insightsController.js`, `regressionService.js`, `PerformanceRegression.js`  | `RegressionAlert.jsx`, `RegressionDetail.jsx`              |
| **Root Cause Analysis**      | `insightsController.js`, `rootCauseService.js`, `RootCauseAnalysis.js`       | `RootCauseCard.jsx`, `CorrelationList.jsx`, `Insights.jsx` |
| **Predictive Alerts**        | `insightsController.js`, `predictiveService.js`, `PredictiveAlert.js`        | `PredictiveCard.jsx`, `AlertBanner.jsx`                    |
| **Natural Language Query**   | `nlQueryController.js`, `nlQueryService.js`, `NLQueryLog.js`, `aiService.js` | `NLQueryChat.jsx`, `QueryInput.jsx`, `QueryInterface.jsx`  |
| **Dependency Visualization** | `dependencyController.js`, `dependencyService.js`, `APIDependency.js`        | `DependencyGraph.jsx`, `ApiNode.jsx`, `Dependencies.jsx`   |
| **Webhook Testing**          | `webhookController.js`, `WebhookEndpoint.js`                                 | `WebhookTester.jsx`, `PayloadEditor.jsx`, `Webhooks.jsx`   |

---

## 📊 Complexity Breakdown

| Category             | Simple | Moderate | Complex |
| -------------------- | ------ | -------- | ------- |
| **Authentication**   | ✅     |          |         |
| **CRUD Operations**  | ✅     |          |         |
| **Analytics**        |        | ✅       |         |
| **Cost Tracking**    |        | ✅       |         |
| **Contract Testing** |        | ✅       |         |
| **SLA Tracking**     |        | ✅       |         |
| **Root Cause**       |        |          | ✅      |
| **Predictive**       |        |          | ✅      |
| **NL Query**         |        |          | ✅      |
| **Dependency Graph** |        |          | ✅      |

---

> **Note:** This structure represents an advanced fresher-level project with IIT-level features. It demonstrates problem-solving skills, AI integration, statistical analysis, and full-stack architecture. Perfect for standing out in placement interviews!
