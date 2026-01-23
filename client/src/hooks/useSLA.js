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
      setDashboard(data.data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch SLA dashboard");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateReport = useCallback(async (apiId, periodType = "daily") => {
    setLoading(true);
    setError(null);
    try {
      const data = await slaService.generateReport(apiId, periodType);
      setCurrentReport(data.data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate report");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReports = useCallback(async (apiId, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await slaService.getReports(apiId, params);
      setReports(data.data.reports || []);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reports");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReportById = useCallback(async (reportId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await slaService.getReportById(reportId);
      setCurrentReport(data.data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch report");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (apiId, config) => {
    setLoading(true);
    setError(null);
    try {
      const data = await slaService.updateConfig(apiId, config);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update SLA config");
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
      setError(err.response?.data?.message || "Failed to generate reports");
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
