export const APP_NAME = "Endpoint";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  DASHBOARD: "/dashboard",
  MONITORS: "/monitors",
  NOTIFICATIONS: "/notifications",
  PLAYGROUND: "/playground",
  ADD_API: "/add-api",
  API_DETAILS: "/api/:id",
  COSTS: "/costs",
  CONTRACTS: "/contracts",
  SLA: "/sla",
  REGRESSIONS: "/regressions",
  INSIGHTS: "/insights",
  QUERY: "/query",
  DEPENDENCIES: "/dependencies",
  WEBHOOKS: "/webhooks",
  SETTINGS: "/settings",
};

export const API_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export const CHECK_FREQUENCIES = [
  { label: "1 Minute", value: 60000 },
  { label: "5 Minutes", value: 300000 },
  { label: "15 Minutes", value: 900000 },
  { label: "30 Minutes", value: 1800000 },
  { label: "1 Hour", value: 3600000 },
];

export const STATUS_COLORS = {
  healthy: "text-green-500 bg-green-500/10 border-green-500/20",
  warning: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  down: "text-red-500 bg-red-500/10 border-red-500/20",
  unknown: "text-gray-500 bg-gray-500/10 border-gray-500/20",
};

export const SEVERITY_COLORS = {
  low: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  high: "text-red-500 bg-red-500/10 border-red-500/20",
  critical: "text-red-600 bg-red-600/10 border-red-600/20",
};

export const REGRESSION_STATUS = {
  active: "text-red-500 bg-red-500/10",
  investigating: "text-yellow-500 bg-yellow-500/10",
  resolved: "text-green-500 bg-green-500/10",
  false_positive: "text-gray-500 bg-gray-500/10",
};

export const ALERT_STATUS = {
  active: "text-red-500 bg-red-500/10",
  acknowledged: "text-yellow-500 bg-yellow-500/10",
  mitigated: "text-green-500 bg-green-500/10",
  expired: "text-gray-500 bg-gray-500/10",
  false_alarm: "text-gray-400 bg-gray-400/10",
};

export const DEPENDENCY_RELATIONSHIPS = [
  { label: "Calls", value: "calls" },
  { label: "Auth Depends", value: "auth_depends" },
  { label: "Data Depends", value: "data_depends" },
  { label: "Sequential", value: "sequential" },
];

export const SLA_PERIOD_TYPES = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];
