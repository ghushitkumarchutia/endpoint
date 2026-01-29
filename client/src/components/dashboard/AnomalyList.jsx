import { AlertTriangle, Clock } from "lucide-react";
import { formatRelativeTime } from "../../utils/formatDate";
import { SEVERITY_COLORS } from "../../utils/constants";

const AnomalyList = ({ anomalies }) => {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className='text-center py-6 px-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-sm'>
        No recent anomalies detected
      </div>
    );
  }

  return (
    <div className='space-y-3 w-full'>
      {anomalies.map((anomaly) => (
        <div
          key={anomaly._id}
          className='flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors'
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
              <h4 className='font-medium text-gray-800 capitalize truncate text-sm'>
                {anomaly.type.replace(/_/g, " ")}
              </h4>
              <span className='text-xs text-gray-400 flex items-center gap-1'>
                <Clock className='h-3 w-3' />
                {formatRelativeTime(anomaly.createdAt)}
              </span>
            </div>
            <p className='text-xs text-gray-500'>
              Value:{" "}
              <span className='font-mono text-gray-700'>
                {anomaly.currentValue}ms
              </span>{" "}
              <span className='text-gray-400'>
                (Expected: {anomaly.expectedValue}ms)
              </span>
            </p>
            {anomaly.aiInsight && (
              <div className='text-xs bg-emerald-50 text-emerald-700 p-2 rounded-lg mt-2 border border-emerald-100'>
                <strong>AI Insight:</strong> {anomaly.aiInsight}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnomalyList;
