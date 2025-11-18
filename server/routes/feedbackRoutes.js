// // server/routes/feedbackRoutes.js
// import express from "express";
// import { submitFeedback, submitQuestionSuggestion } from "../controllers/feedbackController.js";
// import protect from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Submit feedback (can be used by logged-in or anonymous users)
// router.post("/submit", submitFeedback);

// // Submit question suggestion (can be used by logged-in or anonymous users)
// router.post("/question-suggestion", submitQuestionSuggestion);

// export default router;

// server/routes/feedbackRoutes.js
import express from "express";
import { 
  submitFeedback, 
  submitQuestionSuggestion 
} from "../controllers/feedbackController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Feedback can be anonymous or logged-in users
router.post("/submit", submitFeedback);

// Question suggestion should only be from logged-in users
router.post("/question-suggestion", protect, submitQuestionSuggestion);

export default router;
