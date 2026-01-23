import { formatDistanceToNow } from "date-fns";
import { Check, X, Clock, ChevronRight } from "lucide-react";

const WebhookHistory = ({ payloads, onSelect }) => {
  if (!payloads || payloads.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No webhook history yet
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {payloads.map((payload) => {
        const isSuccess =
          payload.response?.statusCode >= 200 &&
          payload.response?.statusCode < 300;

        return (
          <div
            key={payload._id}
            onClick={() => onSelect && onSelect(payload)}
            className='p-3 bg-card border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors'
          >
            <div className='flex items-center gap-3'>
              <div
                className={`p-1.5 rounded-full ${
                  isSuccess ? "bg-green-500/10" : "bg-destructive/10"
                }`}
              >
                {isSuccess ? (
                  <Check className='h-3.5 w-3.5 text-green-500' />
                ) : (
                  <X className='h-3.5 w-3.5 text-destructive' />
                )}
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium'>
                    {payload.event || "webhook_test"}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      isSuccess
                        ? "bg-green-500/10 text-green-500"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {payload.response?.statusCode || "N/A"}
                  </span>
                </div>
                <div className='flex items-center gap-3 mt-1 text-xs text-muted-foreground'>
                  <span className='flex items-center gap-1'>
                    <Clock className='h-3 w-3' />
                    {payload.response?.duration || 0}ms
                  </span>
                  <span>
                    {formatDistanceToNow(new Date(payload.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              <ChevronRight className='h-4 w-4 text-muted-foreground' />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WebhookHistory;
