import { ArrowUp, ArrowDown } from "lucide-react";
import RegressionChart from "../charts/RegressionChart";

const RegressionDetail = ({ regression }) => {
  if (!regression) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
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
      <div className='bg-card border border-border rounded-xl p-4'>
        <h3 className='font-semibold mb-4'>Performance Comparison</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {changes.map((item, idx) => {
            const change = item.current - item.baseline;
            const percentChange = item.baseline
              ? ((change / item.baseline) * 100).toFixed(1)
              : 0;
            const isWorse = item.higherIsBad ? change > 0 : change < 0;

            return (
              <div key={idx} className='bg-muted/50 rounded-lg p-3'>
                <p className='text-xs text-muted-foreground mb-2'>
                  {item.label}
                </p>
                <div className='flex items-end justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground line-through'>
                      {item.baseline?.toFixed(1)}
                      {item.unit}
                    </p>
                    <p className='text-lg font-bold'>
                      {item.current?.toFixed(1)}
                      {item.unit}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${isWorse ? "text-red-500" : "text-green-500"}`}
                  >
                    {isWorse ? (
                      <ArrowUp className='h-3 w-3' />
                    ) : (
                      <ArrowDown className='h-3 w-3' />
                    )}
                    {Math.abs(percentChange)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {data.length > 0 && (
        <div className='bg-card border border-border rounded-xl p-4'>
          <h3 className='font-semibold mb-4'>Response Time Trend</h3>
          <RegressionChart
            baseline={baselineStats.avgResponseTime}
            data={data}
          />
        </div>
      )}

      {regressionDetails.aiAnalysis && (
        <div className='bg-card border border-border rounded-xl p-4'>
          <h3 className='font-semibold mb-2'>AI Analysis</h3>
          <p className='text-sm text-muted-foreground'>
            {regressionDetails.aiAnalysis}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegressionDetail;
