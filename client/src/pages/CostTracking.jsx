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
import StatsCard from "../components/dashboard/StatsCard";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

const CostTracking = () => {
  const { dashboard, loading, error, fetchDashboard, updateGlobalConfig } =
    useCosts();

  const [period, setPeriod] = useState("month");
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({
    budget: 0,
    alertThreshold: 80,
    currency: "USD",
  });

  const activeCurrency = showConfig
    ? config.currency
    : dashboard?.config?.currency || config.currency || "USD";

  const CURRENCY_SYMBOLS = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
  };
  const currencySymbol = CURRENCY_SYMBOLS[activeCurrency] || "$";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: activeCurrency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    fetchDashboard(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  useEffect(() => {
    if (dashboard?.config) {
      setConfig((prev) => ({
        ...prev,
        ...dashboard.config,
        currency: dashboard.config.currency || prev.currency || "USD",
      }));
    }
  }, [dashboard]);

  const handleConfigSave = async () => {
    try {
      const response = await updateGlobalConfig(config);
      toast.success("Configuration saved");

      if (response && response.data) {
        const newConfig = response.data;
        setConfig(newConfig);
      }

      setShowConfig(false);
      fetchDashboard(period);
    } catch {
      toast.error("Failed to save configuration");
    }
  };

  const displayError =
    error === "Network error" || error === "Request cancelled" ? null : error;

  const isInitializing = !dashboard && !error;

  if (isInitializing) {
    return (
      <div className='flex items-center justify-center h-full bg-[#f5f5f6] rounded-3xl'>
        <Loader size='lg' />
      </div>
    );
  }

  return (
    <div className='flex flex-col px-4 py-5 md:px-6 md:py-5.5 bg-[#f5f5f6] rounded-3xl h-full overflow-y-auto custom-scrollbar'>
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
              className='bg-transparent border-none text-sm text-gray-700 font-dmsans focus:outline-none cursor-pointer'
            >
              <option value='day'>Today</option>
              <option value='week'>This Week</option>
              <option value='month'>This Month</option>
              <option value='year'>This Year</option>
            </select>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`p-2 rounded-xl transition-all shadow-sm border cursor-pointer ${showConfig ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-white text-gray-500 border-gray-200/60 hover:text-gray-900 hover:border-gray-300"}`}
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
                Monthly Budget ({currencySymbol})
              </label>
              <div className='relative'>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={config.budget}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      budget: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-gray-900'
                  placeholder={`Enter budget in ${activeCurrency}`}
                />
              </div>
            </div>
            <div>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2'>
                Currency
              </label>
              <div className='relative'>
                <select
                  value={config.currency}
                  onChange={(e) =>
                    setConfig({ ...config, currency: e.target.value })
                  }
                  className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-gray-900 appearance-none'
                >
                  <option value='USD'>USD ($)</option>
                  <option value='INR'>INR (₹)</option>
                  <option value='EUR'>EUR (€)</option>
                  <option value='GBP'>GBP (£)</option>
                </select>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
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
              disabled={loading}
              className='text-sm font-bricolage hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 border border-gray-300 md:px-6 px-5 py-2.5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={handleConfigSave}
              disabled={loading}
              className='md:px-6 px-5 py-2.5 text-sm font-bricolage bg-[#14412B] hover:bg-[#1a5438] text-white rounded-full transition-all shadow-lg shadow-gray-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer'
            >
              {loading ? (
                <>
                  <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Stats 2×2 grid — matching layered gradient card design */}
      <div className='grid grid-cols-2 gap-6 mb-8 shrink-0'>
        {/* Total Cost — blue-indigo gradient */}
        <StatsCard
          title='TOTAL COST'
          value={formatCurrency(dashboard?.totalCost || 0)}
          icon={DollarSign}
          description={`This ${period}`}
          className='p-5 rounded-[24px] bg-gradient-to-br from-[#1e3a5f] via-[#1a2d6b] to-[#2d1b6b] text-white min-h-[160px]'
          iconClassName='p-2 bg-black/40 rounded-full text-white'
          titleClassName='text-[11px] font-bold tracking-[0.12em] uppercase font-dmsans text-white/70'
          valueClassName='text-3xl font-bold font-dmsans text-white'
          descriptionClassName='text-xs text-white/50 font-dmsans-light'
        />

        {/* Projected Cost — olive-green gradient */}
        <StatsCard
          title='PROJECTED COST'
          value={formatCurrency(dashboard?.projectedCost || 0)}
          icon={TrendingUp}
          description='End of period'
          className='p-5 rounded-[24px] bg-gradient-to-br from-[#2d3a1e] via-[#3a4a1a] to-[#4a5a12] text-white min-h-[160px]'
          iconClassName='p-2 bg-black/40 rounded-full text-white'
          titleClassName='text-[11px] font-bold tracking-[0.12em] uppercase font-dmsans text-white/70'
          valueClassName='text-3xl font-bold font-dmsans text-white'
          descriptionClassName='text-xs text-white/50 font-dmsans-light'
        />

        {/* Overages — teal-slate gradient */}
        <StatsCard
          title='OVERAGES'
          value={formatCurrency(dashboard?.overages || 0)}
          icon={AlertCircle}
          description={
            dashboard?.overages > 0 ? "Over budget" : "Within budget"
          }
          className='p-5 rounded-[24px] bg-gradient-to-br from-[#0d3040] via-[#0f3d4a] to-[#0e4a55] text-white min-h-[160px]'
          iconClassName='p-2 bg-black/40 rounded-full text-white'
          titleClassName='text-[11px] font-bold tracking-[0.12em] uppercase font-dmsans text-white/70'
          valueClassName='text-3xl font-bold font-dmsans text-white'
          descriptionClassName='text-xs text-white/50 font-dmsans-light'
        />

        {/* Budget — forest green gradient */}
        <StatsCard
          title='MONTHLY BUDGET'
          value={formatCurrency(dashboard?.config?.budget || 0)}
          icon={Wallet}
          description='Configured limit'
          className='p-5 rounded-[24px] bg-gradient-to-br from-[#1a3d2b] via-[#1e4d2f] to-[#265c2a] text-white min-h-[160px]'
          iconClassName='p-2 bg-black/40 rounded-full text-white'
          titleClassName='text-[11px] font-bold tracking-[0.12em] uppercase font-dmsans text-white/70'
          valueClassName='text-3xl font-bold font-dmsans text-white'
          descriptionClassName='text-xs text-white/50 font-dmsans-light'
        />
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
            currency={activeCurrency}
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
            currency={activeCurrency}
          />
        </div>
      </div>

      <div className='bg-white border border-gray-200/60 rounded-[20px] p-6 shadow-sm mt-6'>
        <h3 className='font-bold text-gray-900 font-dmsans text-lg mb-6'>
          Cost Breakdown by API
        </h3>
        <div className='h-80'>
          <CostBreakdownChart
            data={dashboard?.costByApi || []}
            currency={activeCurrency}
          />
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
                  {formatCurrency(api.cost || 0)}
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
