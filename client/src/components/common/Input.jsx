import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, className = "", type = "text", ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <label className='block text-sm font-medium text-foreground mb-1.5'>
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-red-500 focus-visible:ring-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
