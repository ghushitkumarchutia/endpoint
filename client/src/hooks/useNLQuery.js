import { useState, useCallback } from "react";
import queryService from "../services/queryService";

const useNLQuery = () => {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeQuery = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await queryService.executeQuery(query);
      setResult(data.data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to execute query");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const data = await queryService.getHistory(limit);
      setHistory(data.data || []);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch history");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await queryService.getSuggestions();
      setSuggestions(data.data.suggestions || []);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch suggestions");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitFeedback = useCallback(async (queryId, wasHelpful) => {
    try {
      const data = await queryService.submitFeedback(queryId, wasHelpful);
      setHistory((prev) =>
        prev.map((q) => (q._id === queryId ? { ...q, wasHelpful } : q)),
      );
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback");
      throw err;
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    result,
    history,
    suggestions,
    loading,
    error,
    executeQuery,
    fetchHistory,
    fetchSuggestions,
    submitFeedback,
    clearResult,
  };
};

export default useNLQuery;
