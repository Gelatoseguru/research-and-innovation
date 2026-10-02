import { backendFetch } from "@/lib/backend";
import type { AppUser } from "./types";

export async function getUsers(): Promise<AppUser[]> {
  const response = await backendFetch("admin/users", { cache: "no-store" });
  if (!response.ok) return [];
  const body = await response.json();
  return body.users ?? [];
}
