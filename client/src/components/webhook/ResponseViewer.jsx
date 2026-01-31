import { Check, X, Clock, Copy, AlignLeft, Code } from "lucide-react";
import toast from "react-hot-toast";

const ResponseViewer = ({ response }) => {
  if (!response) {
    return (
      <div className='text-center py-12 text-gray-400'>
        <div className='h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3'>
          <AlignLeft className='h-5 w-5 text-gray-300' />
        </div>
        <p className='text-sm font-medium'>No response data available</p>
      </div>
    );
  }

  const isSuccess = response.statusCode >= 200 && response.statusCode < 300;

  const copyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(response.body, null, 2));
    toast.success("Response copied");
  };

  return (
    <div className='space-y-6'>
      {/* Status Header */}
      <div className='flex items-center justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100'>
        <div className='flex items-center gap-4'>
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
              isSuccess
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isSuccess ? (
              <Check className='h-6 w-6' />
            ) : (
              <X className='h-6 w-6' />
            )}
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <span
                className={`text-2xl font-bold font-dmsans ${
                  isSuccess ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {response.statusCode}
              </span>
              <span
                className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                  isSuccess
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {response.statusText || (isSuccess ? "OK" : "Error")}
              </span>
            </div>
            <p className='text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wide'>
              Status Code
            </p>
          </div>
        </div>
        <div className='text-right'>
          <div className='flex items-center gap-1.5 text-gray-700 font-bold font-mono text-lg justify-end'>
            <Clock className='h-4 w-4 text-gray-400' />
            {response.duration}ms
          </div>
          <p className='text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wide'>
            Duration
          </p>
        </div>
      </div>

      {/* Response Body */}
      {response.body && (
        <div className='animate-fade-in-up delay-100'>
          <div className='flex items-center justify-between mb-2.5 px-1'>
            <h4 className='text-sm font-bold text-gray-800 flex items-center gap-2'>
              <Code className='h-4 w-4 text-gray-400' />
              Response Body
            </h4>
            <button
              onClick={copyResponse}
              className='p-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5'
            >
              <Copy className='h-3.5 w-3.5' />
              Copy JSON
            </button>
          </div>
          <div className='relative group'>
            <pre className='p-4 bg-[#1a1b1e] border border-gray-800 rounded-xl text-[13px] font-mono leading-relaxed text-gray-300 overflow-auto max-h-[400px] custom-scrollbar shadow-inner'>
              {typeof response.body === "string"
                ? response.body
                : JSON.stringify(response.body, null, 2)}
            </pre>
            <div className='absolute top-3 right-4'>
              <span className='text-[10px] font-bold text-gray-600 uppercase tracking-widest'>
                JSON
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Headers */}
      {response.headers && Object.keys(response.headers).length > 0 && (
        <div className='animate-fade-in-up delay-200'>
          <h4 className='text-sm font-bold text-gray-800 mb-3 px-1 flex items-center gap-2'>
            <AlignLeft className='h-4 w-4 text-gray-400' />
            Response Headers
          </h4>
          <div className='border border-gray-200 rounded-xl overflow-hidden'>
            {Object.entries(response.headers).map(([key, value], index) => (
              <div
                key={key}
                className={`flex text-sm p-3 ${index !== Object.keys(response.headers).length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50/50 transition-colors`}
              >
                <div className='font-mono text-gray-500 min-w-[180px] shrink-0 text-xs uppercase tracking-wide pt-0.5'>
                  {key}
                </div>
                <div className='font-mono text-gray-800 break-all text-xs'>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseViewer;
