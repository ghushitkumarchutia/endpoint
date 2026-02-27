const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  getGraph,
  getApiDependencies,
  addApiDependency,
  removeApiDependency,
  getImpact,
  detectDependencies,
} = require("../controllers/dependencyController");

router.use(protect);

router.get("/graph", getGraph);
router.get("/detect", detectDependencies);

router.get(
  "/api/:apiId",
  [param("apiId").isMongoId().withMessage("Invalid API ID")],
  validate,
  getApiDependencies,
);

router.post(
  "/api/:apiId",
  [
    param("apiId").isMongoId().withMessage("Invalid API ID"),
    body("dependsOnApiId").isMongoId().withMessage("Invalid dependency API ID"),
    body("relationship")
      .optional()
      .isIn(["calls", "auth_depends", "data_depends", "sequential"])
      .withMessage("Invalid relationship type"),
    body("isRequired")
      .optional()
      .isBoolean()
      .withMessage("isRequired must be boolean"),
  ],
  validate,
  addApiDependency,
);

router.delete(
  "/api/:apiId/:dependsOnApiId",
  [
    param("apiId").isMongoId().withMessage("Invalid API ID"),
    param("dependsOnApiId")
      .isMongoId()
      .withMessage("Invalid dependency API ID"),
  ],
  validate,
  removeApiDependency,
);

router.get(
  "/api/:apiId/impact",
  [param("apiId").isMongoId().withMessage("Invalid API ID")],
  validate,
  getImpact,
);

module.exports = router;
