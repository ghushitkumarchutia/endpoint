import { Plus, Play, RefreshCw, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = ({
  onRefresh,
  onExport,
  className = "",
  buttonClassName = "",
  primaryButtonClassName = "",
}) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Add API",
      icon: Plus,
      onClick: () => navigate("/add-api"),
      primary: true,
    },
    { label: "Test API", icon: Play, onClick: () => navigate("/playground") },
    { label: "Refresh", icon: RefreshCw, onClick: onRefresh },
    { label: "Export", icon: Download, onClick: onExport },
  ];

  const baseButtonStyles =
    "inline-flex items-center cursor-pointer gap-1.5 md:px-5 md:py-2.5 px-[12px] py-[7px] rounded-full text-[12.5px] md:text-sm transition-colors font-bricolage";

  return (
    <div
      className={`flex flex-wrap justify-center md:justify-normal gap-1 md:gap-3 mt-2 md:mt-0 ${className}`}
    >
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={`${baseButtonStyles} ${action.primary ? primaryButtonClassName : buttonClassName}`}
        >
          <action.icon className='md:h-4 md:w-4 h-3 w-3' />
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
