const mongoose = require("mongoose");

const performanceRegressionSchema = new mongoose.Schema({
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
  detectedAt: {
    type: Date,
    default: Date.now,
  },
  baselinePeriod: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  baselineStats: {
    mean: { type: Number, required: true },
    stdDev: { type: Number, required: true },
    p95: { type: Number, required: true },
    p99: { type: Number, required: true },
    sampleSize: { type: Number, required: true },
  },
  currentStats: {
    mean: { type: Number, required: true },
    stdDev: { type: Number, required: true },
    p95: { type: Number, required: true },
    p99: { type: Number, required: true },
    sampleSize: { type: Number, required: true },
  },
  degradationPercent: {
    type: Number,
    required: true,
  },
  confidenceLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  tTestPValue: {
    type: Number,
    required: true,
  },
  aiDiagnosis: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "investigating", "resolved", "false_positive"],
    default: "active",
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
});

performanceRegressionSchema.index({ apiId: 1, detectedAt: -1 });
performanceRegressionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model(
  "PerformanceRegression",
  performanceRegressionSchema,
);
