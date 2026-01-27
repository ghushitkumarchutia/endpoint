import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, AlertCircle, Settings } from "lucide-react";
import useCosts from "../hooks/useCosts";
import BudgetProgress from "../components/cost/BudgetProgress";
import CostProjection from "../components/cost/CostProjection";
import OptimizationTips from "../components/cost/OptimizationTips";
import CostBreakdownChart from "../components/charts/CostBreakdownChart";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

const CostTracking = () => {
  const [period, setPeriod] = useState("month");
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({ budget: 0, alertThreshold: 80 });

  const { dashboard, loading, error, fetchDashboard, updateConfig } =
    useCosts();

  useEffect(() => {
    fetchDashboard(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  // Sync config from dashboard when it loads
  useEffect(() => {
    if (dashboard?.config) {
       
      setConfig(dashboard.config);
    }
  }, [dashboard]);

  const handleConfigSave = async () => {
    try {
      await updateConfig(config);
      toast.success("Configuration saved");
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

  if (error) {
    return (
      <div className='p-4 bg-destructive/10 text-destructive rounded-lg'>
        {error}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Cost Tracking</h1>
          <p className='text-muted-foreground'>Monitor and manage API costs</p>
        </div>
        <div className='flex items-center gap-3'>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className='px-3 py-2 bg-muted border border-border rounded-lg text-sm'
          >
            <option value='day'>Today</option>
            <option value='week'>This Week</option>
            <option value='month'>This Month</option>
            <option value='year'>This Year</option>
          </select>
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
          <h3 className='font-semibold'>Cost Configuration</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-sm text-muted-foreground block mb-1'>
                Monthly Budget ($)
              </label>
              <input
                type='number'
                value={config.budget}
                onChange={(e) =>
                  setConfig({ ...config, budget: Number(e.target.value) })
                }
                className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
              />
            </div>
            <div>
              <label className='text-sm text-muted-foreground block mb-1'>
                Alert Threshold (%)
              </label>
              <input
                type='number'
                value={config.alertThreshold}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    alertThreshold: Number(e.target.value),
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

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-primary/10 rounded-lg'>
              <DollarSign className='h-5 w-5 text-primary' />
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Total Cost</p>
              <p className='text-2xl font-bold'>
                ${(dashboard?.totalCost || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-amber-500/10 rounded-lg'>
              <TrendingUp className='h-5 w-5 text-amber-500' />
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Projected Cost</p>
              <p className='text-2xl font-bold'>
                ${(dashboard?.projectedCost || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div
              className={`p-2 rounded-lg ${dashboard?.overages > 0 ? "bg-destructive/10" : "bg-muted"}`}
            >
              <AlertCircle
                className={`h-5 w-5 ${dashboard?.overages > 0 ? "text-destructive" : "text-muted-foreground"}`}
              />
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Overages</p>
              <p className='text-2xl font-bold'>
                ${(dashboard?.overages || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-card border border-border rounded-xl p-4'>
          <h3 className='font-semibold mb-4'>Budget Usage</h3>
          <BudgetProgress
            used={dashboard?.totalCost || 0}
            total={dashboard?.config?.budget || 0}
            label='Monthly Budget'
          />
        </div>

        <div className='bg-card border border-border rounded-xl p-4'>
          <h3 className='font-semibold mb-4'>Cost Projection</h3>
          <CostProjection
            currentCost={dashboard?.totalCost || 0}
            projectedCost={dashboard?.projectedCost || 0}
            trend={dashboard?.costTrend}
          />
        </div>
      </div>

      <div className='bg-card border border-border rounded-xl p-4'>
        <h3 className='font-semibold mb-4'>Cost Breakdown by API</h3>
        <div className='h-80'>
          <CostBreakdownChart data={dashboard?.costByApi || []} />
        </div>
      </div>

      {dashboard?.topCostApis && dashboard.topCostApis.length > 0 && (
        <div className='bg-card border border-border rounded-xl p-4'>
          <h3 className='font-semibold mb-4'>Top Cost APIs</h3>
          <div className='space-y-3'>
            {dashboard.topCostApis.map((api, index) => (
              <div
                key={api.apiId}
                className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'
              >
                <div className='flex items-center gap-3'>
                  <span className='w-6 h-6 flex items-center justify-center bg-primary/10 text-primary text-sm font-medium rounded'>
                    {index + 1}
                  </span>
                  <div>
                    <p className='font-medium'>{api.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {api.requests} requests
                    </p>
                  </div>
                </div>
                <span className='font-semibold'>
                  ${api.cost?.toFixed(2) || "0.00"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <OptimizationTips tips={dashboard?.optimizationTips} />
    </div>
  );
};

export default CostTracking;
