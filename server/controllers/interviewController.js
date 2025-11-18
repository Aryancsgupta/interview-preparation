// // server/controllers/interviewController.js
// import Question from "../models/Question.js";
// import Result from "../models/Result.js";
// import openai from "../config/openaiConfig.js"; 
// import { checkSimilarity } from "../utils/similarityChecker.js"; 
// import { calculateScore } from "../utils/scoreCalculator.js";
// import crypto from "crypto"; 

// // --- Fallback Scoring Method (when OpenAI is unavailable) ---
// const fallbackScore = (userAnswer, correctAnswer) => {
//     if (!userAnswer || !correctAnswer) return 50; // Default middle score
    
//     // Simple keyword-based scoring
//     const userLower = userAnswer.toLowerCase();
//     const correctLower = correctAnswer.toLowerCase();
    
//     // Extract key terms from correct answer (words longer than 4 chars)
//     const keyTerms = correctLower.split(/\s+/).filter(word => word.length > 4);
    
//     if (keyTerms.length === 0) return 50;
    
//     // Count how many key terms appear in user answer
//     const matchedTerms = keyTerms.filter(term => userLower.includes(term)).length;
//     const matchRatio = matchedTerms / keyTerms.length;
    
//     // Base score on match ratio (0-100 scale)
//     return Math.min(100, Math.max(0, matchRatio * 100));
// };

// // --- Helper Function to Grade Answer with OpenAI ---
// const gradeAnswerWithOpenAI = async (userAnswer, correctAnswer) => {
//     const prompt = `You are an expert technical interviewer. Grade the user's answer against the correct answer on a scale of 0 to 100 for 'Correctness'. 
    
//     RULES:
//     1. Focus ONLY on technical accuracy.
//     2. Respond STRICTLY with a single JSON object.
//     3. The JSON object must contain only ONE key: 'correctness_score' (number, 0-100).
    
//     Correct Answer: "${correctAnswer}"
//     User's Answer: "${userAnswer}"`;

//     try {
//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo-1106", 
//             messages: [{ role: "user", content: prompt }],
//             response_format: { type: "json_object" },
//             temperature: 0.1, 
//         });
        
//         const jsonResponse = JSON.parse(response.choices[0].message.content);
//         // Ensure the score is a number, default to fallback
//         const score = Number(jsonResponse.correctness_score);
//         return (score && score >= 0 && score <= 100) ? score : fallbackScore(userAnswer, correctAnswer);

//     } catch (error) {
//         // Handle specific error types (OpenAI errors can have status in different places)
//         const statusCode = error.status || error.statusCode || error.response?.status || error.code;
        
//         if (statusCode === 429 || error.message?.includes('quota') || error.message?.includes('429')) {
//             console.warn("OpenAI API quota exceeded. Using fallback scoring method.");
//         } else if (statusCode === 401 || error.message?.includes('401')) {
//             console.error("OpenAI API authentication failed. Check API key.");
//         } else {
//             console.error("OpenAI Grading Error:", error.message || error);
//         }
        
//         // Use fallback scoring when OpenAI is unavailable
//         return fallbackScore(userAnswer, correctAnswer);
//     }
// };

// // Start Interview (Generate Questions)
// export const startInterview = async (req, res) => {
//     try {
//         const { category, difficulty, numQuestions, questionType } = req.body;

//         if (!category || !difficulty || !numQuestions || numQuestions <= 0) {
//             return res.status(400).json({ success: false, message: "Invalid parameters provided." });
//         }

//         // Build match query
//         const matchQuery = { category, difficulty };
        
//         // Filter by question type if specified
//         if (questionType && questionType !== 'all') {
//             matchQuery.type = questionType;
//         }

//         const questions = await Question.aggregate([
//             { $match: matchQuery },
//             { $sample: { size: parseInt(numQuestions) } },
//             // CRITICAL: Exclude correct answer and correctOptionIndex for security
//             { $project: { 
//                 correctAnswer: 0, 
//                 correctOptionIndex: 0,
//                 __v: 0, 
//                 createdAt: 0, 
//                 updatedAt: 0 
//             } } 
//         ]);

//         if (!questions || questions.length === 0) {
//             const typeMsg = questionType && questionType !== 'all' ? ` of type '${questionType}'` : '';
//             return res.status(404).json({ 
//                 success: false, 
//                 message: `No questions found${typeMsg} matching the criteria. Please try different category, difficulty, or add more questions.` 
//             });
//         }

//         res.status(200).json({ success: true, count: questions.length, questions });
        
