import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

const SLACard = ({ api }) => {
  if (!api) return null;
  const { apiName, slaConfig, latestReport } = api;
  const isCompliant = latestReport?.compliance;
  const metrics = latestReport?.metrics || {};

  return (
    <div
      className={`bg-white border rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden ${
        isCompliant
          ? "border-gray-200/60 hover:border-green-200"
          : "border-red-200 hover:border-red-300 ring-1 ring-red-500/10"
      }`}
    >
      <div
        className={`absolute top-0 left-0 w-1 h-full ${isCompliant ? "bg-green-500" : "bg-red-500"}`}
      ></div>

      <div className='flex items-start justify-between mb-5 pl-2'>
        <h3 className='font-bold text-gray-900 font-dmsans text-lg truncate pr-2'>
          {apiName}
        </h3>
        {isCompliant ? (
          <span className='flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100'>
            <CheckCircle className='h-3.5 w-3.5' /> Compliant
          </span>
        ) : (
          <span className='flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100'>
            <XCircle className='h-3.5 w-3.5' /> Breach
          </span>
        )}
      </div>

      <div className='grid grid-cols-3 gap-3 pl-2'>
        <div className='p-2.5 bg-gray-50/50 rounded-xl border border-gray-100'>
          <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1'>
            Uptime
          </p>
          <p
            className={`text-lg font-bold font-mono ${
              metrics.uptime >= (slaConfig?.uptimeTarget || 99.9)
                ? "text-gray-900"
                : "text-red-600"
            }`}
          >
            {metrics.uptime?.toFixed(1) || "—"}%
          </p>
          <p className='text-[10px] text-gray-400 mt-0.5'>
            Target: {slaConfig?.uptimeTarget || 99.9}%
          </p>
        </div>

        <div className='p-2.5 bg-gray-50/50 rounded-xl border border-gray-100'>
          <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1'>
            P95 Latency
          </p>
          <p
            className={`text-lg font-bold font-mono ${
              (metrics.p95ResponseTime || 0) <=
              (slaConfig?.responseTimeP95 || 500)
                ? "text-gray-900"
                : "text-red-600"
            }`}
          >
            {metrics.p95ResponseTime || "—"}ms
          </p>
          <p className='text-[10px] text-gray-400 mt-0.5'>
            Target: &lt;{slaConfig?.responseTimeP95 || 500}ms
          </p>
        </div>

        <div className='p-2.5 bg-gray-50/50 rounded-xl border border-gray-100'>
          <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1'>
            Error Rate
          </p>
          <p
            className={`text-lg font-bold font-mono ${
              (metrics.errorRate || 0) <= (slaConfig?.errorRateMax || 1)
                ? "text-gray-900"
                : "text-red-600"
            }`}
          >
            {metrics.errorRate?.toFixed(2) || "—"}%
          </p>
          <p className='text-[10px] text-gray-400 mt-0.5'>
            Target: &lt;{slaConfig?.errorRateMax || 1}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default SLACard;
