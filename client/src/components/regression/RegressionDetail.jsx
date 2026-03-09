import { ArrowUp, ArrowDown, Microscope } from "lucide-react";
import RegressionChart from "../charts/RegressionChart";

const RegressionDetail = ({ regression }) => {
  if (!regression) {
    return (
      <div className='text-center py-8 text-gray-400'>
        No regression data available
      </div>
    );
  }

  const {
    baselineStats = {},
    currentStats = {},
    regressionDetails = {},
    data = [],
  } = regression;

  const changes = [
    {
      label: "Avg Response Time",
      baseline: baselineStats.avgResponseTime,
      current: currentStats.avgResponseTime,
      unit: "ms",
      higherIsBad: true,
    },
    {
      label: "P95 Response Time",
      baseline: baselineStats.p95ResponseTime,
      current: currentStats.p95ResponseTime,
      unit: "ms",
      higherIsBad: true,
    },
    {
      label: "Error Rate",
      baseline: baselineStats.errorRate,
      current: currentStats.errorRate,
      unit: "%",
      higherIsBad: true,
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm'>
        <h3 className='font-bold text-gray-900 font-dmsans mb-4 text-sm uppercase tracking-wide'>
          Performance Impact
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {changes.map((item, idx) => {
            const change = item.current - item.baseline;
            const percentChange = item.baseline
              ? ((change / item.baseline) * 100).toFixed(1)
              : 0;
            const isWorse = item.higherIsBad ? change > 0 : change < 0;

            return (
              <div
                key={idx}
                className='bg-gray-50/80 rounded-xl p-3 border border-gray-100'
              >
                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2'>
                  {item.label}
                </p>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-end justify-between'>
                    <p className='text-xl font-bold text-gray-900 font-mono'>
                      {item.current?.toFixed(1)}
                      <span className='text-sm text-gray-400 ml-0.5'>
                        {item.unit}
                      </span>
                    </p>
                    <div
                      className={`flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${isWorse ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}
                    >
                      {isWorse ? (
                        <ArrowUp className='h-3 w-3' />
                      ) : (
                        <ArrowDown className='h-3 w-3' />
                      )}
                      {Math.abs(percentChange)}%
                    </div>
                  </div>
                  <p className='text-xs text-gray-400'>
                    prev: {item.baseline?.toFixed(1)}
                    {item.unit}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {data.length > 0 && (
        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm'>
          <h3 className='font-bold text-gray-900 font-dmsans mb-4 text-sm uppercase tracking-wide'>
            Response Time Trend
          </h3>
          <RegressionChart
            baseline={baselineStats.avgResponseTime}
            data={data}
          />
        </div>
      )}

      {regressionDetails.aiAnalysis && (
        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm'>
          <div className='flex items-center gap-2 mb-3'>
            <Microscope className='h-4 w-4 text-purple-500' />
            <h3 className='font-bold text-gray-900 font-dmsans text-sm uppercase tracking-wide'>
              AI Diagnosis
            </h3>
          </div>

          <p className='text-sm text-gray-600 leading-relaxed bg-purple-50/50 p-4 rounded-xl border border-purple-100'>
            {regressionDetails.aiAnalysis}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegressionDetail;