//     } catch (error) {
//         console.error("Start Interview Error:", error.message);
//         res.status(500).json({ success: false, message: "Failed to start interview due to server error." });
//     }
// };

// // Submit Answers
// export const submitInterview = async (req, res) => {
//     try {
//         const { topic, answers } = req.body;
//         const userId = req.user.id; // From JWT Middleware

//         if (!userId || !answers || !Array.isArray(answers) || !topic) {
//             return res.status(400).json({ success: false, message: "Invalid submission data." });
//         }

//         let totalWeightedScore = 0;
//         const scoredAnswers = [];

//         // --- 1. Process and Score Each Answer ---
//         for(const answer of answers) {
//             const questionId = answer.questionId;
//             const userAnswer = answer.userAnswer;
//             const selectedOptionIndex = answer.selectedOptionIndex; // For MCQ
            
//             // 1.1. Fetch Question Data
//             const questionData = await Question.findById(questionId).select('question correctAnswer type correctOptionIndex options');

//             if(!questionData) {
//                 console.warn(`Question ID ${questionId} not found. Skipping.`);
//                 continue; 
//             }
            
//             const questionText = questionData.question;
//             let aiCorrectnessScore = 0;
//             let originality = 100;
//             let questionFinalScore = 0;

//             // Handle MCQ questions
//             if(questionData.type === 'mcq') {
//                 // For MCQ: Check if selected option index matches correct option index
//                 const isCorrect = questionData.correctOptionIndex === parseInt(selectedOptionIndex);
//                 aiCorrectnessScore = isCorrect ? 100 : 0;
//                 originality = 100; // MCQ answers are always original (no plagiarism check needed)
//                 questionFinalScore = aiCorrectnessScore; // For MCQ, score is either 100 or 0
//             } else {
//                 // Handle descriptive questions
//                 const correctAnswer = questionData.correctAnswer;
                
//                 // 1.2. AI Grading (Correctness Score)
//                 aiCorrectnessScore = await gradeAnswerWithOpenAI(userAnswer, correctAnswer);

//                 // 1.3. Plagiarism Check (Originality Score)
//                 const similarity = checkSimilarity(userAnswer, correctAnswer);
//                 originality = 100 - similarity; 

//                 // 1.4. Calculate Final Score for the Question (Weighted)
//                 questionFinalScore = calculateScore(aiCorrectnessScore, originality);
//             }
            
//             totalWeightedScore += questionFinalScore;
            
//             // 1.5. Prepare data for the Result Model
//             scoredAnswers.push({
//                 questionId: questionId,
//                 question: questionText,
//                 userAnswer: userAnswer || `Selected option ${selectedOptionIndex + 1}`, // For MCQ, show selected option
//                 aiScore: parseFloat(aiCorrectnessScore.toFixed(2)),
//                 originality: parseFloat(originality.toFixed(2)),
//                 questionType: questionData.type || 'descriptive'
//             });
//         }
        
//         // --- 2. Calculate Final Average Score ---
//         const finalAverageScore = scoredAnswers.length > 0 ? (totalWeightedScore / scoredAnswers.length) : 0;
        
//         // --- 3. Save the Result to DB ---
//         // Generate unique sessionId to work around old unique index constraint
//         // This is a temporary workaround until the index is dropped
//         const uniqueSessionId = `${userId}_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
        
//         let result;
//         try {
//             result = await Result.create({ 
//                 userId, 
//                 topic,
//                 answers: scoredAnswers, 
//                 totalScore: parseFloat(finalAverageScore.toFixed(2)),
//                 sessionId: uniqueSessionId // Temporary workaround for old index
//             });
//         } catch (dbError) {
//             // Handle MongoDB duplicate key error (likely from old sessionId index)
//             if (dbError.code === 11000) {
//                 console.error("Database Error: Duplicate key constraint violation.");
//                 console.error("Attempting workaround with unique sessionId...");
                
//                 // Retry with a new unique sessionId
//                 try {
//                     const retrySessionId = `${userId}_${Date.now()}_${crypto.randomBytes(12).toString('hex')}`;
//                     result = await Result.create({ 
//                         userId, 
//                         topic,
//                         answers: scoredAnswers, 
//                         totalScore: parseFloat(finalAverageScore.toFixed(2)),
//                         sessionId: retrySessionId
//                     });
//                     console.log("✅ Successfully saved with workaround sessionId");
//                 } catch (retryError) {
//                     console.error("❌ Workaround failed. Please drop the old index:");
//                     console.error("   Run: db.results.dropIndex('sessionId_1')");
//                     return res.status(500).json({ 
//                         success: false, 
//                         message: "Database error: Please contact administrator. The database may need index cleanup. Run: db.results.dropIndex('sessionId_1')",
//                         error: "Duplicate key error - old index needs removal"
//                     });
//                 }
//             } else {
//                 throw dbError; // Re-throw if it's a different error
//             }
//         }

