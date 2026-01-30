import { Loader2 } from "lucide-react";

const Loader = ({ size = "default", className = "" }) => {
  const sizes = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className='flex justify-center items-center w-full h-full p-4'>
      <Loader2
        className={`animate-spin text-[#14412B] ${sizes[size]} ${className}`}
      />
    </div>
  );
};

export default Loader;
