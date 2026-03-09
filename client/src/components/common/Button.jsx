import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const Button = forwardRef(
  (
    {
      children,
      isLoading = false,
      disabled = false,
      type = "button",
      className = "",
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={className}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden='true' />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
