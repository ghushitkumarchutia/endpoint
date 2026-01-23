import { CheckCircle, XCircle, Clock } from "lucide-react";

const SLACard = ({ api }) => {
  const { apiName, slaConfig, latestReport } = api;
  const isCompliant = latestReport?.compliance;
  const metrics = latestReport?.metrics || {};

  return (
    <div
      className={`bg-card border rounded-xl p-4 ${isCompliant ? "border-green-500/30" : "border-red-500/30"}`}
    >
      <div className='flex items-start justify-between mb-4'>
        <h3 className='font-medium'>{apiName}</h3>
        {isCompliant ? (
          <span className='flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded'>
            <CheckCircle className='h-3 w-3' /> Compliant
          </span>
        ) : (
          <span className='flex items-center gap-1 text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded'>
            <XCircle className='h-3 w-3' /> Non-Compliant
          </span>
        )}
      </div>

      <div className='grid grid-cols-3 gap-4 text-center'>
        <div>
          <p className='text-xs text-muted-foreground mb-1'>Uptime</p>
          <p
            className={`text-lg font-bold ${metrics.uptime >= (slaConfig?.uptimeTarget || 99.9) ? "text-green-500" : "text-red-500"}`}
          >
            {metrics.uptime?.toFixed(1) || "—"}%
          </p>
          <p className='text-xs text-muted-foreground'>
            Target: {slaConfig?.uptimeTarget || 99.9}%
          </p>
        </div>
        <div>
          <p className='text-xs text-muted-foreground mb-1'>P95 Response</p>
          <p
            className={`text-lg font-bold ${(metrics.p95ResponseTime || 0) <= (slaConfig?.responseTimeP95 || 500) ? "text-green-500" : "text-red-500"}`}
          >
            {metrics.p95ResponseTime || "—"}ms
          </p>
          <p className='text-xs text-muted-foreground'>
            Target: {slaConfig?.responseTimeP95 || 500}ms
          </p>
        </div>
        <div>
          <p className='text-xs text-muted-foreground mb-1'>Error Rate</p>
          <p
            className={`text-lg font-bold ${(metrics.errorRate || 0) <= (slaConfig?.errorRateMax || 1) ? "text-green-500" : "text-red-500"}`}
          >
            {metrics.errorRate?.toFixed(2) || "—"}%
          </p>
          <p className='text-xs text-muted-foreground'>
            Target: ≤{slaConfig?.errorRateMax || 1}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default SLACard;
