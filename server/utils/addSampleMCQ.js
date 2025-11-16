// server/utils/addSampleMCQ.js
// Script to add sample MCQ questions to the database

import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question.js";

dotenv.config();

const sampleMCQs = [
  // Frontend MCQs
  {
    question: "What is the purpose of the 'use strict' directive in JavaScript?",
    category: "frontend",
    difficulty: "easy",
    type: "mcq",
    options: [
      "It enables strict mode which catches common coding errors",
      "It makes JavaScript run faster",
      "It disables all JavaScript features",
      "It is required for ES6 syntax"
    ],
    correctOptionIndex: 0
  },
  {
    question: "Which method is used to add an element to the end of an array in JavaScript?",
    category: "frontend",
    difficulty: "easy",
    type: "mcq",
    options: [
      "push()",
      "pop()",
      "shift()",
      "unshift()"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What does CSS stand for?",
    category: "frontend",
    difficulty: "easy",
    type: "mcq",
    options: [
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Creative Style System",
      "Colorful Style Sheets"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is React?",
    category: "frontend",
    difficulty: "medium",
    type: "mcq",
    options: [
      "A JavaScript library for building user interfaces",
      "A database management system",
      "A server-side framework",
      "A programming language"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is the virtual DOM in React?",
    category: "frontend",
    difficulty: "medium",
    type: "mcq",
    options: [
      "A lightweight copy of the real DOM kept in memory",
      "A database for storing React components",
      "A browser API",
      "A React component type"
    ],
    correctOptionIndex: 0
  },
  
  // Backend MCQs
  {
    question: "What is REST API?",
    category: "backend",
    difficulty: "easy",
    type: "mcq",
    options: [
      "Representational State Transfer - an architectural style for APIs",
      "A database query language",
      "A frontend framework",
      "A programming language"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is the purpose of middleware in Express.js?",
    category: "backend",
    difficulty: "medium",
    type: "mcq",
    options: [
      "To execute code, make changes to request/response, and call next middleware",
      "To store database connections",
      "To handle frontend routing",
      "To compile JavaScript code"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is JWT used for?",
    category: "backend",
    difficulty: "medium",
    type: "mcq",
    options: [
      "Authentication and authorization",
      "Database queries",
      "File storage",
      "Email sending"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is the difference between SQL and NoSQL databases?",
    category: "backend",
    difficulty: "hard",
    type: "mcq",
    options: [
      "SQL is relational and structured, NoSQL is non-relational and flexible",
      "SQL is faster than NoSQL",
      "NoSQL only works with JavaScript",
      "SQL is for frontend, NoSQL is for backend"
    ],
    correctOptionIndex: 0
  },
  
  // General MCQs
  {
    question: "What is Git?",
    category: "general",
    difficulty: "easy",
    type: "mcq",
    options: [
      "A version control system",
      "A programming language",
      "A database",
      "A web browser"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is the purpose of package.json in Node.js?",
    category: "general",
    difficulty: "medium",
    type: "mcq",
    options: [
      "To define project metadata and dependencies",
      "To store database credentials",
      "To configure the web server",
      "To write test cases"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is the difference between let, const, and var in JavaScript?",
    category: "general",
    difficulty: "medium",
    type: "mcq",
    options: [
      "let and const are block-scoped, var is function-scoped. const cannot be reassigned.",
      "They are all the same",
      "let is for arrays, const is for objects, var is for strings",
      "var is the modern way, let and const are deprecated"
    ],
    correctOptionIndex: 0
  }
];

const addSampleMCQs = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error("❌ Error: MONGODB_URI or MONGO_URI environment variable is not set!");
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri, {
      dbName: "ai_interview_platform",
    });
    console.log("✅ Connected to MongoDB");

    let added = 0;
    let skipped = 0;

    for (const mcq of sampleMCQs) {
      // Check if question already exists
      const exists = await Question.findOne({ 
        question: mcq.question,
        category: mcq.category 
      });

      if (exists) {
        console.log(`⏭️  Skipped: "${mcq.question.substring(0, 50)}..." (already exists)`);
        skipped++;
        continue;
      }

      // Create question with correctAnswer from options
      const questionData = {
        ...mcq,
        correctAnswer: mcq.options[mcq.correctOptionIndex]
      };

      await Question.create(questionData);
      console.log(`✅ Added: "${mcq.question.substring(0, 50)}..."`);
      added++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Added: ${added} MCQ questions`);
    console.log(`   Skipped: ${skipped} (already exist)`);

    await mongoose.connection.close();
    console.log("Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

addSampleMCQs();

