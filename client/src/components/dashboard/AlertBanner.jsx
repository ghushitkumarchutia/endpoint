import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

const AlertBanner = ({ alert, onDismiss, iconOnly = false }) => {
  const [visible, setVisible] = useState(true);

  if (!alert || !visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss && onDismiss(alert._id);
  };

  if (iconOnly) {
    return (
      <div
        className='mr-2 p-3.5 bg-red-500/10 backdrop-blur-3xl rounded-2xl'
        title={alert.title || "Predictive Alert"}
      >
        <AlertTriangle className='h-7 w-7 md:h-7 md:w-7 text-red-500' />
      </div>
    );
  }

  return (
    <div className='bg-red-500/10 border border-red-500/25 rounded-2xl px-4 py-3 flex items-start gap-3'>
      <AlertTriangle className='h-5 w-5 text-red-400 shrink-0 mt-0.5' />
      <div className='flex-1 min-w-0'>
        <h4 className='font-bricolage font-medium text-red-400 text-sm'>
          {alert.title || "Predictive Alert"}
        </h4>
        {alert.message && (
          <p className='font-bricolage text-red-300/80 text-xs mt-1 line-clamp-2'>
            {alert.message}
          </p>
        )}
        {alert.apiName && (
          <p className='font-bricolage text-red-300/60 text-xs mt-1'>
            API: {alert.apiName}
          </p>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className='p-1.5 rounded-full cursor-pointer hover:bg-red-500/20 transition-colors shrink-0'
        aria-label='Dismiss alert'
      >
        <X className='h-4 w-4 text-red-500' />
      </button>
    </div>
  );
};

export default AlertBanner;
