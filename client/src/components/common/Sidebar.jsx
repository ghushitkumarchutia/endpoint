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
} from "lucide-react";
import { ROUTES } from "../../utils/constants";

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

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className='w-64 bg-card border-r border-border flex-shrink-0 hidden md:block'>
      <nav className='p-4 space-y-1'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className='h-4 w-4' />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
