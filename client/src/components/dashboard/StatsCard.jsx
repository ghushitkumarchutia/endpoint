import { forwardRef } from "react";

const StatsCard = forwardRef(
  (
    {
      title,
      value,
      icon: Icon,
      description,
      className = "",
      titleClassName = "",
      valueClassName = "",
      descriptionClassName = "",
      contentClassName = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={className} {...props}>
        <div className={contentClassName}>
          <div className='flex justify-between'>
            {title && <p className={titleClassName}>{title}</p>}
            {Icon && <Icon aria-hidden='true' />}
          </div>

          {value && <p className={valueClassName}>{value}</p>}

          {description && <p className={descriptionClassName}>{description}</p>}
        </div>
      </div>
    );
  },
);

StatsCard.displayName = "StatsCard";

export default StatsCard;
