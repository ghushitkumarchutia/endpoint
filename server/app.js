require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { connectDB, closeDB } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  aiLimiter,
  webhookLimiter,
  heavyOperationLimiter,
} = require("./middleware/rateLimiter");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const costRoutes = require("./routes/costRoutes");
const contractRoutes = require("./routes/contractRoutes");
const slaRoutes = require("./routes/slaRoutes");
const regressionRoutes = require("./routes/regressionRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const dependencyRoutes = require("./routes/dependencyRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const nlQueryRoutes = require("./routes/nlQueryRoutes");
const {
  startMonitoring,
  stopMonitoring,
} = require("./services/monitoringService");

const app = express();

// Trust proxy for rate limiting behind reverse proxy (Render, Vercel, etc.)
app.set("trust proxy", 1);

// Connect to database
connectDB();

// Security middleware - Helmet sets various HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for API
    crossOriginEmbedderPolicy: false,
  }),
);

// Compression middleware - compress responses
app.use(
  compression({
    level: 6, // Balanced compression level
    threshold: 1024, // Only compress responses > 1KB
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        process.env.CLIENT_URL,
      ].filter(Boolean);
      
      if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // Cache preflight for 24 hours
  }),
);

// Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Health check endpoint (excluded from rate limiting)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Endpoint API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
  });
});

// Routes with specific rate limiters
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", passwordResetLimiter);
app.use("/api/auth/reset-password", passwordResetLimiter);
app.use("/api/query", aiLimiter);
app.use("/api/sla/generate-all", heavyOperationLimiter);

// Main routes
app.use("/api/auth", authRoutes);
app.use("/api/apis", apiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/costs", costRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/sla", slaRoutes);
app.use("/api/regressions", regressionRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/dependencies", dependencyRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/query", nlQueryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  startMonitoring();
});

// Configure server timeouts for high traffic
server.keepAliveTimeout = 65000; // Slightly higher than ALB default (60s)
server.headersTimeout = 66000; // Slightly higher than keepAliveTimeout
server.timeout = 120000; // 2 minutes for long-running requests

// Graceful shutdown handling
let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
  if (isShuttingDown) {
    console.log("Shutdown already in progress...");
    return;
  }

  isShuttingDown = true;
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // Stop accepting new requests
  server.close(async () => {
    console.log("HTTP server closed");

    try {
      // Stop monitoring service
      stopMonitoring();
      console.log("Monitoring service stopped");

      // Close database connection
      await closeDB();
      console.log("Database connection closed");

      console.log("Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error.message);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions and rejections
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit for unhandled rejections, just log
});

module.exports = app;
