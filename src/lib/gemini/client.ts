import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "@/config/env";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }
  return genAI;
}

export function getGeminiModel() {
  return getGenAI().getGenerativeModel({ model: env.GEMINI_MODEL });
}
