import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer"))
      return res.status(401).json({ success: false, message: "No token" });

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user info from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalid" });
  }
};

export default protect;
