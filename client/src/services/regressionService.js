import api from "./api";

const regressionService = {
  getDashboard: async (params = {}) => {
    const response = await api.get("/regressions/dashboard", { params });
    return response.data;
  },

  getApiRegressions: async (apiId, days = 30) => {
    const response = await api.get(`/regressions/api/${apiId}`, {
      params: { days },
    });
    return response.data;
  },

  getById: async (regressionId) => {
    const response = await api.get(`/regressions/${regressionId}`);
    return response.data;
  },

  updateStatus: async (regressionId, status) => {
    const response = await api.patch(`/regressions/${regressionId}/status`, {
      status,
    });
    return response.data;
  },
};

export default regressionService;
