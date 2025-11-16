// server/utils/addAllQuestions.js
// Script to add comprehensive MCQ and Descriptive questions for all categories and difficulties

import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question.js";

dotenv.config();

const allQuestions = [
  // ========== FRONTEND QUESTIONS ==========
  
  // Frontend - Easy - MCQ
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
    options: ["push()", "pop()", "shift()", "unshift()"],
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
    question: "Which HTML tag is used to create a hyperlink?",
    category: "frontend",
    difficulty: "easy",
    type: "mcq",
    options: ["<a>", "<link>", "<href>", "<url>"],
    correctOptionIndex: 0
  },
  {
    question: "What is the correct way to select an element by ID in JavaScript?",
    category: "frontend",
    difficulty: "easy",
    type: "mcq",
    options: [
      "document.getElementById('id')",
      "document.getElement('id')",
      "document.selectId('id')",
      "document.findId('id')"
    ],
    correctOptionIndex: 0
  },

  // Frontend - Medium - MCQ
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
  {
    question: "What is the difference between let, const, and var in JavaScript?",
    category: "frontend",
    difficulty: "medium",
    type: "mcq",
    options: [
      "let and const are block-scoped, var is function-scoped. const cannot be reassigned.",
      "They are all the same",
      "let is for arrays, const is for objects, var is for strings",
      "var is the modern way, let and const are deprecated"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is a closure in JavaScript?",
    category: "frontend",
    difficulty: "medium",
    type: "mcq",
    options: [
      "A function that has access to variables in its outer scope",
      "A way to close a browser tab",
      "A method to close a database connection",
      "A JavaScript error type"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is the purpose of useEffect hook in React?",
    category: "frontend",
    difficulty: "medium",
    type: "mcq",
    options: [
      "To perform side effects in functional components",
      "To create new components",
      "To handle form submissions",
      "To manage state in components"
    ],
    correctOptionIndex: 0
  },

  // Frontend - Hard - MCQ
  {
    question: "What is the difference between React.memo() and useMemo()?",
    category: "frontend",
    difficulty: "hard",
    type: "mcq",
    options: [
      "React.memo() memoizes components, useMemo() memoizes values",
      "They are the same",
      "React.memo() is for class components, useMemo() is for functions",
      "useMemo() is deprecated"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is the event loop in JavaScript?",
    category: "frontend",
    difficulty: "hard",
    type: "mcq",
    options: [
      "A mechanism that handles asynchronous operations and callbacks",
      "A way to loop through events",
      "A browser rendering engine",
      "A JavaScript error handler"
    ],
    correctOptionIndex: 0
  },

  // Frontend - Easy - Descriptive
  {
    question: "Explain what HTML is and its purpose in web development.",
    category: "frontend",
    difficulty: "easy",
    type: "descriptive",
    correctAnswer: "HTML (HyperText Markup Language) is the standard markup language used to create and structure content on the web. It defines the structure of web pages using elements and tags. HTML provides the skeleton of a webpage, allowing developers to organize text, images, links, and other content. It works alongside CSS for styling and JavaScript for interactivity to create complete web applications."
  },
  {
    question: "What is the difference between inline and block elements in HTML?",
    category: "frontend",
    difficulty: "easy",
    type: "descriptive",
    correctAnswer: "Inline elements take up only as much width as necessary and do not start on a new line. Examples include <span>, <a>, <img>. Block elements take up the full width available and start on a new line. Examples include <div>, <p>, <h1>. Block elements can contain inline elements, but inline elements cannot contain block elements (with some exceptions)."
  },

  // Frontend - Medium - Descriptive
  {
    question: "Explain the concept of CSS Box Model.",
    category: "frontend",
    difficulty: "medium",
    type: "descriptive",
    correctAnswer: "The CSS Box Model describes how elements are rendered on a page. It consists of four parts: content (the actual content), padding (space between content and border), border (the border around padding), and margin (space outside the border). The total width/height of an element = content + padding + border. Margin is not included in the element's size but affects spacing between elements."
  },
  {
    question: "What are JavaScript promises and how do they work?",
    category: "frontend",
    difficulty: "medium",
    type: "descriptive",
    correctAnswer: "Promises are objects that represent the eventual completion or failure of an asynchronous operation. They have three states: pending, fulfilled, or rejected. Promises help avoid callback hell and make async code more readable. You can chain promises using .then() for success and .catch() for errors. async/await syntax provides a cleaner way to work with promises."
  },

  // Frontend - Hard - Descriptive
  {
    question: "Explain React's reconciliation algorithm and how it optimizes rendering.",
    category: "frontend",
    difficulty: "hard",
    type: "descriptive",
    correctAnswer: "React's reconciliation is the process of comparing the new virtual DOM tree with the previous one (diffing) and updating only the changed parts in the real DOM. React uses a heuristic algorithm that assumes: 1) Elements of different types produce different trees, 2) Keys help identify which items changed. This minimizes DOM manipulations, improving performance. React batches updates and uses techniques like shouldComponentUpdate and React.memo to prevent unnecessary re-renders."
  },

  // ========== BACKEND QUESTIONS ==========
  
  // Backend - Easy - MCQ
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
    question: "What is Node.js?",
    category: "backend",
    difficulty: "easy",
    type: "mcq",
    options: [
      "A JavaScript runtime built on Chrome's V8 engine",
      "A database system",
      "A frontend framework",
      "A version control system"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is Express.js?",
    category: "backend",
    difficulty: "easy",
    type: "mcq",
    options: [
      "A web application framework for Node.js",
      "A database",
      "A frontend library",
      "A programming language"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is MongoDB?",
    category: "backend",
    difficulty: "easy",
    type: "mcq",
    options: [
      "A NoSQL document database",
      "A SQL relational database",
      "A frontend framework",
      "A version control system"
    ],
    correctOptionIndex: 0
  },

  // Backend - Medium - MCQ
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
    difficulty: "medium",
    type: "mcq",
    options: [
      "SQL is relational and structured, NoSQL is non-relational and flexible",
      "SQL is faster than NoSQL",
      "NoSQL only works with JavaScript",
      "SQL is for frontend, NoSQL is for backend"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is the purpose of environment variables?",
    category: "backend",
    difficulty: "medium",
    type: "mcq",
    options: [
      "To store configuration settings and sensitive data securely",
      "To define CSS styles",
      "To create HTML elements",
      "To manage frontend state"
    ],
    correctOptionIndex: 0
  },

  // Backend - Hard - MCQ
  {
    question: "What is database indexing and why is it important?",
    category: "backend",
    difficulty: "hard",
    type: "mcq",
    options: [
      "A data structure that improves query performance by allowing faster data retrieval",
      "A way to delete database records",
      "A method to encrypt data",
      "A type of database backup"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is the difference between authentication and authorization?",
    category: "backend",
    difficulty: "hard",
    type: "mcq",
    options: [
      "Authentication verifies identity, authorization checks permissions",
      "They are the same thing",
      "Authentication is for frontend, authorization is for backend",
      "Authorization verifies identity, authentication checks permissions"
    ],
    correctOptionIndex: 0
  },

  // Backend - Easy - Descriptive
  {
    question: "Explain what an API is and why it's important in web development.",
    category: "backend",
    difficulty: "easy",
    type: "descriptive",
    correctAnswer: "An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other. In web development, APIs enable frontend applications to request data from backend servers. APIs define endpoints, request/response formats, and authentication methods. They allow separation of concerns, enable third-party integrations, and make applications more modular and scalable."
  },
  {
    question: "What is the difference between GET and POST HTTP methods?",
    category: "backend",
    difficulty: "easy",
    type: "descriptive",
    correctAnswer: "GET is used to retrieve data from a server. It should be idempotent and safe, meaning it doesn't modify server state. GET requests can be cached and parameters are sent in the URL. POST is used to submit data to create or update resources. POST requests can modify server state, are not cached, and data is sent in the request body. POST is used for sensitive data and larger payloads."
  },

  // Backend - Medium - Descriptive
  {
    question: "Explain how JWT (JSON Web Tokens) work for authentication.",
    category: "backend",
    difficulty: "medium",
    type: "descriptive",
    correctAnswer: "JWT is a compact, URL-safe token format for securely transmitting information between parties. It consists of three parts: header (algorithm and token type), payload (claims/data), and signature (verification). When a user logs in, the server creates a JWT with user info and signs it with a secret key. The client stores this token and sends it with subsequent requests. The server verifies the signature to ensure the token is valid and hasn't been tampered with. JWTs are stateless, meaning the server doesn't need to store session data."
  },
  {
    question: "What is database normalization and why is it important?",
    category: "backend",
    difficulty: "medium",
    type: "descriptive",
    correctAnswer: "Database normalization is the process of organizing data to reduce redundancy and improve data integrity. It involves dividing large tables into smaller, related tables and defining relationships between them. Normalization follows normal forms (1NF, 2NF, 3NF, etc.) with rules like eliminating duplicate data, ensuring each field contains only one value, and removing transitive dependencies. Benefits include reduced storage space, easier maintenance, and prevention of data inconsistencies."
  },

  // Backend - Hard - Descriptive
  {
    question: "Explain the concept of database transactions and ACID properties.",
    category: "backend",
    difficulty: "hard",
    type: "descriptive",
    correctAnswer: "A database transaction is a sequence of operations that are executed as a single unit. ACID properties ensure reliability: Atomicity (all operations succeed or all fail), Consistency (data remains valid after transaction), Isolation (concurrent transactions don't interfere), and Durability (committed changes persist even after system failure). Transactions ensure data integrity, especially in financial systems where partial updates could cause serious problems."
  },

  // ========== DEVOPS QUESTIONS ==========
  
  // DevOps - Easy - MCQ
  {
    question: "What is Docker?",
    category: "devops",
    difficulty: "easy",
    type: "mcq",
    options: [
      "A platform for containerizing applications",
      "A database system",
      "A programming language",
      "A version control system"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is Git?",
    category: "devops",
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
    question: "What is CI/CD?",
    category: "devops",
    difficulty: "easy",
    type: "mcq",
    options: [
      "Continuous Integration and Continuous Deployment",
      "Computer Interface and Code Development",
      "Centralized Integration and Code Deployment",
      "Continuous Integration and Code Development"
    ],
    correctOptionIndex: 0
  },

  // DevOps - Medium - MCQ
  {
    question: "What is the difference between Docker and Kubernetes?",
    category: "devops",
    difficulty: "medium",
    type: "mcq",
    options: [
      "Docker containers applications, Kubernetes orchestrates containers",
      "They are the same",
      "Kubernetes is a database, Docker is a container",
      "Docker is for frontend, Kubernetes is for backend"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is the purpose of a Dockerfile?",
    category: "devops",
    difficulty: "medium",
    type: "mcq",
    options: [
      "To define instructions for building a Docker image",
      "To store database credentials",
      "To write test cases",
      "To configure the web server"
    ],
    correctOptionIndex: 0
  },

  // DevOps - Hard - MCQ
  {
    question: "What is infrastructure as code (IaC)?",
    category: "devops",
    difficulty: "hard",
    type: "mcq",
    options: [
      "Managing infrastructure through code and configuration files",
      "Writing code for infrastructure components",
      "A type of database",
      "A programming language"
    ],
    correctOptionIndex: 0
  },

  // DevOps - Easy - Descriptive
  {
    question: "What is version control and why is it important?",
    category: "devops",
    difficulty: "easy",
    type: "descriptive",
    correctAnswer: "Version control is a system that tracks changes to files over time, allowing you to recall specific versions later. It enables multiple developers to work on the same project, tracks who made what changes, allows reverting to previous versions, and helps manage different branches of development. Git is the most popular version control system, providing features like branching, merging, and distributed development."
  },
  {
    question: "Explain what containers are and their benefits.",
    category: "devops",
    difficulty: "easy",
    type: "descriptive",
    correctAnswer: "Containers are lightweight, portable units that package an application with all its dependencies, libraries, and configuration files. They run consistently across different environments. Benefits include: isolation (apps don't interfere with each other), portability (works on any system with container runtime), scalability (easy to scale up/down), resource efficiency (less overhead than VMs), and faster deployment. Docker is the most popular containerization platform."
  },

  // DevOps - Medium - Descriptive
  {
    question: "What is CI/CD pipeline and how does it work?",
    category: "devops",
    difficulty: "medium",
    type: "descriptive",
    correctAnswer: "CI/CD (Continuous Integration/Continuous Deployment) is a practice that automates the software delivery process. CI automatically builds and tests code when changes are pushed, catching bugs early. CD automatically deploys code to production after passing tests. A typical pipeline includes: source code management, automated builds, automated testing, code quality checks, and automated deployment. This reduces manual errors, speeds up delivery, and ensures consistent releases."
  },

  // ========== TESTING QUESTIONS ==========
  
  // Testing - Easy - MCQ
  {
    question: "What is unit testing?",
    category: "testing",
    difficulty: "easy",
    type: "mcq",
    options: [
      "Testing individual components or functions in isolation",
      "Testing the entire application",
      "Testing user interfaces",
      "Testing database connections"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is the purpose of test cases?",
    category: "testing",
    difficulty: "easy",
    type: "mcq",
    options: [
      "To verify that software works as expected",
      "To write production code",
      "To design user interfaces",
      "To manage databases"
    ],
    correctOptionIndex: 0
  },

  // Testing - Medium - MCQ
  {
    question: "What is the difference between unit testing and integration testing?",
    category: "testing",
    difficulty: "medium",
    type: "mcq",
    options: [
      "Unit testing tests individual components, integration testing tests component interactions",
      "They are the same",
      "Unit testing is for frontend, integration is for backend",
      "Integration testing is deprecated"
    ],
    correctOptionIndex: 0
  },

  // Testing - Easy - Descriptive
  {
    question: "Explain what software testing is and why it's important.",
    category: "testing",
    difficulty: "easy",
    type: "descriptive",
    correctAnswer: "Software testing is the process of evaluating software to ensure it meets requirements and works correctly. It involves executing software with the intent of finding bugs, verifying functionality, and ensuring quality. Testing is important because it: finds defects before production, ensures software reliability, improves user experience, reduces maintenance costs, and provides confidence in the software. Types include unit, integration, system, and acceptance testing."
  },

  // Testing - Medium - Descriptive
  {
    question: "What is test-driven development (TDD)?",
    category: "testing",
    difficulty: "medium",
    type: "descriptive",
    correctAnswer: "Test-Driven Development (TDD) is a software development approach where you write tests before writing the actual code. The TDD cycle follows three steps: 1) Write a failing test (Red), 2) Write minimal code to pass the test (Green), 3) Refactor the code while keeping tests passing (Refactor). Benefits include better code design, comprehensive test coverage, faster debugging, and documentation through tests. It encourages writing testable, modular code."
  },

  // ========== GENERAL QUESTIONS ==========
  
  // General - Easy - MCQ
  {
    question: "What is the purpose of package.json in Node.js?",
    category: "general",
    difficulty: "easy",
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
    question: "What is npm?",
    category: "general",
    difficulty: "easy",
    type: "mcq",
    options: [
      "Node Package Manager - a package manager for JavaScript",
      "A database system",
      "A frontend framework",
      "A version control system"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is JSON?",
    category: "general",
    difficulty: "easy",
    type: "mcq",
    options: [
      "JavaScript Object Notation - a data interchange format",
      "A programming language",
      "A database",
      "A web framework"
    ],
    correctOptionIndex: 0
  },

  // General - Medium - MCQ
  {
    question: "What is the difference between synchronous and asynchronous programming?",
    category: "general",
    difficulty: "medium",
    type: "mcq",
    options: [
      "Synchronous executes sequentially, asynchronous allows concurrent operations",
      "They are the same",
      "Synchronous is for frontend, asynchronous is for backend",
      "Asynchronous is deprecated"
    ],
    correctOptionIndex: 0
  },
  {
    question: "What is the purpose of .env files?",
    category: "general",
    difficulty: "medium",
    type: "mcq",
    options: [
      "To store environment variables and configuration",
      "To write HTML code",
      "To manage CSS styles",
      "To store test cases"
    ],
    correctOptionIndex: 0
  },

  // General - Easy - Descriptive
  {
    question: "Explain what JSON is and its common use cases.",
    category: "general",
    difficulty: "easy",
    type: "descriptive",
    correctAnswer: "JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and write, and easy for machines to parse and generate. It uses key-value pairs and arrays to represent data. Common use cases include: API responses, configuration files, data storage, and communication between frontend and backend. JSON is language-independent and widely supported across programming languages."
  },
  {
    question: "What is the difference between let, const, and var in JavaScript?",
    category: "general",
    difficulty: "easy",
    type: "descriptive",
    correctAnswer: "var is function-scoped and can be redeclared. let and const are block-scoped (only accessible within the block they're declared). let can be reassigned but not redeclared in the same scope. const cannot be reassigned or redeclared, making it ideal for constants. const objects/arrays can have their properties/elements modified, but the reference cannot change. Modern JavaScript prefers let and const over var."
  },

  // General - Medium - Descriptive
  {
    question: "Explain the concept of asynchronous programming in JavaScript.",
    category: "general",
    difficulty: "medium",
    type: "descriptive",
    correctAnswer: "Asynchronous programming allows code to run without blocking the main thread. JavaScript uses an event loop to handle async operations. Callbacks, Promises, and async/await are mechanisms for handling async code. Promises represent future values and can be chained with .then() and .catch(). async/await provides syntactic sugar for promises, making async code look synchronous. This is essential for operations like API calls, file I/O, and timers that shouldn't block the UI."
  }
];

const addAllQuestions = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error("❌ Error: MONGODB_URI or MONGO_URI environment variable is not set!");
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri, {
      dbName: "ai_interview_platform",
    });
    console.log("✅ Connected to MongoDB\n");

    let added = 0;
    let skipped = 0;
    const categoryCount = {};

    for (const question of allQuestions) {
      // Check if question already exists
      const exists = await Question.findOne({ 
        question: question.question,
        category: question.category 
      });

      if (exists) {
        console.log(`⏭️  Skipped: "${question.question.substring(0, 50)}..." (already exists)`);
        skipped++;
        continue;
      }

      // Create question data
      let questionData;
      if (question.type === 'mcq') {
        questionData = {
          ...question,
          correctAnswer: question.options[question.correctOptionIndex]
        };
      } else {
        questionData = question;
      }

      await Question.create(questionData);
      console.log(`✅ Added [${question.category.toUpperCase()}] [${question.difficulty.toUpperCase()}] [${question.type.toUpperCase()}]: "${question.question.substring(0, 60)}..."`);
      added++;
      
      // Count by category
      if (!categoryCount[question.category]) {
        categoryCount[question.category] = { mcq: 0, descriptive: 0 };
      }
      categoryCount[question.category][question.type]++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Added: ${added} questions`);
    console.log(`   ⏭️  Skipped: ${skipped} (already exist)\n`);
    
    console.log(`📈 Breakdown by Category:`);
    for (const [category, counts] of Object.entries(categoryCount)) {
      console.log(`   ${category.toUpperCase()}: ${counts.mcq} MCQ, ${counts.descriptive} Descriptive`);
    }

    await mongoose.connection.close();
    console.log("\n✅ Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

addAllQuestions();

