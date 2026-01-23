import { useState, useEffect } from "react";
import { TrendingDown, Filter, AlertTriangle, Check, X } from "lucide-react";
import useRegressions from "../hooks/useRegressions";
import RegressionAlert from "../components/regression/RegressionAlert";
import StatComparison from "../components/regression/StatComparison";
import RegressionChart from "../components/charts/RegressionChart";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { REGRESSION_STATUS } from "../utils/constants";

const Regressions = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [metricFilter, setMetricFilter] = useState("all");
  const [selectedRegression, setSelectedRegression] = useState(null);

  const { dashboard, loading, error, fetchDashboard, updateStatus } =
    useRegressions();

  useEffect(() => {
    fetchDashboard();
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

  if (loading && !dashboard) {
    return (
      <div className='flex items-center justify-center h-64'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Regression Detection</h1>
          <p className='text-muted-foreground'>
            Track performance regressions across your APIs
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-destructive/10 rounded-lg'>
              <TrendingDown className='h-5 w-5 text-destructive' />
            </div>
            <div>
              <p className='text-2xl font-bold'>
                {dashboard?.stats?.total || 0}
              </p>
              <p className='text-sm text-muted-foreground'>Total Regressions</p>
            </div>
          </div>
        </div>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-amber-500/10 rounded-lg'>
              <AlertTriangle className='h-5 w-5 text-amber-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>
                {dashboard?.stats?.active || 0}
              </p>
              <p className='text-sm text-muted-foreground'>Active</p>
            </div>
          </div>
        </div>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-500/10 rounded-lg'>
              <Check className='h-5 w-5 text-blue-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>
                {dashboard?.stats?.investigating || 0}
              </p>
              <p className='text-sm text-muted-foreground'>Investigating</p>
            </div>
          </div>
        </div>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-green-500/10 rounded-lg'>
              <Check className='h-5 w-5 text-green-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>
                {dashboard?.stats?.resolved || 0}
              </p>
              <p className='text-sm text-muted-foreground'>Resolved</p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Filter className='h-4 w-4 text-muted-foreground' />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='px-3 py-2 bg-muted border border-border rounded-lg text-sm'
          >
            <option value='all'>All Status</option>
            {Object.values(REGRESSION_STATUS).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <select
          value={metricFilter}
          onChange={(e) => setMetricFilter(e.target.value)}
          className='px-3 py-2 bg-muted border border-border rounded-lg text-sm'
        >
          <option value='all'>All Metrics</option>
          <option value='latency'>Latency</option>
          <option value='error_rate'>Error Rate</option>
          <option value='throughput'>Throughput</option>
        </select>
      </div>

      {error && (
        <div className='p-4 bg-destructive/10 text-destructive rounded-lg'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-4'>
          <h3 className='font-semibold'>Detected Regressions</h3>
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
            <div className='text-center py-8 text-muted-foreground bg-card border border-border rounded-xl'>
              No regressions found
            </div>
          )}
        </div>

        <div className='space-y-4'>
          {selectedRegression ? (
            <>
              <h3 className='font-semibold'>Regression Details</h3>
              <div className='bg-card border border-border rounded-xl p-4 space-y-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>API</p>
                  <p className='font-medium'>{selectedRegression.apiName}</p>
                </div>
                <StatComparison
                  label='Value Change'
                  baseline={selectedRegression.baselineValue}
                  current={selectedRegression.currentValue}
                  unit={selectedRegression.metric === "latency" ? "ms" : "%"}
                />
                <div className='pt-4 border-t border-border'>
                  <p className='text-sm text-muted-foreground mb-2'>
                    Metric Trend
                  </p>
                  <div className='h-40'>
                    <RegressionChart data={selectedRegression.history || []} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className='bg-card border border-border rounded-xl p-6 text-center'>
              <p className='text-muted-foreground'>
                Select a regression to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Regressions;
