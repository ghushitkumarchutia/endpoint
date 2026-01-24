import { GitBranch, Database, Server, Globe } from "lucide-react";

const API_ICONS = {
  database: Database,
  server: Server,
  external: Globe,
  default: GitBranch,
};

const ApiNode = ({ data, selected }) => {
  const IconComponent = API_ICONS[data.type] || API_ICONS.default;
  const healthColor =
    data.health === "healthy"
      ? "bg-green-500"
      : data.health === "degraded"
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div
      className={`px-4 py-3 bg-card border-2 rounded-lg min-w-40 transition-all ${
        selected ? "border-primary shadow-lg" : "border-border"
      } ${data.highlighted ? "ring-2 ring-amber-500 ring-offset-2" : ""}`}
    >
      <div className='flex items-center gap-3'>
        <div className='p-2 bg-muted rounded-lg'>
          <IconComponent className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <span className={`w-2 h-2 rounded-full ${healthColor}`} />
            <span className='font-medium text-sm truncate'>{data.label}</span>
          </div>
          {data.endpoint && (
            <p className='text-xs text-muted-foreground truncate mt-0.5'>
              {data.endpoint}
            </p>
          )}
        </div>
      </div>
      {data.metrics && (
        <div className='flex items-center gap-3 mt-2 pt-2 border-t border-border text-xs text-muted-foreground'>
          <span>{data.metrics.requests}/min</span>
          <span>{data.metrics.latency}ms</span>
        </div>
      )}
    </div>
  );
};

export default ApiNode;
