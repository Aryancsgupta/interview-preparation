// server/controllers/questionController.js
import Question from "../models/Question.js";

// Add Question (Admin Only)
export const addQuestion = async (req, res) => {
  try {
    const { question, category, difficulty, type, correctAnswer, options, correctOptionIndex } = req.body;
    
    if (!question || !category || !difficulty) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide question text, category, and difficulty." 
      });
    }

    // Validate question type
    const questionType = type || 'descriptive';
    if (!['descriptive', 'mcq'].includes(questionType)) {
      return res.status(400).json({ 
        success: false, 
        message: "Question type must be 'descriptive' or 'mcq'." 
      });
    }

    // For MCQ questions
    if (questionType === 'mcq') {
      if (!options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ 
          success: false, 
          message: "MCQ questions must have at least 2 options." 
        });
      }
      
      if (correctOptionIndex === undefined || correctOptionIndex < 0 || correctOptionIndex >= options.length) {
        return res.status(400).json({ 
          success: false, 
          message: "Please provide a valid correctOptionIndex (0-based index of correct option)." 
        });
      }

      const newQuestion = await Question.create({ 
        question, 
        category, 
        difficulty, 
        type: 'mcq',
        options,
        correctOptionIndex: parseInt(correctOptionIndex),
        correctAnswer: options[correctOptionIndex] // Store the correct answer text
      });
      
      return res.status(201).json({
        success: true,
        message: "MCQ question added successfully",
        question: newQuestion,
      });
    }

    // For descriptive questions
    if (!correctAnswer) {
      return res.status(400).json({ 
        success: false, 
        message: "Descriptive questions require a correct answer." 
      });
    }

    const newQuestion = await Question.create({ 
      question, 
      category, 
      difficulty, 
      type: 'descriptive',
      correctAnswer 
    });
    
    res.status(201).json({
      success: true,
      message: "Question added successfully",
      question: newQuestion,
    });
    
  } catch (error) {
    console.error("Add Question Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to add question due to server error." });
  }
};

// Get All Questions (Admin Only)
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    
    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
    
  } catch (error) {
    console.error("Get All Questions Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch questions due to server error." });
  }
};