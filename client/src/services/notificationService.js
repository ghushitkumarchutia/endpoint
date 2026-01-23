import api from "./api";

const SETTINGS_KEY = "endpoint_notification_settings";

const DEFAULT_SETTINGS = {
  emailAlerts: true,
  errorNotifications: true,
  weeklyReport: false,
  slaBreach: true,
  regressionAlerts: true,
};

export const getNotifications = async (params = {}) => {
  const response = await api.get("/notifications", { params });
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

export const getNotificationSettings = async () => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
};

export const updateNotificationSettings = async (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  return settings;
};

const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
};

export default notificationService;
