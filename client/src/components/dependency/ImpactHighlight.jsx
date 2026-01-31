import { AlertTriangle, ArrowRight, Zap, Target } from "lucide-react";

const ImpactHighlight = ({ analysis, onNodeClick }) => {
  // Handle both prop names for backward compatibility during refactor
  const data = analysis || arguments[0].impactData;

  if (!data || !data.affectedApis || data.affectedApis.length === 0) {
    return null;
  }

  const { sourceApi, affectedApis, totalImpact } = data;

  return (
    <div className='absolute top-6 right-6 w-80 bg-white/95 backdrop-blur-sm border border-amber-100/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] z-20 overflow-hidden animate-fade-in-up'>
      <div className='bg-gradient-to-r from-amber-50 to-orange-50/50 p-4 border-b border-amber-100/50'>
        <div className='flex items-start gap-3'>
          <div className='p-2 bg-white rounded-xl shadow-sm border border-amber-100'>
            <AlertTriangle className='h-5 w-5 text-amber-500 fill-amber-500/20' />
          </div>
          <div>
            <h4 className='font-bold text-sm text-gray-900 font-dmsans'>
              Impact Analysis
            </h4>
            <p className='text-xs text-amber-900/70 mt-0.5 font-medium leading-relaxed'>
              If{" "}
              <span className='font-bold text-amber-600'>{sourceApi.name}</span>{" "}
              fails, it will cascade to:
            </p>
          </div>
        </div>
      </div>

      <div className='p-2 max-h-[300px] overflow-y-auto custom-scrollbar'>
        <div className='space-y-1'>
          {affectedApis.slice(0, 5).map((api) => (
            <div
              key={api.id}
              onClick={() => onNodeClick && onNodeClick(api.id)}
              className='flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group border border-transparent hover:border-gray-100'
            >
              <div className='h-6 w-6 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors'>
                <ArrowRight className='h-3 w-3 text-gray-400 group-hover:text-amber-500' />
              </div>
              <div className='flex-1 min-w-0'>
                <span className='text-sm font-medium text-gray-700 block truncate group-hover:text-gray-900'>
                  {api.name}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-md capitalize ${
                  api.depth === 1
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-orange-50 text-orange-600 border border-orange-100"
                }`}
              >
                {api.depth === 1 ? "Direct" : `Lyl ${api.depth}`}
              </span>
            </div>
          ))}
        </div>

        {affectedApis.length > 5 && (
          <div className='px-4 py-2 text-center'>
            <p className='text-xs font-medium text-gray-400'>
              +{affectedApis.length - 5} more dependent services
            </p>
          </div>
        )}
      </div>

      <div className='p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between'>
        <div className='flex items-center gap-2 text-xs font-medium text-gray-500'>
          <Target className='h-4 w-4' />
          Total Impact
        </div>
        <div className='flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-sm'>
          <Zap className='h-3 w-3 text-amber-500 fill-amber-500' />
          <span className='font-bold text-sm text-gray-800'>
            {totalImpact}{" "}
            <span className='text-gray-400 font-normal text-xs'>APIs</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImpactHighlight;
