const mongoose = require("mongoose");

const nlQueryLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  query: {
    type: String,
    required: true,
    maxlength: 500,
  },
  parsedIntent: {
    type: {
      type: String,
      enum: [
        "status_check",
        "performance_query",
        "error_analysis",
        "comparison",
        "trend_analysis",
        "list_apis",
        "cost_query",
        "sla_query",
        "unknown",
      ],
      default: "unknown",
    },
    entities: {
      apiNames: [{ type: String }],
      timeRange: {
        start: { type: Date },
        end: { type: Date },
        relative: { type: String },
      },
      metrics: [{ type: String }],
      filters: { type: Map, of: mongoose.Schema.Types.Mixed },
    },
    confidence: { type: Number, min: 0, max: 100, default: 0 },
  },
  response: {
    type: String,
    default: null,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  executionTime: {
    type: Number,
    default: 0,
  },
  wasHelpful: {
    type: Boolean,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

nlQueryLogSchema.index({ userId: 1, createdAt: -1 });
nlQueryLogSchema.index({ "parsedIntent.type": 1 });
nlQueryLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 },
);

module.exports = mongoose.model("NLQueryLog", nlQueryLogSchema);
