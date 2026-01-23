import { useState, useCallback } from "react";
import insightsService from "../services/insightsService";

const useInsights = () => {
  const [rootCauses, setRootCauses] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRootCauseByApi = useCallback(async (apiId, limit = 20) => {
    if (!apiId) {
      setError("API ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await insightsService.getRootCauseByApi(apiId, limit);
      setRootCauses(data.data?.analyses || []);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch root causes";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRootCauseById = useCallback(async (analysisId) => {
    if (!analysisId) {
      setError("Analysis ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await insightsService.getRootCauseById(analysisId);
      setCurrentAnalysis(data.data || null);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch analysis";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPredictiveAlerts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await insightsService.getPredictiveAlerts(params);
      setAlerts(data.data?.alerts || []);
      setSummary(data.data?.summary || null);
      return data;
    } catch (err) {
      const msg =
        err.message || err.response?.data?.message || "Failed to fetch alerts";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPredictiveAlertById = useCallback(async (alertId) => {
    if (!alertId) {
      setError("Alert ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await insightsService.getPredictiveAlertById(alertId);
      setCurrentAlert(data.data || null);
      return data;
    } catch (err) {
      const msg =
        err.message || err.response?.data?.message || "Failed to fetch alert";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAlertStatus = useCallback(
    async (alertId, status) => {
      if (!alertId || !status) {
        throw new Error("Alert ID and status are required");
      }
      setLoading(true);
      setError(null);
      try {
        const data = await insightsService.updateAlertStatus(alertId, status);
        setAlerts((prev) =>
          prev.map((a) => (a._id === alertId ? { ...a, status } : a)),
        );
        if (currentAlert?._id === alertId) {
          setCurrentAlert((prev) => ({ ...prev, status }));
        }
        return data;
      } catch (err) {
        const msg =
          err.message ||
          err.response?.data?.message ||
          "Failed to update alert status";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentAlert],
  );

  return {
    rootCauses,
    currentAnalysis,
    alerts,
    currentAlert,
    summary,
    loading,
    error,
    fetchRootCauseByApi,
    fetchRootCauseById,
    fetchPredictiveAlerts,
    fetchPredictiveAlertById,
    updateAlertStatus,
  };
};

export default useInsights;
