// // server/models/Question.js
// import mongoose from "mongoose";

// const questionSchema = new mongoose.Schema({
//   question: { 
//     type: String, 
//     required: true,
//     trim: true 
//   },
//   category: { 
//     type: String, 
//     required: true,
//     enum: ['frontend', 'backend', 'devops', 'testing', 'general'] 
//   },
//   difficulty: { 
//     type: String, 
//     required: true,
//     enum: ['easy', 'medium', 'hard'] 
//   },
//   type: {
//     type: String,
//     enum: ['descriptive', 'mcq'],
//     default: 'descriptive'
//   },
//   correctAnswer: { // For descriptive questions and MCQ correct option
//     type: String, 
//     required: true,
//   },
//   // MCQ specific fields
//   options: {
//     type: [String], // Array of options for MCQ
//     default: []
//   },
//   correctOptionIndex: { // Index of correct option (0-based) for MCQ
//     type: Number,
//     default: -1
//   }
// }, { timestamps: true });

// const Question = mongoose.model("Question", questionSchema);
// export default Question;
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({

  question: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    required: true,
    enum: [
      "frontend",
      "backend",
      "devops",
      "testing",
      "general",
      "dsa",
      "java",
      "ml",
      "system-design",
      "webdev"
    ]
  },

  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"]
  },

  type: {
    type: String,
    enum: ["descriptive", "mcq"],
    default: "descriptive"
  },

  // Descriptive correct answer
  correctAnswer: {
    type: String,
    required: function () {
      return this.type === "descriptive";
    }
  },

  // MCQ Options
  options: {
    type: [String],
    default: []
  },

  correctOptionIndex: {
    type: Number,
    default: -1
  }

}, { timestamps: true });

export default mongoose.model("Question", questionSchema);
