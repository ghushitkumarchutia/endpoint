import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  DollarSign,
  FileText,
  Gauge,
  TrendingDown,
  Brain,
  MessageSquare,
  Network,
  Webhook,
  Settings,
  Beaker,
  LogOut,
  X,
} from "lucide-react";
import { ROUTES, APP_NAME } from "../../utils/constants";
import useAuth from "../../hooks/useAuth";

const navItems = [
  { path: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { path: ROUTES.COSTS, label: "Costs", icon: DollarSign },
  { path: ROUTES.CONTRACTS, label: "Contracts", icon: FileText },
  { path: ROUTES.SLA, label: "SLA Tracking", icon: Gauge },
  { path: ROUTES.REGRESSIONS, label: "Regressions", icon: TrendingDown },
  { path: ROUTES.INSIGHTS, label: "AI Insights", icon: Brain },
  { path: ROUTES.QUERY, label: "NL Query", icon: MessageSquare },
  { path: ROUTES.DEPENDENCIES, label: "Dependencies", icon: Network },
  { path: ROUTES.WEBHOOKS, label: "Webhooks", icon: Webhook },
  { path: ROUTES.PLAYGROUND, label: "Playground", icon: Beaker },
  { path: ROUTES.SETTINGS, label: "Settings", icon: Settings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const sidebarClasses = `
    fixed top-0 left-0 h-full md:h-[calc(100%-2rem)] w-60 md:ml-4 md:my-4 bg-black z-50 md:rounded-[32px]
    transform transition-transform duration-300 ease-in-out flex flex-col
    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `;

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-50 md:hidden'
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        <div className='h-[72px] px-6 flex items-center justify-between md:justify-center shrink-0'>
          <Link to={ROUTES.DASHBOARD} className='flex items-center gap-2'>
            <span className='font-dmsans text-xl text-white'>{APP_NAME}</span>
          </Link>
          <button
            onClick={onClose}
            className='md:hidden text-[#40518B] hover:text-white'
          >
            <X className='h-6 w-6' />
          </button>
        </div>
        <nav className='px-4 space-y-1 flex-1 overflow-y-auto py-4'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose && window.innerWidth < 768 && onClose()}
                className={`relative flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "text-white font-dmsans"
                    : "text-white/50 font-dmsans hover:text-white/90"
                }`}
              >
                {isActive && (
                  <div className='absolute left-0 top-1/2 -translate-y-1/2 h-6.5 w-1 bg-[#40518B] rounded-r-lg' />
                )}

                <Icon
                  className={`h-[24px] w-[24px] transition-colors ${isActive ? "text-[#40518B]" : "text-white/50 group-hover:text-white/90"}`}
                />
                <span className='text-[17px] font-dmsans'>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className='p-4 border-t border-white/5 shrink-0'>
          <button
            onClick={logout}
            className='flex items-center gap-3 px-4 py-3 w-full md:rounded-[18px] rounded-[16px] text-[17px] font-dmsans text-white cursor-pointer group transition-all duration-200 hover:brightness-125 hover:scale-[1.01] active:scale-[0.97]'
            style={{
              background: `linear-gradient(to bottom, transparent 0%, #4D4C4F 100%), linear-gradient(to right, #485068, #40518B)`,
            }}
          >
            <LogOut className='h-5 w-5 text-white' />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
