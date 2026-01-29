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
          iconBg: "bg-gray-100",
          iconColor: "text-gray-500",
          badge: "Unknown",
          badgeBg: "bg-gray-50 text-gray-600 border-gray-200",
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
      className='group bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:border-[#14412B]/30 hover:bg-white transition-all hover:shadow-md relative'
    >
      {/* Arrow indicator on hover */}
      <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
        <ArrowUpRight className='h-4 w-4 text-gray-400' />
      </div>

      {/* Header: Status Icon + Name + Method */}
      <div className='flex items-start gap-3 mb-4'>
        <div className={`p-2.5 rounded-xl ${statusConfig.iconBg}`}>
          <StatusIcon className={`h-5 w-5 ${statusConfig.iconColor}`} />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-gray-900 truncate text-base'>
            {api.name}
          </h3>
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-xs font-bold text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded'>
              {api.method}
            </span>
            <span className='text-xs text-gray-400'>
              {api.checkFrequency / 60000}m interval
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-2 gap-3 mb-4'>
        <div className='bg-white rounded-xl p-3 border border-gray-100'>
          <div className='flex items-center gap-1.5 text-gray-400 text-xs mb-1'>
            <Zap className='h-3 w-3' />
            <span>Response Time</span>
          </div>
          <p className='font-mono text-lg font-bold text-gray-900'>
            {api.avgResponseTime}
            <span className='text-sm font-normal text-gray-500'>ms</span>
          </p>
        </div>
        <div className='bg-white rounded-xl p-3 border border-gray-100'>
          <div className='flex items-center gap-1.5 text-gray-400 text-xs mb-1'>
            <Clock className='h-3 w-3' />
            <span>Uptime (24h)</span>
          </div>
          <p
            className={`font-mono text-lg font-bold ${getUptimeColor(api.uptime)}`}
          >
            {api.uptime}
            <span className='text-sm font-normal'>%</span>
          </p>
        </div>
      </div>

      {/* Footer: Last checked */}
      <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
        <div className='flex items-center gap-1.5 text-xs text-gray-400'>
          <Clock className='h-3 w-3' />
          <span>Last checked: {formatRelativeTime(api.lastChecked)}</span>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border ${statusConfig.badgeBg}`}
        >
          {statusConfig.badge}
        </span>
      </div>
    </Link>
  );
};

export default ApiCard;
