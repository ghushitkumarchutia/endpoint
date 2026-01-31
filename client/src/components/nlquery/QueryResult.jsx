import { Bot, ThumbsUp, ThumbsDown, Clock, BrainCircuit } from "lucide-react";

const QueryResult = ({ result, onFeedback }) => {
  if (!result) return null;

  const { queryId, query, response, parsedIntent, executionTime } = result;

  return (
    <div className='flex items-start gap-3'>
      <div className='h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0 border border-gray-200'>
        <Bot className='h-4 w-4 text-gray-600' />
      </div>

      <div className='flex-1 max-w-full'>
        <div className='bg-white border border-gray-200 rounded-[20px] rounded-tl-sm p-4 md:p-5 shadow-sm'>
          {parsedIntent && (
            <div className='flex items-center gap-2 mb-3'>
              <div className='flex items-center gap-1.5 px-2 py-1 bg-[#14412B]/5 border border-[#14412B]/10 rounded-md'>
                <BrainCircuit className='h-3 w-3 text-[#14412B]' />
                <span className='text-[10px] uppercase font-bold text-[#14412B] tracking-wide'>
                  {parsedIntent.type?.replace(/_/g, " ")} Analysis
                </span>
              </div>
              <span className='text-[10px] text-gray-400 font-medium'>
                {parsedIntent.confidence}% confidence
              </span>
            </div>
          )}

          <div className='prose prose-sm prose-gray max-w-none mb-4 text-gray-700 leading-relaxed font-medium'>
            <p className='whitespace-pre-wrap'>{response}</p>
          </div>

          <div className='flex items-center justify-between pt-3 border-t border-gray-50'>
            <div className='flex items-center gap-1.5 text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full'>
              <Clock className='h-3 w-3' />
              {executionTime}ms
            </div>

            {onFeedback && (
              <div className='flex items-center gap-1'>
                <span className='text-[10px] text-gray-400 font-medium mr-1.5'>
                  Helpful?
                </span>
                <button
                  onClick={() => onFeedback(queryId, true)}
                  className='p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors'
                  title='Helpful'
                >
                  <ThumbsUp className='h-3.5 w-3.5' />
                </button>
                <div className='w-[1px] h-3 bg-gray-200'></div>
                <button
                  onClick={() => onFeedback(queryId, false)}
                  className='p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors'
                  title='Not helpful'
                >
                  <ThumbsDown className='h-3.5 w-3.5' />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryResult;
