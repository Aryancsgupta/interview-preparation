// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";

// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password)
//       return res.status(400).json({ success: false, message: "All fields required" });

//     const exist = await User.findOne({ email });
//     if (exist)
//       return res.status(409).json({ success: false, message: "Email already registered" });

//     const hashed = await bcrypt.hash(password, 10);

//     // Auto-assign admin role if email is aryangupta1467@gmail.com
//     const adminEmail = "aryangupta1467@gmail.com";
//     const role = email.toLowerCase() === adminEmail.toLowerCase() ? 'admin' : 'user';

//     const user = await User.create({ name, email, password: hashed, role });

//     res.status(201).json({
//       success: true,
//       message: "User registered",
//       user: { id: user._id, name: user.name, email: user.email, role: user.role },
//     });
//   } catch (err) {
//     console.error("Register Error:", err.message);
//     res.status(500).json({ success: false, message: "Registration failed" });
//   }
// };

// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ success: false, message: "Email & Password required" });

//     const user = await User.findOne({ email }).select("+password");
//     if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

//     if (!process.env.JWT_SECRET) {
//       return res.status(500).json({ success: false, message: "Server config error" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     user.password = undefined;

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: { id: user._id, name: user.name, email: user.email, role: user.role },
//     });
//   } catch (err) {
//     console.error("Login Error:", err.message);
//     res.status(500).json({ success: false, message: "Login failed" });
//   }
// };

// export const logoutUser = (req, res) => {
//   res.status(200).json({ success: true, message: "Logged out" });
// };

// // Forgot Password - Generate reset token
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email)
//       return res.status(400).json({ success: false, message: "Email is required" });

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found with this email" });

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

//     user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//     user.resetPasswordExpires = new Date(resetTokenExpiry);
//     await user.save({ validateBeforeSave: false });

//     // In production, send email with reset link
//     // For now, return the token (remove this in production and send email instead)
//     const resetUrl = `${req.protocol}://${req.get("host")}/reset-password?token=${resetToken}`;

//     res.status(200).json({
//       success: true,
//       message: "Password reset token generated. Check your email for reset link.",
//       // Remove this in production - only for development
//       resetToken: resetToken,
//       resetUrl: resetUrl,
//       note: "In production, this token will be sent via email only"
//     });
//   } catch (err) {
//     console.error("Forgot Password Error:", err.message);
//     res.status(500).json({ success: false, message: "Error generating reset token" });
//   }
// };

// // Reset Password - Use token to reset password
// export const resetPassword = async (req, res) => {
//   try {
//     const { token, password } = req.body;

//     if (!token || !password)
//       return res.status(400).json({ success: false, message: "Token and password are required" });

//     // Hash the token to compare with stored hash
//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (!user)
//       return res.status(400).json({ success: false, message: "Invalid or expired token" });

//     // Update password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Password reset successful. You can now login with your new password."
//     });
//   } catch (err) {
//     console.error("Reset Password Error:", err.message);
//     res.status(500).json({ success: false, message: "Error resetting password" });
//   }
// };

// // Change Password - For logged-in users
// export const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword)
//       return res.status(400).json({ success: false, message: "Current password and new password are required" });

//     // Get user with password field
//     const user = await User.findById(req.user.id).select("+password");
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });

//     // Verify current password
//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch)
//       return res.status(401).json({ success: false, message: "Current password is incorrect" });

//     // Update to new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Password changed successfully"
//     });
//   } catch (err) {
//     console.error("Change Password Error:", err.message);
//     res.status(500).json({ success: false, message: "Error changing password" });
//   }
// };

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const exist = await User.findOne({ email });
    if (exist)
      return res.status(409).json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    // Auto-assign admin role
    const adminEmail = "aryangupta1467@gmail.com";
    const role = email.toLowerCase() === adminEmail ? "admin" : "user";

    const user = await User.create({ name, email, password: hashed, role });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email & Password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id);

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};
