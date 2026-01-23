import { Lightbulb, TrendingDown, Clock, Zap } from "lucide-react";

const OptimizationTips = ({ tips }) => {
  const defaultTips = [
    {
      icon: TrendingDown,
      title: "Reduce Call Frequency",
      description: "Consider caching responses to reduce redundant API calls",
    },
    {
      icon: Clock,
      title: "Off-Peak Scheduling",
      description:
        "Schedule non-urgent calls during off-peak hours for lower rates",
    },
    {
      icon: Zap,
      title: "Batch Requests",
      description:
        "Combine multiple requests into batch operations where possible",
    },
  ];

  const displayTips = tips && tips.length > 0 ? tips : defaultTips;

  return (
    <div className='bg-card border border-border rounded-xl p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Lightbulb className='h-5 w-5 text-yellow-500' />
        <h3 className='font-semibold'>Optimization Tips</h3>
      </div>

      <div className='space-y-4'>
        {displayTips.map((tip, idx) => {
          const Icon = tip.icon || Lightbulb;
          return (
            <div key={idx} className='flex gap-3'>
              <div className='p-2 bg-muted rounded-lg h-fit'>
                <Icon className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <p className='font-medium text-sm'>{tip.title}</p>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  {tip.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OptimizationTips;
