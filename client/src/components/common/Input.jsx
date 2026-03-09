import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, className = "", type = "text", ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <label className='block text-[13px] font-medium text-[#A1A1AA] mb-1.5'>
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`flex w-full border border-white/8 bg-[#050505] rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-[#52525B] focus:outline-none focus:border-white/20 focus:bg-[#0A0A0A] focus:ring-4 focus:ring-white/2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-red-500/50 focus:ring-red-500/10" : ""
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
