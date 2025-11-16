import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("❌ OPENAI_API_KEY missing!");
}

let openai;

try {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log("✅ OpenAI client initialized");
} catch (error) {
  console.error("❌ OpenAI Init Error:", error.message);
  process.exit(1);
}

export default openai;
