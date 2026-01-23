const express = require("express");
const { body, param, query } = require("express-validator");
const {
  getApis,
  getApi,
  createApi,
  updateApi,
  deleteApi,
  toggleActive,
  resetBaseline,
  getCategories,
  getDashboardStats,
  testApi,
} = require("../controllers/apiController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router.get(
  "/",
  [
    query("category").optional().trim().escape(),
    query("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be boolean"),
    query("search").optional().trim().escape().isLength({ max: 100 }),
  ],
  validate,
  getApis,
);

router.get("/categories", getCategories);

router.get("/dashboard-stats", getDashboardStats);

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("API name is required"),
    body("url").trim().isURL().withMessage("Please enter a valid URL"),
    body("method")
      .optional()
      .isIn(["GET", "POST", "PUT", "DELETE", "PATCH"])
      .withMessage("Invalid HTTP method"),
    body("timeout")
      .optional()
      .isInt({ min: 5000, max: 60000 })
      .withMessage("Timeout must be between 5000ms and 60000ms"),
  ],
  validate,
  createApi,
);

router.post(
  "/test",
  [
    body("url").trim().isURL().withMessage("Please enter a valid URL"),
    body("method")
      .optional()
      .isIn(["GET", "POST", "PUT", "DELETE", "PATCH"])
      .withMessage("Invalid HTTP method"),
  ],
  validate,
  testApi,
);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid API ID")],
  validate,
  getApi,
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid API ID"),
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("url")
      .optional()
      .trim()
      .isURL()
      .withMessage("Please enter a valid URL"),
    body("method")
      .optional()
      .isIn(["GET", "POST", "PUT", "DELETE", "PATCH"])
      .withMessage("Invalid HTTP method"),
    body("timeout")
      .optional()
      .isInt({ min: 5000, max: 60000 })
      .withMessage("Timeout must be between 5000ms and 60000ms"),
  ],
  validate,
  updateApi,
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid API ID")],
  validate,
  deleteApi,
);

router.patch(
  "/:id/toggle",
  [param("id").isMongoId().withMessage("Invalid API ID")],
  validate,
  toggleActive,
);

router.patch(
  "/:id/reset-baseline",
  [param("id").isMongoId().withMessage("Invalid API ID")],
  validate,
  resetBaseline,
);

module.exports = router;
