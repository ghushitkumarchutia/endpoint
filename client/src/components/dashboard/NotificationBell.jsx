import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Check,
  DollarSign,
  AlertTriangle,
  Activity,
  TrendingDown,
  FileWarning,
  Clock,
} from "lucide-react";
import notificationService from "../../services/notificationService";
import { formatRelativeTime } from "../../utils/formatDate";
import useFetch from "../../hooks/useFetch";
import Button from "../common/Button";

const NOTIFICATION_TYPE_CONFIG = {
  cost_alert: {
    icon: DollarSign,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    unreadBg: "bg-amber-500/5",
  },
  sla_breach: {
    icon: AlertTriangle,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    unreadBg: "bg-red-500/5",
  },
  anomaly: {
    icon: Activity,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    unreadBg: "bg-blue-500/5",
  },
  performance_regression: {
    icon: TrendingDown,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    unreadBg: "bg-purple-500/5",
  },
  contract_violation: {
    icon: FileWarning,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    unreadBg: "bg-orange-500/5",
  },
  predictive_alert: {
    icon: Clock,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    unreadBg: "bg-indigo-500/5",
  },
  system: {
    icon: Bell,
    iconBg: "bg-zinc-500/10",
    iconColor: "text-zinc-400",
    unreadBg: "bg-zinc-500/5",
  },
};

const getNotificationConfig = (type) => {
  return NOTIFICATION_TYPE_CONFIG[type] || NOTIFICATION_TYPE_CONFIG.system;
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const { request } = useFetch();

  const fetchNotifications = async () => {
    try {
      const data = await request(notificationService.getNotifications, {
        limit: 5,
      });
      setNotifications(data.data || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  // Initial fetch and periodic polling - setState in effect is intentional for polling pattern
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await request(notificationService.markAsRead, id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await request(notificationService.markAllAsRead);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors'
      >
        <Bell className='h-5 w-5' />
        {unreadCount > 0 && (
          <span className='absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white'>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 bg-[#0a0f14] border border-white/5 rounded-2xl shadow-lg z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden'>
          <div className='flex items-center justify-between p-4 border-b border-white/5'>
            <h3 className='font-semibold text-white'>Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                className='text-xs h-7 text-zinc-400 hover:text-white hover:bg-[#111315]'
                onClick={handleMarkAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </div>

          <div className='max-h-75 overflow-y-auto'>
            {notifications.length === 0 ? (
              <div className='p-8 text-center text-zinc-500 text-sm'>
                No notifications
              </div>
            ) : (
              notifications.map((notification) => {
                const config = getNotificationConfig(notification.type);
                const Icon = config.icon;

                return (
                  <div
                    key={notification._id}
                    className={`p-3 border-b border-white/5 last:border-0 hover:bg-[#111315] transition-colors ${
                      !notification.read ? config.unreadBg : ""
                    }`}
                  >
                    <div className='flex gap-3'>
                      {/* Type icon */}
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          notification.read ? "bg-[#111315]" : config.iconBg
                        }`}
                      >
                        <Icon
                          className={`h-3.5 w-3.5 ${
                            notification.read
                              ? "text-zinc-500"
                              : config.iconColor
                          }`}
                        />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <p
                          className={`text-sm text-white leading-snug ${
                            !notification.read ? "font-medium" : ""
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className='text-xs text-zinc-500 mt-1'>
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>

                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification._id);
                          }}
                          className='text-teal-400 hover:text-teal-300 p-1 rounded hover:bg-teal-500/10 transition-colors'
                          title='Mark as read'
                        >
                          <Check className='h-4 w-4' />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
