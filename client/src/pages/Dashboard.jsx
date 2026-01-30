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
    <div className='flex flex-col space-y-3 px-4 py-[20px] md:px-6 md:py-[22px] bg-[#f5f5f6] rounded-3xl h-auto overflow-visible lg:h-full lg:overflow-hidden'>
      <div className='flex flex-col gap-4 rounded-[34px]'>
        <div className='md:flex md:flex-row flex-col md:items-center md:justify-between'>
          <div>
            <h1 className='md:text-2xl text-[22px] text-black tracking-wider font-dmsans text-center md:text-start'>
              Dashboard
            </h1>
            <p className='md:text-base text-[13px] text-black/90 font-bricolage text-center md:text-start'>
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
          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4'>
            <StatsCard
              title='Total Monitors'
              value={stats.totalApis}
              icon={Monitor}
              description='Active endpoints'
              className='px-4 py-4 md:px-6 md:py-6 rounded-[20px] md:rounded-3xl bg-linear-to-br from-[#14412B] to-[#208052] text-white h-full'
              iconClassName='p-2 bg-white/20 rounded-[8px] md:rounded-[10px]'
              titleClassName='text-base md:text-lg font-dmsans text-emerald-100'
              valueClassName='md:text-[34px] text-[24px] font-dmsans text-white'
              descriptionClassName='md:text-[13px] text-[11px] text-emerald-200 font-bricolage'
            />

            <StatsCard
              title='Healthy APIs'
              value={stats.healthyCount}
              icon={CheckCircle}
              description='Operating normally'
              className='px-4 py-4 md:px-6 md:py-6 rounded-[20px] md:rounded-3xl bg-white h-full border border-gray-200/70'
              iconClassName='p-2 bg-emerald-50 rounded-[8px] md:rounded-[10px] text-emerald-600'
              titleClassName='text-base md:text-lg font-dmsans text-gray-500'
              valueClassName='md:text-[34px] text-[24px] font-dmsans text-gray-900'
              descriptionClassName='md:text-[13px] text-[11px] text-emerald-600 font-bricolage'
            />

            <StatsCard
              title='Issues'
              value={stats.warningCount + stats.downCount}
              icon={AlertCircle}
              description='Warnings or downtime'
              className='px-4 py-4 md:px-6 md:py-6 rounded-[20px] md:rounded-3xl bg-white h-full border border-gray-200/70'
              iconClassName='p-2 bg-red-50 rounded-[8px] md:rounded-[10px] text-red-500'
              titleClassName='text-base md:text-lg font-dmsans text-gray-500'
              valueClassName='md:text-[34px] text-[24px] font-dmsans text-red-600'
              descriptionClassName='md:text-[13px] text-[11px] text-red-500 font-bricolage'
            />

            <StatsCard
              title='Anomalies'
              value={stats.unacknowledgedAnomalies}
              icon={Bell}
              description='Unacknowledged'
              className='px-4 py-4 md:px-6 md:py-6 rounded-[20px] md:rounded-3xl bg-white h-full border border-gray-200/70'
              iconClassName='p-2 bg-amber-50 rounded-[8px] md:rounded-[10px] text-amber-600'
              titleClassName='text-base md:text-lg font-dmsans text-gray-500'
              valueClassName='md:text-[34px] text-[24px] font-dmsans text-amber-600'
              descriptionClassName='md:text-[13px] text-[11px] text-amber-500 font-bricolage'
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

      <div className='grid grid-cols-1 lg:grid-cols-3 md:gap-5 gap-3 md:mt-3 flex-1'>
        <div className='lg:col-span-2 flex flex-col'>
          <h2 className='text-md font-dmsans tracking-wide text-gray-600 mb-2'>
            Monitored APIs
          </h2>
          <div className='bg-white rounded-3xl p-5 flex-1 flex flex-col border border-gray-200/70'>
            {apis.length === 0 ? (
              <div className='h-full flex flex-col items-center justify-center min-h-[260px]'>
                <p className='text-gray-400 mb-3 md:mb-4 text-sm'>
                  No APIs monitored yet
                </p>
                <Link to={ROUTES.ADD_API}>
                  <Button className='rounded-full bg-[#14412B] hover:bg-[#1a5438] text-white font-bricolage md:px-6 md:py-3 px-4 py-2.5 md:text-[15px] text-[13px] cursor-pointer'>
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
                  <div className='mt-3 text-center'>
                    <Link
                      to={ROUTES.MONITORS}
                      className='text-sm font-bricolage text-gray-500 hover:text-[#14412B] transition-colors'
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
          <div className='bg-white rounded-3xl p-5 flex-1 flex flex-col min-h-[280px] border border-gray-200/70'>
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
