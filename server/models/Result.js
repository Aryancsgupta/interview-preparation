// server/models/Result.js
import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    totalScore: {
      type: Number,
      required: true,
    },
    answers: [
      {
        questionId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        question: { type: String, required: true },
        userAnswer: { type: String, required: true },
        aiScore: { type: Number, required: true },
        originality: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Result = mongoose.model("Result", resultSchema);
export default Result;