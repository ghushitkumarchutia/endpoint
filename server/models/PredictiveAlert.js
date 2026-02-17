const mongoose = require("mongoose");

const predictiveAlertSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  failureProbability: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  predictedFailureTime: {
    type: Date,
    default: null,
  },
  earlyWarningSignals: [
    {
      signal: { type: String, required: true },
      severity: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium",
      },
      value: { type: mongoose.Schema.Types.Mixed },
      threshold: { type: mongoose.Schema.Types.Mixed },
      detectedAt: { type: Date, default: Date.now },
    },
  ],
  aiPrediction: {
    type: String,
    default: null,
  },
  recommendedActions: [
    {
      action: { type: String, required: true },
      priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium",
      },
      estimatedImpact: { type: String, default: null },
    },
  ],
  status: {
    type: String,
    enum: ["active", "acknowledged", "mitigated", "expired", "false_alarm"],
    default: "active",
  },
  expiresAt: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    },
  },
});

predictiveAlertSchema.index({ apiId: 1, createdAt: -1 });
predictiveAlertSchema.index({ userId: 1, status: 1 });
predictiveAlertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PredictiveAlert", predictiveAlertSchema);
