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
    fixed top-0 left-0 h-full md:h-[calc(100%-2rem)] w-60 md:ml-4 md:my-4 bg-[#f5f5f6] z-50 md:rounded-3xl
    transform transition-transform duration-300 ease-in-out flex flex-col
    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `;

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        <div className='h-[72px] px-6 flex items-center justify-between md:justify-center shrink-0'>
          <Link to={ROUTES.DASHBOARD} className='flex items-center gap-2'>
            <span className='font-dmsans text-xl text-black'>{APP_NAME}</span>
          </Link>
          <button
            onClick={onClose}
            className='md:hidden text-gray-500 hover:text-black'
          >
            <X className='h-6 w-6' />
          </button>
        </div>
        {/* Navigation Links */}
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
                    ? "text-[#14412B] font-dmsans"
                    : "text-gray-500 font-dmsans hover:text-gray-700"
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className='absolute left-0 top-1/2 -translate-y-1/2 h-6.5 w-1 bg-[#14412B] rounded-r-lg' />
                )}

                <Icon
                  className={`h-[22px] w-[22px] transition-colors ${isActive ? "text-[#14412B]" : "text-gray-400 group-hover:text-gray-600"}`}
                />
                <span
                  className={`text-[18px] ${isActive ? "font-dmsans" : "font-dmsans"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Requirement: Logout button need to place in side bar bottom */}
        <div className='p-4 border-t border-gray-200 shrink-0'>
          <button
            onClick={logout}
            className='flex items-center gap-3 px-4 py-3.5 w-full rounded-[14px] text-sm font-dmsans text-white bg-[#14412B] hover:bg-[#1a5438] transition-colors cursor-pointer'
          >
            <LogOut className='h-4.5 w-4.5' />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
