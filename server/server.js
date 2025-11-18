// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 

// --- Route Imports ---
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import plagiarismRoutes from "./routes/plagiarismRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js"; 

dotenv.config();

// Connect to MongoDB
connectDB(); 

const app = express();

// Middleware
app.use(cors({ 
    origin: [  process.env.CLIENT_URL, 'https://interview-preparation-ten.vercel.app',
                'https://interview-preparation-1.onrender.com'
    ],
    credentials: true 
}));
app.use(express.json());

// Basic Root Route
app.get("/", (req, res) => {
    res.send("🚀 AI Interview Backend Running...");
});

// API Routes Setup
app.use("/api/auth", authRoutes); 
app.use("/api/interview", interviewRoutes); 
app.use("/api/plagiarism", plagiarismRoutes); 
app.use("/api/admin", adminRoutes); 
app.use("/api/questions", questionRoutes);
app.use("/api/feedback", feedbackRoutes); 

// Fallback Error Handler (404)
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route Not Found" });
});


// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});