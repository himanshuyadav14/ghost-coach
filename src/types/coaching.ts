export type ConfidenceLevel = "Low" | "Medium" | "High";

export interface CoachingReport {
  overallScore: number;
  strengths: string[];
  areasToImprove: string[];
  priorityFix: string;
  drillSuggestion: string;
  confidenceLevel: ConfidenceLevel;
}

export interface AnalysisResponse {
  report: CoachingReport;
  sessionId: string;
}

export interface SessionSummary {
  id: string;
  overallScore: number;
  priorityFix: string;
  confidenceLevel: ConfidenceLevel;
  createdAt: string;
  imageUrl: string;
}

export interface SessionDetail extends SessionSummary {
  report: CoachingReport;
  imageMimeType: string;
}

export interface SessionsListResponse {
  items: SessionSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
