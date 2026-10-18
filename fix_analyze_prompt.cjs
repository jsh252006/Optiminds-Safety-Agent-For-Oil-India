const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const promptReplacement = `
    const prompt = \`You are an AI Safety Analyst for Oil India Limited (OIL).
    Analyze the following incident report or hazard observation and generate a structured compliance and safety analysis.
    CRITICAL LANGUAGE REQUIREMENT:
    You MUST translate the output text and respond ENTIRELY in \${language}.
    
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
    \`;
`;

const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('const prompt = `You are an AI Safety Analyst for Oil India Limited (OIL).'));
const endIdx = lines.findIndex(l => l.includes('    Ensure your response is valid JSON.')); // Let's look for the end of prompt

if (startIdx !== -1) {
    let finalEndIdx = startIdx;
    for(let i = startIdx; i < lines.length; i++) {
        if (lines[i].includes('`;') && i > startIdx) {
            finalEndIdx = i;
            break;
        }
    }
    
    const before = lines.slice(0, startIdx).join('\n');
    const after = lines.slice(finalEndIdx + 1).join('\n');
    
    content = before + '\n' + promptReplacement.trim() + '\n' + after;
    fs.writeFileSync('server.ts', content);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find prompt.");
}
