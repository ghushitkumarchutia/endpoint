import { useState, useEffect } from "react";
import { FileText, Settings, MoreVertical } from "lucide-react";
import useSLA from "../hooks/useSLA";
import SLADashboard from "../components/sla/SLADashboard";
import SLAHistory from "../components/sla/SLAHistory";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

// Define locally since not in constants.js
const SLA_PERIOD_TYPES = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
};

const SLATracking = () => {
  const [period, setPeriod] = useState(SLA_PERIOD_TYPES.MONTHLY);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({
    uptimeTarget: 99.9,
    latencyTarget: 500,
    errorRateTarget: 1,
  });

  const {
    dashboard,
    reports,
    loading,
    error,
    fetchDashboard,
    fetchReports,
    generateReport,
    updateConfig,
  } = useSLA();

  useEffect(() => {
    fetchDashboard(period);
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  useEffect(() => {
    if (dashboard?.config) {
      setConfig(dashboard.config);
    }
  }, [dashboard]);

  const handleGenerateReport = async () => {
    try {
      await generateReport(period);
      toast.success("Report generated");
      fetchReports();
    } catch {
      toast.error("Failed to generate report");
    }
  };

  const handleConfigSave = async () => {
    try {
      await updateConfig(config);
      toast.success("SLA targets updated");
      setShowConfig(false);
      fetchDashboard(period);
    } catch {
      toast.error("Failed to save configuration");
    }
  };

  // Suppress "Request cancelled" error
  const displayError = error === "Request cancelled" ? null : error;

  if (loading && !dashboard) {
    return (
      <div className='flex items-center justify-center h-full bg-[#f5f5f6] rounded-3xl'>
        <Loader size='lg' />
      </div>
    );
  }

  return (
    <div className='flex flex-col px-4 py-[20px] md:px-6 md:py-[22px] bg-[#f5f5f6] rounded-3xl h-full overflow-y-auto custom-scrollbar'>
      <div className='flex items-center justify-between mb-8 shrink-0'>
        <div>
          <h1 className='text-2xl font-bold font-dmsans text-gray-900'>
            SLA Tracking
          </h1>
          <p className='text-sm text-gray-500 mt-1 font-medium font-bricolage'>
            Monitor service level agreements and compliance
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='bg-white border border-gray-200/60 rounded-xl px-4 py-2 shadow-sm'>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className='bg-transparent border-none text-sm text-gray-700 font-medium focus:outline-none cursor-pointer'
            >
              {Object.values(SLA_PERIOD_TYPES).map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateReport}
            className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-200/60 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm'
          >
            <FileText className='h-4 w-4' />
            Generate Report
          </button>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`p-2 rounded-xl transition-all shadow-sm border ${showConfig ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-white text-gray-500 border-gray-200/60 hover:text-gray-900 hover:border-gray-300"}`}
          >
            <Settings className='h-5 w-5' />
          </button>
        </div>
      </div>

      {showConfig && (
        <div className='p-6 bg-white border border-gray-200/60 rounded-[20px] shadow-sm mb-6 animate-fade-in'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-bold text-gray-900 font-dmsans'>
              Global SLA Configuration
            </h3>
            <button
              onClick={() => setShowConfig(false)}
              className='text-gray-400 hover:text-gray-600'
            >
              <MoreVertical className='h-4 w-4' />
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2'>
                Uptime Target (%)
              </label>
              <div className='relative'>
                <input
                  type='number'
                  step='0.1'
                  value={config.uptimeTarget}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      uptimeTarget: Number(e.target.value),
                    })
                  }
                  className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-gray-900'
                />
              </div>
            </div>
            <div>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2'>
                Latency Target (ms)
              </label>
              <div className='relative'>
                <input
                  type='number'
                  value={config.latencyTarget}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      latencyTarget: Number(e.target.value),
                    })
                  }
                  className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-gray-900'
                />
              </div>
            </div>
            <div>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2'>
                Error Rate Target (%)
              </label>
              <div className='relative'>
                <input
                  type='number'
                  step='0.1'
                  value={config.errorRateTarget}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      errorRateTarget: Number(e.target.value),
                    })
                  }
                  className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-gray-900'
                />
              </div>
            </div>
          </div>
          <div className='flex justify-end gap-3 mt-6'>
            <button
              onClick={() => setShowConfig(false)}
              className='px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={handleConfigSave}
              className='px-5 py-2.5 text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 rounded-xl transition-all shadow-lg shadow-gray-900/10'
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {displayError && (
        <div className='p-4 bg-red-50 text-red-600 rounded-2xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-3'>
          {displayError}
        </div>
      )}

      <div className='space-y-8'>
        <SLADashboard data={dashboard} />

        <div className='bg-white border border-gray-200/60 rounded-[24px] p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='font-bold text-gray-900 font-dmsans text-lg'>
              Report History
            </h3>
            <button
              onClick={fetchReports}
              className='text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors'
            >
              Refresh List
            </button>
          </div>
          <SLAHistory reports={reports || []} />
        </div>
      </div>
    </div>
  );
};

export default SLATracking;
