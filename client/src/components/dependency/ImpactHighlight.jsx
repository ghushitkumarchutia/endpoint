import { AlertTriangle, ArrowRight } from "lucide-react";

const ImpactHighlight = ({ impactData, onNodeClick }) => {
  if (
    !impactData ||
    !impactData.affectedApis ||
    impactData.affectedApis.length === 0
  ) {
    return null;
  }

  const { sourceApi, affectedApis, totalImpact } = impactData;

  return (
    <div className='absolute top-4 right-4 bg-card border border-amber-500/50 rounded-lg shadow-lg p-4 max-w-sm z-10'>
      <div className='flex items-start gap-3'>
        <div className='p-2 bg-amber-500/10 rounded-lg'>
          <AlertTriangle className='h-5 w-5 text-amber-500' />
        </div>
        <div className='flex-1'>
          <h4 className='font-semibold text-sm'>Impact Analysis</h4>
          <p className='text-xs text-muted-foreground mt-1'>
            {sourceApi.name} failure would affect:
          </p>

          <div className='mt-3 space-y-2'>
            {affectedApis.slice(0, 5).map((api) => (
              <div
                key={api.id}
                onClick={() => onNodeClick && onNodeClick(api.id)}
                className='flex items-center gap-2 p-2 bg-muted/50 rounded cursor-pointer hover:bg-muted transition-colors'
              >
                <ArrowRight className='h-3 w-3 text-amber-500' />
                <span className='text-sm flex-1 truncate'>{api.name}</span>
                <span className='text-xs px-1.5 py-0.5 bg-amber-500/20 text-amber-500 rounded'>
                  {api.depth === 1 ? "Direct" : `Level ${api.depth}`}
                </span>
              </div>
            ))}
          </div>

          {affectedApis.length > 5 && (
            <p className='text-xs text-muted-foreground mt-2'>
              +{affectedApis.length - 5} more APIs affected
            </p>
          )}

          <div className='mt-3 pt-3 border-t border-border'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Total Impact</span>
              <span className='font-semibold text-amber-500'>
                {totalImpact} APIs
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactHighlight;
