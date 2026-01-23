import { useState, useCallback } from "react";
import slaService from "../services/slaService";

const useSLA = () => {
  const [dashboard, setDashboard] = useState(null);
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await slaService.getDashboard();
      setDashboard(data.data || null);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch SLA dashboard";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateReport = useCallback(async (apiId, periodType = "daily") => {
    if (!apiId) {
      throw new Error("API ID is required");
    }
    setLoading(true);
    setError(null);
    try {
      const data = await slaService.generateReport(apiId, periodType);
      setCurrentReport(data.data || null);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to generate report";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReports = useCallback(async (apiId, params = {}) => {
    if (!apiId) {
      setError("API ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await slaService.getReports(apiId, params);
      setReports(data.data?.reports || []);
      return data;
    } catch (err) {
      const msg =
        err.message || err.response?.data?.message || "Failed to fetch reports";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReportById = useCallback(async (reportId) => {
    if (!reportId) {
      setError("Report ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await slaService.getReportById(reportId);
      setCurrentReport(data.data || null);
      return data;
    } catch (err) {
      const msg =
        err.message || err.response?.data?.message || "Failed to fetch report";
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
      const data = await slaService.updateConfig(apiId, config);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to update SLA config";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateAllReports = useCallback(async (periodType = "daily") => {
    setLoading(true);
    setError(null);
    try {
      const data = await slaService.generateAllReports(periodType);
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to generate reports";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    dashboard,
    reports,
    currentReport,
    loading,
    error,
    fetchDashboard,
    generateReport,
    fetchReports,
    fetchReportById,
    updateConfig,
    generateAllReports,
  };
};

export default useSLA;
