import { useState, useEffect, useCallback } from "react";
import costService from "../services/costService";

const useCosts = (apiId = null) => {
  const [dashboard, setDashboard] = useState(null);
  const [records, setRecords] = useState([]);
  const [apiCosts, setApiCosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await costService.getDashboard(params);
      setDashboard(data.data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch cost dashboard");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecords = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await costService.getRecords(params);
      setRecords(data.data.records);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch cost records");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApiCosts = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await costService.getApiCosts(id);
      setApiCosts(data.data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch API costs");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (id, config) => {
    setLoading(true);
    setError(null);
    try {
      const data = await costService.updateConfig(id, config);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update cost config");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (apiId) {
      fetchApiCosts(apiId);
    }
  }, [apiId, fetchApiCosts]);

  return {
    dashboard,
    records,
    apiCosts,
    loading,
    error,
    fetchDashboard,
    fetchRecords,
    fetchApiCosts,
    updateConfig,
  };
};

export default useCosts;
