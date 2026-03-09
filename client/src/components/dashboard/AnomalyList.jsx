import { AlertTriangle, Clock } from "lucide-react";
import { formatRelativeTime } from "../../utils/formatDate";

const AnomalyList = ({ anomalies }) => {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className='flex items-center justify-center py-6 px-4'>
        <div className='text-center py-8 px-6 rounded-[24px] bg-white/3 w-full'>
          <p className='text-[13px] md:text-[16px] font-dmsans text-white/30'>
            No recent anomalies detected
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-2 w-full'>
      {anomalies.map((anomaly) => {
        const isHigh = anomaly.severity === "high";
        const isMedium = anomaly.severity === "medium";
        const iconColor = isHigh
          ? "text-red-400"
          : isMedium
            ? "text-amber-400"
            : "text-blue-400";
        const iconBg = isHigh
          ? "bg-red-500/10"
          : isMedium
            ? "bg-amber-500/10"
            : "bg-blue-500/10";

        return (
          <div
            key={anomaly._id}
            className='flex items-start gap-3 p-2.5 rounded-[26px] bg-white/5'
          >
            <div
              className={`p-3 rounded-[18px] ${iconBg} backdrop-blur-3xl shrink-0`}
            >
              <AlertTriangle className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between mb-1'>
                <h4 className='mt-[2px] md:mt-0 font-dmsans text-[14px] md:text-[15px] text-white capitalize truncate'>
                  {anomaly.type.replace(/_/g, " ")}
                </h4>
                <span className='text-[11px] text-white/40 font-dmsans flex items-center gap-1 shrink-0 mr-2'>
                  <Clock className='h-3 w-3' />
                  {formatRelativeTime(anomaly.createdAt)}
                </span>
              </div>
              {anomaly.type === "downtime" ? (
                <p className='text-[12px] md:text-[13px] font-dmsans text-red-400/80'>
                  Service unreachable
                </p>
              ) : (
                <p className='text-[12px] md:text-[13px] font-dmsans text-white/40'>
                  Value:{" "}
                  <span className='font-mono text-white'>
                    {anomaly.currentValue}
                    {anomaly.type === "response_time_spike" ? "ms" : ""}
                  </span>{" "}
                  <span className='text-white/40'>
                    / Exp: {anomaly.expectedValue}
                    {anomaly.type === "response_time_spike" ? "ms" : ""}
                  </span>
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnomalyList;
