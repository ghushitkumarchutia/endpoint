import api from "./api";

const insightsService = {
  getRootCauseByApi: async (apiId, limit = 20) => {
    const response = await api.get(`/insights/root-cause/api/${apiId}`, {
      params: { limit },
    });
    return response.data;
  },

  getRootCauseById: async (analysisId) => {
    const response = await api.get(`/insights/root-cause/${analysisId}`);
    return response.data;
  },

  getPredictiveAlerts: async (params = {}) => {
    const response = await api.get("/insights/predictive", { params });
    return response.data;
  },

  getPredictiveAlertById: async (alertId) => {
    const response = await api.get(`/insights/predictive/${alertId}`);
    return response.data;
  },

  updateAlertStatus: async (alertId, status) => {
    const response = await api.patch(`/insights/predictive/${alertId}/status`, {
      status,
    });
    return response.data;
  },
};

export default insightsService;
