import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Pause, Play } from "lucide-react";
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
          request(analyticsService.getResponseTimeHistory, id, 24),
          request(analyticsService.getAnomalies, id, { limit: 10 }),
        ]);
      setApi(apiData.data);
      setStats(statsData?.data?.stats?.last24h || null);
      setHistory(historyData?.data || []);
      setAnomalies(anomaliesData?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (loading && !api) {
    return (
      <div className='flex items-center justify-center h-full bg-[#f5f5f6] rounded-3xl'>
        <Loader size='lg' />
      </div>
    );
  }

  if (!api) return <div className='text-center p-8'>API not found</div>;

  return (
    <div className='flex flex-col px-4 py-[20px] md:px-6 md:py-[22px] bg-[#f5f5f6] rounded-3xl h-full overflow-y-auto custom-scrollbar space-y-6'>
      {/* Header Section */}
      <div className='flex flex-col gap-4'>
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className='flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-fit'
        >
          <ArrowLeft className='mr-1.5 h-4 w-4' /> Back
        </button>

        <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
          <div>
            <div className='flex items-center gap-3 mb-2'>
              <h1 className='text-3xl font-bold font-dmsans text-gray-900'>
                {api.name}
              </h1>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-opacity-20 uppercase tracking-wide ${
                  api.isActive
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-yellow-50 text-yellow-600 border-yellow-200"
                }`}
              >
                {api.isActive ? "Active" : "Paused"}
              </span>
            </div>
            <div className='flex items-center gap-2 font-mono text-sm text-gray-600'>
              <span className='uppercase font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded textxs'>
                {api.method}
              </span>
              <span className='truncate max-w-md'>{api.url}</span>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={handleToggle}
              className='flex flex-col items-center gap-1 group'
            >
              <div className='p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all'>
                {api.isActive ? (
                  <Pause className='h-5 w-5 text-gray-400 group-hover:text-gray-700' />
                ) : (
                  <Play className='h-5 w-5 text-gray-400 group-hover:text-gray-700' />
                )}
              </div>
              <span className='text-[10px] uppercase font-bold text-gray-400 group-hover:text-gray-600'>
                {api.isActive ? "Pause" : "Resume"}
              </span>
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className='flex flex-col items-center gap-1 group'
            >
              <div className='p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all'>
                <Trash2 className='h-5 w-5 text-gray-400 group-hover:text-red-500' />
              </div>
              <span className='text-[10px] uppercase font-bold text-gray-400 group-hover:text-red-500'>
                Delete
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Response Time Chart */}
        <div className='lg:col-span-2 bg-white border border-gray-200/60 rounded-[20px] p-6 shadow-sm flex flex-col'>
          <h3 className='text-lg font-bold font-dmsans text-gray-900 mb-6'>
            Response Time (24h)
          </h3>
          <div className='w-full h-[320px]'>
            <ResponseTimeChart data={history} />
          </div>
        </div>

        {/* Uptime Ratio Chart */}
        <div className='bg-white border border-gray-200/60 rounded-[20px] p-6 shadow-sm flex flex-col'>
          <h3 className='text-lg font-bold font-dmsans text-gray-900 mb-6'>
            Uptime Ratio
          </h3>
          <div className='flex items-center justify-center h-[220px]'>
            <StatusPieChart
              stats={{
                healthyCount: stats?.successCount || 0,
                warningCount: 0,
                downCount: stats?.errorCount || 0,
              }}
            />
          </div>

          <div className='mt-8 space-y-4'>
            <div className='flex items-center justify-between border-b border-gray-100 pb-3'>
              <span className='text-sm font-medium text-gray-500'>
                Avg Response
              </span>
              <span className='font-mono font-bold text-gray-900'>
                {stats?.avgResponseTime || 0}ms
              </span>
            </div>
            <div className='flex items-center justify-between border-b border-gray-100 pb-3'>
              <span className='text-sm font-medium text-gray-500'>
                Est. Uptime
              </span>
              <span className='font-mono font-bold text-gray-900'>
                {stats?.uptime || 100}%
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-500'>
                Total Checks
              </span>
              <span className='font-mono font-bold text-gray-900'>
                {stats?.totalChecks || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Anomalies Section */}
      <div className='bg-white border border-gray-200/60 rounded-[20px] p-6 shadow-sm'>
        <h3 className='text-lg font-bold font-dmsans text-gray-900 mb-6'>
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
