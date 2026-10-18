const fs = require('fs');

const code = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
// API Route for incident report analysis
app.post("/api/analyze-incident", express.json(), async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
  }

  try {
    const { reportText } = req.body;
    if (!reportText) {
      return res.status(400).json({ error: "No report text provided." });
    }

    const prompt = \`You are an AI Safety Analyst for Oil India Limited (OIL).
    Analyze the following incident report or hazard observation and generate a structured compliance and safety analysis.
    
    Format your response as a JSON object with this EXACT structure:
    {
      "rulesChecked": 15,
      "potentialIssues": 2,
      "highPriorityIssues": 1,
      "insufficientEvidence": 0,
      "findings": [
        {
          "id": "F-001",
          "finding": "Describe the safety finding",
          "requirement": "Describe the breached or applicable safety requirement",
          "source": "OISD-STD-114",
          "severity": "HIGH", // or "MEDIUM" or "LOW"
          "evidence": "Quote from the report",
          "recommendedAction": "What to do next",
          "explainableMatch": {
            "reportEvidence": "Quote from report",
            "matchedConcepts": ["Hot Work", "PPE"],
            "applicableTopic": "Fire Safety",
            "source": "OISD-STD-114 Section 4.2"
          }
        }
      ],
      "ruleBasedPrecautions": [
        {
          "hazard": "Hazard name",
          "precautions": ["Precaution 1", "Precaution 2"],
          "source": "OISD-114"
        }
      ]
    }

    Incident Report:
    """
    \${reportText}
    """\`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Incident analysis error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze incident report" });
  }
});
`;

const updatedCode = code.replace(
  'async function startServer()',
  newEndpoint + '\nasync function startServer()'
);

fs.writeFileSync('server.ts', updatedCode);
