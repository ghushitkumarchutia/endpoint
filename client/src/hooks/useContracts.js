import { useState, useCallback } from "react";
import contractService from "../services/contractService";

const useContracts = () => {
  const [violations, setViolations] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchViolations = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getViolations(params);
      setViolations(data.data?.violations || []);
      setPagination(data.data?.pagination || null);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch violations";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApiViolations = useCallback(async (apiId) => {
    if (!apiId) {
      setError("API ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getApiViolations(apiId);
      setViolations(data.data?.violations || []);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch API violations";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async (apiId, days = 7) => {
    if (!apiId) {
      setError("API ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getStats(apiId, days);
      setStats(data.data?.stats || null);
      return data;
    } catch (err) {
      const msg =
        err.message || err.response?.data?.message || "Failed to fetch stats";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (apiId, config) => {
    if (!apiId || !config) {
      throw new Error("API ID and config are required");
    }
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.updateConfig(apiId, config);
      return data;
    } catch (err) {
      const msg =
        err.message || err.response?.data?.message || "Failed to update config";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const acknowledgeViolation = useCallback(async (violationId) => {
    if (!violationId) {
      throw new Error("Violation ID is required");
    }
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.acknowledgeViolation(violationId);
      setViolations((prev) =>
        prev.map((v) =>
          v._id === violationId ? { ...v, acknowledged: true } : v,
        ),
      );
      return data;
    } catch (err) {
      const msg =
        err.message || err.response?.data?.message || "Failed to acknowledge";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    violations,
    stats,
    pagination,
    loading,
    error,
    fetchViolations,
    fetchApiViolations,
    fetchStats,
    updateConfig,
    acknowledgeViolation,
  };
};

export default useContracts;
