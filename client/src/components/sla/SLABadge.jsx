import { CheckCircle, XCircle } from "lucide-react";

const SLABadge = ({ compliant, size = "sm" }) => {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  if (compliant) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-green-500/10 text-green-500 ${sizeClasses[size]}`}
      >
        <CheckCircle className='h-3 w-3' />
        Compliant
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-red-500/10 text-red-500 ${sizeClasses[size]}`}
    >
      <XCircle className='h-3 w-3' />
      Non-Compliant
    </span>
  );
};

export default SLABadge;
