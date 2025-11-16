// server/utils/dropOldIndex.js
// Script to drop the old sessionId index from MongoDB
// Run this once to fix the duplicate key error

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dropOldIndex = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error("❌ Error: MONGODB_URI or MONGO_URI environment variable is not set!");
      console.error("Please set it in your .env file or environment variables.");
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri, {
      dbName: "ai_interview_platform",
    });
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("results");

    // List all indexes
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes);

    // Try to drop the sessionId index if it exists
    try {
      await collection.dropIndex("sessionId_1");
      console.log("✅ Successfully dropped sessionId_1 index");
    } catch (err) {
      if (err.code === 27) {
        console.log("ℹ️  sessionId_1 index does not exist (already removed)");
      } else {
        console.error("Error dropping index:", err.message);
      }
    }

    // List indexes again to confirm
    const indexesAfter = await collection.indexes();
    console.log("Indexes after cleanup:", indexesAfter);

    await mongoose.connection.close();
    console.log("Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

dropOldIndex();

