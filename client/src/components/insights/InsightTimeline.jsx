import { format } from "date-fns";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";

const severityIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  critical: AlertCircle,
};

const severityStyles = {
  info: "text-blue-500 bg-blue-50 border-blue-100",
  warning: "text-amber-500 bg-amber-50 border-amber-100",
  error: "text-red-500 bg-red-50 border-red-100",
  critical: "text-red-600 bg-red-50 border-red-100",
};

const InsightTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className='text-center py-6 text-gray-400'>
        No timeline events available
      </div>
    );
  }

  return (
    <div className='relative pl-4'>
      <div className='absolute left-[27px] top-0 bottom-0 w-[1px] bg-gray-100' />
      <div className='space-y-8 relative'>
        {timeline.map((event, index) => {
          const Icon = severityIcons[event.severity] || Info;
          return (
            <div key={index} className='flex gap-6 relative group'>
              <div
                className={`z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm transition-all group-hover:scale-110 ${severityStyles[event.severity] || severityStyles.info}`}
              >
                <Icon className='h-5 w-5' />
              </div>
              <div className='flex-1 py-1'>
                <p className='text-sm font-bold text-gray-900 font-dmsans'>
                  {event.title || event.event}
                </p>
                <p className='text-sm text-gray-600 mt-1 mb-2 leading-relaxed'>
                  {event.description}
                </p>
                <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 inline-block px-2 py-1 rounded-md'>
                  {format(new Date(event.timestamp), "MMM d, HH:mm:ss")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightTimeline;
