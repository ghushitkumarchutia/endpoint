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
      const [statsRes, apisRes, alertsRes] = await Promise.allSettled([
        apiService.getDashboardStats(),
        apiService.getApis(),
        insightsService.getPredictiveAlerts({ status: "active", limit: 1 }),
      ]);

      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value.data);
        setRecentAnomalies(statsRes.value.data.recentAnomalies || []);
      } else if (statsRes.reason?.message !== "Request cancelled") {
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
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Silent anomaly-only refresh every 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await apiService.getDashboardStats();
        if (res?.data?.recentAnomalies) {
          setRecentAnomalies(res.data.recentAnomalies);
        }
      } catch {
        // Silent — don't disrupt the UI
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => fetchData();
  const handleExport = () => window.print();

  if (loading || !stats) {
    return (
      <div className='h-full flex flex-col items-center justify-center bg-black rounded-2xl'>
        <Loader size='lg' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4  h-full overflow-y-auto'>
      <div className='grid grid-cols-1 lg:grid-cols-[1.95fr_3.05fr] gap-4 flex-1 min-h-0'>
        <div className='flex flex-col gap-4 min-h-0 flex-1'>
          <div className='flex items-start justify-between'>
            <div className='pl-1'>
              <h1 className='text-2xl md:text-3xl font-bold font-dmsans text-[#F5F5F5]'>
                Dashboard
              </h1>
              <p className='text-sm md:text-md text-white/60 mt-1 font-medium font-bricolage'>
                Overview of your API ecosystem
              </p>
            </div>
            {predictiveAlert && (
              <AlertBanner
                alert={predictiveAlert}
                onDismiss={() => setPredictiveAlert(null)}
                iconOnly
              />
            )}
          </div>

          {stats && (
            <div className='bg-black rounded-[48px] md:rounded-[46px] p-6 flex-1 flex flex-col'>
              <div className='grid grid-cols-2 gap-x-5 gap-y-5 h-full'>
                <StatsCard
                  title='TOTAL MONITORS'
                  value={stats.totalApis}
                  icon={Monitor}
                  description='Active endpoints'
                  className='pt-5 pb-6 px-5 rounded-[36px] text-white'
                  cardStyle={{
                    background: `linear-gradient(to bottom, transparent 0%, #4D4C4F 100%), linear-gradient(to right, #485068, #40518B)`,
                  }}
                  iconClassName='p-3.5 bg-black rounded-full text-white'
                  titleClassName='md:text-[16px] text-[12px] tracking-[0.12em] uppercase font-dmsans text-white'
                  valueClassName='text-4xl md:-mt-[35px] font-dmsans text-white'
                  descriptionClassName='text-xs text-white/80 font-dmsans-light'
                />

                <StatsCard
                  title='HEALTHY APIS'
                  value={stats.healthyCount}
                  icon={CheckCircle}
                  description='Operating normally'
                  className='pt-5 pb-6 px-5 rounded-[36px] text-white'
                  cardStyle={{
                    background: `linear-gradient(to bottom, transparent 0%, #4D4C4F 100%), linear-gradient(to right, #5F6752, #839158)`,
                  }}
                  iconClassName='p-3.5 bg-black rounded-full text-white'
                  titleClassName='md:text-[16px] text-[12px] tracking-[0.12em] uppercase font-dmsans text-white'
                  valueClassName='text-4xl font-dmsans text-white'
                  descriptionClassName='text-xs text-white/80 font-dmsans-light'
                />

                <StatsCard
                  title='ISSUES'
                  value={stats.warningCount + stats.downCount}
                  icon={AlertCircle}
                  description='Warnings or downtime'
                  className='pt-5 pb-6 px-5 rounded-[36px] text-white'
                  cardStyle={{
                    background: `linear-gradient(to bottom, transparent 0%, #4D4C4F 100%), linear-gradient(to right, #4A6065, #418297)`,
                  }}
                  iconClassName='p-3.5 bg-black rounded-full text-white'
                  titleClassName='md:text-[16px] text-[12px] tracking-[0.12em] uppercase font-dmsans text-white'
                  valueClassName='text-4xl font-bold font-dmsans text-white'
                  descriptionClassName='text-xs text-white/80 font-dmsans-light'
                />

                <StatsCard
                  title='ANOMALIES'
                  value={stats.unacknowledgedAnomalies}
                  icon={Bell}
                  description='Unacknowledged'
                  className='pt-5 pb-6 px-5 rounded-[36px] text-white'
                  cardStyle={{
                    background: `linear-gradient(to bottom, transparent 0%, #4D4C4F 100%), linear-gradient(to right, #546547, #5C903C)`,
                  }}
                  iconClassName='p-3.5 bg-black rounded-full text-white'
                  titleClassName='md:text-[16px] text-[12px] tracking-[0.12em] uppercase font-dmsans text-white'
                  valueClassName='text-4xl font-bold font-dmsans text-white'
                  descriptionClassName='text-xs text-white/80 font-dmsans-light'
                />
              </div>
            </div>
          )}
        </div>
        <div className='bg-black rounded-[48px] md:rounded-[46px] p-6 flex flex-col gap-5 min-h-0 overflow-hidden'>
          <div className='flex justify-end'>
            <QuickActions
              onRefresh={handleRefresh}
              onExport={handleExport}
              iconOnly
            />
          </div>

          <div className='flex flex-col flex-1 min-h-0'>
            <h2 className='text-[11px] md:text-[14px] font-dmsans uppercase text-white tracking-[0.15em] mb-3'>
              Monitored APIs
            </h2>

            {apis.length === 0 ? (
              <div className='flex-1 flex flex-col items-center justify-center min-h-40'>
                <div className='p-6 rounded-[22px] md:rounded-[26px] bg-[#4D4C4F]/70 backdrop-blur-3xl'>
                  <Monitor className='h-8 w-8 md:h-12 md:w-12 text-white' />
                </div>
                <p className='text-zinc-400 text-[14px] md:text-[16px] font-dmsans mb-3 mt-4'>
                  No APIs monitored yet
                </p>
                <Link to={ROUTES.ADD_API}>
                  <Button
                    className='rounded-2xl text-white px-5 py-3 md:px-6 md:py-3.5 text-[13px] md:text-[16px] font-bricolage cursor-pointer group transition-all duration-200 hover:brightness-125 hover:scale-[1.01] active:scale-[0.97]'
                    style={{
                      background: `linear-gradient(to bottom, transparent 0%, #4D4C4F 100%), linear-gradient(to right, #485068, #40518B)`,
                    }}
                  >
                    Create your first monitor
                  </Button>
                </Link>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1'>
                {apis.slice(0, 2).map((api) => (
                  <ApiCard key={api._id} api={api} />
                ))}
              </div>
            )}

            <div className='mt-3 pt-3 border-t border-white/5 flex justify-center'>
              <Link
                to={ROUTES.MONITORS}
                className='text-sm font-medium text-white/50 hover:text-white transition-colors flex items-center gap-1.5'
              >
                View all monitors <ArrowRight className='h-4 w-4' />
              </Link>
            </div>
          </div>

          <div className='flex flex-col min-h-0'>
            <h2 className='text-[11px] md:text-[14px] font-dmsans text-white uppercase tracking-[0.15em] mb-3'>
              Recent Anomalies
            </h2>
            <div className='bg-stone-800/30 rounded-[38px] border border-dashed border-[#40518B]/70 p-4 overflow-y-auto'>
              <AnomalyList anomalies={recentAnomalies} />
            </div>
            <div className='mt-3 pt-3 border-t border-white/5 flex justify-center'>
              <Link
                to={ROUTES.NOTIFICATIONS}
                className='text-sm font-medium text-white/50 hover:text-white transition-colors flex items-center gap-1.5'
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
