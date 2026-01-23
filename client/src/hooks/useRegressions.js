import { useState, useCallback } from "react";
import regressionService from "../services/regressionService";

const useRegressions = () => {
  const [dashboard, setDashboard] = useState(null);
  const [regressions, setRegressions] = useState([]);
  const [currentRegression, setCurrentRegression] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await regressionService.getDashboard(params);
      setDashboard(data.data || null);
      setRegressions(data.data?.regressions || []);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch regressions";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApiRegressions = useCallback(async (apiId, days = 30) => {
    if (!apiId) {
      setError("API ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await regressionService.getApiRegressions(apiId, days);
      setRegressions(data.data?.regressions || []);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch API regressions";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (regressionId) => {
    if (!regressionId) {
      setError("Regression ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await regressionService.getById(regressionId);
      setCurrentRegression(data.data || null);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch regression";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(
    async (regressionId, status) => {
      if (!regressionId || !status) {
        throw new Error("Regression ID and status are required");
      }
      setLoading(true);
      setError(null);
      try {
        const data = await regressionService.updateStatus(regressionId, status);
        setRegressions((prev) =>
          prev.map((r) => (r._id === regressionId ? { ...r, status } : r)),
        );
        if (currentRegression?._id === regressionId) {
          setCurrentRegression((prev) => ({ ...prev, status }));
        }
        return data;
      } catch (err) {
        const msg =
          err.message ||
          err.response?.data?.message ||
          "Failed to update status";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentRegression],
  );

  return {
    dashboard,
    regressions,
    currentRegression,
    loading,
    error,
    fetchDashboard,
    fetchApiRegressions,
    fetchById,
    updateStatus,
  };
};

export default useRegressions;
