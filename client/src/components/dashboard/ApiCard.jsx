import { Link } from "react-router-dom";
import {
  Zap,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Timer,
} from "lucide-react";
import { ROUTES } from "../../utils/constants";
import { formatRelativeTime } from "../../utils/formatDate";

const ApiCard = ({ api }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "healthy":
        return {
          icon: CheckCircle2,
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          badge: "Healthy",
          badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "warning":
        return {
          icon: AlertCircle,
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          badge: "Warning",
          badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "down":
        return {
          icon: XCircle,
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          badge: "Down",
          badgeBg: "bg-red-50 text-red-700 border-red-200",
        };
      default:
        return {
          icon: Timer,
          iconBg: "bg-white border border-gray-200",
          iconColor: "text-gray-500",
          badge: "Unknown",
          badgeBg: "bg-gray-50 text-gray-500 border-gray-200",
        };
    }
  };

  const statusConfig = getStatusConfig(api.status);
  const StatusIcon = statusConfig.icon;

  const getUptimeColor = (uptime) => {
    if (uptime >= 99) return "text-emerald-600";
    if (uptime >= 90) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Link
      to={ROUTES.API_DETAILS.replace(":id", api._id)}
      className='group bg-gray-50/80 border border-gray-200/60 rounded-[24px] p-5 hover:border-[#14412B]/20 hover:bg-gray-50 transition-all hover:shadow-sm relative block'
    >
      {/* Arrow indicator on hover */}
      <div className='absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 group-hover:-translate-y-1'>
        <ArrowUpRight className='h-4 w-4 text-gray-400' />
      </div>

      {/* Header: Status Icon + Name + Method */}
      <div className='flex items-start gap-4 mb-5'>
        <div className={`p-3 rounded-2xl ${statusConfig.iconBg} shrink-0`}>
          <StatusIcon className={`h-6 w-6 ${statusConfig.iconColor}`} />
        </div>
        <div className='flex-1 min-w-0 pt-0.5'>
          <h3 className='font-bold font-dmsans text-gray-900 truncate text-[15px] mb-1.5'>
            {api.name}
          </h3>
          <div className='flex items-center gap-2'>
            <span className='text-[10px] font-bold font-mono tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[6px] border border-emerald-100/50 uppercase'>
              {api.method}
            </span>
            <span className='text-xs font-medium text-gray-400'>
              {api.checkFrequency / 60000}m interval
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-2 gap-3 mb-5'>
        <div className='bg-white rounded-2xl p-3.5 border border-gray-100/50 shadow-sm'>
          <div className='flex items-center gap-1.5 text-gray-400 text-xs font-medium mb-1'>
            <Zap className='h-3.5 w-3.5' />
            <span>Response Time</span>
          </div>
          <p className='text-lg font-bold font-dmsans text-gray-900'>
            {api.avgResponseTime}
            <span className='text-xs font-medium text-gray-400 ml-0.5'>ms</span>
          </p>
        </div>
        <div className='bg-white rounded-2xl p-3.5 border border-gray-100/50 shadow-sm'>
          <div className='flex items-center gap-1.5 text-gray-400 text-xs font-medium mb-1'>
            <Clock className='h-3.5 w-3.5' />
            <span>Uptime (24h)</span>
          </div>
          <p
            className={`font-bold font-dmsans text-lg ${getUptimeColor(api.uptime)}`}
          >
            {api.uptime}
            <span className='text-xs font-medium text-gray-400 ml-0.5'>%</span>
          </p>
        </div>
      </div>

      {/* Footer: Last checked */}
      <div className='flex items-center justify-between pt-1'>
        <div className='flex items-center gap-1.5 text-xs text-gray-400 font-medium'>
          <Clock className='h-3.5 w-3.5' />
          <span>Last checked: {formatRelativeTime(api.lastChecked)}</span>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusConfig.badgeBg}`}
        >
          {statusConfig.badge}
        </span>
      </div>
    </Link>
  );
};

export default ApiCard;
