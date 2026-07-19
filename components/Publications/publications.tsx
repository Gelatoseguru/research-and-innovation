"use client";

import { ArrowUpRight, FileText } from "lucide-react";
import { fraunces, mono, inter } from "@/components/fonts";
import { publications } from "@/components/Publications/publications-data";

export default function Publications() {
  return (
    // 1. Made full-width with a soft light mode background color (bg-[#F4F3F2])
    <section
      id="publications"
      className={`${fraunces.variable} ${mono.variable} ${inter.variable} w-full bg-[#E3E1E0] py-20`}
    >
      {/* 2. Added this content layout wrapper to keep everything perfectly centered */}
      <div className="mx-auto max-w-6xl px-6">
        
        <div className="flex items-end justify-between">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[#922842]">
              Publications
            </p>

            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight text-[#010100]">
              Recently cataloged.
            </h2>
          </div>

          <a
            href="#"
            className="hidden items-center gap-1 text-sm text-[#922842] md:flex hover:underline"
          >
            View full catalog <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {publications.map((publication) => (
            <div
              key={publication.id}
              className="relative rounded-xl border border-[#010100]/10 bg-white p-6 shadow-sm"
            >
              <span className="absolute left-6 top-6 h-2.5 w-2.5 rounded-full border border-[#010100]/15 bg-[#E3E1E0]" />

              <div className="pl-6">
                <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[#922842]">
                  {publication.id}
                </p>

                <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg leading-snug text-[#010100]">
                  {publication.title}
                </h3>

                <p className="mt-2 text-[13px] text-[#6B6B6B]">
                  {publication.program} &middot; {publication.year} &middot;{" "}
                  {publication.author}
                </p>

                <div className="mt-4 flex items-center gap-1 border-t border-dashed border-[#010100]/10 pt-4 text-sm text-[#922842] cursor-pointer hover:opacity-80 transition-opacity">
                  <FileText size={14} />
                  Request full manuscript
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
