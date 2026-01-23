import { useState, useCallback } from "react";
import queryService from "../services/queryService";

const useNLQuery = () => {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeQuery = useCallback(async (query) => {
    if (!query || typeof query !== "string" || !query.trim()) {
      throw new Error("Query is required");
    }
    setLoading(true);
    setError(null);
    try {
      const data = await queryService.executeQuery(query.trim());
      setResult(data.data || null);
      return data;
    } catch (err) {
      const msg =
        err.message || err.response?.data?.message || "Failed to execute query";
      setError(msg);
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
      const msg =
        err.message || err.response?.data?.message || "Failed to fetch history";
      setError(msg);
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
      setSuggestions(data.data?.suggestions || []);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch suggestions";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitFeedback = useCallback(async (queryId, wasHelpful) => {
    if (!queryId) {
      throw new Error("Query ID is required");
    }
    try {
      const data = await queryService.submitFeedback(queryId, wasHelpful);
      setHistory((prev) =>
        prev.map((q) => (q._id === queryId ? { ...q, wasHelpful } : q)),
      );
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to submit feedback";
      setError(msg);
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
