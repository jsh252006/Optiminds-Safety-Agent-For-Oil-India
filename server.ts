import express from "express";
import path from "path";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { db } from './src/db/index.ts';
import { queries } from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';


const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

// Multer setup for memory storage
const upload = multer({ storage: multer.memoryStorage() });

async function generateContentWithRetry(aiClient: GoogleGenAI, request: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await aiClient.models.generateContent(request);
    } catch (error: any) {
      if ((error?.status === 503 || error?.message?.includes('503')) && i < maxRetries - 1) {
        console.warn(`[Retry ${i + 1}/${maxRetries - 1}] Gemini API 503 error, retrying...`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      } else {
        throw error;
      }
    }
  }
}

// API Route for getting user queries
app.get("/api/queries", requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.dbUser) return res.status(401).json({ error: "User not found" });
    
    const userQueries = await db.select()
      .from(queries)
      .where(eq(queries.userId, req.dbUser.id))
      .orderBy(desc(queries.createdAt))
      .limit(15);
      
    res.json(userQueries.map(q => q.queryText));
  } catch (error: any) {
    console.error("Failed to fetch queries:", error);
    res.status(500).json({ error: "Failed to fetch queries" });
  }
});

// API Route for saving a query
app.post("/api/queries", requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.dbUser) return res.status(401).json({ error: "User not found" });
    const { queryText } = req.body;
    
    if (!queryText || typeof queryText !== 'string') {
      return res.status(400).json({ error: "Invalid queryText" });
    }
    
    // Simple deduplication, could also be done on frontend
    const existing = await db.select()
      .from(queries)
      .where(eq(queries.queryText, queryText))
      .limit(1);
      
    if (existing.length === 0 || existing[0].userId !== req.dbUser.id) {
       await db.insert(queries).values({
         userId: req.dbUser.id,
         queryText: queryText
       });
    }
      
    res.json({ success: true });
  } catch (error: any) {
    console.error("Failed to save query:", error);
    res.status(500).json({ error: "Failed to save query" });
  }
});

// API Route for document analysis
app.post("/api/analyze-document", upload.single("document"), async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
  }

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No document provided." });
    }
    
    // We can use gemini to process the text.
    // For simplicity, we convert buffer to base64 if it's PDF, or just to string if it's text
    // The google/genai supports document uploads, but we need to upload it via the API first or pass base64 inline.
    // Given the SDK, we can pass inline data for PDF.
    
    let mimeType = file.mimetype;
    let base64Data = file.buffer.toString("base64");

    const prompt = `Analyze this safety document from Oil India Limited. 
    1. Identify the primary hazards mentioned.
    2. List the key safety precautions and recommended actions.
    3. Generate a brief summary report of the document.
    Format your response as a JSON object with this exact structure:
    {
      "summary": "Brief summary",
      "hazards": ["Hazard 1", "Hazard 2"],
      "precautions": ["Precaution 1", "Precaution 2"]
    }`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: [
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    try {
      res.json(JSON.parse(text));
    } catch (parseError) {
      console.error("JSON parse error on AI response:", parseError, text);
      // Fallback if model failed to output valid JSON
      res.json({
        content: text.replace(/```json/g, '').replace(/```/g, '').trim()
      });
    }
  } catch (error: any) {
    console.error("Document analysis error:", error);
    let errorMessage = error.message || "Failed to analyze document";
    if (errorMessage.includes("429") || errorMessage.includes("resource_exhausted") || errorMessage.includes("quota")) {
      errorMessage = "The AI service quota has been exceeded. Please try again later or check your billing plan.";
      res.status(429).json({ error: errorMessage });
      return;
    }
    if (errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE")) {
      errorMessage = "The AI model is currently experiencing high demand. Please try again in a moment.";
    }
    res.status(500).json({ error: errorMessage });
  }
});

