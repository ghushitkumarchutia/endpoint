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
      iconClassName = "",
      titleClassName = "",
      valueClassName = "",
      descriptionClassName = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col justify-between ${className}`}
        {...props}
      >
        <div className='flex items-start justify-between'>
          <p className={titleClassName}>{title}</p>
          {Icon && (
            <div className={iconClassName}>
              <Icon className='h-5 w-5' aria-hidden='true' />
            </div>
          )}
        </div>

        <div className='mt-auto'>
          <p className={valueClassName}>{value}</p>

          {(description || trend) && (
            <div className='flex items-center gap-2 mt-1'>
              {trend && (
                <span
                  className={`text-xs font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}
                >
                  {trendUp ? "↑" : "↓"} {trend}
                </span>
              )}
              {description && (
                <p className={descriptionClassName}>{description}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

StatsCard.displayName = "StatsCard";

export default StatsCard;
