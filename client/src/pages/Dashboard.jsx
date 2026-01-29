import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Monitor, CheckCircle, AlertCircle, Bell } from "lucide-react";
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
    <div className='h-[calc(100%-2rem)] space-y-3 px-6 py-[22px] m-4 bg-[#f5f5f6] rounded-3xl overflow-hidden'>
      <div className='flex flex-col gap-4 rounded-[34px]'>
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
              icon={Monitor}
              description='Active endpoints'
              className='px-6 py-6 rounded-3xl bg-linear-to-br from-[#14412B] to-[#208052] text-white h-full'
              iconClassName='p-2 bg-white/20 rounded-[10px]'
              titleClassName='text-lg font-dmsans text-emerald-100'
              valueClassName='text-[34px] font-dmsans text-white'
              descriptionClassName='text-[13px] text-emerald-200 font-bricolage'
            />

            <StatsCard
              title='Healthy APIs'
              value={stats.healthyCount}
              icon={CheckCircle}
              description='Operating normally'
              className='px-6 py-6 rounded-3xl bg-white h-full'
              iconClassName='p-2 bg-emerald-50 rounded-[10px] text-emerald-600'
              titleClassName='text-lg font-dmsans text-gray-500'
              valueClassName='text-[34px] font-dmsans text-gray-900'
              descriptionClassName='text-[13px] text-emerald-600 font-bricolage'
            />

            <StatsCard
              title='Issues'
              value={stats.warningCount + stats.downCount}
              icon={AlertCircle}
              description='Warnings or downtime'
              className='px-6 py-6 rounded-3xl bg-white h-full'
              iconClassName='p-2 bg-red-50 rounded-[10px] text-red-500'
              titleClassName='text-lg font-dmsans text-gray-500'
              valueClassName='text-[34px] font-dmsans text-red-600'
              descriptionClassName='text-[13px] text-red-500 font-bricolage'
            />

            <StatsCard
              title='Anomalies'
              value={stats.unacknowledgedAnomalies}
              icon={Bell}
              description='Unacknowledged'
              className='px-6 py-6 rounded-3xl bg-white h-full'
              iconClassName='p-2 bg-amber-50 rounded-[10px] text-amber-600'
              titleClassName='text-lg font-dmsans text-gray-500'
              valueClassName='text-[34px] font-dmsans text-amber-600'
              descriptionClassName='text-[13px] text-amber-500 font-bricolage'
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

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mt-3 flex-1'>
        <div className='lg:col-span-2 flex flex-col'>
          <h2 className='text-md font-dmsans tracking-wide text-gray-600 mb-2'>
            Monitored APIs
          </h2>
          <div className='bg-white rounded-3xl p-5 flex-1 flex flex-col'>
            {apis.length === 0 ? (
              <div className='h-full flex flex-col items-center justify-center min-h-[304px]'>
                <p className='text-gray-400 mb-4 text-sm'>
                  No APIs monitored yet
                </p>
                <Link to={ROUTES.ADD_API}>
                  <Button className='rounded-full bg-[#14412B] hover:bg-[#1a5438] text-white font-bricolage px-6 py-2.5 text-sm cursor-pointer'>
                    Create your first monitor
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {apis.slice(0, 2).map((api) => (
                    <ApiCard key={api._id} api={api} />
                  ))}
                </div>
                {apis.length > 2 && (
                  <div className='mt-3 text-center border-t border-gray-100 pt-3'>
                    <Link
                      to={ROUTES.MONITORS}
                      className='text-xs font-medium text-gray-500 hover:text-[#14412B] transition-colors'
                    >
                      View all ({apis.length}) →
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className='flex flex-col'>
          <h2 className='text-md font-dmsans tracking-wide text-gray-600 mb-2'>
            Recent Anomalies
          </h2>
          <div className='bg-white rounded-3xl p-5 flex-1 flex flex-col min-h-[304px]'>
            <div className='flex-1 flex items-center justify-center'>
              <AnomalyList anomalies={recentAnomalies} />
            </div>
            <div className='mt-3 text-center border-t border-gray-100 pt-3'>
              <Link
                to={ROUTES.NOTIFICATIONS}
                className='text-sm font-bricolage text-gray-500 hover:text-[#14412B] transition-colors'
              >
                View all notifications →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
