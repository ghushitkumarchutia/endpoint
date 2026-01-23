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
    setLoading(true);
    setError(null);
    try {
      const data = await insightsService.getRootCauseByApi(apiId, limit);
      setRootCauses(data.data.analyses || []);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch root causes");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRootCauseById = useCallback(async (analysisId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await insightsService.getRootCauseById(analysisId);
      setCurrentAnalysis(data.data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch analysis");
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
      setAlerts(data.data.alerts || []);
      setSummary(data.data.summary || null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch alerts");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPredictiveAlertById = useCallback(async (alertId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await insightsService.getPredictiveAlertById(alertId);
      setCurrentAlert(data.data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch alert");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAlertStatus = useCallback(
    async (alertId, status) => {
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
        setError(
          err.response?.data?.message || "Failed to update alert status",
        );
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
