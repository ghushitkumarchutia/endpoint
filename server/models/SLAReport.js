const mongoose = require("mongoose");

const slaReportSchema = new mongoose.Schema({
  apiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Api",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    type: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },
  },
  metrics: {
    uptime: { type: Number, default: 100 },
    avgResponseTime: { type: Number, default: 0 },
    p95ResponseTime: { type: Number, default: 0 },
    p99ResponseTime: { type: Number, default: 0 },
    errorRate: { type: Number, default: 0 },
    totalChecks: { type: Number, default: 0 },
    successfulChecks: { type: Number, default: 0 },
    failedChecks: { type: Number, default: 0 },
  },
  targets: {
    uptime: { type: Number, default: 99.9 },
    responseTimeP95: { type: Number, default: 500 },
    errorRate: { type: Number, default: 1 },
  },
  compliance: {
    overall: { type: Boolean, default: true },
    uptimeCompliant: { type: Boolean, default: true },
    responseTimeCompliant: { type: Boolean, default: true },
    errorRateCompliant: { type: Boolean, default: true },
  },
  incidents: [
    {
      timestamp: { type: Date, required: true },
      duration: { type: Number, default: 0 },
      type: { type: String, default: null },
      description: { type: String, default: null },
    },
  ],
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

slaReportSchema.index({ apiId: 1, "period.start": -1 });
slaReportSchema.index({ userId: 1, generatedAt: -1 });

module.exports = mongoose.model("SLAReport", slaReportSchema);