// API Route for incident report analysis
app.post("/api/analyze-incident", upload.single("reportFile"), async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
  }

  try {
    const reportText = req.body.reportText;
    const file = req.file;
    const language = req.body.language || "English";
    
    const site = req.body.site || "Unknown Site";

    const eventCategory = req.body.eventCategory || "Auto-Detect";
    const activity = req.body.activity || "Unknown Activity";

    if (!reportText && !file) {
      return res.status(400).json({ error: "No report text or file provided." });
    }

const prompt = `You are an AI Safety Analyst for Oil India Limited (OIL).
    Analyze the following incident report or hazard observation and generate a structured compliance and safety analysis.
    CRITICAL LANGUAGE REQUIREMENT:
    You MUST translate the output text and respond ENTIRELY in ${language}.
    
    IMPORTANT OISD GUIDELINES TO CONSIDER (OISD = Oil Industry Safety Directorate):
    - OISD-STD-105: Work Permit System (hazardous work requires controlled authorization)
    - OISD-STD-155: Personal Protective Equipment (PPE issues)
    - OISD-STD-178: Management of Change (equipment/process changes)
    - OISD-STD-174: Well Control (drilling/well operations)
    - OISD-STD-190: Safety in Derrick Floor Operations
    - OISD-GDN-206: Safety Management System in Oil and Gas Industry
    - OISD-STD-227: Emergency Response and Preparedness
    
    Format your response as a JSON object with this EXACT structure:
    {
      "executiveSummary": "Brief overview of the incident",
      "sifPotential": "High", // "High", "Medium", "Low", or "Uncertain"
      "sifClassification": "Potential SIF", // "Potential SIF", "Non-SIF", or "Requires Review"
      "sifConfidence": 85, // percentage
      "sifExplanation": {
        "reasoning": "Detailed explanation of why this was classified as a specific SIF risk level. Do NOT predict someone will definitely die; say 'identifies indicators associated with potential serious injury/fatality exposure'.",
        "evidence": ["Direct quote from report", "Another quote or detail"]
      },
      "aiSuggestedCategory": "Equipment Failure", // e.g. "Near Miss", "Unsafe Condition", "Unsafe Act"
      "rulesChecked": 15,
      "potentialIssues": 2,
      "highPriorityIssues": 1,
      "insufficientEvidence": 0,
      "riskScore": 85, // A numerical risk score between 0 and 100 based on severity
      "trendCategory": "Equipment Failure", // e.g. "Gas Leakage", "Maintenance Delay", "PPE Non-compliance"
      "precursors": [
        { "id": "P-001", "category": "Unsafe Condition", "signal": "Brief description of the early warning sign", "evidence": "Direct quote from the text that proves this precursor exists" }
      ],
      "recurringPatterns": ["Inadequate isolation", "PPE deficiency"],
      "barrierConcerns": [
        { "id": "B-001", "barrier": "Permit to Work", "concern": "Potential barrier weakness", "riskLevel": "HIGH", "evidence": "Direct quote from report showing this barrier failed or was missing" }
      ],
      "potentialConsequences": ["List of potential worst-case scenarios"],
      "contributingFactors": ["List of contributing factors"],
      "recommendations": ["List of recommended preventive actions"],
      "humanReviewRequired": true, // Always true if SIF potential or high risk
      "findings": [
        {
          "id": "F-001",
          "finding": "Describe the safety finding",
          "requirement": "Describe the breached or applicable safety requirement",
          "source": "OISD-STD-105 or other relevant standard",
          "severity": "HIGH", // or "MEDIUM" or "LOW"
          "evidence": "Direct quote from report",
          "recommendedAction": "Action to fix it",
          "confidenceLevel": "HIGH",
          "explainableMatch": {
             "reportEvidence": "The EXACT sentence from the report",
             "matchedConcepts": ["Hazard", "Location", "Condition"],
             "applicableTopic": "e.g. Work Permit System",
             "source": "OISD-STD-105"
          }
        }
      ],
      "ruleBasedPrecautions": [
        { "hazard": "Gas Leak", "precautions": ["Action 1", "Action 2"], "source": "OISD-STD-155" }
      ]
    }
    
    Ensure ALL 'evidence' and 'explainableMatch.reportEvidence' fields contain EXACT text quotes from the report to support Explainable AI principles. AI should act as a decision-support and information-assistance tool.
    `;

    const contents: any[] = [prompt];
    if (file) {
      contents.push({
        inlineData: {
          data: file.buffer.toString("base64"),
          mimeType: file.mimetype
        }
      });
    }

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Incident analysis error:", error);
    let errorMessage = error.message || "Failed to analyze incident report";
    if (errorMessage.includes("429") || errorMessage.includes("resource_exhausted") || errorMessage.includes("quota")) {
      errorMessage = "The AI service quota has been exceeded. Please try again later or check your billing plan.";
      res.status(429).json({ error: errorMessage });
      return;
    }
    if (errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE")) {
      errorMessage = "The AI model is currently experiencing high demand. Please try again in a moment.";
    }
    res.status(500).json({ error: errorMessage });
  }
});

