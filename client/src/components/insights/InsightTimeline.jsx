import { format } from "date-fns";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";

const severityIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  critical: AlertCircle,
};

const severityColors = {
  info: "text-blue-500 bg-blue-500/10",
  warning: "text-yellow-500 bg-yellow-500/10",
  error: "text-red-500 bg-red-500/10",
  critical: "text-red-600 bg-red-600/10",
};

const InsightTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className='text-center py-6 text-muted-foreground'>
        No timeline events available
      </div>
    );
  }

  return (
    <div className='relative'>
      <div className='absolute left-4 top-0 bottom-0 w-px bg-border' />
      <div className='space-y-4'>
        {timeline.map((event, index) => {
          const Icon = severityIcons[event.severity] || Info;
          return (
            <div key={index} className='flex gap-4 relative'>
              <div
                className={`z-10 p-1.5 rounded-full ${severityColors[event.severity] || severityColors.info}`}
              >
                <Icon className='h-4 w-4' />
              </div>
              <div className='flex-1 pb-4'>
                <p className='text-sm font-medium'>{event.event}</p>
                <p className='text-xs text-muted-foreground'>
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
