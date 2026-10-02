import { backendFetch } from "@/lib/backend";
import type { ActivityLog } from "./types";

export async function getActivityLogs(): Promise<ActivityLog[]> {
  const response = await backendFetch("activity", { cache: "no-store" });
  if (!response.ok) return [];
  const body = await response.json();
  return body.logs ?? [];
}

// The PHP API records uploads, edits, archives, approvals, and rejections atomically.
export async function addActivityLog(entry: Omit<ActivityLog, "id" | "timestamp">): Promise<ActivityLog> {
  return { ...entry, id: "server-managed", timestamp: new Date().toISOString() };
}
