// server/routes/adminRoutes.js
import express from "express";
import { getAllResults } from "../controllers/adminController.js";
import authAdmin from "../middleware/authAdmin.js"; 

const router = express.Router();

router.get("/results", authAdmin, getAllResults); 

export default router;