const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { webhookLimiter } = require("../middleware/rateLimiter");
const {
  create,
  receive,
  list,
  getOne,
  remove,
  clear,
  toggle,
  getPayload,
} = require("../controllers/webhookController");

// Public endpoint - accepts any HTTP method for webhook testing
// Apply specific rate limiter for webhook receiver
router.all(
  "/receive/:uniqueId",
  webhookLimiter,
  [
    param("uniqueId")
      .isLength({ min: 32, max: 32 })
      .withMessage("Invalid webhook ID"),
  ],
  validate,
  receive,
);

router.use(protect);

router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 100 })
      .withMessage("Name must be under 100 characters"),
    body("description")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Description must be under 500 characters"),
    body("maxPayloads")
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage("Max payloads must be 1-1000"),
  ],
  validate,
  create,
);

router.get("/", list);

router.get(
  "/:uniqueId",
  [
    param("uniqueId")
      .isLength({ min: 32, max: 32 })
      .withMessage("Invalid webhook ID"),
  ],
  validate,
  getOne,
);

router.delete(
  "/:uniqueId",
  [
    param("uniqueId")
      .isLength({ min: 32, max: 32 })
      .withMessage("Invalid webhook ID"),
  ],
  validate,
  remove,
);

router.delete(
  "/:uniqueId/payloads",
  [
    param("uniqueId")
      .isLength({ min: 32, max: 32 })
      .withMessage("Invalid webhook ID"),
  ],
  validate,
  clear,
);

router.patch(
  "/:uniqueId/toggle",
  [
    param("uniqueId")
      .isLength({ min: 32, max: 32 })
      .withMessage("Invalid webhook ID"),
  ],
  validate,
  toggle,
);

router.get(
  "/:uniqueId/payload/:index",
  [
    param("uniqueId")
      .isLength({ min: 32, max: 32 })
      .withMessage("Invalid webhook ID"),
    param("index").isInt({ min: 0 }).withMessage("Index must be non-negative"),
  ],
  validate,
  getPayload,
);

module.exports = router;
