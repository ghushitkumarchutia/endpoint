import { formatDistanceToNow } from "date-fns";
import { Brain, AlertCircle, Search, Microscope } from "lucide-react";

const RootCauseCard = ({ analysis, onClick }) => {
  const { analyzedAt, context, possibleCauses, aiAnalysis } = analysis;
  const topCause = possibleCauses?.[0];

  return (
    <div
      onClick={onClick}
      className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group'
    >
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors'>
            <Brain className='h-5 w-5 text-purple-600' />
          </div>
          <div>
            <p className='font-bold text-gray-900 font-dmsans'>
              Root Cause Analysis
            </p>
            <p className='text-xs text-gray-500 font-medium'>
              {formatDistanceToNow(new Date(analyzedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        {topCause && (
          <span className='px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100'>
            {topCause.probability}% Match
          </span>
        )}
      </div>

      {context?.error && (
        <div className='mb-4 p-3 bg-red-50 rounded-xl border border-red-100/50 flex items-start gap-2.5'>
          <AlertCircle className='h-4 w-4 text-red-500 mt-0.5 shrink-0' />
          <p className='text-xs text-red-600 font-medium font-mono leading-relaxed break-all'>
            {context.error}
          </p>
        </div>
      )}

      {topCause && (
        <div className='mb-4'>
          <div className='flex items-center gap-1.5 mb-2'>
            <Search className='h-3.5 w-3.5 text-gray-400' />
            <p className='text-xs font-bold text-gray-500 uppercase tracking-wide'>
              Primary Suspect
            </p>
          </div>
          <div className='p-3.5 bg-gray-50/80 rounded-xl border border-gray-100'>
            <p className='text-sm font-semibold text-gray-900 mb-2'>
              {topCause.cause}
            </p>
            {topCause.evidence?.length > 0 && (
              <ul className='space-y-1.5'>
                {topCause.evidence.slice(0, 2).map((e, i) => (
                  <li
                    key={i}
                    className='flex items-start gap-2 text-xs text-gray-600'
                  >
                    <span className='w-1 h-1 bg-purple-400 rounded-full mt-1.5 shrink-0' />
                    <span className='leading-relaxed'>{e}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {aiAnalysis && (
        <div className='pt-3 border-t border-gray-50'>
          <div className='flex items-center gap-1.5 mb-2'>
            <Microscope className='h-3.5 w-3.5 text-gray-400' />
            <p className='text-xs font-bold text-gray-500 uppercase tracking-wide'>
              AI Diagnosis
            </p>
          </div>
          <p className='text-sm text-gray-600 leading-relaxed'>{aiAnalysis}</p>
        </div>
      )}
    </div>
  );
};

export default RootCauseCard;
