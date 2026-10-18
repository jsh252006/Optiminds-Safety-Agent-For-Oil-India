const { GoogleGenAI } = require("@google/genai");

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: "hello",
    });
    console.log("3.1-flash-lite Success:", res.text);
  } catch (e) {
    console.error("3.1-flash-lite Error:", e.message);
  }
}
test();
