const crypto = require("crypto");

const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const calculateAverage = (values) => {
  if (!values || values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

const calculateStdDev = (values) => {
  if (!values || values.length < 2) return 0;
  const avg = calculateAverage(values);
  const squareDiffs = values.map((val) => Math.pow(val - avg, 2));
  return Math.sqrt(calculateAverage(squareDiffs));
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }
  const sanitized = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const sanitizedKey = key.replace(/[.$]/g, "_");
      const value = obj[key];
      if (typeof value === "object" && value !== null) {
        sanitized[sanitizedKey] = sanitizeObject(value);
      } else {
        sanitized[sanitizedKey] = value;
      }
    }
  }
  return sanitized;
};

const calculatePercentile = (values, percentile) => {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
};

const formatResponseTime = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const generateRandomString = (length = 16) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const truncateString = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};

module.exports = {
  generateResetToken,
  calculateAverage,
  calculateStdDev,
  sanitizeObject,
  calculatePercentile,
  formatResponseTime,
  generateRandomString,
  isValidUrl,
  truncateString,
};
