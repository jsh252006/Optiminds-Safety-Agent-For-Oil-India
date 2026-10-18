import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Hello",
    });
    console.log("gemini-3.6-flash worked", response.text);
  } catch (e: any) {
    console.error("3.6-flash failed:", e.message);
  }
}
run();
