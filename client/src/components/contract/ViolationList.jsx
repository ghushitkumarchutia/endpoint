import ViolationCard from "./ViolationCard";

const ViolationList = ({ violations, onAcknowledge, emptyMessage }) => {
  if (!violations || violations.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        {emptyMessage || "No contract violations found"}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
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
