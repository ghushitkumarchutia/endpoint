import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Activity, Globe, AlertTriangle, RefreshCw } from "lucide-react";
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

  const fetchData = async () => {
    try {
      const [statsData, apisData] = await Promise.all([
        request(apiService.getDashboardStats),
        request(apiService.getApis),
      ]);
      setStats(statsData.data);
      setApis(apisData.data);

      try {
        const alertsData = await insightsService.getPredictiveAlerts({
          status: "active",
          limit: 1,
        });
        if (alertsData.data?.alerts?.length > 0) {
          setPredictiveAlert(alertsData.data.alerts[0]);
        }
      } catch {}
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [request]);

  const handleRefresh = () => fetchData();
  const handleExport = () => window.print();

  if (loading && !stats) return <Loader size='lg' />;

  return (
    <div className='container mx-auto px-4 py-8 space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Overview of your API ecosystem
          </p>
        </div>
        <QuickActions onRefresh={handleRefresh} onExport={handleExport} />
      </div>

      {predictiveAlert && (
        <AlertBanner
          alert={predictiveAlert}
          onDismiss={() => setPredictiveAlert(null)}
        />
      )}

      {stats && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
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
          {/* Placeholder for future anomaly stat */}
          <div className='bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-muted-foreground'>
            <span className='text-sm'>Total anomalies today</span>
            <span className='text-xl font-bold text-foreground mt-1'>
              {stats.unacknowledgedAnomalies}
            </span>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-6'>
          <h2 className='text-xl font-semibold'>Monitored APIs</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {apis.length === 0 ? (
              <div className='col-span-2 text-center py-12 border border-dashed border-border rounded-xl bg-muted/20'>
                <p className='text-muted-foreground mb-4'>
                  No APIs monitored yet
                </p>
                <Link to={ROUTES.ADD_API}>
                  <Button variant='outline'>Create your first monitor</Button>
                </Link>
              </div>
            ) : (
              apis.map((api) => <ApiCard key={api._id} api={api} />)
            )}
          </div>
        </div>

        <div className='space-y-6'>
          <h2 className='text-xl font-semibold'>Recent Anomalies</h2>
          <div className='bg-card border border-border rounded-xl p-4 min-h-[300px]'>
            {/* Note: In a real app we would fetch actual recent anomalies list here alone, 
                 but for checking we used the stats. 
                 To show list we'd need to fetch them. For now leaving empty or simple. 
             */}
            <AnomalyList anomalies={[]} />
            {/* TODO: Fetch recent anomalies list separately if needed or pass from stats */}
            <div className='mt-4 text-center'>
              <Link
                to={ROUTES.NOTIFICATIONS}
                className='text-sm text-primary hover:underline'
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
