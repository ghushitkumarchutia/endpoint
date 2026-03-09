const ConfidenceBar = ({ value, label }) => {
  const getColor = () => {
    if (value >= 80) return "bg-green-500";
    if (value >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className='space-y-1'>
      {label && (
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>{label}</span>
          <span className='font-medium'>{value}%</span>
        </div>
      )}
      <div className='h-2 bg-muted rounded-full overflow-hidden'>
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
