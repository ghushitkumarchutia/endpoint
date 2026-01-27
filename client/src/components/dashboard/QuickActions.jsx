import { Plus, Play, RefreshCw, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = ({ onRefresh, onExport }) => {
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

  return (
    <div className='flex flex-wrap gap-3'>
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={`inline-flex items-center cursor-pointer gap-[6px] px-5 py-3 rounded-full text-[16px] font-medium text-white hover:bg-white/20 hover:text-white transition-colors bg-[#2C2C2C]/90 border border-[#363636]/90 font-bricolage ${
            action.primary
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-[#2C2C2C]/80 hover:bg-[#2C2C2C]/80"
          }`}
        >
          <action.icon className='h-4 w-4' />
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
