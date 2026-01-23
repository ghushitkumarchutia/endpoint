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
    <div className='bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3'>
      <AlertTriangle className='h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5' />
      <div className='flex-1'>
        <h4 className='font-medium text-yellow-500'>
          {alert.title || "Predictive Alert"}
        </h4>
        <p className='text-sm text-muted-foreground mt-1'>{alert.message}</p>
        {alert.apiName && (
          <p className='text-xs text-muted-foreground mt-2'>
            API: {alert.apiName}
          </p>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className='p-1 rounded hover:bg-muted transition-colors'
      >
        <X className='h-4 w-4 text-muted-foreground' />
      </button>
    </div>
  );
};

export default AlertBanner;
