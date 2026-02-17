const mongoose = require("mongoose");

const apiSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "API name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
    default: "",
  },
  url: {
    type: String,
    required: [true, "API URL is required"],
    trim: true,
  },
  method: {
    type: String,
    enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    default: "GET",
  },
  headers: {
    type: Object,
    default: {},
  },
  body: {
    type: Object,
    default: null,
  },
  checkFrequency: {
    type: Number,
    default: 300000,
    validate: {
      validator: function (v) {
        return [60000, 300000, 900000, 1800000, 3600000].includes(v);
      },
      message: "Check frequency must be 1min, 5min, 15min, 30min, or 1hour",
    },
  },
  timeout: {
    type: Number,
    default: 30000,
    min: [5000, "Timeout must be at least 5 seconds"],
    max: [60000, "Timeout cannot exceed 60 seconds"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  baselineSchema: {
    type: Object,
    default: null,
  },
  expectedStatusCode: {
    type: Number,
    default: 200,
  },
  alertsEnabled: {
    type: Boolean,
    default: true,
  },
  lastChecked: {
    type: Date,
    default: null,
  },
  lastSuccessAt: {
    type: Date,
    default: null,
  },
  lastFailureAt: {
    type: Date,
    default: null,
  },
  consecutiveFailures: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    trim: true,
    default: "General",
  },
  tags: {
    type: [String],
    default: [],
  },
  costTracking: {
    enabled: { type: Boolean, default: false },
    costPerRequest: { type: Number, default: 0 },
    costPerToken: { type: Number, default: 0 },
    monthlyBudget: { type: Number, default: null },
    alertThreshold: { type: Number, default: 80 },
  },
  responseContract: {
    enabled: { type: Boolean, default: false },
    schema: { type: Object, default: null },
    strictMode: { type: Boolean, default: false },
    expectedResponseTime: { type: Number, default: null },
  },
  sla: {
    enabled: { type: Boolean, default: false },
    uptimeTarget: { type: Number, default: 99.9 },
    responseTimeP95: { type: Number, default: 500 },
    errorRateMax: { type: Number, default: 1 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

apiSchema.pre("save", function () {
  this.updatedAt = new Date();
});

apiSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: new Date() });
});

apiSchema.index({ userId: 1, isActive: 1 });
apiSchema.index({ lastChecked: 1 });
apiSchema.index({ category: 1 });
apiSchema.index({ tags: 1 });

module.exports = mongoose.model("Api", apiSchema);
