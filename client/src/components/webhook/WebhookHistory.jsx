import { formatDistanceToNow } from "date-fns";
import { Check, X, Clock, ChevronRight, Activity } from "lucide-react";

const WebhookHistory = ({ payloads, onSelect }) => {
  if (!payloads || payloads.length === 0) {
    return (
      <div className='text-center py-12 text-gray-400'>
        <Activity className='h-10 w-10 mx-auto mb-3 opacity-30' />
        <p className='text-sm'>No webhook history yet</p>
      </div>
    );
  }

  return (
    <div className='space-y-2.5'>
      {payloads.map((payload) => {
        const isSuccess =
          payload.response?.statusCode >= 200 &&
          payload.response?.statusCode < 300;

        return (
          <div
            key={payload._id}
            onClick={() => onSelect && onSelect(payload)}
            className='group p-3.5 bg-white border border-gray-200 rounded-[14px] hover:border-[#14412B]/30 hover:shadow-sm cursor-pointer transition-all flex items-center gap-3 relative overflow-hidden'
          >
            {/* Status Indicator Bar */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${isSuccess ? "bg-emerald-500" : "bg-red-500"}`}
            ></div>

            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                isSuccess
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {isSuccess ? (
                <Check className='h-4 w-4' />
              ) : (
                <X className='h-4 w-4' />
              )}
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between mb-0.5'>
                <span className='text-sm font-bold text-gray-900 truncate'>
                  {payload.event || "webhook_test"}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    isSuccess
                      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                      : "bg-red-50 border-red-100 text-red-700"
                  }`}
                >
                  {payload.response?.statusCode || "ERR"}
                </span>
              </div>

              <div className='flex items-center gap-3 text-[11px] text-gray-500 font-medium'>
                <span className='flex items-center gap-1'>
                  <Clock className='h-3 w-3 text-gray-400' />
                  {payload.response?.duration || 0}ms
                </span>
                <span className='text-gray-300'>•</span>
                <span>
                  {formatDistanceToNow(new Date(payload.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            <ChevronRight className='h-4 w-4 text-gray-300 group-hover:text-[#14412B] transition-colors' />
          </div>
        );
      })}
    </div>
  );
};

export default WebhookHistory;
