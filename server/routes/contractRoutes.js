const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  getViolations,
  getStats,
  acknowledge,
  updateContractConfig,
  getAllViolations,
} = require("../controllers/contractController");

router.use(protect);

router.get("/violations", getAllViolations);

router.get(
  "/api/:apiId/violations",
  [param("apiId").isMongoId().withMessage("Invalid API ID")],
  validate,
  getViolations,
);

router.get(
  "/api/:apiId/stats",
  [param("apiId").isMongoId().withMessage("Invalid API ID")],
  validate,
  getStats,
);

router.put(
  "/api/:apiId/config",
  [
    param("apiId").isMongoId().withMessage("Invalid API ID"),
    body("responseContract.enabled")
      .optional()
      .isBoolean()
      .withMessage("Enabled must be boolean"),
    body("responseContract.strictMode")
      .optional()
      .isBoolean()
      .withMessage("Strict mode must be boolean"),
    body("responseContract.expectedResponseTime")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Expected response time must be positive"),
  ],
  validate,
  updateContractConfig,
);

router.patch(
  "/violations/:violationId/acknowledge",
  [param("violationId").isMongoId().withMessage("Invalid violation ID")],
  validate,
  acknowledge,
);

module.exports = router;
