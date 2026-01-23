const rateLimit = require("express-rate-limit");

// Skip rate limiting during testing
const skipInTest = () => process.env.NODE_ENV === "test";

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
  skip: (req) => {
    // Skip for health check and in test environment
    return req.path === "/api/health" || skipInTest();
  },
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    success: false,
    message: "Too many password reset attempts, please try again later",
  },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    success: false,
    message: "AI query rate limit exceeded, please try again later",
  },
});

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  keyGenerator: (req) => {
    return `${req.params.uniqueId}-${req.ip}`;
  },
  message: {
    success: false,
    message: "Webhook rate limit exceeded",
  },
});

const heavyOperationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    success: false,
    message: "Rate limit exceeded for heavy operations, please try again later",
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  aiLimiter,
  webhookLimiter,
  heavyOperationLimiter,
};
