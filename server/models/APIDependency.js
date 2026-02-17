const mongoose = require("mongoose");

const apiDependencySchema = new mongoose.Schema({
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
  dependsOn: [
    {
      apiId: { type: mongoose.Schema.Types.ObjectId, ref: "Api" },
      apiName: { type: String },
      relationship: {
        type: String,
        enum: ["calls", "auth_depends", "data_depends", "sequential"],
        default: "calls",
      },
      isRequired: { type: Boolean, default: true },
    },
  ],
  dependents: [
    {
      apiId: { type: mongoose.Schema.Types.ObjectId, ref: "Api" },
      apiName: { type: String },
      relationship: {
        type: String,
        enum: ["calls", "auth_depends", "data_depends", "sequential"],
        default: "calls",
      },
    },
  ],
  criticalPath: {
    isCritical: { type: Boolean, default: false },
    impactScore: { type: Number, min: 0, max: 100, default: 0 },
    affectedServices: { type: Number, default: 0 },
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  autoDetected: {
    type: Boolean,
    default: false,
  },
});

apiDependencySchema.index({ apiId: 1 }, { unique: true });
apiDependencySchema.index({ userId: 1 });
apiDependencySchema.index({ "dependsOn.apiId": 1 });
apiDependencySchema.index({ "dependents.apiId": 1 });

module.exports = mongoose.model("APIDependency", apiDependencySchema);
