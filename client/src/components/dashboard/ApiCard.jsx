import { Link } from "react-router-dom";
import {
  Zap,
  Clock,
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
          iconColor: "text-teal-400",
          badge: "Healthy",
          badgeClass: "bg-teal-400/10 text-teal-400",
        };
      case "warning":
        return {
          icon: AlertCircle,
          iconColor: "text-amber-400",
          badge: "Warning",
          badgeClass: "bg-amber-500/15 text-amber-400",
        };
      case "down":
        return {
          icon: XCircle,
          iconColor: "text-red-400",
          badge: "Down",
          badgeClass: "bg-red-500/15 text-red-400",
        };
      default:
        return {
          icon: Timer,
          iconColor: "text-zinc-400",
          badge: "Unknown",
          badgeClass: "bg-white/5 text-zinc-400",
        };
    }
  };

  const statusConfig = getStatusConfig(api.status);
  const StatusIcon = statusConfig.icon;

  const getUptimeColor = (uptime) => {
    if (uptime >= 99) return "text-teal-400";
    if (uptime >= 90) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <Link
      to={ROUTES.API_DETAILS.replace(":id", api._id)}
      className='block rounded-[36px] px-5 py-4'
      style={{
        background: `linear-gradient(to bottom, transparent 0%, #4D4C4F 100%), linear-gradient(to right, #485068, #40518B)`,
      }}
    >
      <div className='flex items-center gap-3.5 mb-4'>
        <div
          className={`p-3.5 rounded-[20px] mt-1 bg-white/10 backdrop-blur-3xl shrink-0`}
        >
          <StatusIcon
            className={`h-5 w-5 md:h-7 md:w-7 ${statusConfig.iconColor}`}
          />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-dmsans text-[14px] md:text-[16px] text-white truncate leading-tight'>
            {api.name}
          </h3>
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-[10px] font-mono tracking-wider text-teal-400 bg-teal-500/10 backdrop-blur-3xl px-2 py-1 rounded-lg uppercase'>
              {api.method}
            </span>
            <span className='text-[11px] md:text-[12px] text-white/70 font-dmsans-light'>
              {api.checkFrequency / 60000}m interval
            </span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2.5 mb-4'>
        <div className='bg-white/10 backdrop-blur-3xl rounded-[18px] p-3'>
          <div className='flex items-center gap-1.5 text-white/50 text-[12px] font-dmsans mb-1.5'>
            <Zap className='h-3.5 w-3.5' />
            <span>Response Time</span>
          </div>
          <p className='text-[18px] font-dmsans text-white'>
            {api.avgResponseTime}
            <span className='text-[13px] text-white/50 ml-0.5'>ms</span>
          </p>
        </div>
        <div className='bg-white/10 backdrop-blur-3xl rounded-[18px] p-3'>
          <div className='flex items-center gap-1.5 text-white/50 text-[12px] font-dmsans mb-1.5'>
            <Clock className='h-3.5 w-3.5' />
            <span>Uptime (24h)</span>
          </div>
          <p
            className={`text-[18px] font-dmsans ${getUptimeColor(api.uptime)}`}
          >
            {api.uptime}
            <span className='text-[13px] text-white/50 ml-0.5'>%</span>
          </p>
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1.5 text-[12px] text-white/50 font-dmsans-light'>
          <Clock className='h-3.5 w-3.5' />
          <span>Last checked: {formatRelativeTime(api.lastChecked)}</span>
        </div>
        <span
          className={`text-[11px] font-dmsans-light px-2.5 py-1 rounded-full backdrop-blur-3xl ${statusConfig.badgeClass}`}
        >
          {statusConfig.badge}
        </span>
      </div>
    </Link>
  );
};

export default ApiCard;
