"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileStack, CheckCircle2, Inbox, Users, Upload, ArrowUpRight, TrendingUp } from "lucide-react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { getStudies } from "@/lib/admin/research-service";
import { getRequests } from "@/lib/admin/requests-service";
import { getUsers } from "@/lib/admin/users-service";
import type { Study, AccessRequest, AppUser } from "@/lib/admin/types";

export default function AdminDashboardPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStudies(), getRequests(), getUsers()]).then(
      ([s, r, u]) => {
        setStudies(s);
        setRequests(r);
        setUsers(u);
        setLoading(false);
      }
    );
  }, []);

  const publishedCount = studies.filter((s) => s.status === "published").length;
  const pendingRequestCount = requests.filter((r) => r.status === "pending").length;
  const recentUploads = [...studies]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-sm font-medium text-gray-400">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="font-fraunces text-[#6B6B6B] space-y-6 pb-12">
      <div className="px-6">
        <AdminTopBar title="" />
      </div>
      {/* Hero Spotlight Panel — Light Glassmorphism Card matching the reference structure */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-white/80 via-white/40 to-gray-100/50 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-2xl">
        {/* Background decorative subtle glow elements */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gray-200/40 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 h-64 w-64 rounded-full bg-zinc-200/35 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5  /60 px-3 py-1 text-[15px] font-medium uppercase tracking-[0.2em] text-[#922842] ">
              <TrendingUp size={12} /> Research Management &amp; Innovation Office
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/research/upload"
              className="flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-xs font-medium text-white shadow-md shadow-gray-900/10 transition-all hover:bg-gray-800 hover:shadow-lg"
            >
              <Upload size={14} /> Upload study
            </Link>
          
          </div>
        </div>

        {/* Floating Translucent Stat Strip — mirroring the multi-stat overlay pill in the reference image */}
        <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:bg-white/60">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[#6B6B6B]">Total studies</p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-2xl font-bold text-gray-900">{studies.length}</p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:bg-white/60">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[#6B6B6B]">Published studies</p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-2xl font-bold text-gray-900">{publishedCount}</p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:bg-white/60">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[#6B6B6B]">Access requests</p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-2xl font-bold text-gray-900">{requests.length}</p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:bg-white/60">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[#6B6B6B]">Registered users</p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Recent Uploads Table Card */}
        <div>
          <div className="mb-3 flex items-center justify-between px-2">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[#922842]">
              Recent uploads
            </p>
            <Link
              href="/admin/research"
              className="flex items-center gap-1 text-xs font-medium text-gray-700 transition-colors hover:text-gray-900 hover:underline"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 shadow-xl shadow-gray-200/40 backdrop-blur-2xl">
            <table className="w-full text-sm">
              <tbody>
                {recentUploads.map((s) => (
                  <tr key={s.id} className="border-b border-[#6B6B6B] transition-colors hover:bg-white/80 last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{s.title}</p>
                      <p className="font-[family-name:var(--font-mono)] text-xs text-gray-400">
                        {s.id}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-medium">{s.program}</td>
                    <td className="px-5 py-4 text-gray-500">{s.year}</td>
                    <td className="px-5 py-4 text-right">
                      <StatusBadge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Secondary Awaiting Review Card */}
        <div>
          <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[#922842] px-2">
            Awaiting review
          </p>
          <div className="rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-xl shadow-gray-200/40 backdrop-blur-2xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-800 mb-4 border border-gray-200/60 shadow-sm">
              <Inbox size={22} />
            </div>
            <p className="font-[family-name:var(--font-mono)] text-4xl font-bold text-gray-900 tracking-tight">
              {pendingRequestCount}
            </p>
            <p className="mt-1 text-sm text-gray-600 font-medium">
              pending manuscript {pendingRequestCount === 1 ? "request" : "requests"} requiring action
            </p>
            <Link
              href="/admin/requests"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white/80 px-4 py-2 text-xs font-medium text-gray-800 shadow-sm backdrop-blur-md transition-all hover:bg-gray-900 hover:text-white hover:border-gray-900"
            >
              Review now <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}