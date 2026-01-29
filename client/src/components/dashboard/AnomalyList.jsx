import { AlertTriangle, Clock } from "lucide-react";
import { formatRelativeTime } from "../../utils/formatDate";
import { SEVERITY_COLORS } from "../../utils/constants";

const AnomalyList = ({ anomalies }) => {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className='text-center py-8 px-8 text-neutral-400 bg-neutral-800/50 rounded-2xl border border-dashed border-neutral-700'>
        No recent anomalies detected
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {anomalies.map((anomaly) => (
        <div
          key={anomaly._id}
          className='flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:bg-muted/30 transition-colors'
        >
          <div
            className={`p-2 rounded-full shrink-0 ${
              SEVERITY_COLORS[anomaly.severity]
                .replace("text-", "bg-")
                .split(" ")[1]
            }`}
          >
            <AlertTriangle
              className={`h-5 w-5 ${SEVERITY_COLORS[anomaly.severity].split(" ")[0]}`}
            />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between mb-1'>
              <h4 className='font-medium text-foreground capitalize truncate'>
                {anomaly.type.replace(/_/g, " ")}
              </h4>
              <span className='text-xs text-muted-foreground flex items-center gap-1'>
                <Clock className='h-3 w-3' />
                {formatRelativeTime(anomaly.createdAt)}
              </span>
            </div>
            <p className='text-sm text-muted-foreground mb-2'>
              Value:{" "}
              <span className='font-mono text-foreground'>
                {anomaly.currentValue}ms
              </span>{" "}
              <span className='text-xs'>
                (Expected: {anomaly.expectedValue}ms)
              </span>
            </p>
            {anomaly.aiInsight && (
              <div className='text-xs bg-primary/5 text-primary p-2 rounded border border-primary/10'>
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
