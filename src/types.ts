export type DocumentStatus = 'CURRENT' | 'SUPERSEDED' | 'ARCHIVED' | 'PENDING VERIFICATION';
export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface SafetyDocument {
  id: string;
  name: string;
  type: string;
  organization: string;
  standardNumber: string;
  version: string;
  publicationDate: string;
  effectiveDate?: string;
  status: DocumentStatus;
  applicableArea: string[];
  aiAnalysis?: {
    summary: string;
    hazards: string[];
    precautions: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isEmergency?: boolean;
  confidence?: Confidence;
  structuredResponse?: {
    answer: string;
    why: string;
    requirement: string;
    precautions: string[];
    source: {
      document: string;
      standardNumber: string;
      section: string;
      version: string;
    };
    important?: string;
  };
}

export interface PreventiveAction {
  id: string;
  text: string;
  status: 'PENDING' | 'COMPLETED';
  dateCompleted?: string;
}

export interface ComplianceFinding {
  id: string;
  finding: string;
  requirement: string;
  source: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string;
  recommendedAction: string;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  explainableMatch: {
    reportEvidence: string;
    matchedConcepts: string[];
    applicableTopic: string;
    source: string;
  };
}

export interface BarrierConcern {
  id: string;
  barrier: string;
  concern: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string;
}

export interface PrecursorSignal {
  id: string;
  category: string;
  signal: string;
  evidence: string;
}

export interface ReportAnalysisResult {
  rulesChecked: number;
  potentialIssues: number;
  highPriorityIssues: number;
  insufficientEvidence: number;
  riskScore: number;
  trendCategory: string;
  findings: ComplianceFinding[];
  ruleBasedPrecautions: {
    hazard: string;
    precautions: string[];
    source: string;
  }[];
  // New Analytics Fields
  executiveSummary?: string;
  sifPotential?: 'High' | 'Medium' | 'Low' | 'Uncertain';
  sifClassification?: 'Potential SIF' | 'Non-SIF' | 'Requires Review';
  sifConfidence?: number;
  sifExplanation?: {
    reasoning: string;
    evidence: string[];
  };
  aiSuggestedCategory?: string;
  precursors?: PrecursorSignal[];
  recurringPatterns?: string[];
  barrierConcerns?: BarrierConcern[];
  potentialConsequences?: string[];
  contributingFactors?: string[];
  recommendations?: string[];
  humanReviewRequired?: boolean;
}

export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  createdAt?: any;
  analysis?: ReportAnalysisResult;
  preventiveActions?: PreventiveAction[];
  attachedFileName?: string;
  attachedFileData?: string;
  
  // User Ownership Fields
  userId?: string;
  userEmail?: string;
  userName?: string;

  // New Metadata Fields
  site?: string;
  location?: string;
  asset?: string;
  eventCategory?: string;
  activity?: string;
  date?: string;
  reportType?: string;
  contractor?: string;
  incidentSeverity?: string;
  sourceOfReport?: string;
}
