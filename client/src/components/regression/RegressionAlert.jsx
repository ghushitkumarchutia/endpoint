import { formatDistanceToNow } from "date-fns";
import {
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Activity,
} from "lucide-react";
import { REGRESSION_STATUS } from "../../utils/constants";

const RegressionAlert = ({ regression, onClick, selected }) => {
  const {
    apiId,
    detectedAt,
    degradationPercent,
    confidenceLevel,
    status,
    baselineStats,
    currentStats,
  } = regression;

  return (
    <div
      onClick={onClick}
      className={`bg-white border rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden ${
        selected
          ? "border-blue-500 ring-4 ring-blue-500/10"
          : "border-gray-200/60 hover:border-blue-200"
      }`}
    >
      <div
        className={`absolute top-0 left-0 w-1 h-full ${selected ? "bg-blue-500" : "bg-transparent group-hover:bg-blue-200 transition-colors"}`}
      ></div>

      <div className='flex items-start justify-between mb-4 pl-3'>
        <div className='flex items-center gap-3'>
          <div
            className={`p-2 rounded-xl ${selected ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors"}`}
          >
            <Activity className='h-5 w-5' />
          </div>
          <div>
            <h3 className='font-bold text-gray-900 font-dmsans text-lg'>
              {apiId?.name || "Unknown API"}
            </h3>
            <p className='text-xs text-gray-500 font-medium'>
              Detected{" "}
              {formatDistanceToNow(new Date(detectedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
            status === "active"
              ? "bg-amber-100 text-amber-700"
              : status === "resolved"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {status.replace("_", " ")}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4 pl-3'>
        <div className='p-3 bg-gray-50 rounded-xl border border-gray-100 text-center relative'>
          <p className='text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1'>
            Baseline P95
          </p>
          <p className='text-lg font-bold text-gray-700 font-mono'>
            {baselineStats?.p95ResponseTime?.toFixed(0)}ms
          </p>
        </div>
        <div className='p-3 bg-red-50 rounded-xl border border-red-100 text-center relative'>
          <div className='absolute top-1/2 -left-3 -translate-y-1/2 z-10 bg-white rounded-full p-0.5 border border-gray-100 shadow-sm'>
            <ArrowRight className='h-3 w-3 text-gray-400' />
          </div>
          <p className='text-[10px] uppercase tracking-wider font-bold text-red-400 mb-1'>
            Current P95
          </p>
          <p className='text-lg font-bold text-red-600 font-mono'>
            {currentStats?.p95ResponseTime?.toFixed(0)}ms
          </p>
        </div>
      </div>

      <div className='flex items-center justify-between text-sm pl-3'>
        <div className='flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100/50'>
          <TrendingDown className='h-4 w-4' />
          <span className='font-bold'>
            {degradationPercent?.toFixed(0)}% degradation
          </span>
        </div>
        <span className='text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md'>
          {confidenceLevel?.toFixed(0)}% confidence
        </span>
      </div>
    </div>
  );
};

export default RegressionAlert;
