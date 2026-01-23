import { TrendingUp, Calendar } from "lucide-react";

const CostProjection = ({ currentCost = 0, projectedCost = 0, trend }) => {
  const safeCurrent = Number(currentCost) || 0;
  const safeProjected = Number(projectedCost) || 0;
  const difference = safeProjected - safeCurrent;
  const isIncreasing = difference > 0;

  return (
    <div className='bg-card border border-border rounded-xl p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Calendar className='h-5 w-5 text-muted-foreground' />
        <h3 className='font-semibold'>Monthly Projection</h3>
      </div>

      <div className='space-y-4'>
        <div>
          <p className='text-sm text-muted-foreground mb-1'>Current Month</p>
          <p className='text-2xl font-bold'>${safeCurrent.toFixed(2)}</p>
        </div>

        <div className='border-t border-border pt-4'>
          <p className='text-sm text-muted-foreground mb-1'>Projected Total</p>
          <div className='flex items-baseline gap-2'>
            <p className='text-3xl font-bold'>${safeProjected.toFixed(2)}</p>
            <div
              className={`flex items-center gap-1 text-sm ${isIncreasing ? "text-red-500" : "text-green-500"}`}
            >
              <TrendingUp
                className={`h-4 w-4 ${!isIncreasing && "rotate-180"}`}
              />
              <span>{Math.abs(difference).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {trend && (
          <p className='text-sm text-muted-foreground'>
            Trend: <span className='font-medium capitalize'>{trend}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CostProjection;
