import { useState, useCallback } from "react";
import contractService from "../services/contractService";

const useContracts = () => {
  const [violations, setViolations] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchViolations = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getViolations(params);
      setViolations(data.data.violations);
      setPagination(data.data.pagination);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch violations");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApiViolations = useCallback(async (apiId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getApiViolations(apiId);
      setViolations(data.data.violations || []);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch API violations");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async (apiId, days = 7) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getStats(apiId, days);
      setStats(data.data.stats);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stats");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (apiId, config) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.updateConfig(apiId, config);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update config");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const acknowledgeViolation = useCallback(async (violationId) => {
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
      setError(err.response?.data?.message || "Failed to acknowledge");
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
