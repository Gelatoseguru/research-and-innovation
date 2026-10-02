import type { ActivityLog } from "./types";

// Replace bodies with real API calls (e.g. /api/activity) once the
// backend exists. Every admin action elsewhere in the dashboard (upload,
// edit, delete, approve, reject) should call addActivityLog() so this
// stays a complete audit trail of who did what and when.

let logs: ActivityLog[] = [
  {
    id: "LOG-1",
    actor: "J. Manalo",
    action: "uploaded",
    target: "Effects of blended learning on student retention",
    timestamp: "2024-03-11T09:00:00.000Z",
  },
  {
    id: "LOG-2",
    actor: "R. Fernandez",
    action: "published",
    target: "Teacher workload and burnout in public secondary schools",
    timestamp: "2023-08-22T09:00:00.000Z",
  },
  {
    id: "LOG-3",
    actor: "J. Manalo",
    action: "approved",
    target: "REQ-0188 — Community mental health interventions post-pandemic",
    timestamp: "2026-07-12T10:00:00.000Z",
  },
];

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  return delay(
    [...logs].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
  );
}

export async function addActivityLog(
  entry: Omit<ActivityLog, "id" | "timestamp">
): Promise<ActivityLog> {
  const log: ActivityLog = {
    ...entry,
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  logs = [log, ...logs];
  return delay(log);
}