// API Route for chat assistant
app.post("/api/chat", async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
  }
  try {
    const messages = req.body.messages; // array of {role, content}
    const requestedLanguage = req.body.language || 'English';

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array." });
    }

const systemPrompt = `You are Oily, the OPTIMINDS Safety AI Assistant for Oil India Limited (OIL).
    Your EXCLUSIVE purpose is to answer Oil & Gas safety-related queries based on official OISD standards, OIL safety guidelines, and industrial hazards.
    
    CRITICAL PERFORMANCE & LOAD OPTIMIZATION RULE:
    - If the user asks about general knowledge, programming, math, pop culture, or anything OUTSIDE of Oil India Limited safety and OISD standards, you MUST instantly reply with a short refusal: "I am specifically designed for Oil India safety queries. I cannot answer that." Do not explain further. This saves processing time and load.
    - Keep all valid answers extremely concise, direct, and actionable. Do not generate long essays.

    CRITICAL RESTRICTIONS:
    - You must act as a decision-support and information-assistance tool.
    - NEVER give final emergency commands.
    - Do NOT claim to replace qualified HSE professionals.
    - Avoid "100% safe" type statements.
    - Do NOT make unsupported regulatory claims.

CRITICAL IDENTITY RULE: You are "Oily AI". You MUST NEVER mention "Gemini", "Google", "LLM", or that you are an AI model trained by Google. If asked about your identity, creator, or underlying technology, simply state that you are Oily, the OPTIMINDS Safety AI Assistant built exclusively for Oil India Limited. Do NOT break character.

CRITICAL LANGUAGE REQUIREMENT:
You MUST respond ENTIRELY in ${requestedLanguage}. 
Even if the user asks their question in English, if the requested language is ${requestedLanguage}, your response MUST be in ${requestedLanguage}. Do not use English unless citing a specific technical term that cannot be translated.

Format your response as a JSON object with this exact structure if it's a safety question, otherwise answer normally in the "content" field:
{
  "content": "Your conversational response here in ${requestedLanguage} (if any, make it short)",
  "structuredResponse": {
    "answer": "Direct, fast answer to the safety question in ${requestedLanguage}",
    "why": "Brief 1-sentence rationale in ${requestedLanguage}",
    "requirement": "The formal safety requirement or rule in ${requestedLanguage}",
    "precautions": ["Precaution 1", "Precaution 2"],
    "source": {
      "document": "e.g. OISD-STD-105",
      "standardNumber": "105",
      "section": "Relevant section",
      "version": "Current"
    },
    "important": "A critical warning if applicable"
  },
  "confidence": "HIGH"
}
`;

    // Optimize for speed: take the last 6 messages
    const recentMessages = messages.slice(-6);
    
    let formattedHistory = recentMessages.map((msg: any) => {
      // Reconstruct content to include structured data if present, so the model has context of its past answers
      let textContent = msg.content || "";
      if (msg.structuredResponse) {
        textContent += `\n[Safety Answer Provided: ${msg.structuredResponse.answer}]`;
      }
      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: textContent || "Understood." }]
      };
    });

    // Ensure the history always starts with a user message to prevent API errors and confusion
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.unshift({
        role: 'user',
        parts: [{ text: "Hello." }]
      });
    }

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Chat error:", error);
    let errorMessage = error.message || "Failed to process chat";
    if (errorMessage.includes("429") || errorMessage.includes("resource_exhausted") || errorMessage.includes("quota")) {
      errorMessage = "The AI service quota has been exceeded. Please try again later or check your billing plan.";
      res.status(429).json({ error: errorMessage });
      return;
    }
    if (errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE")) {
      errorMessage = "The AI model is currently experiencing high demand. Please try again in a moment.";
    }
    res.status(500).json({ error: errorMessage });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
