"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import StatusBadge from "@/components/admin/StatusBadge";
import { searchStudies, deleteStudy } from "@/lib/admin/research-service";
import { addActivityLog } from "@/lib/admin/activity-service";
import { useAdminAuth } from "@/lib/admin/auth-context";
import type { PublicationStatus, Study } from "@/lib/admin/types";
import { ChevronDown } from "lucide-react";

const PROGRAMS = ["PhD in Education", "MAEd", "MAN"];
const STATUSES: PublicationStatus[] = ["draft", "published", "archived"];

export default function ResearchListPage() {
  const { admin } = useAdminAuth();
  const [studies, setStudies] = useState<Study[]>([]);
  const [query, setQuery] = useState("");
  const [program, setProgram] = useState("");
  const [status, setStatus] = useState<PublicationStatus | "">("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    queueMicrotask(() => {
      if (!isCurrent) return;
      setLoading(true);
      searchStudies(query, {
        program: program || undefined,
        status: status || undefined,
      }).then((results) => {
        if (!isCurrent) return;
        setStudies(results);
        setLoading(false);
      });
    });
    return () => {
      isCurrent = false;
    };
  }, [query, program, status]);

  async function handleDelete(s: Study) {
    if (!confirm(`Delete "${s.title}"? This can't be undone.`)) return;
    await deleteStudy(s.id);
    await addActivityLog({
      actor: admin?.name ?? "Unknown admin",
      action: "deleted",
      target: s.title,
    });
    setStudies((prev) => prev.filter((x) => x.id !== s.id));
  }

  return (
    <div className="space-y-6 pb-12">
     <div className="px-4">
       <AdminTopBar title="Research List" />
     </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-1 min-w-[220px] items-center gap-2 rounded-2xl border border-white/80 bg-white/60 px-4 py-2.5 shadow-sm backdrop-blur-2xl transition-all focus-within:border-gray-400 focus-within:bg-white/80">
          <Search size={15} className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or keyword"
            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
        <div className="relative">
          <select
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            className="appearance-none rounded-2xl border border-white/80 bg-white/60 px-4 py-2.5 pr-8 text-sm text-gray-700 shadow-sm backdrop-blur-2xl outline-none transition-all hover:bg-white/80 focus:border-gray-400"
          >
            <option value="">All programs</option>
            {PROGRAMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
    <ChevronDown size={16} />
  </div>
        </div>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PublicationStatus | "")}
            className="appearance-none rounded-2xl border border-white/80 bg-white/60 px-4 py-2.5 pr-8 text-sm text-gray-700 shadow-sm backdrop-blur-2xl outline-none transition-all hover:bg-white/80 focus:border-gray-400"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
    <ChevronDown size={16} />
  </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 shadow-xl shadow-gray-200/40 backdrop-blur-2xl">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100/80 bg-white/40 text-xs font-medium uppercase tracking-[0.2em] text-gray-500 backdrop-blur-md">
            <tr>
              <th className="px-5 py-4 text-left">Study</th>
              <th className="px-5 py-4 text-left">Program</th>
              <th className="px-5 py-4 text-left">College</th>
              <th className="px-5 py-4 text-left">Year</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="px-5 py-8 text-center text-gray-400" colSpan={6}>Loading…</td></tr>
            )}
            {!loading && studies.length === 0 && (
              <tr><td className="px-5 py-8 text-center text-gray-400" colSpan={6}>No studies match your search.</td></tr>
            )}
            {studies.map((s) => (
              <tr key={s.id} className="border-b border-[#6B6B6B] transition-colors hover:bg-white/80 last:border-0">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{s.title}</p>
                  <p className="font-[family-name:var(--font-mono)] text-xs text-gray-400">
                    {s.id} &middot; {s.authors.join(", ")}
                  </p>
                </td>
                <td className="px-5 py-4 text-gray-600 font-medium">{s.program}</td>
                <td className="px-5 py-4 text-gray-500">{s.college}</td>
                <td className="px-5 py-4 text-gray-500">{s.year}</td>
                <td className="px-5 py-4"><StatusBadge status={s.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/research/upload?id=${s.id}`}
                      className="rounded-xl border border-gray-200/80 bg-white/70 p-2 text-gray-600 shadow-sm backdrop-blur-md transition-all hover:bg-[#922842]/10 hover:text-[#922842] hover:border-[#922842]/30"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(s)}
                      className="rounded-xl border border-gray-200/80 bg-white/70 p-2 text-gray-600 shadow-sm backdrop-blur-md transition-all hover:bg-[#791B37]/10 hover:text-[#791B37] hover:border-[#791B37]/30"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}