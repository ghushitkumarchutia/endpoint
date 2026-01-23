import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const REQUEST_TIMEOUT = 30000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
const RETRYABLE_STATUS_CODES = [408, 502, 503, 504];
const RETRYABLE_ERROR_CODES = [
  "ECONNABORTED",
  "ETIMEDOUT",
  "ENOTFOUND",
  "ENETUNREACH",
];

const pendingRequests = new Map();

const getRequestKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
};

const cancelPendingRequest = (key) => {
  if (pendingRequests.has(key)) {
    const controller = pendingRequests.get(key);
    controller.abort();
    pendingRequests.delete(key);
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (error, retryCount) => {
  if (retryCount >= MAX_RETRIES) return false;

  if (RETRYABLE_ERROR_CODES.includes(error.code)) return true;

  if (
    error.response &&
    RETRYABLE_STATUS_CODES.includes(error.response.status)
  ) {
    return true;
  }

  return false;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  const queue = [...failedQueue];
  failedQueue = [];

  queue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method === "get" && !config.skipCancellation) {
      const requestKey = getRequestKey(config);
      cancelPendingRequest(requestKey);

      const controller = new AbortController();
      config.signal = controller.signal;
      pendingRequests.set(requestKey, controller);
      config._requestKey = requestKey;
    }

    config._retryCount = config._retryCount || 0;

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (response.config._requestKey) {
      pendingRequests.delete(response.config._requestKey);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?._requestKey) {
      pendingRequests.delete(originalRequest._requestKey);
    }

    if (axios.isCancel(error)) {
      return Promise.reject(new Error("Request cancelled"));
    }

    if (originalRequest && shouldRetry(error, originalRequest._retryCount)) {
      originalRequest._retryCount += 1;
      await sleep(RETRY_DELAY * originalRequest._retryCount);
      return api(originalRequest);
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return Promise.reject(new Error("Request timeout. Please try again."));
    }

    if (!error.response) {
      return Promise.reject(
        new Error("Network error. Please check your connection."),
      );
    }

    const { status } = error.response;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        localStorage.removeItem("token");
        processQueue(new Error("Session expired"));
      } finally {
        isRefreshing = false;
      }

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
      return Promise.reject(new Error("Session expired. Please log in again."));
    }

    if (status === 403) {
      return Promise.reject(
        new Error("Access denied. You don't have permission for this action."),
      );
    }

    if (status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      const message = retryAfter
        ? `Too many requests. Please wait ${retryAfter} seconds.`
        : "Too many requests. Please wait and try again.";
      return Promise.reject(new Error(message));
    }

    if (status >= 500) {
      return Promise.reject(new Error("Server error. Please try again later."));
    }

    if (status >= 400 && error.response.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    return Promise.reject(error);
  },
);

export const cancelAllRequests = () => {
  pendingRequests.forEach((controller) => controller.abort());
  pendingRequests.clear();
};

export const cancelRequest = (urlPattern) => {
  pendingRequests.forEach((controller, key) => {
    if (key.includes(urlPattern)) {
      controller.abort();
      pendingRequests.delete(key);
    }
  });
};

export default api;
