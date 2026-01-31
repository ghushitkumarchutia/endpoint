import { CheckCircle, XCircle } from "lucide-react";

const SLABadge = ({ compliant, size = "sm" }) => {
  const sizeClasses = {
    sm: "text-[10px] px-2.5 py-1",
    md: "text-xs px-3 py-1.5",
    lg: "text-sm px-4 py-2",
  };

  if (compliant) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg border border-green-100 bg-green-50 text-green-700 font-bold uppercase tracking-wider ${sizeClasses[size]}`}
      >
        <CheckCircle className='h-3 w-3' />
        Compliant
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 text-red-700 font-bold uppercase tracking-wider ${sizeClasses[size]}`}
    >
      <XCircle className='h-3 w-3' />
      Non-Compliant
    </span>
  );
};

export default SLABadge;
