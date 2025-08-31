import express from "express";
import { body } from "express-validator";
import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "../controllers/authController";

const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be 3-20 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters"),
  body("cnfpass")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters"),
];

const router = express.Router();

router.post("/login", loginValidation, loginUser);

router.post("/register", registerValidation, registerUser);

router.post("/refresh", refreshToken);

router.post("/logout", logoutUser);

export default router;
