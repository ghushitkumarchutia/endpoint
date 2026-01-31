import { TrendingUp, Calendar, ArrowRight } from "lucide-react";

const CostProjection = ({
  currentCost = 0,
  projectedCost = 0,
  trend,
  currency = "USD",
}) => {
  const safeCurrent = Number(currentCost) || 0;
  const safeProjected = Number(projectedCost) || 0;
  const difference = safeProjected - safeCurrent;
  const isIncreasing = difference > 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className='space-y-5'>
      <div className='flex flex-col gap-1'>
        <span className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>
          Current Month
        </span>
        <div className='flex items-center gap-3'>
          <span className='text-3xl font-bold font-dmsans text-gray-900'>
            {formatCurrency(safeCurrent)}
          </span>
          <span className='text-gray-300'>
            <ArrowRight className='h-5 w-5' />
          </span>
          <span className='text-3xl font-bold font-dmsans text-gray-400'>
            {formatCurrency(safeProjected)}
          </span>
        </div>
        <span className='text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1'>
          Projected Total
        </span>
      </div>

      <div
        className={`p-4 rounded-xl border ${isIncreasing ? "bg-amber-50 border-amber-100" : "bg-green-50 border-green-100"}`}
      >
        <div className='flex items-center gap-3'>
          <div
            className={`p-2 rounded-lg ${isIncreasing ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}
          >
            <TrendingUp
              className={`h-4 w-4 ${!isIncreasing && "rotate-180"}`}
            />
          </div>
          <div>
            <p
              className={`font-bold text-sm ${isIncreasing ? "text-amber-700" : "text-green-700"}`}
            >
              {isIncreasing ? "Projected Increase" : "Projected Savings"}
            </p>
            <p
              className={`text-xs ${isIncreasing ? "text-amber-600/80" : "text-green-600/80"}`}
            >
              Expected to {isIncreasing ? "increase" : "decrease"} by{" "}
              <span className='font-mono font-bold'>
                {formatCurrency(Math.abs(difference))}
              </span>
            </p>
          </div>
        </div>
      </div>

      {trend && (
        <div className='flex items-center gap-2 text-xs text-gray-500 font-medium'>
          <span className='w-1.5 h-1.5 rounded-full bg-gray-400'></span>
          Trend Analysis:{" "}
          <span className='text-gray-900 capitalize'>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default CostProjection;
