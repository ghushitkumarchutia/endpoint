const StatsCard = ({ title, value, icon: Icon, description, trend }) => {
  return (
    <div className='bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-muted-foreground'>{title}</p>
          <h3 className='text-2xl font-bold mt-2 text-foreground'>{value}</h3>
        </div>
        <div className='h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary'>
          <Icon className='h-5 w-5' />
        </div>
      </div>
      {description && (
        <p className='text-xs text-muted-foreground mt-2'>{description}</p>
      )}
    </div>
  );
};

export default StatsCard;
