import api from "./api";

const dependencyService = {
  getGraph: async () => {
    const response = await api.get("/dependencies/graph");
    return response.data;
  },

  detectDependencies: async () => {
    const response = await api.get("/dependencies/detect");
    return response.data;
  },

  getApiDependencies: async (apiId) => {
    const response = await api.get(`/dependencies/api/${apiId}`);
    return response.data;
  },

  addDependency: async (apiId, data) => {
    const response = await api.post(`/dependencies/api/${apiId}`, data);
    return response.data;
  },

  removeDependency: async (apiId, dependsOnApiId) => {
    const response = await api.delete(
      `/dependencies/api/${apiId}/${dependsOnApiId}`,
    );
    return response.data;
  },

  getImpactAnalysis: async (apiId) => {
    const response = await api.get(`/dependencies/api/${apiId}/impact`);
    return response.data;
  },
};

export default dependencyService;
