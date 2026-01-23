import { CheckCircle, XCircle, Clock, Activity } from "lucide-react";
import SLACard from "./SLACard";

const SLADashboard = ({ data, onApiClick }) => {
  if (!data) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        Loading SLA data...
      </div>
    );
  }

  const { summary = {}, apis = [] } = data;
  const { compliant = 0, nonCompliant = 0, averageUptime = 0 } = summary;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm text-muted-foreground'>Compliant</span>
            <CheckCircle className='h-4 w-4 text-green-500' />
          </div>
          <p className='text-2xl font-bold text-green-500'>{compliant}</p>
          <p className='text-xs text-muted-foreground mt-1'>APIs meeting SLA</p>
        </div>

        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm text-muted-foreground'>Non-Compliant</span>
            <XCircle className='h-4 w-4 text-red-500' />
          </div>
          <p className='text-2xl font-bold text-red-500'>{nonCompliant}</p>
          <p className='text-xs text-muted-foreground mt-1'>
            APIs breaching SLA
          </p>
        </div>

        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm text-muted-foreground'>Avg Uptime</span>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </div>
          <p className='text-2xl font-bold'>{averageUptime.toFixed(2)}%</p>
          <p className='text-xs text-muted-foreground mt-1'>Across all APIs</p>
        </div>

        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm text-muted-foreground'>Total APIs</span>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </div>
          <p className='text-2xl font-bold'>{apis.length}</p>
          <p className='text-xs text-muted-foreground mt-1'>
            With SLA tracking
          </p>
        </div>
      </div>

      {apis.length > 0 && (
        <div>
          <h3 className='font-semibold mb-4'>API SLA Status</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {apis.map((api) => (
              <SLACard
                key={api._id || api.apiId}
                api={api}
                onClick={() => onApiClick && onApiClick(api)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SLADashboard;
