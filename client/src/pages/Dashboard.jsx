import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Globe, AlertTriangle } from "lucide-react";
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
    try {
      const [statsData, apisData] = await Promise.all([
        request(apiService.getDashboardStats),
        request(apiService.getApis),
      ]);
      setStats(statsData.data);
      setApis(apisData.data);

      // Fetch predictive alerts
      try {
        const alertsData = await insightsService.getPredictiveAlerts({
          status: "active",
          limit: 1,
        });
        if (alertsData.data?.alerts?.length > 0) {
          setPredictiveAlert(alertsData.data.alerts[0]);
        }
      } catch {
        /* Insights may not be available */
      }

      // Fetch recent notifications/anomalies
      try {
        const notificationsData = await notificationService.getNotifications({
          limit: 5,
          type: "anomaly",
        });
        if (notificationsData.data?.notifications) {
          // Map notifications to anomaly format for AnomalyList
          const anomalies = notificationsData.data.notifications.map((n) => ({
            _id: n._id,
            type: n.type || "anomaly",
            severity: n.severity || "warning",
            createdAt: n.createdAt,
            currentValue: n.data?.currentValue || n.data?.responseTime || 0,
            expectedValue: n.data?.expectedValue || n.data?.baseline || 0,
            aiInsight: n.data?.aiInsight || null,
          }));
          setRecentAnomalies(anomalies);
        }
      } catch {
        /* Notifications may not be available */
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => fetchData();
  const handleExport = () => window.print();

  if (loading && !stats) return <Loader size='lg' />;

  return (
    <div className='h-[calc(100%-2rem)] space-y-3 px-6 py-7 m-4 bg-[#f5f5f6] rounded-3xl overflow-hidden'>
      <div className='flex flex-col gap-5.5 rounded-[34px]'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl text-black tracking-wider font-dmsans'>
              Dashboard
            </h1>
            <p className='text-black/90 font-bricolage'>
              Overview of your API ecosystem
            </p>
          </div>
          <QuickActions
            onRefresh={handleRefresh}
            onExport={handleExport}
            primaryButtonClassName='bg-[#14412B] text-white border border-[#14412B] hover:bg-[#1a5438]'
            buttonClassName='bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 active:scale-95'
          />
        </div>
        {stats && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <StatsCard
              title='Total Monitors'
              value={stats.totalApis}
              icon={Activity}
              className='px-8 py-9 rounded-3xl bg-gradient-to-br from-[#14412B] to-[#208052] text-white'
              titleClassName='text-sm font-medium text-emerald-100'
              valueClassName='text-5xl font-bold text-white'
              descriptionClassName='text-emerald-200'
              contentClassName='flex flex-col gap-2'
            />

            <StatsCard
              title='Healthy APIs'
              value={stats.healthyCount}
              icon={Globe}
              description='Operating normally'
              className='px-8 py-9 rounded-3xl bg-[#FFF]'
              titleClassName='text-sm font-medium text-gray-500'
              valueClassName='text-5xl font-bold text-gray-900'
              descriptionClassName='text-sm text-emerald-600'
              contentClassName='flex flex-col gap-2'
            />

            <StatsCard
              title='Issues'
              value={stats.warningCount + stats.downCount}
              icon={AlertTriangle}
              description='Warnings or downtime'
              className='px-8 py-9 rounded-3xl bg-[#FFF]'
              titleClassName='text-sm font-medium text-gray-500'
              valueClassName='text-5xl font-bold text-red-600'
              descriptionClassName='text-sm text-red-500'
              contentClassName='flex flex-col gap-2'
            />

            <StatsCard
              title='Total Anomalies'
              value={stats.unacknowledgedAnomalies}
              icon={AlertTriangle}
              className='px-8 py-9 rounded-3xl bg-[#FFF]'
              titleClassName='text-sm font-medium text-gray-500'
              valueClassName='text-5xl font-bold text-amber-600'
              contentClassName='flex flex-col gap-2'
            />
          </div>
        )}
        {predictiveAlert && (
          <AlertBanner
            alert={predictiveAlert}
            onDismiss={() => setPredictiveAlert(null)}
          />
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 flex-1'>
        <div className='lg:col-span-2 flex flex-col space-y-4'>
          <h2 className='text-xl font-anton tracking-wider uppercase text-gray-800'>
            Monitored APIs
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 flex-1'>
            {apis.length === 0 ? (
              <div className='col-span-2 flex flex-col items-center justify-center min-h-50 border border-gray-300 rounded-[28px] bg-white/50'>
                <p className='text-gray-500 mb-4'>No APIs monitored yet</p>
                <Link to={ROUTES.ADD_API}>
                  <Button className='rounded-full bg-gray-800 hover:bg-gray-700 text-white font-bricolage px-8 py-3'>
                    Create your first monitor
                  </Button>
                </Link>
              </div>
            ) : (
              apis.map((api) => <ApiCard key={api._id} api={api} />)
            )}
          </div>
        </div>

        <div className='flex flex-col space-y-4'>
          <h2 className='text-xl font-anton tracking-wider uppercase text-gray-800'>
            Recent Anomalies
          </h2>
          <div className='bg-white/50 border border-gray-300 rounded-[28px] p-5 flex-1 flex flex-col min-h-50'>
            <div className='flex-1 flex items-center justify-center'>
              <AnomalyList anomalies={recentAnomalies} />
            </div>
            <div className='mt-4 text-center'>
              <Link
                to={ROUTES.NOTIFICATIONS}
                className='text-sm text-gray-500 hover:text-gray-800 transition-colors'
              >
                View all notifications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
