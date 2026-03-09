import { forwardRef } from "react";

const StatsCard = forwardRef(
  (
    {
      title,
      value,
      icon: Icon,
      description,
      trend,
      trendUp,
      className = "",
      cardStyle = {},
      iconClassName = "",
      titleClassName = "",
      valueClassName = "",
      descriptionClassName = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className='h-full' {...props}>
        <div
          className={`relative z-30 h-[calc(100%-40px)] flex flex-col justify-between ${className}`}
          style={cardStyle}
        >
          {Icon && (
            <div className={`self-start ${iconClassName}`}>
              <Icon className='h-4 w-4 md:h-5.5 md:w-5.5' aria-hidden='true' />
            </div>
          )}

          <p className={`mt-5 ${titleClassName}`}>{title}</p>

          <div className='mt-auto pt-4'>
            <p className={valueClassName}>{value}</p>
            {(description || trend) && (
              <div className='flex items-center gap-2 mt-1.5'>
                {trend && (
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                      trendUp
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-red-400 bg-red-500/10"
                    }`}
                  >
                    {trendUp ? "+" : ""}
                    {trend}
                  </span>
                )}
                {description && (
                  <p className={descriptionClassName}>{description}</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div
          className='relative z-5 h-[50px] -mt-[44px] rounded-b-[32px] bg-[#2f2f2f]'
          aria-hidden='true'
        />
        <div
          className='relative z-4 h-[50px] -mt-[42px] rounded-b-[32px] bg-[#262626]'
          aria-hidden='true'
        />
        <div
          className='relative z-3 h-[50px] -mt-[42px] rounded-b-[32px] bg-[#212121]'
          aria-hidden='true'
        />
        <div
          className='relative z-2 h-[50px] -mt-[42px] rounded-b-[32px] bg-[#1d1d1d]'
          aria-hidden='true'
        />

        <div
          className='relative z-1 h-[50px] -mt-[42px] rounded-b-[32px] bg-[#151515]'
          aria-hidden='true'
        />
      </div>
    );
  },
);

StatsCard.displayName = "StatsCard";

export default StatsCard;
