// // server/utils/constants.js

// export const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];

// export const QUESTION_CATEGORIES = [
//     "frontend", 
//     "backend", 
//     "devops", 
//     "testing", 
//     "general"
// ];

// // Total weight must be 1.0 (100%)
// export const SCORE_WEIGHTS = {
//   correctness: 0.7,
//   originality: 0.3,
// };
// server/utils/constants.js

// Allowed difficulty levels
export const DIFFICULTY_LEVELS = Object.freeze([
  "easy",
  "medium",
  "hard",
]);

// Allowed categories
export const QUESTION_CATEGORIES = Object.freeze([
  "frontend",
  "backend",
  "devops",
  "testing",
  "general"
]);

// Scoring weights (must equal 1.0)
export const SCORE_WEIGHTS = Object.freeze({
  correctness: 0.7,
  originality: 0.3,
});

// Validate score weights (if changed later)
export const validateScoreWeights = () => {
  const total =
    SCORE_WEIGHTS.correctness +
    SCORE_WEIGHTS.originality;

  if (total !== 1) {
    console.warn(
      `⚠️ SCORE_WEIGHTS total = ${total}. It must equal 1.0`
    );
  }
};
