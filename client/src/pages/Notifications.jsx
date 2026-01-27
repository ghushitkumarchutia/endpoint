import { useEffect, useState } from "react";
import notificationService from "../services/notificationService";
import useFetch from "../hooks/useFetch";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { formatRelativeTime } from "../utils/formatDate";
import { Trash2, CheckCircle } from "lucide-react";

const Notifications = () => {
  const { request, loading } = useFetch();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const data = await request(notificationService.getNotifications, {
        limit: 100,
      });
      setNotifications(data.data);
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

  if (loading && notifications.length === 0) return <Loader size='lg' />;

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-2xl font-bold'>Notifications</h1>
        {notifications.length > 0 && (
          <Button variant='outline' size='sm' onClick={handleMarkAllRead}>
            <CheckCircle className='mr-2 h-4 w-4' /> Mark all read
          </Button>
        )}
      </div>

      <div className='space-y-4'>
        {notifications.length === 0 ? (
          <div className='text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border'>
            No notifications found
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-xl border border-border flex items-start gap-4 transition-colors ${
                notification.read ? "bg-card" : "bg-muted/30"
              }`}
            >
              <div className='flex-1'>
                <p
                  className={`text-sm ${!notification.read ? "font-semibold" : ""}`}
                >
                  {notification.message}
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(notification._id)}
                className='text-muted-foreground hover:text-destructive transition-colors p-2'
                title='Delete'
              >
                <Trash2 className='h-4 w-4' />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
