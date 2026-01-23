import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Pause, Play, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

import apiService from "../services/apiService";
import analyticsService from "../services/analyticsService";
import useFetch from "../hooks/useFetch";
import { ROUTES } from "../utils/constants";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ResponseTimeChart from "../components/charts/ResponseTimeChart";
import StatusPieChart from "../components/charts/StatusPieChart";
import AnomalyList from "../components/dashboard/AnomalyList";
import Modal from "../components/common/Modal";

const ApiDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request, loading } = useFetch();

  const [api, setApi] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchAllData = async () => {
    try {
      const [apiData, statsData, historyData, anomaliesData] =
        await Promise.all([
          request(apiService.getApi, id),
          request(analyticsService.getSummary, id),
          request(analyticsService.getResponseTimeHistory, id),
          request(analyticsService.getAnomalies, id, { limit: 10 }),
        ]);
      setApi(apiData.data);
      setStats(statsData.data.stats.last24h);
      setHistory(historyData.data);
      setAnomalies(anomaliesData.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await request(apiService.deleteApi, id);
      toast.success("API deleted successfully");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async () => {
    try {
      const res = await request(apiService.toggleActive, id);
      setApi(res.data);
      toast.success(`API ${res.data.isActive ? "resumed" : "paused"}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading && !api) return <Loader size='lg' />;
  if (!api) return <div className='text-center p-8'>API not found</div>;

  return (
    <div className='container mx-auto px-4 py-8 space-y-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className='mb-2 pl-0'
          >
            <ArrowLeft className='mr-2 h-4 w-4' /> Back
          </Button>
          <h1 className='text-3xl font-bold flex items-center gap-3'>
            {api.name}
            <span
              className={`text-xs px-2 py-1 rounded-full border ${api.isActive ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}
            >
              {api.isActive ? "Active" : "Paused"}
            </span>
          </h1>
          <p className='text-muted-foreground font-mono mt-1 text-sm bg-muted/30 inline-block px-2 py-1 rounded'>
            {api.method} {api.url}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={handleToggle}>
            {api.isActive ? (
              <Pause className='mr-2 h-4 w-4' />
            ) : (
              <Play className='mr-2 h-4 w-4' />
            )}
            {api.isActive ? "Pause" : "Resume"}
          </Button>
          <Button
            variant='destructive'
            size='icon'
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Charts Row */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 bg-card border border-border p-6 rounded-xl shadow-sm'>
          <h3 className='text-lg font-semibold mb-4'>Response Time (24h)</h3>
          <ResponseTimeChart data={history} />
        </div>

        <div className='bg-card border border-border p-6 rounded-xl shadow-sm'>
          <h3 className='text-lg font-semibold mb-4'>Uptime Ratio</h3>
          <StatusPieChart
            stats={{
              healthyCount: stats?.successCount || 0,
              warningCount: 0, // Simplified for this view
              downCount: stats?.errorCount || 0,
            }}
          />

          <div className='mt-4 space-y-2 text-sm'>
            <div className='flex justify-between border-b border-border pb-2'>
              <span className='text-muted-foreground'>Avg Response</span>
              <span className='font-mono font-medium'>
                {stats?.avgResponseTime}ms
              </span>
            </div>
            <div className='flex justify-between border-b border-border pb-2'>
              <span className='text-muted-foreground'>Est. Uptime</span>
              <span className='font-mono font-medium'>{stats?.uptime}%</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Total Checks</span>
              <span className='font-mono font-medium'>
                {stats?.totalChecks}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Anomalies Section */}
      <div className='bg-card border border-border p-6 rounded-xl shadow-sm'>
        <h3 className='text-lg font-semibold mb-4'>
          Recent Anomalies & Insights
        </h3>
        <AnomalyList anomalies={anomalies} />
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Delete API Monitor?'
        footer={
          <>
            <Button variant='ghost' onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              isLoading={loading}
            >
              Delete Permanently
            </Button>
          </>
        }
      >
        <p className='text-muted-foreground'>
          Are you sure you want to delete this monitor? All historical data and
          anomalies will be lost. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ApiDetails;
