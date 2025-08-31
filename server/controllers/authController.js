import authModel from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { email, password } = req.body;

  try {
    const found = await authModel.findOne({ email: email });

    if (!found) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials, please try again",
      });
    }

    const match = await bcrypt.compare(password, found.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const accessToken = jwt.sign({ id: found._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    await authModel.findByIdAndUpdate(found._id, { refreshToken });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error logging in",
      error: err.message,
    });
  }
};

const registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { username, email, password } = req.body;

  try {
    const found = await authModel.findOne({ email });
    if (found) {
      return res.status(400).json({
        success: false,
        message: "Account already exists, please login.",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await authModel.create({
      name: username,
      email,
      password: hashedPass,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error creating user",
      error: err.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired refresh token",
        });
      }

      const newAccessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error refreshing token",
      error: err.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userID = req.user?.id;

    if (userID) {
      await authModel.findByIdAndDelete(userID, { refreshToken: null });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error logging out",
      error: err.message,
    });
  }
};

export { loginUser, registerUser, refreshToken, logoutUser };
