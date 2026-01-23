const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { heavyOperationLimiter } = require("../middleware/rateLimiter");
const {
  getDashboard,
  generateReport,
  getReports,
  getReportById,
  updateSLAConfig,
  generateAllReports,
} = require("../controllers/slaController");

router.use(protect);

router.get("/dashboard", getDashboard);

// Heavy operations with rate limiting
router.post("/generate-all", heavyOperationLimiter, generateAllReports);

router.get(
  "/reports/:reportId",
  [param("reportId").isMongoId().withMessage("Invalid report ID")],
  validate,
  getReportById,
);

router.get(
  "/api/:apiId/reports",
  [param("apiId").isMongoId().withMessage("Invalid API ID")],
  validate,
  getReports,
);

router.post(
  "/api/:apiId/generate",
  heavyOperationLimiter,
  [param("apiId").isMongoId().withMessage("Invalid API ID")],
  validate,
  generateReport,
);

router.put(
  "/api/:apiId/config",
  [
    param("apiId").isMongoId().withMessage("Invalid API ID"),
    body("sla.uptimeTarget")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Uptime target must be 0-100"),
    body("sla.responseTimeP95")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Response time must be positive"),
    body("sla.errorRateMax")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Error rate must be 0-100"),
  ],
  validate,
  updateSLAConfig,
);

module.exports = router;
