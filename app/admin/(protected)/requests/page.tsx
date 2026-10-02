"use client";

import { useEffect, useState } from "react";
import { Check, Ban } from "lucide-react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import StatusBadge from "@/components/admin/StatusBadge";
import { getRequests, decideRequest } from "@/lib/admin/requests-service";
import { addActivityLog } from "@/lib/admin/activity-service";
import { useAdminAuth } from "@/lib/admin/auth-context";
import type { AccessRequest, RequestStatus } from "@/lib/admin/types";

export default function AccessRequestsPage() {
  const { admin } = useAdminAuth();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRequests().then((r) => {
      setRequests(r);
      setLoading(false);
    });
  }, []);

  async function handleDecision(r: AccessRequest, decision: RequestStatus) {
    await decideRequest(r.id, decision);
    await addActivityLog({
      actor: admin?.name ?? "Unknown admin",
      action: decision === "approved" ? "approved" : "rejected",
      target: `${r.id} — ${r.studyTitle}`,
    });
    setRequests((prev) =>
      prev.map((x) => (x.id === r.id ? { ...x, status: decision } : x))
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="px-4">
        <AdminTopBar title="Access Requests" />
      </div>

      {loading && (
        <div className="flex h-48 items-center justify-center">
          <p className="text-sm font-medium text-gray-400">Loading requests…</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {requests.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-4 rounded-[2rem] border border-[#6B6B6B] bg-white/60 p-6 shadow-xl shadow-gray-200/40 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between transition-all hover:bg-white/75"
          >
            <div className="space-y-1">
              <p className="font-semibold text-gray-900 text-base">{r.studyTitle}</p>
              <p className="text-xs text-gray-500 font-medium">
                Requested by <span className="text-gray-700">{r.requesterName}</span> ({r.requesterEmail})
              </p>
              <p className="text-xs text-gray-600 bg-white/50 border border-[#6B6B6B] rounded-xl p-2.5 mt-2 backdrop-blur-sm">
                {r.purpose}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <StatusBadge status={r.status} />
              {r.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDecision(r, "approved")}
                    className="flex items-center gap-1.5 rounded-full border border-[#922842]/35 bg-[#922842]/10 px-4 py-2 text-xs font-medium text-[#922842] shadow-sm backdrop-blur-md transition-all hover:bg-[#922842]/20 hover:border-[#922842]/50"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => handleDecision(r, "rejected")}
                    className="flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white/60 px-4 py-2 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-md transition-all hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Ban size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

