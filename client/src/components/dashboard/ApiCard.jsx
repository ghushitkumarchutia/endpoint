import { Link } from "react-router-dom";
import {
  Activity,
  Clock,
  MoreVertical,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ROUTES, STATUS_COLORS } from "../../utils/constants";
import { formatRelativeTime } from "../../utils/formatDate";

const ApiCard = ({ api }) => {
  const statusColor = STATUS_COLORS[api.status] || STATUS_COLORS.unknown;

  const StatusIcon = {
    healthy: CheckCircle,
    warning: AlertTriangle,
    down: XCircle,
    unknown: Clock,
  }[api.status];

  return (
    <Link
      to={ROUTES.API_DETAILS.replace(":id", api._id)}
      className='group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg relative overflow-hidden'
    >
      <div className='absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity'>
        <MoreVertical className='h-5 w-5 text-muted-foreground' />
      </div>

      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className={`p-2 rounded-lg ${statusColor.split(" ")[1]}`}>
            <StatusIcon className={`h-6 w-6 ${statusColor.split(" ")[0]}`} />
          </div>
          <div>
            <h3 className='font-semibold text-lg text-foreground truncate max-w-[200px]'>
              {api.name}
            </h3>
            <div className='flex items-center gap-2 text-xs text-muted-foreground mt-1'>
              <span className='uppercase font-bold tracking-wider'>
                {api.method}
              </span>
              <span>•</span>
              <span>{api.checkFrequency / 60000}m interval</span>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 my-4'>
        <div className='bg-muted/30 rounded-lg p-3'>
          <div className='flex items-center gap-2 text-muted-foreground text-xs mb-1'>
            <Activity className='h-3 w-3' />
            <span>Response Time</span>
          </div>
          <p className='font-mono text-lg font-semibold text-foreground'>
            {api.avgResponseTime}ms
          </p>
        </div>
        <div className='bg-muted/30 rounded-lg p-3'>
          <div className='flex items-center gap-2 text-muted-foreground text-xs mb-1'>
            <Globe className='h-3 w-3' />
            <span>Uptime (24h)</span>
          </div>
          <p
            className={`font-mono text-lg font-semibold ${
              api.uptime >= 99
                ? "text-green-500"
                : api.uptime >= 90
                  ? "text-yellow-500"
                  : "text-red-500"
            }`}
          >
            {api.uptime}%
          </p>
        </div>
      </div>

      <div className='text-xs text-muted-foreground flex items-center gap-1 mt-4 border-t border-border pt-4'>
        <Clock className='h-3 w-3' />
        Last checked: {formatRelativeTime(api.lastChecked)}
      </div>
    </Link>
  );
};

export default ApiCard;
