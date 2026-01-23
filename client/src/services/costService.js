import api from "./api";

const costService = {
  getDashboard: async (params = {}) => {
    const response = await api.get("/costs/dashboard", { params });
    return response.data;
  },

  getRecords: async (params = {}) => {
    const response = await api.get("/costs/records", { params });
    return response.data;
  },

  getApiCosts: async (apiId) => {
    const response = await api.get(`/costs/api/${apiId}`);
    return response.data;
  },

  updateConfig: async (apiId, config) => {
    const response = await api.put(`/costs/api/${apiId}/config`, config);
    return response.data;
  },
};

export default costService;
