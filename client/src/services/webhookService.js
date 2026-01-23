import api from "./api";

const webhookService = {
  create: async (data) => {
    const response = await api.post("/webhooks", data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/webhooks");
    return response.data;
  },

  getByUniqueId: async (uniqueId) => {
    const response = await api.get(`/webhooks/${uniqueId}`);
    return response.data;
  },

  getPayload: async (uniqueId, index) => {
    const response = await api.get(`/webhooks/${uniqueId}/payload/${index}`);
    return response.data;
  },

  toggle: async (uniqueId, isActive) => {
    const response = await api.patch(`/webhooks/${uniqueId}/toggle`, {
      isActive,
    });
    return response.data;
  },

  clearPayloads: async (uniqueId) => {
    const response = await api.delete(`/webhooks/${uniqueId}/payloads`);
    return response.data;
  },

  deleteWebhook: async (uniqueId) => {
    const response = await api.delete(`/webhooks/${uniqueId}`);
    return response.data;
  },
};

export default webhookService;
