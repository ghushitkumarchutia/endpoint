import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Settings,
  MoreVertical,
  Wallet,
} from "lucide-react";
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

  // Suppress specific network errors
  const displayError =
    error === "Network error" || error === "Request cancelled" ? null : error;

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
            Cost Tracking
          </h1>
          <p className='text-sm text-gray-500 mt-1 font-medium font-bricolage'>
            Monitor and manage API costs
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='bg-white border border-gray-200/60 rounded-xl px-4 py-2 shadow-sm'>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className='bg-transparent border-none text-sm text-gray-700 font-medium focus:outline-none cursor-pointer'
            >
              <option value='day'>Today</option>
              <option value='week'>This Week</option>
              <option value='month'>This Month</option>
              <option value='year'>This Year</option>
            </select>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`p-2 rounded-xl transition-all shadow-sm border ${showConfig ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-white text-gray-500 border-gray-200/60 hover:text-gray-900 hover:border-gray-300"}`}
          >
            <Settings className='h-5 w-5' />
          </button>
        </div>
      </div>

      {displayError && (
        <div className='p-4 bg-red-50 text-red-600 rounded-2xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-3'>
          {displayError}
        </div>
      )}

      {showConfig && (
        <div className='p-6 bg-white border border-gray-200/60 rounded-[20px] shadow-sm mb-6 animate-fade-in'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-bold text-gray-900 font-dmsans'>
              Cost Configuration
            </h3>
            <button
              onClick={() => setShowConfig(false)}
              className='text-gray-400 hover:text-gray-600'
            >
              <MoreVertical className='h-4 w-4' />
            </button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2'>
                Monthly Budget ($)
              </label>
              <div className='relative'>
                <input
                  type='number'
                  value={config.budget}
                  onChange={(e) =>
                    setConfig({ ...config, budget: Number(e.target.value) })
                  }
                  className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-gray-900'
                />
              </div>
            </div>
            <div>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2'>
                Alert Threshold (%)
              </label>
              <div className='relative'>
                <input
                  type='number'
                  value={config.alertThreshold}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      alertThreshold: Number(e.target.value),
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

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 shrink-0'>
        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <Wallet className='h-24 w-24 text-blue-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-blue-50 rounded-xl border border-blue-100/50'>
              <DollarSign className='h-6 w-6 text-blue-500' />
            </div>
            <div>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Total Cost
              </p>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mt-1'>
                ${(dashboard?.totalCost || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <TrendingUp className='h-24 w-24 text-amber-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-amber-50 rounded-xl border border-amber-100/50'>
              <TrendingUp className='h-6 w-6 text-amber-500' />
            </div>
            <div>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Projected Cost
              </p>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mt-1'>
                ${(dashboard?.projectedCost || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <AlertCircle
              className={`h-24 w-24 ${dashboard?.overages > 0 ? "text-red-500" : "text-gray-300"}`}
            />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div
              className={`p-3 rounded-xl border ${dashboard?.overages > 0 ? "bg-red-50 border-red-100/50" : "bg-gray-50 border-gray-100"}`}
            >
              <AlertCircle
                className={`h-6 w-6 ${dashboard?.overages > 0 ? "text-red-500" : "text-gray-400"}`}
              />
            </div>
            <div>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Overages
              </p>
              <p
                className={`text-3xl font-bold font-dmsans leading-none mt-1 ${dashboard?.overages > 0 ? "text-red-600" : "text-gray-900"}`}
              >
                ${(dashboard?.overages || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white border border-gray-200/60 rounded-[20px] p-6 shadow-sm'>
          <h3 className='font-bold text-gray-900 font-dmsans text-lg mb-6'>
            Budget Usage
          </h3>
          <BudgetProgress
            used={dashboard?.totalCost || 0}
            total={dashboard?.config?.budget || 0}
            label='Monthly Budget'
          />
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-6 shadow-sm'>
          <h3 className='font-bold text-gray-900 font-dmsans text-lg mb-6'>
            Cost Projection
          </h3>
          <CostProjection
            currentCost={dashboard?.totalCost || 0}
            projectedCost={dashboard?.projectedCost || 0}
            trend={dashboard?.costTrend}
          />
        </div>
      </div>

      <div className='bg-white border border-gray-200/60 rounded-[20px] p-6 shadow-sm mt-6'>
        <h3 className='font-bold text-gray-900 font-dmsans text-lg mb-6'>
          Cost Breakdown by API
        </h3>
        <div className='h-80'>
          <CostBreakdownChart data={dashboard?.costByApi || []} />
        </div>
      </div>

      {dashboard?.topCostApis && dashboard.topCostApis.length > 0 && (
        <div className='bg-white border border-gray-200/60 rounded-[20px] p-6 shadow-sm mt-6'>
          <h3 className='font-bold text-gray-900 font-dmsans text-lg mb-6'>
            Top Cost APIs
          </h3>
          <div className='space-y-3'>
            {dashboard.topCostApis.map((api, index) => (
              <div
                key={api.apiId}
                className='flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-white hover:border-gray-200 transition-all'
              >
                <div className='flex items-center gap-4'>
                  <span className='w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-700 font-bold rounded-lg shadow-sm text-sm'>
                    {index + 1}
                  </span>
                  <div>
                    <p className='font-bold text-gray-900'>{api.name}</p>
                    <p className='text-xs font-medium text-gray-500'>
                      {api.requests} requests
                    </p>
                  </div>
                </div>
                <span className='font-bold text-gray-900 font-mono text-lg'>
                  ${api.cost?.toFixed(2) || "0.00"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='mt-6'>
        <OptimizationTips tips={dashboard?.optimizationTips} />
      </div>
    </div>
  );
};

export default CostTracking;
