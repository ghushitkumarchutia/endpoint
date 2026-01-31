import { Lightbulb, TrendingDown, Clock, Zap, Sparkles } from "lucide-react";

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
    <div className='bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[20px] p-6 text-white relative overflow-hidden shadow-lg'>
      <div className='absolute top-0 right-0 p-8 opacity-10'>
        <Sparkles className='h-40 w-40 text-white' />
      </div>

      <div className='flex items-center gap-3 mb-6 relative z-10'>
        <div className='p-2 bg-white/10 rounded-lg backdrop-blur-sm'>
          <Lightbulb className='h-5 w-5 text-yellow-300' />
        </div>
        <div>
          <h3 className='font-bold text-lg leading-tight'>Cost Optimization</h3>
          <p className='text-white/60 text-xs font-medium'>
            Smart ways to reduce your monthly bill
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10'>
        {displayTips.map((tip, idx) => {
          const Icon = tip.icon || Lightbulb;
          return (
            <div
              key={idx}
              className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors'
            >
              <div className='p-2 bg-indigo-500/30 rounded-lg h-fit w-fit mb-3'>
                <Icon className='h-4 w-4 text-indigo-200' />
              </div>
              <p className='font-bold text-sm mb-1 text-white'>{tip.title}</p>
              <p className='text-xs text-indigo-200/80 leading-relaxed font-medium'>
                {tip.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OptimizationTips;
