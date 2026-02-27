const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  getRootCauses,
  getRootCauseDetail,
  getPredictiveAlerts,
  getAlertById,
  updateAlert,
} = require("../controllers/insightsController");

router.use(protect);

router.get(
  "/root-cause/api/:apiId",
  [param("apiId").isMongoId().withMessage("Invalid API ID")],
  validate,
  getRootCauses,
);

router.get(
  "/root-cause/:analysisId",
  [param("analysisId").isMongoId().withMessage("Invalid analysis ID")],
  validate,
  getRootCauseDetail,
);

router.get("/predictive", getPredictiveAlerts);

router.get(
  "/predictive/:alertId",
  [param("alertId").isMongoId().withMessage("Invalid alert ID")],
  validate,
  getAlertById,
);

router.patch(
  "/predictive/:alertId/status",
  [
    param("alertId").isMongoId().withMessage("Invalid alert ID"),
    body("status")
      .isIn(["active", "acknowledged", "mitigated", "expired", "false_alarm"])
      .withMessage("Invalid status"),
  ],
  validate,
  updateAlert,
);

module.exports = router;
