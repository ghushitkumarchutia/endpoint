import api from "./api";

const contractService = {
  getViolations: async (params = {}) => {
    const response = await api.get("/contracts/violations", { params });
    return response.data;
  },

  getApiViolations: async (apiId) => {
    const response = await api.get(`/contracts/api/${apiId}/violations`);
    return response.data;
  },

  getStats: async (apiId, days = 7) => {
    const response = await api.get(`/contracts/api/${apiId}/stats`, {
      params: { days },
    });
    return response.data;
  },

  updateConfig: async (apiId, config) => {
    const response = await api.put(`/contracts/api/${apiId}/config`, config);
    return response.data;
  },

  acknowledgeViolation: async (violationId) => {
    const response = await api.patch(
      `/contracts/violations/${violationId}/acknowledge`,
    );
    return response.data;
  },
};

export default contractService;
