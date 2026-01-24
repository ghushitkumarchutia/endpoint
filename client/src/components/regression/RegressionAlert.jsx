import { formatDistanceToNow } from "date-fns";
import { TrendingDown, AlertTriangle } from "lucide-react";
import { REGRESSION_STATUS } from "../../utils/constants";

const RegressionAlert = ({ regression, onClick }) => {
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
      className='bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-red-500/50 transition-colors'
    >
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <TrendingDown className='h-5 w-5 text-red-500' />
          <div>
            <h3 className='font-medium'>{apiId?.name || "Unknown API"}</h3>
            <p className='text-xs text-muted-foreground'>
              Detected{" "}
              {formatDistanceToNow(new Date(detectedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded capitalize ${REGRESSION_STATUS[status] || REGRESSION_STATUS.active}`}
        >
          {status.replace("_", " ")}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-3'>
        <div className='text-center p-2 bg-muted/50 rounded-lg'>
          <p className='text-xs text-muted-foreground'>Baseline P95</p>
          <p className='text-lg font-bold'>
            {baselineStats?.p95ResponseTime?.toFixed(0)}ms
          </p>
        </div>
        <div className='text-center p-2 bg-red-500/10 rounded-lg'>
          <p className='text-xs text-muted-foreground'>Current P95</p>
          <p className='text-lg font-bold text-red-500'>
            {currentStats?.p95ResponseTime?.toFixed(0)}ms
          </p>
        </div>
      </div>

      <div className='flex items-center justify-between text-sm'>
        <div className='flex items-center gap-1 text-red-500'>
          <AlertTriangle className='h-4 w-4' />
          <span>{degradationPercent?.toFixed(0)}% degradation</span>
        </div>
        <span className='text-muted-foreground'>
          {confidenceLevel?.toFixed(0)}% confidence
        </span>
      </div>
    </div>
  );
};

export default RegressionAlert;
