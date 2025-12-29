
export enum IssuePriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum IssueStatus {
  REPORTED = 'Reported',
  VERIFIED = 'Verified',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved'
}

export interface CivicIssue {
  id: string;
  type: string;
  priority: IssuePriority;
  status: IssueStatus;
  department: string;
  summary: string;
  location: string;
  timestamp: string;
  imageUrl?: string;
  confidence: number;
}

export interface AIAnalysisResult {
  issue_type: string;
  priority: IssuePriority;
  department: string;
  confidence: number;
  summary: string;
}
