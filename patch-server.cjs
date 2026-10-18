const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
const regex = /const prompt = `You are an AI Safety Analyst[\s\S]*?Incident Report Text:\s*"""\s*\$\{reportText \|\| "See attached file\."\}\s*"""`;/;
const newPrompt = `const prompt = \`You are an AI Safety Analyst for Oil India Limited (OIL).
    Analyze the following incident report or hazard observation and generate a structured compliance and safety analysis.
    Translate the output text into \${language}.
    
    Format your response as a JSON object with this EXACT structure:
    {
      "executiveSummary": "Brief overview of the incident",
      "sifPotential": "High", // "High", "Medium", "Low", or "Uncertain"
      "sifClassification": "Potential SIF", // "Potential SIF", "Non-SIF", or "Requires Review"
      "sifConfidence": 85, // percentage
      "aiSuggestedCategory": "Equipment Failure", // e.g. "Near Miss", "Unsafe Act", "Process Safety Event"
      "rulesChecked": 15,
      "potentialIssues": 2,
      "highPriorityIssues": 1,
      "insufficientEvidence": 0,
      "riskScore": 85, // A numerical risk score between 0 and 100 based on severity
      "trendCategory": "Equipment Failure", // e.g. "PPE Non-compliance", "Process Deviation", "Fire Hazard"
      "precursors": [
        { "id": "P-001", "category": "Barrier failure", "signal": "Signal description", "evidence": "Quote from report" }
      ],
      "recurringPatterns": ["Inadequate isolation", "PPE deficiency"],
      "barrierConcerns": [
        { "id": "B-001", "barrier": "Permit to Work", "concern": "Potential barrier weakness", "riskLevel": "HIGH", "evidence": "Quote from report" }
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
          "source": "OISD-STD-114",
          "severity": "HIGH", // or "MEDIUM" or "LOW"
          "evidence": "Quote from the report",
          "recommendedAction": "What to do next",
          "confidenceLevel": "HIGH", // "HIGH", "MEDIUM", or "LOW"
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

    IMPORTANT: Do not claim an event caused an injury/fatality unless explicitly stated. Distinguish potential precursors from actual consequences. Provide exact quotes from the text for evidence.
    
    Incident Report Text:
    """
    \${reportText || "See attached file."}
    """\`;`;

if (regex.test(content)) {
  content = content.replace(regex, newPrompt);
  fs.writeFileSync('server.ts', content);
  console.log("Replaced system prompt successfully.");
} else {
  console.log("Could not find system prompt to replace.");
}
