// server/routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, changePassword } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/change-password", protect, changePassword);

export default router;