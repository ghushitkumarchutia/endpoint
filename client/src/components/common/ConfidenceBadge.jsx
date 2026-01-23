const ConfidenceBadge = ({ confidence, size = "sm" }) => {
  const getColor = () => {
    if (confidence >= 80)
      return "bg-green-500/10 text-green-500 border-green-500/20";
    if (confidence >= 60)
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  const getSize = () => {
    if (size === "lg") return "px-3 py-1.5 text-sm";
    if (size === "md") return "px-2.5 py-1 text-sm";
    return "px-2 py-0.5 text-xs";
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${getColor()} ${getSize()}`}
    >
      {confidence}% confident
    </span>
  );
};

export default ConfidenceBadge;
