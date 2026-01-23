const express = require("express");
const { param, query } = require("express-validator");
const {
  getChecks,
  getSummary,
  getAnomalies,
  acknowledgeAnomaly,
  getResponseTimeHistory,
  clearChecks,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { heavyOperationLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.use(protect);

router.get(
  "/:id/checks",
  [
    param("id").isMongoId().withMessage("Invalid API ID"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 500 })
      .withMessage("Limit must be 1-500"),
  ],
  validate,
  getChecks,
);

router.get(
  "/:id/summary",
  [param("id").isMongoId().withMessage("Invalid API ID")],
  validate,
  getSummary,
);

router.get(
  "/:id/anomalies",
  [
    param("id").isMongoId().withMessage("Invalid API ID"),
    query("acknowledged")
      .optional()
      .isBoolean()
      .withMessage("Acknowledged must be boolean"),
  ],
  validate,
  getAnomalies,
);

router.get(
  "/:id/response-time-history",
  [
    param("id").isMongoId().withMessage("Invalid API ID"),
    query("hours")
      .optional()
      .isInt({ min: 1, max: 168 })
      .withMessage("Hours must be 1-168"),
  ],
  validate,
  getResponseTimeHistory,
);

router.delete(
  "/:id/checks",
  heavyOperationLimiter,
  [param("id").isMongoId().withMessage("Invalid API ID")],
  validate,
  clearChecks,
);

router.patch(
  "/anomalies/:anomalyId/acknowledge",
  [param("anomalyId").isMongoId().withMessage("Invalid anomaly ID")],
  validate,
  acknowledgeAnomaly,
);

module.exports = router;
