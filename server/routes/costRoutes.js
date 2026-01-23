const express = require("express");
const { body, param, query } = require("express-validator");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  getCostDashboard,
  getApiCosts,
  updateCostConfig,
  getCostRecords,
} = require("../controllers/costController");

router.use(protect);

router.get("/dashboard", getCostDashboard);

router.get(
  "/records",
  [
    query("days")
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage("Days must be 1-365"),
  ],
  validate,
  getCostRecords,
);

router.get(
  "/api/:apiId",
  [param("apiId").isMongoId().withMessage("Invalid API ID")],
  validate,
  getApiCosts,
);

router.get(
  "/api/:apiId/records",
  [
    param("apiId").isMongoId().withMessage("Invalid API ID"),
    query("days")
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage("Days must be 1-365"),
  ],
  validate,
  getCostRecords,
);

router.put(
  "/api/:apiId/config",
  [
    param("apiId").isMongoId().withMessage("Invalid API ID"),
    body("costTracking.costPerRequest")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Cost per request must be positive"),
    body("costTracking.monthlyBudget")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Monthly budget must be positive"),
    body("costTracking.alertThreshold")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Alert threshold must be 0-100"),
  ],
  validate,
  updateCostConfig,
);

module.exports = router;
