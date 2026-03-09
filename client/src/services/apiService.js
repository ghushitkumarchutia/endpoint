import api from "./api";

const apiService = {
  getApis: async (params = {}) => {
    const response = await api.get("/apis", { params });
    return response.data;
  },

  getApi: async (id) => {
    const response = await api.get(`/apis/${id}`);
    return response.data;
  },

  createApi: async (apiData) => {
    const response = await api.post("/apis", apiData);
    return response.data;
  },

  updateApi: async (id, apiData) => {
    const response = await api.put(`/apis/${id}`, apiData);
    return response.data;
  },

  deleteApi: async (id) => {
    const response = await api.delete(`/apis/${id}`);
    return response.data;
  },

  toggleActive: async (id) => {
    const response = await api.patch(`/apis/${id}/toggle`);
    return response.data;
  },

  resetBaseline: async (id) => {
    const response = await api.patch(`/apis/${id}/reset-baseline`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/apis/categories");
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get("/apis/dashboard-stats");
    return response.data;
  },

  testApi: async (testData) => {
    const response = await api.post("/apis/test", testData);
    return response.data;
  },
};

export default apiService;
