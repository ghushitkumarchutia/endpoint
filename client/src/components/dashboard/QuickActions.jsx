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
    "inline-flex items-center cursor-pointer gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={`${baseButtonStyles} ${action.primary ? primaryButtonClassName : buttonClassName}`}
        >
          <action.icon className='h-3.5 w-3.5' />
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
