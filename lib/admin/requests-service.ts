import type { AccessRequest, RequestStatus } from "./types";

// Replace bodies with real API calls (e.g. /api/requests) once the
// backend exists — same pattern as research-service.ts.

let requests: AccessRequest[] = [
  {
    id: "REQ-0192",
    studyId: "LNU-ED-2024-014",
    studyTitle: "Effects of blended learning on student retention",
    requesterName: "M. Reyes",
    requesterEmail: "m.reyes@students.lnu.edu.ph",
    purpose: "Citing for a related MAEd thesis on hybrid instruction.",
    status: "pending",
    requestedAt: "2026-07-18T08:30:00.000Z",
  },
  {
    id: "REQ-0188",
    studyId: "LNU-MN-2023-088",
    studyTitle: "Community mental health interventions post-pandemic",
    requesterName: "A. Cruz",
    requesterEmail: "a.cruz@students.lnu.edu.ph",
    purpose: "Department reference for a counseling program review.",
    status: "approved",
    requestedAt: "2026-07-10T13:15:00.000Z",
  },
  {
    id: "REQ-0201",
    studyId: "LNU-ED-2023-041",
    studyTitle: "Teacher workload and burnout in public secondary schools",
    requesterName: "L. Torres",
    requesterEmail: "l.torres@students.lnu.edu.ph",
    purpose: "Background reading for a school administration case study.",
    status: "pending",
    requestedAt: "2026-07-21T16:00:00.000Z",
  },
];

function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getRequests(): Promise<AccessRequest[]> {
  return delay(
    [...requests].sort((a, b) => (a.requestedAt < b.requestedAt ? 1 : -1))
  );
}

export async function decideRequest(
  id: string,
  status: RequestStatus
): Promise<AccessRequest | null> {
  requests = requests.map((r) => (r.id === id ? { ...r, status } : r));
  return delay(requests.find((r) => r.id === id) ?? null);
}
