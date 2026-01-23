import { useState, useCallback } from "react";
import dependencyService from "../services/dependencyService";

const useDependencies = () => {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [suggestions, setSuggestions] = useState([]);
  const [apiDependencies, setApiDependencies] = useState(null);
  const [impactAnalysis, setImpactAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dependencyService.getGraph();
      setGraph(data.data || { nodes: [], edges: [] });
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch dependency graph";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const detectDependencies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dependencyService.detectDependencies();
      setSuggestions(data.data?.suggestions || []);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to detect dependencies";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApiDependencies = useCallback(async (apiId) => {
    if (!apiId) {
      setError("API ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await dependencyService.getApiDependencies(apiId);
      setApiDependencies(data.data || null);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch API dependencies";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addDependency = useCallback(async (apiId, dependencyData) => {
    if (!apiId || !dependencyData) {
      throw new Error("API ID and dependency data are required");
    }
    setLoading(true);
    setError(null);
    try {
      const data = await dependencyService.addDependency(apiId, dependencyData);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to add dependency";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeDependency = useCallback(async (apiId, dependsOnApiId) => {
    if (!apiId || !dependsOnApiId) {
      throw new Error("Both API IDs are required");
    }
    setLoading(true);
    setError(null);
    try {
      const data = await dependencyService.removeDependency(
        apiId,
        dependsOnApiId,
      );
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to remove dependency";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchImpactAnalysis = useCallback(async (apiId) => {
    if (!apiId) {
      setError("API ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await dependencyService.getImpactAnalysis(apiId);
      setImpactAnalysis(data.data || null);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch impact analysis";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    graph,
    suggestions,
    apiDependencies,
    impactAnalysis,
    loading,
    error,
    fetchGraph,
    detectDependencies,
    fetchApiDependencies,
    addDependency,
    removeDependency,
    fetchImpactAnalysis,
  };
};

export default useDependencies;
