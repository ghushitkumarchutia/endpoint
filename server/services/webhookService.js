const WebhookEndpoint = require("../models/WebhookEndpoint");

const createEndpoint = async (
  userId,
  name,
  description = null,
  options = {},
) => {
  const { maxPayloads = 100, expiresInDays = 7 } = options;
  const endpoint = await WebhookEndpoint.create({
    userId,
    name,
    description,
    maxPayloads,
    expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
  });
  return {
    id: endpoint._id,
    uniqueId: endpoint.uniqueId,
    name: endpoint.name,
    url: generateWebhookUrl(endpoint.uniqueId),
    expiresAt: endpoint.expiresAt,
  };
};

const generateWebhookUrl = (uniqueId) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  return `${baseUrl}/api/webhooks/receive/${uniqueId}`;
};

const receivePayload = async (uniqueId, payload) => {
  const endpoint = await WebhookEndpoint.findOne({ uniqueId, isActive: true });
  if (!endpoint) {
    return { success: false, error: "Endpoint not found or inactive" };
  }
  if (endpoint.expiresAt < new Date()) {
    endpoint.isActive = false;
    await endpoint.save();
    return { success: false, error: "Endpoint has expired" };
  }
  await endpoint.addPayload(payload);
  return {
    success: true,
    message: "Payload received",
    endpointName: endpoint.name,
    totalPayloads: endpoint.receivedPayloads.length,
  };
};

const getEndpoints = async (userId) => {
  const endpoints = await WebhookEndpoint.find({ userId })
    .select(
      "uniqueId name description isActive expiresAt maxPayloads createdAt",
    )
    .sort({ createdAt: -1 })
    .lean();
  return endpoints.map((e) => ({
    ...e,
    url: generateWebhookUrl(e.uniqueId),
    payloadCount: 0,
  }));
};

const getEndpointWithPayloads = async (uniqueId, userId) => {
  const endpoint = await WebhookEndpoint.findOne({ uniqueId, userId }).lean();
  if (!endpoint) return null;
  return {
    ...endpoint,
    url: generateWebhookUrl(endpoint.uniqueId),
    payloads: endpoint.receivedPayloads.slice().reverse(),
  };
};

const deleteEndpoint = async (uniqueId, userId) => {
  const result = await WebhookEndpoint.deleteOne({ uniqueId, userId });
  return result.deletedCount > 0;
};

const clearPayloads = async (uniqueId, userId) => {
  const result = await WebhookEndpoint.updateOne(
    { uniqueId, userId },
    { $set: { receivedPayloads: [] } },
  );
  return result.modifiedCount > 0;
};

const toggleEndpoint = async (uniqueId, userId, isActive) => {
  return WebhookEndpoint.findOneAndUpdate(
    { uniqueId, userId },
    { isActive },
    { new: true },
  );
};

const getPayloadById = async (uniqueId, payloadIndex, userId) => {
  const endpoint = await WebhookEndpoint.findOne({ uniqueId, userId }).lean();
  if (!endpoint || !endpoint.receivedPayloads[payloadIndex]) {
    return null;
  }
  return endpoint.receivedPayloads[payloadIndex];
};

module.exports = {
  createEndpoint,
  receivePayload,
  getEndpoints,
  getEndpointWithPayloads,
  deleteEndpoint,
  clearPayloads,
  toggleEndpoint,
  getPayloadById,
  generateWebhookUrl,
};
