// server/utils/constants.js

export const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];

export const QUESTION_CATEGORIES = [
    "frontend", 
    "backend", 
    "devops", 
    "testing", 
    "general"
];

// Total weight must be 1.0 (100%)
export const SCORE_WEIGHTS = {
  correctness: 0.7,
  originality: 0.3,
};