//         res.status(201).json({ 
//           success: true, 
//           message: "Interview submitted and scored successfully.",
//           totalScore: result.totalScore, 
//           resultId: result._id,
//           feedback: `Your final score is ${result.totalScore}%. The score is based on technical correctness and originality of your answers.`
//         });

//     } catch (error) {
//         console.error("Submit Interview Error:", error.message);
//         res.status(500).json({ 
//             success: false, 
//             message: error.message || "Failed to submit interview due to server error." 
//         });
//     }
// };

// server/controllers/interviewController.js
import Question from "../models/Question.js";
import Result from "../models/Result.js";
import openai from "../config/openaiConfig.js";
import { checkSimilarity } from "../utils/similarityChecker.js";
import { calculateScore } from "../utils/scoreCalculator.js";

// ------------------ Fallback Score ------------------
const fallbackScore = (userAnswer, correctAnswer) => {
  if (!userAnswer || !correctAnswer) return 50;

  const u = userAnswer.toLowerCase();
  const c = correctAnswer.toLowerCase();

  const keywords = c.split(/\s+/).filter(w => w.length > 4);
  if (keywords.length === 0) return 50;

  const matches = keywords.filter(w => u.includes(w)).length;
  return Math.min(100, Math.max(0, (matches / keywords.length) * 100));
};

// ------------------ OpenAI Grading ------------------
const gradeAnswerWithOpenAI = async (userAnswer, correctAnswer) => {
  const prompt = `
You are an expert technical interviewer.
Rate the technical correctness from 0 to 100.

Respond ONLY as JSON:
{ "correctness_score": 0-100 }

Correct Answer: "${correctAnswer}"
User Answer: "${userAnswer}"
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0
    });

    const json = JSON.parse(response.choices[0].message.content);
    if (json.correctness_score < 0 || json.correctness_score > 100)
      return fallbackScore(userAnswer, correctAnswer);

    return json.correctness_score;
  } catch (err) {
    console.warn("OpenAI Error:", err.message);
    return fallbackScore(userAnswer, correctAnswer);
  }
};

// ------------------ Start Interview ------------------
export const startInterview = async (req, res) => {
  try {
    const { category, difficulty, numQuestions } = req.body;

    if (!category || !difficulty || !numQuestions)
      return res.status(400).json({ success: false, message: "Invalid data" });

    const questions = await Question.aggregate([
      { $match: { category, difficulty } },
      { $sample: { size: Number(numQuestions) } },
      { $project: { correctAnswer: 0, correctOptionIndex: 0 } }
    ]);

    if (questions.length === 0)
      return res.status(404).json({ success: false, message: "No questions found" });

    return res.status(200).json({
      success: true,
      questions
    });

  } catch (err) {
    console.error("Start Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------ Submit Interview ------------------
export const submitInterview = async (req, res) => {
  try {
    const { topic, answers } = req.body;
    const userId = req.user.id;

    if (!topic || !answers)
      return res.status(400).json({ success: false, message: "Invalid submission" });

    let total = 0;
    const final = [];

    for (const ans of answers) {

      const q = await Question.findById(ans.questionId);
      if (!q) continue;

      let aiScore = 0;
      let originality = 100;

      if (q.type === "mcq") {
        aiScore = q.correctOptionIndex === ans.selectedOptionIndex ? 100 : 0;
      } else {
        aiScore = await gradeAnswerWithOpenAI(ans.userAnswer, q.correctAnswer);
        const sim = checkSimilarity(ans.userAnswer, q.correctAnswer);
        originality = 100 - sim;
      }

      const finalScore = calculateScore(aiScore, originality);
      total += finalScore;

      final.push({
        questionId: q._id,
        question: q.question,
        userAnswer: q.type === "mcq"
          ? `Selected option ${ans.selectedOptionIndex + 1}`
          : ans.userAnswer,
        aiScore,
        originality,
        questionType: q.type
      });
    }

    const average = total / final.length;

    const result = await Result.create({
      userId,
      topic,
      answers: final,
      totalScore: Number(average.toFixed(2))
    });

    return res.status(201).json({
      success: true,
      message: "Interview submitted",
      totalScore: result.totalScore,
      resultId: result._id
    });

  } catch (err) {
    console.error("Submit Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
