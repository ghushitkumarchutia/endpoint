const mongoose = require("mongoose");

const costRecordSchema = new mongoose.Schema({
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cost: {
    type: Number,
    required: true,
    min: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    tokensUsed: {
      input: { type: Number, default: 0 },
      output: { type: Number, default: 0 },
    },
    dataTransferredBytes: { type: Number, default: 0 },
    requestType: { type: String, default: null },
  },
});

costRecordSchema.index({ apiId: 1, timestamp: -1 });
costRecordSchema.index({ userId: 1, timestamp: -1 });
costRecordSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model("CostRecord", costRecordSchema);
