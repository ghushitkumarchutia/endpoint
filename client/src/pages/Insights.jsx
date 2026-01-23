import { useState, useEffect } from "react";
import { Brain, Bell, Lightbulb, Clock, Link2 } from "lucide-react";
import useInsights from "../hooks/useInsights";
import RootCauseCard from "../components/insights/RootCauseCard";
import PredictiveCard from "../components/insights/PredictiveCard";
import InsightTimeline from "../components/insights/InsightTimeline";
import CorrelationList from "../components/insights/CorrelationList";
import ConfidenceBar from "../components/insights/ConfidenceBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const Insights = () => {
  const [activeTab, setActiveTab] = useState("root-cause");

  const {
    rootCauses,
    predictiveAlerts,
    loading,
    error,
    fetchRootCauses,
    fetchPredictiveAlerts,
    updateAlertStatus,
  } = useInsights();

  useEffect(() => {
    fetchRootCauses();
    fetchPredictiveAlerts();
  }, []);

  const handleAlertStatusUpdate = async (alertId, status) => {
    try {
      await updateAlertStatus(alertId, status);
      toast.success("Alert status updated");
      fetchPredictiveAlerts();
    } catch {
      toast.error("Failed to update alert status");
    }
  };

  const timelineEvents =
    [...(rootCauses || []), ...(predictiveAlerts || [])]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map((item) => ({
        id: item._id,
        timestamp: item.createdAt,
        title: item.apiName || item.title,
        description: item.summary || item.message,
        severity:
          item.severity || (item.probability > 0.7 ? "error" : "warning"),
      })) || [];

  if (loading && !rootCauses && !predictiveAlerts) {
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
          <h1 className='text-2xl font-bold'>AI Insights</h1>
          <p className='text-muted-foreground'>
            AI-powered root cause analysis and predictive alerts
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-purple-500/10 rounded-lg'>
              <Brain className='h-5 w-5 text-purple-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>{rootCauses?.length || 0}</p>
              <p className='text-sm text-muted-foreground'>
                Root Cause Analyses
              </p>
            </div>
          </div>
        </div>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-amber-500/10 rounded-lg'>
              <Bell className='h-5 w-5 text-amber-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>
                {predictiveAlerts?.filter((a) => a.status === "active")
                  .length || 0}
              </p>
              <p className='text-sm text-muted-foreground'>
                Active Predictions
              </p>
            </div>
          </div>
        </div>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-green-500/10 rounded-lg'>
              <Lightbulb className='h-5 w-5 text-green-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>
                {predictiveAlerts?.filter((a) => a.status === "mitigated")
                  .length || 0}
              </p>
              <p className='text-sm text-muted-foreground'>Issues Mitigated</p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex gap-2 border-b border-border'>
        <button
          onClick={() => setActiveTab("root-cause")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "root-cause"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Root Cause Analysis
        </button>
        <button
          onClick={() => setActiveTab("predictive")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "predictive"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Predictive Alerts
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "timeline"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Timeline
        </button>
      </div>

      {error && (
        <div className='p-4 bg-destructive/10 text-destructive rounded-lg'>
          {error}
        </div>
      )}

      {activeTab === "root-cause" && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {rootCauses?.length > 0 ? (
            rootCauses.map((analysis) => (
              <RootCauseCard key={analysis._id} analysis={analysis} />
            ))
          ) : (
            <div className='col-span-2 text-center py-12 text-muted-foreground bg-card border border-border rounded-xl'>
              <Brain className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p>No root cause analyses available</p>
              <p className='text-sm mt-1'>
                Analyses are generated when anomalies are detected
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "predictive" && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {predictiveAlerts?.length > 0 ? (
            predictiveAlerts.map((alert) => (
              <PredictiveCard
                key={alert._id}
                alert={alert}
                onStatusUpdate={handleAlertStatusUpdate}
              />
            ))
          ) : (
            <div className='col-span-2 text-center py-12 text-muted-foreground bg-card border border-border rounded-xl'>
              <Bell className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p>No predictive alerts</p>
              <p className='text-sm mt-1'>
                Alerts are generated based on trend analysis
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "timeline" && (
        <div className='bg-card border border-border rounded-xl p-4'>
          {timelineEvents.length > 0 ? (
            <InsightTimeline events={timelineEvents} />
          ) : (
            <div className='text-center py-12 text-muted-foreground'>
              <Clock className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p>No recent events</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Insights;
