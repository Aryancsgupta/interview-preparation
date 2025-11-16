// server/utils/setAdmin.js
// Script to set aryangupta1467@gmail.com as admin
// Run this if the user already exists in the database

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const setAdmin = async () => {
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

    const adminEmail = "aryangupta1467@gmail.com";
    
    // Find and update the user
    const user = await User.findOneAndUpdate(
      { email: adminEmail },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`✅ Successfully set ${adminEmail} as admin`);
      console.log(`   User ID: ${user._id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
    } else {
      console.log(`ℹ️  User with email ${adminEmail} not found.`);
      console.log("   Please register this email first, then run this script again.");
    }

    await mongoose.connection.close();
    console.log("Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

setAdmin();

