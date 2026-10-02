// Shared types for the Research Archiving System admin dashboard.
// Keeping these in one place means the mock services and every page/
// component agree on the same shape, and swapping mock data for real
// MongoDB documents later only touches the service files, not the UI.

export type Role = "admin";

// Roles for the *public* site (referenced here for RBAC planning, not
// enforced yet since the public site itself isn't being modified in
// this pass — see README for how this plugs in later).
export type PublicRole = "guest" | "student";

export type PublicationStatus = "draft" | "published" | "archived";
export type RequestStatus = "pending" | "approved" | "rejected";
export type ActivityAction =
  | "uploaded"
  | "edited"
  | "approved"
  | "rejected"
  | "deleted"
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
  coverImageName: string | null;
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
