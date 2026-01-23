import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

const QueryHistory = ({ history, onSelect }) => {
  if (!history || history.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No query history yet
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {history.map((item) => (
        <div
          key={item._id}
          onClick={() => onSelect && onSelect(item.query)}
          className='p-3 bg-card border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors'
        >
          <div className='flex items-start gap-3'>
            <MessageSquare className='h-4 w-4 text-muted-foreground mt-0.5' />
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium truncate'>{item.query}</p>
              <p className='text-xs text-muted-foreground line-clamp-1 mt-1'>
                {item.response}
              </p>
              <div className='flex items-center gap-3 mt-2 text-xs text-muted-foreground'>
                <span>
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                {item.wasHelpful !== null && (
                  <span className='flex items-center gap-1'>
                    {item.wasHelpful ? (
                      <ThumbsUp className='h-3 w-3 text-green-500' />
                    ) : (
                      <ThumbsDown className='h-3 w-3 text-red-500' />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QueryHistory;
