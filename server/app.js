require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { connectDB, closeDB } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { generalLimiter } = require("./middleware/rateLimiter");
const { logger, stream } = require("./utils/logger");
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

app.set("trust proxy", 1);

connectDB();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        process.env.CLIENT_URL,
      ].filter(Boolean);

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream,
    skip: (req) => req.path === "/api/health",
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Endpoint API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
  });
});

app.use(generalLimiter);

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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
  startMonitoring();
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
server.timeout = 120000;
let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
  if (isShuttingDown) {
    logger.warn("Shutdown already in progress...");
    return;
  }

  isShuttingDown = true;
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      stopMonitoring();
      logger.info("Monitoring service stopped");

      await closeDB();
      logger.info("Database connection closed");

      logger.info("Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown", { error: error.message });
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 30000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason: String(reason) });
});

module.exports = app;
