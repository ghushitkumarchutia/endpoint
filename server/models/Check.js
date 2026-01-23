const mongoose = require("mongoose");

const checkSchema = new mongoose.Schema({
  apiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Api",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  responseTime: {
    type: Number,
    required: true,
  },
  statusCode: {
    type: Number,
    default: null,
  },
  success: {
    type: Boolean,
    required: true,
  },
  responseBody: {
    type: Object,
    default: null,
  },
  responseSize: {
    type: Number,
    default: 0,
  },
  error: {
    type: String,
    default: null,
  },
  errorType: {
    type: String,
    enum: ["timeout", "network", "server", "client", null],
    default: null,
  },
  cost: {
    type: Number,
    default: 0,
  },
  tokensUsed: {
    input: { type: Number, default: 0 },
    output: { type: Number, default: 0 },
  },
});

checkSchema.index({ apiId: 1, timestamp: -1 });
checkSchema.index({ apiId: 1, success: 1 });
checkSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model("Check", checkSchema);
