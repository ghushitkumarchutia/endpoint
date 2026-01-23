const express = require("express");
const { param, query } = require("express-validator");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router.get(
  "/",
  [
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be 1-100"),
    query("unreadOnly")
      .optional()
      .isBoolean()
      .withMessage("unreadOnly must be boolean"),
  ],
  validate,
  getNotifications,
);

router.put("/read-all", markAllAsRead);

router.put(
  "/:id/read",
  [param("id").isMongoId().withMessage("Invalid notification ID")],
  validate,
  markAsRead,
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid notification ID")],
  validate,
  deleteNotification,
);

module.exports = router;
