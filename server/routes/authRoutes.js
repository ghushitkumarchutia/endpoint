const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  authLimiter,
  passwordResetLimiter,
} = require("../middleware/rateLimiter");

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register,
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login,
);

router.get("/me", protect, getMe);

router.put("/profile", protect, updateProfile);

router.put("/change-password", protect, changePassword);

router.post(
  "/forgot-password",
  passwordResetLimiter,
  [body("email").isEmail().withMessage("Please enter a valid email")],
  validate,
  forgotPassword,
);

router.post(
  "/reset-password",
  passwordResetLimiter,
  [
    body("token").notEmpty().withMessage("Token is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  resetPassword,
);

router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
