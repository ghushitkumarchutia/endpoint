const BudgetProgress = ({ used, total, label }) => {
  const percentage = total > 0 ? Math.round((used / total) * 100) : 0;
  const isWarning = percentage > 80;
  const isDanger = percentage > 100;

  return (
    <div className='space-y-2'>
      {label && (
        <div className='flex justify-between text-sm'>
          <span className='text-muted-foreground'>{label}</span>
          <span className='font-medium'>
            ${used.toFixed(2)} / ${total.toFixed(2)}
          </span>
        </div>
      )}
      <div className='h-3 bg-muted rounded-full overflow-hidden'>
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isDanger
              ? "bg-red-500"
              : isWarning
                ? "bg-yellow-500"
                : "bg-green-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className='text-xs text-right'>
        <span
          className={
            isDanger ? "text-red-500 font-medium" : "text-muted-foreground"
          }
        >
          {percentage}% used
        </span>
      </p>
    </div>
  );
};

export default BudgetProgress;
