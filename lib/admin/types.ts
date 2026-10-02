// Shared types for the Research Archiving System admin dashboard.
// The PHP/MySQL API and the existing screens share this shape so the UI
// stays independent from database column names.

export type Role = "admin";

export type PublicRole = "guest" | "student";

export type PublicationStatus = "draft" | "published" | "archived";
export type RequestStatus = "pending" | "approved" | "rejected";
export type ActivityAction =
  | "uploaded"
  | "edited"
  | "approved"
  | "rejected"
  | "deleted"
  | "archived"
  | "published";

export interface Study {
  id: string;
  title: string;
  authors: string[];
  program: string;
  college: string;
  year: string;
  abstract: string;
  keywords: string[];
  pdfName: string | null;
  pdfUrl?: string | null;
  coverImageName: string | null;
  coverImageUrl?: string | null;
  status: PublicationStatus;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccessRequest {
  id: string;
  studyId: string;
  studyTitle: string;
  requesterName: string;
  requesterEmail: string;
  purpose: string;
  status: RequestStatus;
  requestedAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: PublicRole | "faculty";
  requestsCount: number;
  joinedAt: string;
}

export interface ActivityLog {
  id: string;
  actor: string;
  action: ActivityAction;
  target: string;
  timestamp: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
}
