import { formatDistanceToNow } from "date-fns";
import SLABadge from "./SLABadge";

const SLAHistory = ({ reports, onSelect }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No SLA reports available
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {reports.map((report) => (
        <div
          key={report._id}
          onClick={() => onSelect && onSelect(report)}
          className='flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors'
        >
          <div>
            <p className='font-medium capitalize'>
              {report.period?.type} Report
            </p>
            <p className='text-xs text-muted-foreground'>
              {formatDistanceToNow(new Date(report.generatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <div className='text-right text-sm'>
              <p>{report.metrics?.uptime?.toFixed(1)}% uptime</p>
              <p className='text-muted-foreground text-xs'>
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
