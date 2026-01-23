import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const CostCard = ({ api, onClick }) => {
  const { apiName, cost, trend, budget } = api;
  const percentUsed = budget ? Math.round((cost / budget) * 100) : 0;
  const isOverBudget = percentUsed > 100;

  return (
    <div
      onClick={onClick}
      className='bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors'
    >
      <div className='flex items-start justify-between mb-3'>
        <h3 className='font-medium truncate flex-1'>{apiName}</h3>
        <div className='flex items-center gap-1 text-xs'>
          {trend > 0 ? (
            <TrendingUp className='h-3 w-3 text-red-500' />
          ) : (
            <TrendingDown className='h-3 w-3 text-green-500' />
          )}
          <span className={trend > 0 ? "text-red-500" : "text-green-500"}>
            {Math.abs(trend)}%
          </span>
        </div>
      </div>

      <div className='flex items-baseline gap-1 mb-3'>
        <DollarSign className='h-4 w-4 text-muted-foreground' />
        <span className='text-2xl font-bold'>{cost.toFixed(2)}</span>
        {budget && (
          <span className='text-muted-foreground text-sm'>/ ${budget}</span>
        )}
      </div>

      {budget && (
        <div className='space-y-1'>
          <div className='h-2 bg-muted rounded-full overflow-hidden'>
            <div
              className={`h-full rounded-full transition-all ${
                isOverBudget
                  ? "bg-red-500"
                  : percentUsed > 80
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
          <p className='text-xs text-muted-foreground text-right'>
            {percentUsed}% of budget
          </p>
        </div>
      )}
    </div>
  );
};

export default CostCard;
