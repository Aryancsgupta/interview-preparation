// 
import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // Topic of interview (e.g., Backend, DSA, etc.)
    topic: {
      type: String,
      required: true,
      trim: true
    },

    // Final average score
    totalScore: {
      type: Number,
      required: true
    },

    // Unique interview session ID (important to avoid duplicate key errors)
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    // Answer list
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true
        },

        question: { 
          type: String, 
          required: true 
        },

        userAnswer: { 
          type: String, 
          required: true 
        },

        aiScore: { 
          type: Number, 
          required: true 
        },

        originality: { 
          type: Number, 
          required: true 
        },

        // ADD THIS → required for MCQ/descriptive
        questionType: {
          type: String,
          enum: ["descriptive", "mcq"],
          required: true
        }
      }
    ]
  },

  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
