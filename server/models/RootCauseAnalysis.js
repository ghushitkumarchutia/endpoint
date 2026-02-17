const mongoose = require("mongoose");

const rootCauseAnalysisSchema = new mongoose.Schema({
  failedCheckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Check",
    required: true,
  },
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
  analyzedAt: {
    type: Date,
    default: Date.now,
  },
  context: {
    error: { type: String, default: null },
    statusCode: { type: Number, default: null },
    responseTime: { type: Number, default: null },
    timestamp: { type: Date, required: true },
  },
  correlatedFailures: [
    {
      apiId: { type: mongoose.Schema.Types.ObjectId, ref: "Api" },
      apiName: { type: String },
      failureTime: { type: Date },
      timeDelta: { type: Number },
    },
  ],
  possibleCauses: [
    {
      cause: { type: String, required: true },
      probability: { type: Number, min: 0, max: 100 },
      evidence: [{ type: String }],
    },
  ],
  aiAnalysis: {
    type: String,
    default: null,
  },
  timeline: [
    {
      timestamp: { type: Date, required: true },
      event: { type: String, required: true },
      severity: {
        type: String,
        enum: ["info", "warning", "error", "critical"],
        default: "info",
      },
    },
  ],
  similarPastIncidents: [
    {
      checkId: { type: mongoose.Schema.Types.ObjectId, ref: "Check" },
      timestamp: { type: Date },
      similarity: { type: Number, min: 0, max: 100 },
      resolution: { type: String },
    },
  ],
});

rootCauseAnalysisSchema.index({ apiId: 1, analyzedAt: -1 });
rootCauseAnalysisSchema.index({ failedCheckId: 1 }, { unique: true });

module.exports = mongoose.model("RootCauseAnalysis", rootCauseAnalysisSchema);
