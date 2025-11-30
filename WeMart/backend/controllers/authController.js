// backend/controllers/authController.js
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

   
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already registered, please login",
      });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // save user
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    
    const { email, identifier, password } = req.body;
    const loginId = email || identifier;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: "Email/Phone and password are required" });
    }

    
    const user = await userModel.findOne({
      $or: [{ email: loginId }, { phone: loginId }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found. Please register." });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Sign token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).send({
  success: true,
  message: "login successfully",
  user: {
    name: user.name,
    email: user.email,
    role: user.role, // ✅ Add this line
  },
  token,
});

  } catch (error) {
    console.error("Login controller error =>", error);
    res.status(500).json({
      success: false,
      message: "Error in login",
      error: error.message || error,
    });
  }
};

export const testController = (req, res) => {
  res.json({ success: true, message: "Protected route access granted" });
};
