import { Link2 } from "lucide-react";

const CorrelationList = ({ correlations }) => {
  if (!correlations || correlations.length === 0) {
    return (
      <div className='text-center py-6 text-muted-foreground text-sm'>
        No correlated failures found
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {correlations.map((item, idx) => (
        <div
          key={idx}
          className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'
        >
          <Link2 className='h-4 w-4 text-muted-foreground flex-shrink-0' />
          <div className='flex-1 min-w-0'>
            <p className='font-medium text-sm truncate'>
              {item.apiName || item.name}
            </p>
            <p className='text-xs text-muted-foreground'>
              Correlation: {(item.correlation * 100).toFixed(0)}%
            </p>
          </div>
          {item.failureCount && (
            <span className='text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded'>
              {item.failureCount} failures
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CorrelationList;
