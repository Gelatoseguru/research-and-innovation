import type { AppUser } from "./types";

// Replace bodies with real API calls (e.g. /api/users) once the
// backend exists — same pattern as research-service.ts.

const users: AppUser[] = [
  {
    id: "usr-1",
    name: "M. Reyes",
    email: "m.reyes@students.lnu.edu.ph",
    role: "student",
    requestsCount: 3,
    joinedAt: "2025-08-14T00:00:00.000Z",
  },
  {
    id: "usr-2",
    name: "A. Cruz",
    email: "a.cruz@students.lnu.edu.ph",
    role: "student",
    requestsCount: 1,
    joinedAt: "2025-09-02T00:00:00.000Z",
  },
  {
    id: "usr-3",
    name: "L. Torres",
    email: "l.torres@students.lnu.edu.ph",
    role: "student",
    requestsCount: 2,
    joinedAt: "2026-01-20T00:00:00.000Z",
  },
  {
    id: "usr-4",
    name: "Dr. P. Ilagan",
    email: "p.ilagan@lnu.edu.ph",
    role: "faculty",
    requestsCount: 5,
    joinedAt: "2024-06-01T00:00:00.000Z",
  },
];

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getUsers(): Promise<AppUser[]> {
  return delay([...users]);
}
