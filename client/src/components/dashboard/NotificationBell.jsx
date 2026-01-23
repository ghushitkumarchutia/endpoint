import { useState, useEffect, useRef } from "react";
import { Bell, X, Check } from "lucide-react";
import notificationService from "../../services/notificationService";
import { formatRelativeTime } from "../../utils/formatDate";
import useFetch from "../../hooks/useFetch";
import Button from "../common/Button";

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
      setNotifications(data.data);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

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
        <div className='absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2'>
          <div className='flex items-center justify-between p-4 border-b border-border'>
            <h3 className='font-semibold'>Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                className='text-xs h-7'
                onClick={handleMarkAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </div>

          <div className='max-h-[300px] overflow-y-auto'>
            {notifications.length === 0 ? (
              <div className='p-8 text-center text-muted-foreground text-sm'>
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${
                    !notification.read ? "bg-muted/30" : ""
                  }`}
                >
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <p className='text-sm text-foreground'>
                        {notification.message}
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className='text-primary hover:text-primary/80'
                        title='Mark as read'
                      >
                        <Check className='h-4 w-4' />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
