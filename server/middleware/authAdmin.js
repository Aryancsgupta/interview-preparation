import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Admin email - only this user can be admin
const ADMIN_EMAIL = "aryangupta1467@gmail.com";

const authAdmin = async (req, res, next) => {
  try {
    // Check for JWT token
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer")) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to check email and role
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Check if user is admin (only aryangupta1467@gmail.com can be admin)
    const isAdmin = user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || user.role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Admin access denied. Only authorized admin can perform this action." 
      });
    }

    // Add user info to request
    req.user = { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authAdmin;
