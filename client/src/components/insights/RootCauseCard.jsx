import { formatDistanceToNow } from "date-fns";
import { Brain } from "lucide-react";

const RootCauseCard = ({ analysis, onClick }) => {
  const { analyzedAt, context, possibleCauses, aiAnalysis } = analysis;
  const topCause = possibleCauses?.[0];

  return (
    <div
      onClick={onClick}
      className='bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors'
    >
      <div className='flex items-start gap-3 mb-3'>
        <Brain className='h-5 w-5 text-primary mt-0.5' />
        <div className='flex-1'>
          <p className='font-medium'>Root Cause Analysis</p>
          <p className='text-xs text-muted-foreground'>
            {formatDistanceToNow(new Date(analyzedAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {context?.error && (
        <div className='mb-3 p-2 bg-red-500/10 rounded-lg'>
          <p className='text-sm text-red-500 font-mono'>{context.error}</p>
        </div>
      )}

      {topCause && (
        <div className='mb-3 p-3 bg-muted/50 rounded-lg'>
          <div className='flex items-center justify-between mb-1'>
            <span className='text-sm font-medium'>{topCause.cause}</span>
            <span className='text-xs bg-primary/10 text-primary px-2 py-0.5 rounded'>
              {topCause.probability}% likely
            </span>
          </div>
          {topCause.evidence?.length > 0 && (
            <ul className='text-xs text-muted-foreground space-y-1'>
              {topCause.evidence.slice(0, 2).map((e, i) => (
                <li key={i} className='flex items-center gap-1'>
                  <span className='w-1 h-1 bg-muted-foreground rounded-full' />
                  {e}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {aiAnalysis && (
        <p className='text-sm text-muted-foreground line-clamp-2'>
          {aiAnalysis}
        </p>
      )}
    </div>
  );
};

export default RootCauseCard;
