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
          className={`flex w-full border border-gray-200 bg-[#f9fafb] rounded-[14px] px-4 py-3 text-sm font-bricolage text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#14412B]/30 focus:bg-white focus:ring-4 focus:ring-[#14412B]/5 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-red-500 focus:ring-red-500/10" : ""
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
