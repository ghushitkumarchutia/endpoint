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

  getById: async (id) => {
    const response = await api.get(`/webhooks/${id}`);
    return response.data;
  },

  getPayload: async (id, index) => {
    const response = await api.get(`/webhooks/${id}/payload/${index}`);
    return response.data;
  },

  toggle: async (id, isActive) => {
    const response = await api.patch(`/webhooks/${id}/toggle`, {
      isActive,
    });
    return response.data;
  },

  clearPayloads: async (id) => {
    const response = await api.delete(`/webhooks/${id}/payloads`);
    return response.data;
  },

  deleteWebhook: async (id) => {
    const response = await api.delete(`/webhooks/${id}`);
    return response.data;
  },
};

export default webhookService;
