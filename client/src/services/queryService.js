import api from "./api";

const queryService = {
  executeQuery: async (query) => {
    const response = await api.post("/query", { query });
    return response.data;
  },

  getHistory: async (limit = 20) => {
    const response = await api.get("/query/history", { params: { limit } });
    return response.data;
  },

  getSuggestions: async () => {
    const response = await api.get("/query/suggestions");
    return response.data;
  },

  submitFeedback: async (queryId, wasHelpful) => {
    const response = await api.patch(`/query/${queryId}/feedback`, {
      wasHelpful,
    });
    return response.data;
  },
};

export default queryService;
