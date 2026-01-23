import { Check, X, Clock, Copy } from "lucide-react";
import toast from "react-hot-toast";

const ResponseViewer = ({ response }) => {
  if (!response) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No response data
      </div>
    );
  }

  const isSuccess = response.statusCode >= 200 && response.statusCode < 300;

  const copyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(response.body, null, 2));
    toast.success("Response copied");
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div
            className={`p-2 rounded-full ${
              isSuccess ? "bg-green-500/10" : "bg-destructive/10"
            }`}
          >
            {isSuccess ? (
              <Check className='h-4 w-4 text-green-500' />
            ) : (
              <X className='h-4 w-4 text-destructive' />
            )}
          </div>
          <div>
            <span
              className={`text-lg font-semibold ${
                isSuccess ? "text-green-500" : "text-destructive"
              }`}
            >
              {response.statusCode}
            </span>
            <span className='text-sm text-muted-foreground ml-2'>
              {response.statusText || (isSuccess ? "OK" : "Error")}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Clock className='h-4 w-4' />
          {response.duration}ms
        </div>
      </div>

      {response.headers && Object.keys(response.headers).length > 0 && (
        <div>
          <h4 className='text-sm font-medium mb-2'>Headers</h4>
          <div className='p-3 bg-muted rounded-lg space-y-1'>
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className='flex text-xs'>
                <span className='font-medium text-primary min-w-[140px]'>
                  {key}:
                </span>
                <span className='text-muted-foreground truncate'>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {response.body && (
        <div>
          <div className='flex items-center justify-between mb-2'>
            <h4 className='text-sm font-medium'>Body</h4>
            <button
              onClick={copyResponse}
              className='p-1 hover:bg-muted rounded transition-colors'
            >
              <Copy className='h-3.5 w-3.5' />
            </button>
          </div>
          <pre className='p-3 bg-muted rounded-lg text-xs overflow-auto max-h-64'>
            {typeof response.body === "string"
              ? response.body
              : JSON.stringify(response.body, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ResponseViewer;
