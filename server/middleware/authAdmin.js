// 
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Only YOU are the admin
const ADMIN_EMAIL = "aryangupta1467@gmail.com";

const authAdmin = async (req, res, next) => {
  try {
    // Check Bearer token
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const token = header.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Only your email should be admin
    if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only the main admin can access this route."
      });
    }

    // Attach user info
    req.user = {
      id: user._id,
      email: user.email,
      role: "admin"
    };

    next();

  } catch (err) {
    console.error("Admin Auth Error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default authAdmin;
