import { formatDistanceToNow } from "date-fns";
import SLABadge from "./SLABadge";
import { Calendar, CheckCircle2 } from "lucide-react";

const SLAHistory = ({ reports, onSelect }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className='text-center py-12 bg-gray-50/50 rounded-[20px] border border-dashed border-gray-200'>
        <div className='p-3 bg-white rounded-full w-fit mx-auto mb-3 shadow-sm border border-gray-100'>
          <Calendar className='h-6 w-6 text-gray-300' />
        </div>
        <p className='text-gray-500 font-medium'>
          No SLA reports available yet
        </p>
        <p className='text-xs text-gray-400 mt-1'>
          Generate a report to see history here
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {reports.map((report) => (
        <div
          key={report._id}
          onClick={() => onSelect && onSelect(report)}
          className='flex items-center justify-between p-4 bg-gray-50/50 border border-transparent rounded-xl hover:bg-white hover:border-gray-200/60 hover:shadow-sm cursor-pointer transition-all group'
        >
          <div className='flex items-center gap-4'>
            <div
              className={`p-2 rounded-lg ${report.compliance?.overall ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
            >
              <CheckCircle2 className='h-5 w-5' />
            </div>
            <div>
              <p className='font-bold text-gray-900 font-dmsans capitalize text-sm'>
                {report.period?.type} Report
              </p>
              <p className='text-xs text-gray-500 font-medium'>
                {formatDistanceToNow(new Date(report.generatedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-6'>
            <div className='text-right hidden sm:block'>
              <p className='text-sm font-bold text-gray-900 font-mono'>
                {report.metrics?.uptime?.toFixed(1)}%{" "}
                <span className='text-gray-400 text-xs font-sans font-normal ml-1'>
                  uptime
                </span>
              </p>
              <p className='text-gray-400 text-xs font-medium'>
                {report.metrics?.totalChecks} checks
              </p>
            </div>
            <SLABadge compliant={report.compliance?.overall} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SLAHistory;
