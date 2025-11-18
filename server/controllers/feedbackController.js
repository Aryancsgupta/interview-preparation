// server/controllers/feedbackController.js
import { sendFeedbackEmail, sendQuestionSuggestionEmail } from "../utils/emailService.js";

// Submit Feedback
export const submitFeedback = async (req, res) => {
  try {
    const { feedback, email, name } = req.body;

    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Feedback is required" 
      });
    }

    const userEmail = email || req.user?.email || "anonymous@example.com";
    const userName = name || req.user?.name || "Anonymous User";

    // Send email to admin
    const emailResult = await sendFeedbackEmail(userEmail, userName, feedback);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "Thank you for your feedback! We'll review it soon."
      });
    } else {
      // Even if email fails, we still acknowledge the feedback
      console.error("Email sending failed:", emailResult.error);
      res.status(200).json({
        success: true,
        message: "Thank you for your feedback! (Note: Email notification may have failed)"
      });
    }
  } catch (error) {
    console.error("Feedback Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to submit feedback. Please try again later." 
    });
  }
};

// Submit Question Suggestion
export const submitQuestionSuggestion = async (req, res) => {
  try {
    const { 
      question, 
      category, 
      difficulty, 
      type, 
      options, 
      correctOptionIndex, 
      correctAnswer,
      additionalNotes 
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Question is required" 
      });
    }

    const userEmail = req.user?.email || req.body.email || "anonymous@example.com";
    const userName = req.user?.name || req.body.name || "Anonymous User";

    const questionData = {
      question: question.trim(),
      category: category || "general",
      difficulty: difficulty || "medium",
      type: type || "descriptive",
      options: options || [],
      correctOptionIndex: correctOptionIndex !== undefined ? parseInt(correctOptionIndex) : -1,
      correctAnswer: correctAnswer || "",
      additionalNotes: additionalNotes || ""
    };

    // Send email to admin
    const emailResult = await sendQuestionSuggestionEmail(userEmail, userName, questionData);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "Thank you for your question suggestion! We'll review it and add it if appropriate."
      });
    } else {
      console.error("Email sending failed:", emailResult.error);
      res.status(200).json({
        success: true,
        message: "Thank you for your question suggestion! (Note: Email notification may have failed)"
      });
    }
  } catch (error) {
    console.error("Question Suggestion Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to submit question suggestion. Please try again later." 
    });
  }
};

