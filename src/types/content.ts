export type Platform = "linkedin" | "twitter" | "email" | "facebook" | "instagram" | "tiktok";

export type DraftStatus = "Draft" | "Pending Review" | "Approved" | "Rejected" | "Scheduled" | "Published";

export interface SEOStructure {
  h1: boolean;
  h2Count: number;
  keywordDensity: string;
  readability: string;
}

export interface Draft {
  id: string | number;
  title: string;
  creator?: string;
  platforms: Platform[];
  status: DraftStatus;
  createdAt?: string;
  lastUpdated?: string;
  submissionDate?: string;
  estPublishDate?: string;
  body?: string;
  seo?: SEOStructure;
  version?: number;
  urgent?: boolean;
  submitted?: string;
}
