import { AlertTriangle, Clock } from "lucide-react";
import { formatRelativeTime } from "../../utils/formatDate";
import { SEVERITY_COLORS } from "../../utils/constants";

const AnomalyList = ({ anomalies }) => {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className='h-full flex items-center justify-center py-8 px-6'>
        <div className='text-center p-6 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 w-full'>
          <p className='text-sm font-medium text-gray-400'>
            No recent anomalies detected
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-3 w-full'>
      {anomalies.map((anomaly) => (
        <div
          key={anomaly._id}
          className='flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100'
        >
          <div
            className={`p-2 rounded-lg shrink-0 ${
              anomaly.severity === "critical"
                ? "bg-red-100"
                : anomaly.severity === "warning"
                  ? "bg-amber-100"
                  : "bg-gray-100"
            }`}
          >
            <AlertTriangle
              className={`h-4 w-4 ${
                anomaly.severity === "critical"
                  ? "text-red-500"
                  : anomaly.severity === "warning"
                    ? "text-amber-500"
                    : "text-gray-500"
              }`}
            />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between mb-1'>
              <h4 className='font-bold text-gray-900 capitalize truncate text-xs'>
                {anomaly.type.replace(/_/g, " ")}
              </h4>
              <span className='text-[10px] text-gray-400 flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-gray-200'>
                <Clock className='h-3 w-3' />
                {formatRelativeTime(anomaly.createdAt)}
              </span>
            </div>
            <p className='text-xs text-gray-500'>
              Value:{" "}
              <span className='font-mono font-bold text-gray-700'>
                {anomaly.currentValue}ms
              </span>{" "}
              <span className='text-gray-400 opacity-70'>
                / Exp: {anomaly.expectedValue}ms
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnomalyList;
