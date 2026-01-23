const mongoose = require("mongoose");

const contractViolationSchema = new mongoose.Schema({
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
  violations: [
    {
      type: {
        type: String,
        enum: [
          "MISSING_FIELD",
          "TYPE_MISMATCH",
          "STATUS_MISMATCH",
          "RESPONSE_TIME_BREACH",
        ],
        required: true,
      },
      field: { type: String, default: null },
      expected: { type: mongoose.Schema.Types.Mixed, default: null },
      actual: { type: mongoose.Schema.Types.Mixed, default: null },
      severity: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium",
      },
    },
  ],
  aiExplanation: {
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

contractViolationSchema.index({ apiId: 1, createdAt: -1 });
contractViolationSchema.index({ acknowledged: 1 });

module.exports = mongoose.model("ContractViolation", contractViolationSchema);
