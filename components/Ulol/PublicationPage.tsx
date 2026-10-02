"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Filter, Eye, ChevronDown, Search } from "lucide-react";

// Mock research data
const researchData = [
  {
    id: 1,
    title: "Digital Archives and Institutional Memory Preservation",
    author: "Victor Magtanggol",
    program: "Information Technology",
    year: "2026",
  },
  {
    id: 2,
    title: "Pedagogical Strategies in Post-Pandemic Higher Education",
    author: "Lilith Dalisay",
    program: "MAN",
    year: "2025",
  },
  {
    id: 3,
    title: "Language Evolution and Regional Dialects in Leyte",
    author: "Lara Plato",
    program: "MAEd",
    year: "2026",
  },
  {
    id: 4,
    title: "Automated Thesis Repository and Retrieval System",
    author: "Josh Baterbonians",
    program: "MAN",
    year: "2025",
  },
  {
    id: 5,
    title: "Community Engagement Frameworks for Local Governance",
    author: "Elena Gomez",
    program: "PhD",
    year: "2025",
  },
];

const programsList = [
  "All Programs",
  "Information Technology",
  "MAN",
  "MAEd",
  "PhD",
];

export default function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState("All Programs");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResearch = researchData.filter((item) => {
    const matchesProgram =
      selectedProgram === "All Programs" || item.program === selectedProgram;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
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

      {/* Main Content Aligned to Navbar Width Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-28 sm:pt-36 pb-16">
        
        {/* Top Page Title Section */}
        <div className="mb-12 border-b border-zinc-400/50 pb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <h1 className="text-5xl sm:text-7xl font-light tracking-tight font-[family-name:var(--font-fraunces)] text-zinc-900">
            Research <span className="text-[#922842] font-normal">Lists</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-zinc-600 font-[family-name:var(--font-mono)]">
            &bull; Index &bull; 
          </p>
        </div>

        {/* Glassmorphism Wrapper for the Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-zinc-200/80 bg-white/60 backdrop-blur-2xl shadow-2xl shadow-zinc-300/50">
          
          {/* Left Sidebar Space */}
          <div className="lg:col-span-4 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#6B6B6B] border-dashed flex flex-col justify-between bg-[#E3E1E0]">
            <div>
              {/* Sidebar Header Indicator */}
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-zinc-500 font-[family-name:var(--font-mono)] pb-4 border-b border-zinc-200/80 mb-6">
                <span>Filters</span>
                <span>Options</span>
              </div>

              <div className="space-y-6">
                {/* Search Filter */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2 font-[family-name:var(--font-mono)]">
                    Search Research
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Title or author..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-zinc-300/80 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-[#922842] transition-colors"
                    />
                  </div>
                </div>

                {/* Program Dropdown Filter */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2 font-[family-name:var(--font-mono)]">
                    Filter by Program
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="w-full appearance-none bg-white/70 border border-zinc-300/80 rounded-lg px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#922842] transition-colors pr-8 cursor-pointer font-[family-name:var(--font-mono)]"
                    >
                      {programsList.map((prog) => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400">
                      <ChevronDown size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-[11px] text-zinc-500 font-[family-name:var(--font-mono)]">
              Showing {filteredResearch.length} results
            </div>
          </div>

          {/* Right Main Content (Research List Table) */}
          <div className="lg:col-span-8 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-light tracking-tight text-zinc-900 font-[family-name:var(--font-fraunces)]">
                Research List
              </h2>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-300/80 text-[11px] font-[family-name:var(--font-mono)] text-zinc-500 uppercase tracking-wider">
                    <th className="py-3 px-2 font-medium">Title</th>
                    <th className="py-3 px-2 font-medium">Author</th>
                    <th className="py-3 px-2 font-medium">Program</th>
                    <th className="py-3 px-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-zinc-200/80 text-xs font-[family-name:var(--font-mono)]">
                  {filteredResearch.length > 0 ? (
                    filteredResearch.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-4 px-2 text-zinc-900 font-medium font-sans">
                          {item.title}
                        </td>
                        <td className="py-4 px-2 text-zinc-700">
                          {item.author}
                        </td>
                        <td className="py-4 px-2 text-zinc-700">
                          <span className="inline-block px-2 py-0.5 rounded bg-zinc-100/80 border border-zinc-200 text-[10px] text-zinc-800">
                            {item.program}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <Link
                            href="/view"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#922842]/10 hover:bg-[#922842] text-[#922842] hover:text-white transition-all text-xs font-medium"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-zinc-500 font-sans">
                        No research documents found matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}