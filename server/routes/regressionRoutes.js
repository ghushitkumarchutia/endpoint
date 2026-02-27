const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  getDashboard,
  getApiRegressions,
  getRegressionById,
  updateStatus,
} = require("../controllers/regressionController");

router.use(protect);

router.get("/dashboard", getDashboard);

router.get(
  "/api/:apiId",
  [param("apiId").isMongoId().withMessage("Invalid API ID")],
  validate,
  getApiRegressions,
);

router.get(
  "/:regressionId",
  [param("regressionId").isMongoId().withMessage("Invalid regression ID")],
  validate,
  getRegressionById,
);

router.patch(
  "/:regressionId/status",
  [
    param("regressionId").isMongoId().withMessage("Invalid regression ID"),
    body("status")
      .isIn(["active", "investigating", "resolved", "false_positive"])
      .withMessage("Invalid status"),
  ],
  validate,
  updateStatus,
);

module.exports = router;
