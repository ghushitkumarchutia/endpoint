const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { aiLimiter } = require("../middleware/rateLimiter");
const {
  query,
  feedback,
  history,
  suggestions,
} = require("../controllers/nlQueryController");

router.use(protect);

// AI query with rate limiting and validation
router.post(
  "/",
  aiLimiter,
  [
    body("query")
      .trim()
      .notEmpty()
      .withMessage("Query is required")
      .isLength({ max: 500 })
      .withMessage("Query must be under 500 characters"),
  ],
  validate,
  query,
);

router.get("/history", history);
router.get("/suggestions", suggestions);

router.patch(
  "/:queryId/feedback",
  [
    param("queryId").isMongoId().withMessage("Invalid query ID"),
    body("wasHelpful").isBoolean().withMessage("Feedback must be boolean"),
  ],
  validate,
  feedback,
);

module.exports = router;
