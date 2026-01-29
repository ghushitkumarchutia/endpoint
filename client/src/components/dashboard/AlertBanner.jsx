import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

const AlertBanner = ({ alert, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  if (!alert || !visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss && onDismiss(alert._id);
  };

  return (
    <div className='bg-red-500/10 border border-red-500/30 rounded-[14px] pl-4 pr-1.5 h-10 flex items-center gap-3'>
      <AlertTriangle className='h-4.5 w-4.5 text-red-500 shrink-0 ' />
      <div className='flex-1 h-full flex items-center'>
        <h4 className='font-bricolage text-red-500 mt-[px]'>
          {alert.title || "Predictive Alert"}
        </h4>
        <p className='text-bricolage text-red-500 mt-1'>{alert.message}</p>
        {alert.apiName && (
          <p className='text-bricolage text-red-500 mt-2'>
            API: {alert.apiName}
          </p>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className='p-1.5 rounded-full cursor-pointer hover:bg-white/20 transition-colors'
      >
        <X className='h-4 w-4 text-red-500' />
      </button>
    </div>
  );
};

export default AlertBanner;
