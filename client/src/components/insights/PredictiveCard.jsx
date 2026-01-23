import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Clock } from "lucide-react";
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

  const urgencyColor =
    failureProbability >= 80
      ? "border-red-500/50 bg-red-500/5"
      : failureProbability >= 50
        ? "border-yellow-500/50 bg-yellow-500/5"
        : "border-border";

  return (
    <div className={`bg-card border rounded-xl p-4 ${urgencyColor}`}>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <AlertTriangle
            className={`h-5 w-5 ${failureProbability >= 80 ? "text-red-500" : "text-yellow-500"}`}
          />
          <div>
            <h3
              className='font-medium cursor-pointer hover:text-primary'
              onClick={onClick}
            >
              {apiId?.name || "Unknown API"}
            </h3>
            <p className='text-xs text-muted-foreground'>
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <span
            className={`text-xs px-2 py-1 rounded capitalize ${ALERT_STATUS[status] || ""}`}
          >
            {status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div className='p-3 bg-muted/50 rounded-lg text-center'>
          <p className='text-xs text-muted-foreground mb-1'>
            Failure Probability
          </p>
          <p
            className={`text-2xl font-bold ${failureProbability >= 80 ? "text-red-500" : failureProbability >= 50 ? "text-yellow-500" : "text-foreground"}`}
          >
            {failureProbability}%
          </p>
        </div>
        {predictedFailureTime && (
          <div className='p-3 bg-muted/50 rounded-lg text-center'>
            <p className='text-xs text-muted-foreground mb-1'>Predicted In</p>
            <p className='text-lg font-bold flex items-center justify-center gap-1'>
              <Clock className='h-4 w-4' />
              {formatDistanceToNow(new Date(predictedFailureTime))}
            </p>
          </div>
        )}
      </div>

      {earlyWarningSignals?.length > 0 && (
        <div className='mb-4'>
          <p className='text-xs text-muted-foreground mb-2'>Warning Signals</p>
          <div className='space-y-1'>
            {earlyWarningSignals.slice(0, 3).map((signal, i) => (
              <div key={i} className='flex items-center gap-2 text-sm'>
                <span
                  className={`w-2 h-2 rounded-full ${
                    signal.severity === "critical"
                      ? "bg-red-500"
                      : signal.severity === "high"
                        ? "bg-orange-500"
                        : signal.severity === "medium"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                  }`}
                />
                <span className='text-muted-foreground'>{signal.signal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendedActions?.length > 0 && (
        <div className='p-3 bg-primary/5 rounded-lg border border-primary/20'>
          <p className='text-xs font-medium text-primary mb-1'>
            Recommended Action
          </p>
          <p className='text-sm'>{recommendedActions[0].action}</p>
        </div>
      )}

      {status === "active" && onUpdateStatus && (
        <div className='flex gap-2 mt-4'>
          <button
            onClick={() => onUpdateStatus(_id, "acknowledged")}
            className='flex-1 text-sm py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors'
          >
            Acknowledge
          </button>
          <button
            onClick={() => onUpdateStatus(_id, "mitigated")}
            className='flex-1 text-sm py-2 px-3 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors'
          >
            Mark Mitigated
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictiveCard;
