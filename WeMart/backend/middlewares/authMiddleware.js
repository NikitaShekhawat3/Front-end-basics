import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Middleware to verify token (Login required)
export const requireSignIn = async (req, res, next) => {
  try {
    // Extract token from header and remove "Bearer "
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

    // Verify token
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode; // attach user info to request
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access - Admin only",
      });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error.message);
    res.status(500).send({
      success: false,
      message: "Error verifying admin access",
    });
  }
};
