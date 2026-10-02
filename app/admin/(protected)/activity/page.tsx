"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import StatusBadge from "@/components/admin/StatusBadge";
import { getActivityLogs } from "@/lib/admin/activity-service";
import type { ActivityLog } from "@/lib/admin/types";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityLogs().then((l) => {
      setLogs(l);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="px-5">
         <AdminTopBar title="Activity Logs" />
      </div>

      {loading && (
        <div className="flex h-48 items-center justify-center">
          <p className="text-sm font-medium text-gray-400">Loading activity logs…</p>
        </div>
      )}

      <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 shadow-xl shadow-gray-200/40 backdrop-blur-2xl">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100/80 bg-white/40 text-xs font-medium uppercase tracking-[0.2em] text-[#6B6B6B] backdrop-blur-md">
            <tr>
              <th className="px-5 py-4 text-left">Timestamp</th>
              <th className="px-5 py-4 text-left">Admin</th>
              <th className="px-5 py-4 text-left">Action</th>
              <th className="px-5 py-4 text-left">Target</th>
            </tr>
          </thead>
          <tbody>
            {!loading && logs.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-gray-400" colSpan={4}>
                  No activity logs found.
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-[#6B6B6B] transition-colors hover:bg-white/80 last:border-0"
              >
                <td className="px-5 py-4 font-[family-name:var(--font-mono)] text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-5 py-4 font-medium text-gray-900">{log.actor}</td>
                <td className="px-5 py-4"><StatusBadge status={log.action} /></td>
                <td className="px-5 py-4 text-gray-600">{log.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}