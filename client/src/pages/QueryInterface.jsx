import { useState, useEffect } from "react";
import { History, Sparkles, MessageSquare } from "lucide-react";
import NLQueryChat from "../components/nlquery/NLQueryChat";
import QueryHistory from "../components/nlquery/QueryHistory";
import useNLQuery from "../hooks/useNLQuery";

const QueryInterface = () => {
  const [showHistory, setShowHistory] = useState(false);
  const { history, fetchHistory } = useNLQuery();

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex flex-col px-4 py-[20px] md:px-6 md:py-[22px] bg-[#f5f5f6] rounded-3xl h-full overflow-hidden'>
      <div className='flex items-center justify-between mb-6 shrink-0'>
        <div>
          <h1 className='text-2xl font-bold font-dmsans text-gray-900'>
            Natural Language Query
          </h1>
          <p className='text-sm text-gray-500 mt-1 font-medium font-bricolage'>
            Ask questions about your APIs in plain English
          </p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium border ${
            showHistory
              ? "bg-[#14412B] text-white border-[#14412B] shadow-md shadow-[#14412B]/20"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-sm"
          }`}
        >
          <History className='h-4 w-4' />
          {showHistory ? "Hide History" : "History"}
        </button>
      </div>

      <div className='flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6'>
        <div
          className={`flex flex-col min-h-0 bg-white border border-gray-200/60 rounded-[24px] shadow-sm overflow-hidden relative transition-all duration-300 ${
            showHistory ? "lg:col-span-8 xl:col-span-9" : "lg:col-span-12"
          }`}
        >
          <NLQueryChat />
        </div>

        {showHistory && (
          <div className='lg:col-span-4 xl:col-span-3 min-h-0 flex flex-col bg-white border border-gray-200/60 rounded-[24px] shadow-sm overflow-hidden animate-fade-in-right'>
            <div className='p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2 shrink-0'>
              <div className='p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm'>
                <MessageSquare className='h-4 w-4 text-gray-500' />
              </div>
              <h3 className='font-bold text-gray-900 font-dmsans text-sm'>
                Recent Queries
              </h3>
            </div>
            <div className='flex-1 overflow-y-auto p-2 custom-scrollbar'>
              <QueryHistory history={history} />
            </div>
          </div>
        )}
      </div>

      <div className='mt-4 p-4 bg-[#e8e8ea]/50 rounded-2xl border border-gray-200/60 shrink-0 hidden md:block'>
        <div className='flex items-start gap-3'>
          <div className='p-2 bg-white rounded-lg shadow-sm'>
            <Sparkles className='h-4 w-4 text-[#14412B]' />
          </div>
          <div>
            <p className='font-bold text-sm text-gray-900 font-dmsans'>
              Example queries you can ask:
            </p>
            <div className='flex flex-wrap gap-x-6 gap-y-1 mt-1.5'>
              <span className='text-xs text-gray-500 font-medium flex items-center gap-1.5'>
                <span className='w-1 h-1 rounded-full bg-gray-400'></span>
                "Which API has the highest error rate this week?"
              </span>
              <span className='text-xs text-gray-500 font-medium flex items-center gap-1.5'>
                <span className='w-1 h-1 rounded-full bg-gray-400'></span>
                "Show me the slowest endpoints"
              </span>
              <span className='text-xs text-gray-500 font-medium flex items-center gap-1.5'>
                <span className='w-1 h-1 rounded-full bg-gray-400'></span>
                "What caused the spike in errors yesterday?"
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryInterface;
