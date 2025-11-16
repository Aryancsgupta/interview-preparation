// server/routes/questionRoutes.js
import express from "express";
import { addQuestion, getAllQuestions } from "../controllers/questionController.js";
import authAdmin from "../middleware/authAdmin.js"; 

const router = express.Router();

router.post("/add", authAdmin, addQuestion); 

router.get("/all", authAdmin, getAllQuestions); 

export default router;