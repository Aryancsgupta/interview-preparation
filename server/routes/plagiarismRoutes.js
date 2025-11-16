// server/routes/plagiarismRoutes.js
import express from "express";
import { detectPlagiarism } from "../controllers/plagiarismController.js";
import protect from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/check", protect, detectPlagiarism);

export default router;