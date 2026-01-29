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
    <div className='bg-red-500/20 border border-red-500/50 rounded-2xl p-3 flex items-start gap-3'>
      <AlertTriangle className='h-6 w-6 text-red-500 shrink-0 mt-[2px]' />
      <div className='flex-1'>
        <h4 className='font-dmsans text-red-500 mt-[3px]'>
          {alert.title || "Predictive Alert"}
        </h4>
        <p className='text-dmsans text-red-500 mt-1'>{alert.message}</p>
        {alert.apiName && (
          <p className='text-dmsans text-red-500 mt-2'>API: {alert.apiName}</p>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className='p-1 rounded-full cursor-pointer hover:bg-white/20 transition-colors'
      >
        <X className='h-5 w-5 text-red-500' />
      </button>
    </div>
  );
};

export default AlertBanner;
