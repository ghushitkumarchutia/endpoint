import {
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  ShieldCheck,
  AlertOctagon,
} from "lucide-react";
import SLACard from "./SLACard";

const SLADashboard = ({ data, onApiClick }) => {
  if (!data) {
    return (
      <div className='text-center py-12 text-gray-400 font-medium'>
        Loading SLA data...
      </div>
    );
  }

  const { summary = {}, apis = [] } = data;
  const { compliant = 0, nonCompliant = 0, averageUptime = 0 } = summary;

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <ShieldCheck className='h-24 w-24 text-green-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-green-50 rounded-xl border border-green-100/50'>
              <CheckCircle className='h-6 w-6 text-green-500' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {compliant}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Compliant APIs
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <AlertOctagon className='h-24 w-24 text-red-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-red-50 rounded-xl border border-red-100/50'>
              <XCircle className='h-6 w-6 text-red-500' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {nonCompliant}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Non-Compliant
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <Activity className='h-24 w-24 text-blue-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-blue-50 rounded-xl border border-blue-100/50'>
              <Activity className='h-6 w-6 text-blue-500' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {!isNaN(averageUptime) ? averageUptime.toFixed(2) : "0.00"}%
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Avg Uptime
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <Clock className='h-24 w-24 text-purple-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-purple-50 rounded-xl border border-purple-100/50'>
              <Clock className='h-6 w-6 text-purple-500' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {apis.length}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Total APIs
              </p>
            </div>
          </div>
        </div>
      </div>

      {apis.length > 0 && (
        <div className='animate-fade-in-up'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-bold text-gray-900 font-dmsans text-lg'>
              Detailed Compliance Status
            </h3>
            <div className='px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500'>
              {apis.length} Services
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
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
