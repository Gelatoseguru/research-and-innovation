import { backendFetch } from "@/lib/backend";
import type { AccessRequest, RequestStatus } from "./types";

export async function getRequests(): Promise<AccessRequest[]> {
  const response = await backendFetch("requests", { cache: "no-store" });
  if (!response.ok) return [];
  const body = await response.json();
  return body.requests ?? [];
}

export async function decideRequest(
  id: string,
  status: RequestStatus
): Promise<AccessRequest | null> {
  const response = await backendFetch(`requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) return null;
  const body = await response.json();
  return body.request ?? null;
}
