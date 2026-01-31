const BudgetProgress = ({ used = 0, total = 0, label }) => {
  const safeUsed = Number(used) || 0;
  const safeTotal = Number(total) || 0;
  const percentage =
    safeTotal > 0 ? Math.min(Math.round((safeUsed / safeTotal) * 100), 100) : 0;
  const isWarning = percentage > 80;
  const isDanger = percentage >= 100;

  return (
    <div className='space-y-4'>
      {label && (
        <div className='flex justify-between items-end'>
          <span className='text-sm text-gray-500 font-medium tracking-wide uppercase text-[10px]'>
            {label}
          </span>
          <div className='text-right'>
            <span className='font-bold text-gray-900 font-mono text-lg'>
              ${safeUsed.toFixed(2)}
            </span>
            <span className='text-gray-400 text-sm ml-1 font-medium'>
              / ${safeTotal.toFixed(2)}
            </span>
          </div>
        </div>
      )}
      <div className='h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-100/50 shadow-inner'>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-in-out relative ${
            isDanger
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : isWarning
                ? "bg-gradient-to-r from-amber-400 to-amber-500"
                : "bg-gradient-to-r from-blue-500 to-blue-600"
          }`}
          style={{ width: `${percentage}%` }}
        >
          <div className='absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse'></div>
        </div>
      </div>
      <div className='flex justify-end'>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-lg ${
            isDanger
              ? "bg-red-50 text-red-600 border border-red-100"
              : isWarning
                ? "bg-amber-50 text-amber-600 border border-amber-100"
                : "bg-blue-50 text-blue-600 border border-blue-100"
          }`}
        >
          {percentage}% Used
        </span>
      </div>
    </div>
  );
};

export default BudgetProgress;
