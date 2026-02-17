const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  anomalyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Anomaly",
    default: null,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "anomaly",
      "sla_breach",
      "cost_alert",
      "predictive_alert",
      "contract_violation",
      "performance_regression",
      "system",
    ],
    default: "anomaly",
  },
  metadata: {
    apiId: { type: mongoose.Schema.Types.ObjectId, ref: "Api", default: null },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    actionUrl: { type: String, default: null },
    data: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
