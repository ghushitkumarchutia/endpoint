import api from "./api";

const SETTINGS_KEY = "endpoint_notification_settings";

const DEFAULT_SETTINGS = Object.freeze({
  emailAlerts: true,
  errorNotifications: true,
  weeklyReport: false,
  slaBreach: true,
  regressionAlerts: true,
});

const safeJsonParse = (str, fallback) => {
  if (!str || typeof str !== "string") return fallback;
  try {
    const parsed = JSON.parse(str);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
    return fallback;
  } catch {
    // Clear corrupted data
    try {
      localStorage.removeItem(SETTINGS_KEY);
    } catch {
      // localStorage might be unavailable
    }
    return fallback;
  }
};

const safeJsonStore = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.warn("Failed to save notification settings to localStorage");
    return false;
  }
};

export const getNotifications = async (params = {}) => {
  const response = await api.get("/notifications", { params });
  return response.data;
};

export const markAsRead = async (id) => {
  if (!id) throw new Error("Notification ID is required");
  const response = await api.put(
    `/notifications/${encodeURIComponent(id)}/read`,
  );
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response.data;
};

export const deleteNotification = async (id) => {
  if (!id) throw new Error("Notification ID is required");
  const response = await api.delete(`/notifications/${encodeURIComponent(id)}`);
  return response.data;
};

export const getNotificationSettings = async () => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  const settings = safeJsonParse(stored, null);

  if (!settings) return { ...DEFAULT_SETTINGS };

  return { ...DEFAULT_SETTINGS, ...settings };
};

export const updateNotificationSettings = async (settings) => {
  if (!settings || typeof settings !== "object") {
    throw new Error("Invalid settings object");
  }

  const sanitized = {};
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    sanitized[key] =
      typeof settings[key] === "boolean"
        ? settings[key]
        : DEFAULT_SETTINGS[key];
  }

  safeJsonStore(SETTINGS_KEY, sanitized);
  return sanitized;
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
