import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, className = "", type = "text", ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <label className='block text-sm font-medium text-gray-700 mb-1.5'>
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`flex h-10 w-full border border-gray-300 bg-white rounded-xl py-2 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14412B]/20 focus:border-[#14412B] disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-red-500 focus:ring-red-500/20" : ""
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
