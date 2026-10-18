import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Hello",
    });
    console.log("gemini-2.0-flash worked");
  } catch (e: any) {
    console.error("2.0-flash failed:", e.message);
  }
}
run();
