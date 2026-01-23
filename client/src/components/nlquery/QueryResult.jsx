import { Bot, ThumbsUp, ThumbsDown } from "lucide-react";

const QueryResult = ({ result, onFeedback }) => {
  if (!result) return null;

  const { queryId, query, response, parsedIntent, executionTime } = result;

  return (
    <div className='bg-card border border-border rounded-xl p-4 space-y-4'>
      <div className='flex items-start gap-3'>
        <div className='p-2 bg-primary/10 rounded-lg'>
          <Bot className='h-5 w-5 text-primary' />
        </div>
        <div className='flex-1'>
          <p className='text-sm text-muted-foreground mb-2'>You asked:</p>
          <p className='font-medium mb-4'>{query}</p>

          {parsedIntent && (
            <div className='flex items-center gap-2 mb-3 text-xs'>
              <span className='px-2 py-1 bg-muted rounded capitalize'>
                {parsedIntent.type?.replace(/_/g, " ")}
              </span>
              <span className='text-muted-foreground'>
                {parsedIntent.confidence}% confidence
              </span>
            </div>
          )}

          <div className='p-4 bg-muted/50 rounded-lg'>
            <p className='text-sm whitespace-pre-wrap'>{response}</p>
          </div>

          <div className='flex items-center justify-between mt-4 pt-4 border-t border-border'>
            <span className='text-xs text-muted-foreground'>
              Response time: {executionTime}ms
            </span>

            {onFeedback && (
              <div className='flex items-center gap-2'>
                <span className='text-xs text-muted-foreground'>
                  Was this helpful?
                </span>
                <button
                  onClick={() => onFeedback(queryId, true)}
                  className='p-1.5 rounded hover:bg-green-500/10 transition-colors'
                  title='Helpful'
                >
                  <ThumbsUp className='h-4 w-4 text-green-500' />
                </button>
                <button
                  onClick={() => onFeedback(queryId, false)}
                  className='p-1.5 rounded hover:bg-red-500/10 transition-colors'
                  title='Not helpful'
                >
                  <ThumbsDown className='h-4 w-4 text-red-500' />
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
