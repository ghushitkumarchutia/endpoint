import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  RefreshCw,
  Calendar,
  Settings,
} from "lucide-react";
import useSLA from "../hooks/useSLA";
import SLACard from "../components/sla/SLACard";
import SLADashboard from "../components/sla/SLADashboard";
import SLAHistory from "../components/sla/SLAHistory";
import SLABadge from "../components/sla/SLABadge";
import SLAGaugeChart from "../components/charts/SLAGaugeChart";
import SLAForm from "../components/forms/SLAForm";
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

  if (loading && !dashboard) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader size='lg' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>SLA Tracking</h1>
          <p className='text-muted-foreground'>
            Monitor service level agreements and compliance
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className='px-3 py-2 bg-muted border border-border rounded-lg text-sm'
          >
            {Object.values(SLA_PERIOD_TYPES).map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={handleGenerateReport}
            className='flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors'
          >
            <FileText className='h-4 w-4' />
            Generate Report
          </button>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className='p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors'
          >
            <Settings className='h-5 w-5' />
          </button>
        </div>
      </div>

      {showConfig && (
        <div className='p-4 bg-card border border-border rounded-xl space-y-4'>
          <h3 className='font-semibold'>SLA Targets</h3>
          <div className='grid grid-cols-3 gap-4'>
            <div>
              <label className='text-sm text-muted-foreground block mb-1'>
                Uptime Target (%)
              </label>
              <input
                type='number'
                step='0.1'
                value={config.uptimeTarget}
                onChange={(e) =>
                  setConfig({ ...config, uptimeTarget: Number(e.target.value) })
                }
                className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
              />
            </div>
            <div>
              <label className='text-sm text-muted-foreground block mb-1'>
                Latency Target (ms)
              </label>
              <input
                type='number'
                value={config.latencyTarget}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    latencyTarget: Number(e.target.value),
                  })
                }
                className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
              />
            </div>
            <div>
              <label className='text-sm text-muted-foreground block mb-1'>
                Error Rate Target (%)
              </label>
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
                className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
              />
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <button
              onClick={() => setShowConfig(false)}
              className='px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={handleConfigSave}
              className='px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors'
            >
              Save
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className='p-4 bg-destructive/10 text-destructive rounded-lg'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <SLACard
          title='Uptime'
          value={dashboard?.metrics?.uptime || 0}
          target={dashboard?.config?.uptimeTarget || 99.9}
          unit='%'
        />
        <SLACard
          title='Avg Latency'
          value={dashboard?.metrics?.avgLatency || 0}
          target={dashboard?.config?.latencyTarget || 500}
          unit='ms'
          inverse
        />
        <SLACard
          title='Error Rate'
          value={dashboard?.metrics?.errorRate || 0}
          target={dashboard?.config?.errorRateTarget || 1}
          unit='%'
          inverse
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-card border border-border rounded-xl p-4'>
          <h3 className='font-semibold mb-4'>SLA Compliance</h3>
          <div className='h-64 flex items-center justify-center'>
            <SLAGaugeChart
              compliance={{ overall: (dashboard?.compliance || 0) >= 100 }}
            />
          </div>
          <div className='text-center mt-2'>
            <p className='text-sm text-muted-foreground'>
              {dashboard?.compliance >= 100
                ? "All SLA targets met"
                : `${(100 - dashboard?.compliance).toFixed(1)}% below target`}
            </p>
          </div>
        </div>

        <div className='bg-card border border-border rounded-xl p-4'>
          <h3 className='font-semibold mb-4'>API Performance</h3>
          <div className='space-y-3 max-h-72 overflow-y-auto'>
            {dashboard?.apiMetrics?.map((api) => (
              <div
                key={api.apiId}
                className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'
              >
                <div>
                  <p className='font-medium'>{api.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {api.uptime?.toFixed(2)}% uptime · {api.avgLatency}ms
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    api.meetsSLA
                      ? "bg-green-500/10 text-green-500"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {api.meetsSLA ? "Meeting SLA" : "Below SLA"}
                </span>
              </div>
            )) || (
              <p className='text-center text-muted-foreground py-4'>
                No API metrics available
              </p>
            )}
          </div>
        </div>
      </div>

      <div className='bg-card border border-border rounded-xl p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-semibold'>Report History</h3>
          <button
            onClick={fetchReports}
            className='p-2 hover:bg-muted rounded-lg transition-colors'
          >
            <RefreshCw className='h-4 w-4' />
          </button>
        </div>
        <SLAHistory reports={reports || []} />
      </div>
    </div>
  );
};

export default SLATracking;
