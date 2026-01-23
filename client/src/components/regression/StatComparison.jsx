import { ArrowRight } from "lucide-react";

const StatComparison = ({
  label,
  baseline,
  current,
  unit = "",
  higherIsBetter = false,
}) => {
  const diff = current - baseline;
  const percentChange = baseline > 0 ? ((diff / baseline) * 100).toFixed(1) : 0;
  const isImproved = higherIsBetter ? diff > 0 : diff < 0;

  return (
    <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <div className='flex items-center gap-2'>
        <span className='font-mono text-sm'>
          {baseline?.toFixed(2)}
          {unit}
        </span>
        <ArrowRight className='h-4 w-4 text-muted-foreground' />
        <span
          className={`font-mono text-sm font-medium ${isImproved ? "text-green-500" : "text-red-500"}`}
        >
          {current?.toFixed(2)}
          {unit}
        </span>
        <span
          className={`text-xs px-1.5 py-0.5 rounded ${isImproved ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
        >
          {diff > 0 ? "+" : ""}
          {percentChange}%
        </span>
      </div>
    </div>
  );
};

export default StatComparison;
