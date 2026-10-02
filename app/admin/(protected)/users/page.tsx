"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { getUsers } from "@/lib/admin/users-service";
import type { AppUser } from "@/lib/admin/types";

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then((u) => {
      setUsers(u);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="px-5">
        <AdminTopBar title="Registered Users" />
      </div>

      {loading && (
        <div className="flex h-48 items-center justify-center">
          <p className="text-sm font-medium text-gray-400">Loading users…</p>
        </div>
      )}

      <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 shadow-xl shadow-gray-200/40 backdrop-blur-2xl">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100/80 bg-white/40 text-xs font-medium uppercase tracking-[0.2em] text-[#6B6B6B] backdrop-blur-md">
            <tr>
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">Role</th>
              <th className="px-5 py-4 text-left">Requests made</th>
              <th className="px-5 py-4 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {!loading && users.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-gray-400" colSpan={5}>
                  No registered users found.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-[#6B6B6B] transition-colors hover:bg-white/80 last:border-0"
              >
                <td className="px-5 py-4 font-medium text-gray-900">{u.name}</td>
                <td className="px-5 py-4 text-gray-500">{u.email}</td>
                <td className="px-5 py-4 capitalize text-gray-600 font-medium">{u.role}</td>
                <td className="px-5 py-4 text-gray-500">{u.requestsCount}</td>
                <td className="px-5 py-4 text-gray-500">
                  {new Date(u.joinedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}