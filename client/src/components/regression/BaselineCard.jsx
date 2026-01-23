import { Clock, Activity, Percent, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const BaselineCard = ({ baseline, onReset }) => {
  if (!baseline) {
    return (
      <div className='bg-card border border-border rounded-xl p-4'>
        <p className='text-center text-muted-foreground'>
          No baseline established
        </p>
      </div>
    );
  }

  const {
    avgResponseTime = 0,
    p95ResponseTime = 0,
    errorRate = 0,
    sampleSize = 0,
    establishedAt,
  } = baseline;

  return (
    <div className='bg-card border border-border rounded-xl p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='font-semibold'>Current Baseline</h3>
        {onReset && (
          <button
            onClick={onReset}
            className='flex items-center gap-1 text-xs text-primary hover:underline'
          >
            <RefreshCw className='h-3 w-3' />
            Reset
          </button>
        )}
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='bg-muted/50 rounded-lg p-3'>
          <div className='flex items-center gap-1 text-xs text-muted-foreground mb-1'>
            <Clock className='h-3 w-3' />
            Avg Response
          </div>
          <p className='font-bold'>{avgResponseTime.toFixed(0)}ms</p>
        </div>

        <div className='bg-muted/50 rounded-lg p-3'>
          <div className='flex items-center gap-1 text-xs text-muted-foreground mb-1'>
            <Activity className='h-3 w-3' />
            P95 Response
          </div>
          <p className='font-bold'>{p95ResponseTime.toFixed(0)}ms</p>
        </div>

        <div className='bg-muted/50 rounded-lg p-3'>
          <div className='flex items-center gap-1 text-xs text-muted-foreground mb-1'>
            <Percent className='h-3 w-3' />
            Error Rate
          </div>
          <p className='font-bold'>{errorRate.toFixed(2)}%</p>
        </div>

        <div className='bg-muted/50 rounded-lg p-3'>
          <div className='flex items-center gap-1 text-xs text-muted-foreground mb-1'>
            Sample Size
          </div>
          <p className='font-bold'>{sampleSize}</p>
        </div>
      </div>

      {establishedAt && (
        <p className='text-xs text-muted-foreground mt-3'>
          Established{" "}
          {formatDistanceToNow(new Date(establishedAt), { addSuffix: true })}
        </p>
      )}
    </div>
  );
};

export default BaselineCard;
