import { useEffect, useState, useMemo } from "react";
import notificationService from "../services/notificationService";
import useFetch from "../hooks/useFetch";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { formatRelativeTime } from "../utils/formatDate";
import {
  Trash2,
  CheckCircle,
  DollarSign,
  AlertTriangle,
  Activity,
  TrendingDown,
  FileWarning,
  Bell,
  Clock,
  Filter,
} from "lucide-react";

// Notification type configuration for consistent styling
const NOTIFICATION_TYPE_CONFIG = {
  cost_alert: {
    icon: DollarSign,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    label: "Cost Alert",
  },
  sla_breach: {
    icon: AlertTriangle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    label: "SLA Breach",
  },
  anomaly: {
    icon: Activity,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    label: "Anomaly",
  },
  performance_regression: {
    icon: TrendingDown,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    label: "Regression",
  },
  contract_violation: {
    icon: FileWarning,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    label: "Contract Violation",
  },
  predictive_alert: {
    icon: Clock,
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    label: "Prediction",
  },
  system: {
    icon: Bell,
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    label: "System",
  },
};

const getNotificationConfig = (type) => {
  return NOTIFICATION_TYPE_CONFIG[type] || NOTIFICATION_TYPE_CONFIG.system;
};

const Notifications = () => {
  const { request, loading } = useFetch();
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchNotifications = async () => {
    try {
      const data = await request(notificationService.getNotifications, {
        limit: 100,
      });
      setNotifications(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await request(notificationService.markAllAsRead);
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await request(notificationService.deleteNotification, id);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Get unique notification types for filter
  const availableTypes = useMemo(() => {
    const types = new Set(notifications.map((n) => n.type));
    return Array.from(types);
  }, [notifications]);

  // Filter notifications based on active filter
  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  if (loading && notifications.length === 0) return <Loader size='lg' />;

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Notifications</h1>
        {notifications.length > 0 && (
          <Button variant='outline' size='sm' onClick={handleMarkAllRead}>
            <CheckCircle className='mr-2 h-4 w-4' /> Mark all read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      {availableTypes.length > 1 && (
        <div className='flex items-center gap-2 mb-6 overflow-x-auto pb-2'>
          <div className='flex items-center gap-1 text-sm text-muted-foreground mr-2'>
            <Filter className='h-4 w-4' />
            Filter:
          </div>
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap ${
              activeFilter === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({notifications.length})
          </button>
          {availableTypes.map((type) => {
            const config = getNotificationConfig(type);
            const count = notifications.filter((n) => n.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === type
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <config.icon className='h-3.5 w-3.5' />
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div className='space-y-3'>
        {filteredNotifications.length === 0 ? (
          <div className='text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border'>
            {activeFilter === "all"
              ? "No notifications found"
              : `No ${getNotificationConfig(activeFilter).label.toLowerCase()} notifications`}
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const config = getNotificationConfig(notification.type);
            const Icon = config.icon;
            const severity = notification.metadata?.severity;

            return (
              <div
                key={notification._id}
                className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                  notification.read
                    ? "bg-card border-border"
                    : `${config.bgColor} ${config.borderColor}`
                }`}
              >
                {/* Icon */}
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    notification.read ? "bg-gray-100" : config.iconBg
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${notification.read ? "text-gray-500" : config.iconColor}`}
                  />
                </div>

                {/* Content */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        notification.read
                          ? "bg-gray-100 text-gray-600"
                          : `${config.iconBg} ${config.iconColor}`
                      }`}
                    >
                      {config.label}
                    </span>
                    {severity && severity !== "medium" && (
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          severity === "critical"
                            ? "bg-red-100 text-red-700"
                            : severity === "high"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {severity.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      !notification.read
                        ? "font-medium text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1.5'>
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(notification._id)}
                  className='text-muted-foreground hover:text-destructive transition-colors p-2 rounded-lg hover:bg-red-50'
                  title='Delete'
                >
                  <Trash2 className='h-4 w-4' />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
