// eslint-disable-next-line no-unused-vars
const StatsCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className='bg-[#2C2C2C]/80 h-[190px] px-[30px] py-7 rounded-[32px] border border-[#363636]'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-[24px] font-anton tracking-wider uppercase text-white'>
            {title}
          </p>
          <h3 className='text-[44px] font-bold text-white'>{value}</h3>
        </div>
        <div className='rounded-full mb-[66px] ml-2 text-white'>
          <Icon className='h-7 w-7' />
        </div>
      </div>
      {description && (
        <p className='text-[18px] text-white font-dmsans'>{description}</p>
      )}
    </div>
  );
};

export default StatsCard;
