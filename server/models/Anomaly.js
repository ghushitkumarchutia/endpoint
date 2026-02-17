const mongoose = require("mongoose");

const anomalySchema = new mongoose.Schema({
  apiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Api",
    required: true,
  },
  checkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Check",
    required: true,
  },
  type: {
    type: String,
    enum: ["response_time_spike", "error_spike", "schema_drift", "downtime"],
    required: true,
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  currentValue: {
    type: Number,
    default: null,
  },
  expectedValue: {
    type: Number,
    default: null,
  },
  aiInsight: {
    type: String,
    default: null,
  },
  acknowledged: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

anomalySchema.index({ apiId: 1, createdAt: -1 });
anomalySchema.index({ acknowledged: 1 });

module.exports = mongoose.model("Anomaly", anomalySchema);
