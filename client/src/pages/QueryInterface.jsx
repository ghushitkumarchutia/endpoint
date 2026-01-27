import { useState, useEffect } from "react";
import { History, Sparkles } from "lucide-react";
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
    <div className='h-[calc(100vh-120px)] flex flex-col'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h1 className='text-2xl font-bold'>Natural Language Query</h1>
          <p className='text-muted-foreground'>
            Ask questions about your APIs in plain English
          </p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            showHistory
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          <History className='h-4 w-4' />
          History
        </button>
      </div>

      <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div
          className={`bg-card border border-border rounded-xl overflow-hidden ${
            showHistory ? "lg:col-span-2" : "lg:col-span-3"
          }`}
        >
          <NLQueryChat />
        </div>

        {showHistory && (
          <div className='bg-card border border-border rounded-xl p-4 overflow-hidden'>
            <div className='flex items-center gap-2 mb-4'>
              <History className='h-5 w-5 text-muted-foreground' />
              <h3 className='font-semibold'>Query History</h3>
            </div>
            <div className='h-[calc(100%-40px)] overflow-y-auto'>
              <QueryHistory history={history} />
            </div>
          </div>
        )}
      </div>

      <div className='mt-4 p-4 bg-muted/50 border border-border rounded-xl'>
        <div className='flex items-start gap-3'>
          <Sparkles className='h-5 w-5 text-primary mt-0.5' />
          <div>
            <p className='font-medium text-sm'>Example queries you can ask:</p>
            <ul className='text-sm text-muted-foreground mt-1 space-y-1'>
              <li>• "Which API has the highest error rate this week?"</li>
              <li>• "Show me the slowest endpoints"</li>
              <li>• "What caused the spike in errors yesterday?"</li>
              <li>• "Compare performance between production and staging"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryInterface;
