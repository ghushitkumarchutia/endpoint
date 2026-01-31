import { Clock, Activity, Percent, RefreshCw, BarChart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const BaselineCard = ({ baseline, onReset }) => {
  if (!baseline) {
    return (
      <div className='bg-white border border-gray-200/60 rounded-[20px] p-6 shadow-sm flex flex-col items-center justify-center text-center'>
        <div className='p-3 bg-gray-50 rounded-full mb-3'>
          <BarChart className='h-6 w-6 text-gray-300' />
        </div>
        <p className='text-gray-500 font-medium'>No baseline established yet</p>
      </div>
    );
  }

  const {
    avgResponseTime = 0,
    p95ResponseTime = 0,
    errorRate = 0,
    sampleSize = 0,
    establishedAt,
  } = baseline;

  return (
    <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm'>
      <div className='flex items-center justify-between mb-5'>
        <div className='flex items-center gap-2'>
          <div className='p-1.5 bg-blue-50 rounded-lg'>
            <BarChart className='h-4 w-4 text-blue-500' />
          </div>
          <h3 className='font-bold text-gray-900 font-dmsans text-sm uppercase tracking-wide'>
            Current Baseline
          </h3>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className='flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors'
          >
            <RefreshCw className='h-3 w-3' />
            Reset Baseline
          </button>
        )}
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-gray-50/50 rounded-xl p-3 border border-gray-100'>
          <div className='flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1'>
            <Clock className='h-3 w-3' />
            Avg Wait
          </div>
          <p className='font-bold text-gray-900 text-lg font-mono'>
            {avgResponseTime.toFixed(0)}ms
          </p>
        </div>

        <div className='bg-gray-50/50 rounded-xl p-3 border border-gray-100'>
          <div className='flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1'>
            <Activity className='h-3 w-3' />
            P95 Wait
          </div>
          <p className='font-bold text-gray-900 text-lg font-mono'>
            {p95ResponseTime.toFixed(0)}ms
          </p>
        </div>

        <div className='bg-gray-50/50 rounded-xl p-3 border border-gray-100'>
          <div className='flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1'>
            <Percent className='h-3 w-3' />
            Errors
          </div>
          <p className='font-bold text-gray-900 text-lg font-mono'>
            {errorRate.toFixed(2)}%
          </p>
        </div>

        <div className='bg-gray-50/50 rounded-xl p-3 border border-gray-100'>
          <div className='flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1'>
            Samples
          </div>
          <p className='font-bold text-gray-900 text-lg font-mono'>
            {sampleSize}
          </p>
        </div>
      </div>

      {establishedAt && (
        <p className='text-xs font-medium text-gray-400 mt-4 text-center'>
          Established{" "}
          {formatDistanceToNow(new Date(establishedAt), { addSuffix: true })}
        </p>
      )}
    </div>
  );
};

export default BaselineCard;
