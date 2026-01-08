
export enum UserRole {
  CITIZEN = 'Verified Citizen',
  JOURNALIST = 'Journalist',
  EXPERT = 'Subject Matter Expert',
  EDITOR = 'Editor/Fact-Checker',
  OFFICIAL = 'Official Body'
}

export enum ContentType {
  NEWS = 'News Report',
  INVESTIGATION = 'Investigative Summary',
  OFFICIAL = 'Official Announcement',
  RESEARCH = 'Research Article',
  INTERVIEW = 'Recorded Interview'
}

export enum VerificationStatus {
  PENDING = 'Pending Verification',
  AI_SCREENED = 'AI Screened',
  RIGHT_OF_REPLY = 'Right of Reply Active',
  VERIFIED = 'Verified',
  CORRECTED = 'Corrected'
}

export interface VerificationLog {
  id: string;
  step: string;
  timestamp: string;
  actor: string;
  details: string;
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  authorRole: UserRole;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: string;
  authorAvatar?: string;
  authorRole: UserRole;
  type: ContentType;
  title: string;
  content: string;
  timestamp: string;
  status: VerificationStatus;
  sources: string[];
  evidenceUrls: string[];
  replyConfirmed?: boolean;
  auditTrail: VerificationLog[];
  interviewUrl?: string;
  comments?: Comment[];
  likes: number;
  likedByMe?: boolean;
  views: number;
}

export interface VerificationResult {
  credibilityScore: number;
  analysis: string;
  sourcesFound: string[];
  flags: string[];
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}
