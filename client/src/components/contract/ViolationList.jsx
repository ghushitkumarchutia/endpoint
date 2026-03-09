import ViolationCard from "./ViolationCard";
import { ShieldCheck } from "lucide-react";

const ViolationList = ({ violations, onAcknowledge, emptyMessage }) => {
  if (!violations || violations.length === 0) {
    return (
      <div className='text-center py-12 bg-white/50 rounded-[24px] border border-dashed border-gray-200'>
        <div className='p-4 bg-green-50 rounded-full w-fit mx-auto mb-4 border border-green-100'>
          <ShieldCheck className='h-8 w-8 text-green-500' />
        </div>
        <p className='text-gray-900 font-bold text-lg'>
          {emptyMessage || "No violations found"}
        </p>
        <p className='text-gray-500 text-sm mt-1'>
          Your API contracts are compliant.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {violations.map((violation) => (
        <ViolationCard
          key={violation._id}
          violation={violation}
          onAcknowledge={onAcknowledge}
        />
      ))}
    </div>
  );
};

export default ViolationList;
