import api from "./api";

const costService = {
  getDashboard: async (params = {}) => {
    // Add cache buster to prevent browser caching of stale config
    const safeParams = { ...params, _t: new Date().getTime() };
    const response = await api.get("/costs/dashboard", { params: safeParams });
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

  updateGlobalConfig: async (config) => {
    const response = await api.put("/costs/config", config);
    return response.data;
  },
};

export default costService;
