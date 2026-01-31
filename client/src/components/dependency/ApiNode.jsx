import {
  GitBranch,
  Database,
  Server,
  Globe,
  Activity,
  Clock,
} from "lucide-react";

const ApiNode = ({ data, selected }) => {
  const getTypeStyles = (type) => {
    switch (type) {
      case "database":
        return { icon: Database, bg: "bg-blue-50", text: "text-blue-600" };
      case "external":
        return { icon: Globe, bg: "bg-purple-50", text: "text-purple-600" };
      case "server":
        return { icon: Server, bg: "bg-orange-50", text: "text-orange-600" };
      default:
        return { icon: GitBranch, bg: "bg-gray-100", text: "text-gray-600" };
    }
  };

  const { icon: IconComponent, bg, text } = getTypeStyles(data.type);

  const getHealthColor = (health) => {
    switch (health) {
      case "healthy":
        return "bg-emerald-500 shadow-[0_0_8px_-2px_rgba(16,185,129,0.5)]";
      case "degraded":
        return "bg-amber-500 shadow-[0_0_8px_-2px_rgba(245,158,11,0.5)]";
      case "down":
        return "bg-red-500 shadow-[0_0_8px_-2px_rgba(239,68,68,0.5)]";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      className={`relative group w-[220px] bg-white rounded-[18px] transition-all duration-300 ${
        selected
          ? "ring-2 ring-[#14412B] ring-offset-2 shadow-xl shadow-[#14412B]/10"
          : "border border-gray-200/60 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50"
      } ${data.highlighted ? "ring-2 ring-amber-500 ring-offset-2 z-10 scale-105" : ""}`}
    >
      <div className='p-4'>
        <div className='flex items-start gap-3'>
          <div className={`p-2.5 rounded-xl shrink-0 ${bg}`}>
            <IconComponent className={`h-4.5 w-4.5 ${text}`} />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-0.5'>
              <h3 className='font-bold text-sm text-gray-900 truncate font-dmsans'>
                {data.label}
              </h3>
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${getHealthColor(data.health)}`}
              />
            </div>
            {data.endpoint && (
              <p className='text-[11px] text-gray-500 truncate bg-gray-50 px-1.5 py-0.5 rounded-md inline-block max-w-full font-mono'>
                {data.endpoint}
              </p>
            )}
          </div>
        </div>
      </div>

      {data.metrics && (
        <div className='px-4 py-2 bg-gray-50/50 border-t border-gray-100 rounded-b-[18px] flex items-center justify-between text-[11px] font-medium text-gray-500'>
          <div className='flex items-center gap-1.5'>
            <Activity className='h-3 w-3 text-gray-400' />
            <span>{data.metrics.requests} req/m</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Clock className='h-3 w-3 text-gray-400' />
            <span>{data.metrics.latency}ms</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiNode;
