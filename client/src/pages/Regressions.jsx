import { useState, useEffect } from "react";
import {
  TrendingDown,
  Filter,
  AlertTriangle,
  Check,
  X,
  CheckCircle2,
} from "lucide-react";
import useRegressions from "../hooks/useRegressions";
import RegressionAlert from "../components/regression/RegressionAlert";
import RegressionDetail from "../components/regression/RegressionDetail";
import BaselineCard from "../components/regression/BaselineCard";
import StatComparison from "../components/regression/StatComparison";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

// Define locally since not in constants.js
const REGRESSION_STATUS = {
  ACTIVE: "active",
  INVESTIGATING: "investigating",
  RESOLVED: "resolved",
  FALSE_POSITIVE: "false_positive",
};

const Regressions = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [metricFilter, setMetricFilter] = useState("all");
  const [selectedRegression, setSelectedRegression] = useState(null);

  const { dashboard, loading, error, fetchDashboard, updateStatus } =
    useRegressions();

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusUpdate = async (regressionId, newStatus) => {
    try {
      await updateStatus(regressionId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchDashboard();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredRegressions = dashboard?.regressions?.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (metricFilter !== "all" && r.metric !== metricFilter) return false;
    return true;
  });

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
            Regression Detection
          </h1>
          <p className='text-sm text-gray-500 mt-1 font-medium font-bricolage'>
            Track performance regressions across your APIs
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-5 mb-8'>
        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <TrendingDown className='h-24 w-24 text-gray-400' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-gray-50 rounded-xl border border-gray-100/50'>
              <TrendingDown className='h-6 w-6 text-gray-600' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {dashboard?.stats?.total || 0}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Total
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <AlertTriangle className='h-24 w-24 text-amber-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-amber-50 rounded-xl border border-amber-100/50'>
              <AlertTriangle className='h-6 w-6 text-amber-500' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {dashboard?.stats?.active || 0}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Active
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <Check className='h-24 w-24 text-blue-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-blue-50 rounded-xl border border-blue-100/50'>
              <Check className='h-6 w-6 text-blue-500' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {dashboard?.stats?.investigating || 0}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Investigating
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <CheckCircle2 className='h-24 w-24 text-emerald-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-emerald-50 rounded-xl border border-emerald-100/50'>
              <CheckCircle2 className='h-6 w-6 text-emerald-500' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {dashboard?.stats?.resolved || 0}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Resolved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-4 mb-6'>
        <div className='flex items-center gap-3 bg-white border border-gray-200/60 rounded-xl px-4 py-2 shadow-sm'>
          <Filter className='h-4 w-4 text-gray-400' />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='bg-transparent border-none text-sm text-gray-700 font-medium focus:outline-none cursor-pointer'
          >
            <option value='all'>All Status</option>
            {Object.values(REGRESSION_STATUS).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className='flex items-center gap-3 bg-white border border-gray-200/60 rounded-xl px-4 py-2 shadow-sm'>
          <select
            value={metricFilter}
            onChange={(e) => setMetricFilter(e.target.value)}
            className='bg-transparent border-none text-sm text-gray-700 font-medium focus:outline-none cursor-pointer'
          >
            <option value='all'>All Metrics</option>
            <option value='latency'>Latency</option>
            <option value='error_rate'>Error Rate</option>
            <option value='throughput'>Throughput</option>
          </select>
        </div>
      </div>

      {displayError && (
        <div className='p-4 bg-red-50 text-red-600 rounded-2xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-3'>
          <AlertTriangle className='h-5 w-5 shrink-0' />
          {displayError}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8'>
        <div className='lg:col-span-2 space-y-5'>
          <h3 className='font-bold text-gray-900 font-dmsans text-lg'>
            Detected Regressions
          </h3>
          {filteredRegressions?.length > 0 ? (
            filteredRegressions.map((regression) => (
              <RegressionAlert
                key={regression._id}
                regression={regression}
                onStatusUpdate={handleStatusUpdate}
                onClick={() => setSelectedRegression(regression)}
                selected={selectedRegression?._id === regression._id}
              />
            ))
          ) : (
            <div className='flex flex-col items-center justify-center py-16 text-center bg-white border border-gray-200/60 rounded-[24px] shadow-sm border-dashed'>
              <div className='p-4 bg-gray-50 rounded-full mb-4'>
                <CheckCircle2 className='h-8 w-8 text-gray-300' />
              </div>
              <p className='font-bold text-gray-900 text-lg'>
                No regressions found
              </p>
              <p className='text-sm text-gray-500 mt-1 max-w-sm'>
                Everything is running smoothly. We haven't detected any
                performance regressions.
              </p>
            </div>
          )}
        </div>

        <div className='space-y-5'>
          {selectedRegression ? (
            <div className='sticky top-6 space-y-5 animate-fade-in'>
              <h3 className='font-bold text-gray-900 font-dmsans text-lg'>
                Regression Details
              </h3>
              <RegressionDetail regression={selectedRegression} />
              {selectedRegression.baseline && (
                <BaselineCard baseline={selectedRegression.baseline} />
              )}
            </div>
          ) : (
            <div className='sticky top-6 space-y-5'>
              <h3 className='font-bold text-transparent font-dmsans text-lg select-none'>
                Regression Details
              </h3>
              <div className='bg-white border border-gray-200/60 rounded-[24px] p-8 text-center shadow-sm'>
                <div className='p-4 bg-gray-50 rounded-full mb-4 w-fit mx-auto'>
                  <TrendingDown className='h-8 w-8 text-gray-300' />
                </div>
                <p className='text-gray-500 font-medium'>
                  Select a regression from the list to view detailed analysis
                  compared to baseline.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Regressions;
