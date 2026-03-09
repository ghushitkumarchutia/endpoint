import api from "./api";

const slaService = {
  getDashboard: async () => {
    const response = await api.get("/sla/dashboard");
    return response.data;
  },

  generateReport: async (apiId, periodType = "daily") => {
    const response = await api.post(`/sla/api/${apiId}/generate`, {
      periodType,
    });
    return response.data;
  },

  getReports: async (apiId, params = {}) => {
    const response = await api.get(`/sla/api/${apiId}/reports`, { params });
    return response.data;
  },

  getReportById: async (reportId) => {
    const response = await api.get(`/sla/reports/${reportId}`);
    return response.data;
  },

  updateConfig: async (apiId, config) => {
    const response = await api.put(`/sla/api/${apiId}/config`, config);
    return response.data;
  },

  generateAllReports: async (periodType = "daily") => {
    const response = await api.post("/sla/generate-all", { periodType });
    return response.data;
  },
};

export default slaService;
