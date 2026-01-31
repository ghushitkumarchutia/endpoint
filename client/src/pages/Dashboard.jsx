import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Monitor,
  CheckCircle,
  AlertCircle,
  Bell,
  ArrowRight,
} from "lucide-react";
import apiService from "../services/apiService";
import insightsService from "../services/insightsService";
import notificationService from "../services/notificationService";
import useFetch from "../hooks/useFetch";
import ApiCard from "../components/dashboard/ApiCard";
import StatsCard from "../components/dashboard/StatsCard";
import AlertBanner from "../components/dashboard/AlertBanner";
import QuickActions from "../components/dashboard/QuickActions";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import AnomalyList from "../components/dashboard/AnomalyList";
import { ROUTES } from "../utils/constants";

const Dashboard = () => {
  const { request, loading } = useFetch();
  const [stats, setStats] = useState(null);
  const [apis, setApis] = useState([]);
  const [predictiveAlert, setPredictiveAlert] = useState(null);
  const [recentAnomalies, setRecentAnomalies] = useState([]);

  const fetchData = async () => {
    setStats(null);
    await request(async () => {
      const [statsRes, apisRes, alertsRes, notificationsRes] =
        await Promise.allSettled([
          apiService.getDashboardStats(),
          apiService.getApis(),
          insightsService.getPredictiveAlerts({ status: "active", limit: 1 }),
          notificationService.getNotifications({ limit: 5, type: "anomaly" }),
        ]);

      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value.data);
      } else {
        console.error("Failed to load dashboard stats", statsRes.reason);
      }

      if (apisRes.status === "fulfilled") {
        setApis(apisRes.value.data);
      }
      if (
        alertsRes.status === "fulfilled" &&
        alertsRes.value.data?.alerts?.length > 0
      ) {
        setPredictiveAlert(alertsRes.value.data.alerts[0]);
      } else {
        setPredictiveAlert(null);
      }

      if (
        notificationsRes.status === "fulfilled" &&
        notificationsRes.value.data?.notifications
      ) {
        const mappedAnomalies = notificationsRes.value.data.notifications.map(
          (n) => ({
            _id: n._id,
            type: n.type || "anomaly",
            severity: n.severity || "warning",
            createdAt: n.createdAt,
            currentValue: n.data?.currentValue || n.data?.responseTime || 0,
            expectedValue: n.data?.expectedValue || n.data?.baseline || 0,
            aiInsight: n.data?.aiInsight || null,
          }),
        );
        setRecentAnomalies(mappedAnomalies);
      } else {
        setRecentAnomalies([]);
      }
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => fetchData();
  const handleExport = () => window.print();

  if (loading || !stats) {
    return (
      <div className='h-full flex flex-col items-center justify-center bg-[#f5f5f6] rounded-3xl'>
        <Loader size='lg' />
      </div>
    );
  }

  return (
    <div className='flex flex-col space-y-6 px-4 py-[20px] md:px-6 md:py-[22px] bg-[#f5f5f6] rounded-3xl h-full overflow-y-auto custom-scrollbar'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold font-dmsans text-gray-900'>
            Dashboard
          </h1>
          <p className='text-sm text-gray-500 mt-1 font-medium font-bricolage'>
            Overview of your API ecosystem
          </p>
        </div>
        <QuickActions
          onRefresh={handleRefresh}
          onExport={handleExport}
          primaryButtonClassName='bg-[#14412B] text-white border border-[#14412B] hover:bg-[#1a5438] shadow-sm'
          buttonClassName='bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
        />
      </div>

      {predictiveAlert && (
        <AlertBanner
          alert={predictiveAlert}
          onDismiss={() => setPredictiveAlert(null)}
        />
      )}

      {/* Stats Cards Grid */}
      {stats && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatsCard
            title='Total Monitors'
            value={stats.totalApis}
            icon={Monitor}
            description='Active endpoints'
            className='p-5 rounded-[24px] bg-[#14412B] text-white shadow-sm'
            iconClassName='p-2 bg-white/20 rounded-xl text-white'
            titleClassName='text-xl font-dmsans text-emerald-100/90'
            valueClassName='text-4xl font-bold font-dmsans mt-4 mb-1'
            descriptionClassName='text-xs text-emerald-200/80 font-medium'
          />

          <StatsCard
            title='Healthy APIs'
            value={stats.healthyCount}
            icon={CheckCircle}
            description='Operating normally'
            className='p-5 rounded-[20px] bg-white border border-gray-200/60 shadow-sm'
            iconClassName='p-2 bg-emerald-50 rounded-xl text-emerald-600'
            titleClassName='text-sm font-medium text-gray-500'
            valueClassName='text-4xl font-bold font-dmsans text-gray-900 mt-4 mb-1'
            descriptionClassName='text-xs text-emerald-600 font-medium'
          />

          <StatsCard
            title='Issues'
            value={stats.warningCount + stats.downCount}
            icon={AlertCircle}
            description='Warnings or downtime'
            className='p-5 rounded-[20px] bg-white border border-gray-200/60 shadow-sm'
            iconClassName='p-2 bg-red-50 rounded-xl text-red-500'
            titleClassName='text-sm font-medium text-gray-500'
            valueClassName='text-4xl font-bold font-dmsans text-red-600 mt-4 mb-1'
            descriptionClassName='text-xs text-red-500 font-medium'
          />

          <StatsCard
            title='Anomalies'
            value={stats.unacknowledgedAnomalies}
            icon={Bell}
            description='Unacknowledged'
            className='p-5 rounded-[20px] bg-white border border-gray-200/60 shadow-sm'
            iconClassName='p-2 bg-amber-50 rounded-md text-amber-500'
            titleClassName='text-sm font-medium text-gray-500'
            valueClassName='text-4xl font-bold font-dmsans text-amber-600 mt-4 mb-1'
            descriptionClassName='text-xs text-amber-500 font-medium'
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0'>
        {/* Monitored APIs Section */}
        <div className='lg:col-span-2 flex flex-col min-h-0'>
          <h2 className='text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1'>
            Monitored APIs
          </h2>
          <div className='bg-white rounded-[24px] border border-gray-200/60 shadow-sm p-6 flex-1 overflow-hidden flex flex-col'>
            {apis.length === 0 ? (
              <div className='h-full flex flex-col items-center justify-center min-h-[300px]'>
                <div className='p-4 bg-gray-50 rounded-full'>
                  <Monitor className='h-8 w-8 text-gray-300' />
                </div>
                <p className='text-gray-400 font-dmsans mb-3'>
                  No APIs monitored yet
                </p>
                <Link to={ROUTES.ADD_API}>
                  <Button className='rounded-[14px] bg-[#14412B] hover:bg-[#1a5438] text-white px-6 py-3 font-bricolage shadow-lg shadow-[#14412B]/20 cursor-pointer'>
                    Create your first monitor
                  </Button>
                </Link>
              </div>
            ) : (
              <div className='flex flex-col h-full'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pr-2 mb-4'>
                  {apis.slice(0, 4).map((api) => (
                    <ApiCard key={api._id} api={api} />
                  ))}
                </div>
                <div className='mt-auto pt-4 border-t border-gray-100 flex justify-center'>
                  <Link
                    to={ROUTES.MONITORS}
                    className='text-sm font-medium text-gray-500 hover:text-[#14412B] transition-colors flex items-center gap-1'
                  >
                    View all monitors <ArrowRight className='h-4 w-4' />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Anomalies Section */}
        <div className='flex flex-col min-h-0'>
          <h2 className='text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1'>
            Recent Anomalies
          </h2>
          <div className='bg-white rounded-[24px] border border-gray-200/60 shadow-sm p-6 flex-1 overflow-hidden flex flex-col'>
            <div className='flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2'>
              <AnomalyList anomalies={recentAnomalies} />
            </div>

            <div className='mt-4 pt-4 border-t border-gray-100 flex justify-center shrink-0'>
              <Link
                to={ROUTES.NOTIFICATIONS}
                className='text-sm font-medium text-gray-500 hover:text-[#14412B] transition-colors flex items-center gap-1'
              >
                View all notifications <ArrowRight className='h-4 w-4' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
