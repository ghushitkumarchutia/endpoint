import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import CostCard from "./CostCard";
import BudgetProgress from "./BudgetProgress";

const CostDashboard = ({ data, onApiClick }) => {
  if (!data) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        Loading cost data...
      </div>
    );
  }

  const { totalCost = 0, budget = 0, apis = [], trend = 0 } = data;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm text-muted-foreground'>
              Total Cost (MTD)
            </span>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </div>
          <p className='text-2xl font-bold'>${totalCost.toFixed(2)}</p>
          <div className='flex items-center gap-1 mt-1 text-xs'>
            {trend >= 0 ? (
              <TrendingUp className='h-3 w-3 text-red-500' />
            ) : (
              <TrendingDown className='h-3 w-3 text-green-500' />
            )}
            <span className={trend >= 0 ? "text-red-500" : "text-green-500"}>
              {Math.abs(trend)}% from last month
            </span>
          </div>
        </div>

        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm text-muted-foreground'>Budget</span>
            <AlertCircle className='h-4 w-4 text-muted-foreground' />
          </div>
          <BudgetProgress used={totalCost} total={budget} />
        </div>

        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm text-muted-foreground'>APIs Tracked</span>
          </div>
          <p className='text-2xl font-bold'>{apis.length}</p>
          <p className='text-xs text-muted-foreground mt-1'>
            with cost tracking enabled
          </p>
        </div>
      </div>

      {apis.length > 0 && (
        <div>
          <h3 className='font-semibold mb-4'>Cost by API</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {apis.map((api) => (
              <CostCard
                key={api._id || api.apiId}
                api={api}
                onClick={() => onApiClick && onApiClick(api)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CostDashboard;
