// server/controllers/adminController.js
import Result from "../models/Result.js";

/**
 * GET /api/admin/results (Admin Only)
 */
export const getAllResults = async (req, res) => {
  try {
    const data = await Result.find().sort({ createdAt: -1 }).populate('userId', 'name email');

    res.status(200).json({
      success: true,
      count: data.length, 
      data,
    });
  } catch (err) {
    console.error("Admin fetch error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch admin data." });
  }
};