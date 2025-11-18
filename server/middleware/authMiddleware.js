// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const protect = async (req, res, next) => {
//   try {
//     const header = req.headers.authorization;

//     if (!header || !header.startsWith("Bearer"))
//       return res.status(401).json({ success: false, message: "No token" });

//     const token = header.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Get user info from database
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }

//     req.user = { 
//       id: user._id, 
//       email: user.email, 
//       role: user.role 
//     };

//     next();
//   } catch (err) {
//     return res.status(401).json({ success: false, message: "Token invalid" });
//   }
// };

// export default protect;
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // No token found
    if (!header || !header.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const token = header.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired, please login again"
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    // Fetch user (with performance optimization)
    const user = await User.findById(decoded.id).select("name email role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Attach user details to request
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();

  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

export default protect;
