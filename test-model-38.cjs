const { GoogleGenAI } = require("@google/genai");

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "hello",
    });
    console.log("3.8-flash Success:", res.text);
  } catch (e) {
    console.error("3.8-flash Error:", e.message);
  }
}
test();
