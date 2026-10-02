"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Filter, Eye, ChevronDown, Search } from "lucide-react";
import { backendFetch } from "@/lib/backend";

type StudyRow = {
  id: string; // MongoDB ObjectId string — never convert to Number
  title: string;
  author: string;
  program: string;
  year: string;
  views: string;
  citations: string;
};

type StudyApi = {
  id: string;
  title: string;
  authors: string[];
  program: string;
  year: string;
  views?: number;
};

const ALL_PROGRAMS = "All Programs";

export default function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState(ALL_PROGRAMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [researchData, setResearchData] = useState<StudyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    backendFetch("studies", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? "Unable to load studies.");
        return body;
      })
      .then((body) => {
        if (cancelled) return;
        const studies: StudyApi[] = Array.isArray(body.studies) ? body.studies : [];
        setResearchData(
          studies.map((study) => ({
            id: study.id,
            title: study.title,
            author: (study.authors ?? []).join(", "),
            program: study.program,
            year: study.year,
            views: `${study.views ?? 0} views`,
            citations: "0 citations",
          })),
        );
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load studies.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Program filter options come from the studies in the database.
  const availablePrograms = useMemo(() => {
    const programs = new Set(researchData.map((item) => item.program).filter(Boolean));
    return [ALL_PROGRAMS, ...Array.from(programs).sort()];
  }, [researchData]);

  const filteredResearch = researchData.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesProgram = selectedProgram === ALL_PROGRAMS || item.program === selectedProgram;
    const matchesSearch = item.title.toLowerCase().includes(q) || item.author.toLowerCase().includes(q);
    return matchesProgram && matchesSearch;
  });

  return (
    <div className="relative min-h-screen w-full font-sans text-zinc-900 selection:bg-[#922842] selection:text-white">
      {/* Background Image with Light Overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/photo.jpg"
          alt="Background"
          fill
          priority
          className="object-cover object-center opacity-30 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-zinc-100/70 to-[#922842]/10" />
      </div>

      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-28 sm:pt-36 pb-16">
        {/* Top Page Title Section */}
        <div className="mb-12 border-b border-zinc-400/50 pb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <h1 className="text-5xl sm:text-7xl font-light tracking-tight font-[family-name:var(--font-fraunces)] text-zinc-900">
            Research <span className="text-[#922842] font-normal">Lists</span>
          </h1>
          <p className="text-sm uppercase tracking-widest text-zinc-600 font-[family-name:var(--font-mono)]">
            &bull; Index &bull;
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-zinc-200/80 bg-white/65 backdrop-blur-2xl shadow-2xl shadow-zinc-300/50">
          {/* Top Filter & Search Bar */}
          <div className="p-6 sm:p-10 border-b border-zinc-200/80 bg-white/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 flex-1">
              {/* Search Input */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 bg-white/90 border border-zinc-300/80 rounded-2xl text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-[#922842] transition-colors shadow-[#922842] shadow-sm"
                />
              </div>

              {/* Program Dropdown Filter */}
              <div className="relative sm:w-72">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Filter size={16} />
                </span>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full appearance-none bg-white/90 border border-zinc-300/80 rounded-2xl pl-10 pr-10 py-3.5 text-sm text-zinc-900 focus:outline-none focus:border-[#922842] transition-colors cursor-pointer font-[family-name:var(--font-mono)] shadow-sm"
                >
                  {availablePrograms.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-400">
                  <ChevronDown size={16} />
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-6 sm:p-10 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-300/80 text-xs font-[family-name:var(--font-mono)] text-zinc-500 uppercase tracking-wider">
                  <th className="py-4 px-4 font-semibold">Title</th>
                  <th className="py-4 px-4 font-semibold">Program</th>
                  <th className="py-4 px-4 font-semibold">Year</th>
                  <th className="py-4 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-zinc-200/80 text-sm font-[family-name:var(--font-mono)]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-zinc-500 font-sans text-base">
                      Loading research documents…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-[#791B37] font-sans text-base">
                      {error}
                    </td>
                  </tr>
                ) : filteredResearch.length > 0 ? (
                  filteredResearch.map((item) => (
                    <tr key={item.id} className="hover:bg-white/60 transition-colors group">
                      <td className="py-5 px-4">
                        <div className="font-medium text-zinc-900 font-sans text-lg mb-1.5 group-hover:text-[#922842] transition-colors">
                          {item.title}
                        </div>
                        <div className="flex items-center gap-3.5 text-zinc-500 text-xs">
                          <span>
                            By <strong className="text-zinc-700 font-medium">{item.author}</strong>
                          </span>
                          <span>&bull;</span>
                          <span className="text-zinc-600">{item.views}</span>
                          <span>&bull;</span>
                          <span className="text-zinc-600">{item.citations}</span>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-zinc-700 align-middle">
                        <span className="inline-block px-3 py-1.5 rounded-lg bg-zinc-100/90 border border-zinc-200 text-xs text-zinc-800 font-medium">
                          {item.program}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-zinc-600 align-middle text-sm">{item.year}</td>
                      <td className="py-5 px-4 text-right align-middle">
                        <Link
                          href={`/view?id=${encodeURIComponent(item.id)}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#922842]/10 hover:bg-[#922842] text-[#922842] hover:text-white transition-all text-sm font-medium shadow-sm"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-zinc-500 font-sans text-base">
                      No research documents found matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}