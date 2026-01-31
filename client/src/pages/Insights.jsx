import { useState, useEffect } from "react";
import {
  Brain,
  Bell,
  Lightbulb,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import useInsights from "../hooks/useInsights";
import RootCauseCard from "../components/insights/RootCauseCard";
import PredictiveCard from "../components/insights/PredictiveCard";
import InsightTimeline from "../components/insights/InsightTimeline";
import Loader from "../components/common/Loader";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Suppress "Request cancelled" error
  const displayError = error === "Request cancelled" ? null : error;

  if (loading && !rootCauses && !predictiveAlerts) {
    return (
      <div className='flex items-center justify-center h-full bg-[#f5f5f6] rounded-3xl'>
        <Loader size='lg' />
      </div>
    );
  }

  const activePredictionsCount =
    predictiveAlerts?.filter((a) => a.status === "active").length || 0;
  const mitigatedCount =
    predictiveAlerts?.filter((a) => a.status === "mitigated").length || 0;

  return (
    <div className='flex flex-col px-4 py-[20px] md:px-6 md:py-[22px] bg-[#f5f5f6] rounded-3xl h-full overflow-y-auto custom-scrollbar'>
      <div className='flex items-center justify-between mb-8 shrink-0'>
        <div>
          <h1 className='text-2xl font-bold font-dmsans text-gray-900'>
            AI Insights
          </h1>
          <p className='text-sm text-gray-500 mt-1 font-medium font-bricolage'>
            AI-powered root cause analysis and predictive alerts
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-8'>
        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <Brain className='h-24 w-24 text-purple-600' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-purple-50 rounded-xl border border-purple-100/50'>
              <Brain className='h-6 w-6 text-purple-600' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {rootCauses?.length || 0}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Root Causes
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <AlertTriangle className='h-24 w-24 text-amber-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-amber-50 rounded-xl border border-amber-100/50'>
              <Bell className='h-6 w-6 text-amber-500' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {activePredictionsCount}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Active Predictions
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <CheckCircle2 className='h-24 w-24 text-emerald-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-emerald-50 rounded-xl border border-emerald-100/50'>
              <Lightbulb className='h-6 w-6 text-emerald-600' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {mitigatedCount}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Issues Mitigated
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-center mb-8'>
        <div className='flex p-1 bg-gray-200/50 rounded-xl md:rounded-full border border-gray-200/50 w-full md:w-auto'>
          {["root-cause", "predictive", "timeline"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg md:rounded-full transition-all duration-200 capitalize ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-md shadow-gray-200/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {displayError && (
        <div className='p-4 bg-red-50 text-red-600 rounded-2xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-3'>
          <AlertTriangle className='h-5 w-5 shrink-0' />
          {displayError}
        </div>
      )}

      <div className='animate-fade-in-up min-h-[400px]'>
        {activeTab === "root-cause" && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
            {rootCauses?.length > 0 ? (
              rootCauses.map((analysis) => (
                <RootCauseCard key={analysis._id} analysis={analysis} />
              ))
            ) : (
              <div className='col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-16 text-center bg-white border border-gray-200/60 rounded-[24px] shadow-sm border-dashed'>
                <div className='p-4 bg-gray-50 rounded-full mb-4'>
                  <Brain className='h-8 w-8 text-gray-300' />
                </div>
                <p className='font-bold text-gray-900 text-lg'>
                  No incidents detected
                </p>
                <p className='text-sm text-gray-500 mt-1 max-w-sm'>
                  Root cause analyses are automatically generated when anomalies
                  are detected in your APIs.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "predictive" && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
            {predictiveAlerts?.length > 0 ? (
              predictiveAlerts.map((alert) => (
                <PredictiveCard
                  key={alert._id}
                  alert={alert}
                  onStatusUpdate={handleAlertStatusUpdate}
                />
              ))
            ) : (
              <div className='col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-16 text-center bg-white border border-gray-200/60 rounded-[24px] shadow-sm border-dashed'>
                <div className='p-4 bg-gray-50 rounded-full mb-4'>
                  <Bell className='h-8 w-8 text-gray-300' />
                </div>
                <p className='font-bold text-gray-900 text-lg'>
                  No active predictions
                </p>
                <p className='text-sm text-gray-500 mt-1 max-w-sm'>
                  Our AI models haven't detected any potential issues that
                  require your attention right now.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "timeline" && (
          <div className='bg-white border border-gray-200/60 rounded-[24px] p-6 shadow-sm'>
            {timelineEvents.length > 0 ? (
              <InsightTimeline events={timelineEvents} />
            ) : (
              <div className='text-center py-16 text-gray-500'>
                <Clock className='h-12 w-12 mx-auto mb-4 opacity-20' />
                <p>No recent events found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
