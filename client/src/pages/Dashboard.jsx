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
    <div className='flex-1 h-full bg-black space-y-3 px-8 py-8'>
      <div className='flex flex-col gap-[22px] rounded-[34px]'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl text-white tracking-widest font-bold font-anton'>
              Dashboard
            </h1>
            <p className='text-white/90 font-bricolage'>
              Overview of your API ecosystem
            </p>
          </div>
          <QuickActions onRefresh={handleRefresh} onExport={handleExport} />
        </div>
        {stats && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[18px] rounded-[28px]'>
            <StatsCard
              title='Total Monitors'
              value={stats.totalApis}
              icon={Activity}
            />
            <StatsCard
              title='Healthy APIs'
              value={stats.healthyCount}
              icon={Globe}
              description='Operating normally'
            />
            <StatsCard
              title='Issues'
              value={stats.warningCount + stats.downCount}
              icon={AlertTriangle}
              description='Warnings or downtime'
            />
            <div className='h-[190px] bg-[#2C2C2C]/80 px-[30px] py-7 rounded-[32px] border border-[#363636] flex flex-col'>
              <span className='text-[24px] font-anton tracking-wider uppercase text-white'>
                Total anomalies today
              </span>
              <span className='text-[44px] font-bold text-white mt-1'>
                {stats.unacknowledgedAnomalies}
              </span>
            </div>
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
          <h2 className='text-xl font-anton tracking-wider uppercase text-white'>
            Monitored APIs
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 flex-1'>
            {apis.length === 0 ? (
              <div className='col-span-2 flex flex-col items-center justify-center min-h-[200px] border border-neutral-700 rounded-[28px] bg-neutral-900/50'>
                <p className='text-neutral-400 mb-4'>No APIs monitored yet</p>
                <Link to={ROUTES.ADD_API}>
                  <Button className='rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-bricolage px-8 py-3'>
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
          <h2 className='text-xl font-anton tracking-wider uppercase text-white'>
            Recent Anomalies
          </h2>
          <div className='bg-neutral-900/50 border border-neutral-700 rounded-[28px] p-5 flex-1 flex flex-col min-h-[200px]'>
            <div className='flex-1 flex items-center justify-center'>
              <AnomalyList anomalies={recentAnomalies} />
            </div>
            <div className='mt-4 text-center'>
              <Link
                to={ROUTES.NOTIFICATIONS}
                className='text-sm text-neutral-400 hover:text-white transition-colors'
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
