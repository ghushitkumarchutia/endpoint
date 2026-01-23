const mongoose = require("mongoose");
const crypto = require("crypto");

const webhookEndpointSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return crypto.randomBytes(16).toString("hex");
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    default: null,
    maxlength: 500,
  },
  receivedPayloads: [
    {
      receivedAt: { type: Date, default: Date.now },
      method: { type: String, default: "POST" },
      headers: { type: Map, of: String },
      body: { type: mongoose.Schema.Types.Mixed },
      queryParams: { type: Map, of: String },
      sourceIp: { type: String, default: null },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    },
  },
  maxPayloads: {
    type: Number,
    default: 100,
    min: 1,
    max: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

webhookEndpointSchema.index({ userId: 1, createdAt: -1 });
webhookEndpointSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

webhookEndpointSchema.methods.addPayload = function (payload) {
  if (this.receivedPayloads.length >= this.maxPayloads) {
    this.receivedPayloads.shift();
  }
  this.receivedPayloads.push(payload);
  return this.save();
};

module.exports = mongoose.model("WebhookEndpoint", webhookEndpointSchema);
