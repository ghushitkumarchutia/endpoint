import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  Clock,
  Zap,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { ALERT_STATUS } from "../../utils/constants";

const PredictiveCard = ({ alert, onClick, onUpdateStatus }) => {
  const {
    _id,
    apiId,
    failureProbability,
    predictedFailureTime,
    earlyWarningSignals,
    recommendedActions,
    status,
    createdAt,
  } = alert;

  const isHighRisk = failureProbability >= 80;
  const isMediumRisk = failureProbability >= 50;

  const getUrgencyStyles = () => {
    if (isHighRisk)
      return {
        border: "border-red-100",
        bg: "bg-red-50/50",
        iconColor: "text-red-500",
        badge: "bg-red-100 text-red-700",
      };
    if (isMediumRisk)
      return {
        border: "border-amber-100",
        bg: "bg-amber-50/50",
        iconColor: "text-amber-500",
        badge: "bg-amber-100 text-amber-700",
      };
    return {
      border: "border-gray-200",
      bg: "bg-white",
      iconColor: "text-gray-500",
      badge: "bg-gray-100 text-gray-700",
    };
  };

  const styles = getUrgencyStyles();

  return (
    <div
      className={`bg-white border ${styles.border} rounded-[20px] p-5 shadow-sm relative overflow-hidden transition-all hover:shadow-md`}
    >
      {isHighRisk && (
        <div className='absolute top-0 left-0 w-1 h-full bg-red-500'></div>
      )}

      <div className='flex items-start justify-between mb-4 pl-2'>
        <div className='flex items-center gap-3'>
          <div
            className={`p-2 rounded-xl bg-white shadow-sm border border-gray-100`}
          >
            <AlertTriangle className={`h-5 w-5 ${styles.iconColor}`} />
          </div>
          <div>
            <h3
              className='font-bold text-gray-900 font-dmsans cursor-pointer hover:text-gray-700 transition-colors'
              onClick={onClick}
            >
              {apiId?.name || "Unknown API"}
            </h3>
            <p className='text-xs text-gray-500 font-medium'>
              Detected{" "}
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${styles.badge}`}
        >
          {status.replace("_", " ")}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-5 pl-2'>
        <div className='p-3 bg-gray-50 rounded-xl border border-gray-100'>
          <p className='text-xs text-gray-500 font-medium mb-1'>
            Failure Probability
          </p>
          <div className='flex items-end gap-1'>
            <p
              className={`text-2xl font-bold leading-none ${isHighRisk ? "text-red-600" : isMediumRisk ? "text-amber-600" : "text-gray-700"}`}
            >
              {failureProbability}%
            </p>
            <span className='text-xs text-gray-400 mb-0.5'>risk</span>
          </div>
        </div>
        {predictedFailureTime && (
          <div className='p-3 bg-gray-50 rounded-xl border border-gray-100'>
            <p className='text-xs text-gray-500 font-medium mb-1'>Impact In</p>
            <div className='flex items-center gap-1.5 text-gray-700'>
              <Clock className='h-4 w-4 text-gray-400' />
              <p className='text-lg font-bold leading-none'>
                {formatDistanceToNow(new Date(predictedFailureTime)).replace(
                  "about ",
                  "",
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {earlyWarningSignals?.length > 0 && (
        <div className='mb-5 pl-2'>
          <div className='flex items-center gap-1.5 mb-2'>
            <Zap className='h-3.5 w-3.5 text-gray-400' />
            <p className='text-xs font-bold text-gray-500 uppercase tracking-wide'>
              Signals
            </p>
          </div>
          <div className='space-y-1.5'>
            {earlyWarningSignals.slice(0, 3).map((signal, i) => (
              <div
                key={i}
                className='flex items-start gap-2 text-xs font-medium text-gray-600'
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    signal.severity === "critical"
                      ? "bg-red-500"
                      : signal.severity === "high"
                        ? "bg-orange-500"
                        : "bg-blue-500"
                  }`}
                />
                <span className='leading-relaxed'>{signal.signal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {status === "active" && onUpdateStatus && (
        <div className='flex gap-3 pl-2'>
          <button
            onClick={() => onUpdateStatus(_id, "acknowledged")}
            className='flex-1 text-xs font-bold py-2.5 px-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2'
          >
            <CheckCircle className='h-3.5 w-3.5' />
            Acknowledge
          </button>
          <button
            onClick={() => onUpdateStatus(_id, "mitigated")}
            className='flex-1 text-xs font-bold py-2.5 px-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 flex items-center justify-center gap-2'
          >
            <ShieldCheck className='h-3.5 w-3.5' />
            Mitigate
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictiveCard;
