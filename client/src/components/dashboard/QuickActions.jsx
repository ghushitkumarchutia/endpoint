import { Plus, Play, RefreshCw, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = ({
  onRefresh,
  onExport,
  iconOnly = false,
  className = "",
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

  if (iconOnly) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            title={action.label}
            className='px-3 md:px-4 py-2.5 text-[13px] font-dmsans rounded-full flex items-center gap-2 cursor-pointer transition-colors duration-200 bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:bg-white/15'
          >
            <action.icon className='h-3.5 w-3.5 shrink-0' />
            <span className='hidden md:inline'>{action.label}</span>
          </button>
        ))}
      </div>
    );
  }

  const baseButtonStyles =
    "inline-flex items-center cursor-pointer gap-2 px-5 py-2.5 rounded-full text-xs font-dmsans transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={`${baseButtonStyles} ${
            action.primary
              ? "bg-white text-black hover:bg-neutral-200 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              : "bg-white/4 text-white/50 border border-white/6 hover:text-white hover:bg-white/10"
          }`}
        >
          <action.icon className='h-3.5 w-3.5' />
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
