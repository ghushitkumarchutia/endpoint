import api from "./api";

const analyticsService = {
  getChecks: async (id, params = {}) => {
    const response = await api.get(`/analytics/${id}/checks`, { params });
    return response.data;
  },

  getSummary: async (id) => {
    const response = await api.get(`/analytics/${id}/summary`);
    return response.data;
  },

  getAnomalies: async (id, params = {}) => {
    const response = await api.get(`/analytics/${id}/anomalies`, { params });
    return response.data;
  },

  getResponseTimeHistory: async (id, hours = 24) => {
    const response = await api.get(`/analytics/${id}/response-time-history`, {
      params: { hours },
    });
    return response.data;
  },

  clearChecks: async (id) => {
    const response = await api.delete(`/analytics/${id}/checks`);
    return response.data;
  },

  acknowledgeAnomaly: async (anomalyId) => {
    const response = await api.patch(
      `/analytics/anomalies/${anomalyId}/acknowledge`,
    );
    return response.data;
  },
};

export default analyticsService;
