"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";
import { fraunces, mono, inter } from "@/components/fonts";
import { publications } from "@/components/Publications/publications-data";
import { backendFetch } from "@/lib/backend";

type PublicationCard = (typeof publications)[number];

export default function Publications() {
  const [recentPublications, setRecentPublications] = useState<PublicationCard[]>(publications);

  useEffect(() => {
    backendFetch("studies?recent=1", { cache: "no-store" })
      .then((response) => response.json())
      .then((body) => {
        if (!Array.isArray(body.studies)) return;
        setRecentPublications(body.studies.map((study: {
          id: string;
          title: string;
          program: string;
          year: string;
          authors: string[];
        }) => ({
          id: study.id,
          title: study.title,
          program: study.program,
          year: study.year,
          author: study.authors.join(", "),
        })));
      })
      .catch(() => undefined);
  }, []);

  return (
    <section
      id="publications"
      className={`${fraunces.variable} ${mono.variable} ${inter.variable} w-full bg-[#E3E1E0] py-20`}
    >
      {/* 
        CONTAINER: 
        Maintains the exact horizontal layout alignment of your About section grid frame.
      */}
      <div className="pb-20 max-w-[90vw] xl:max-w-[85vw] mx-auto px-4 w-full">
        
        <div className="flex items-end justify-between">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xL uppercase tracking-[0.2em] text-[#922842]">
              Publications
            </p>

            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight text-[#010100]">
              Recently cataloged.
            </h2>
          </div>

          <a
            href="/Publications"
            className="hidden items-center gap-1 text-sm text-[#922842] md:flex hover:underline"
          >
            View full catalog <ArrowUpRight size={15} />
          </a>
        </div>

        {/* 
          UPDATED GRID CONFIGURATION:
          Changes from md:grid-cols-2 to lg:grid-cols-3. 
          Perfect layout configuration for displaying 6 distinct research item boxes evenly.
        */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPublications.slice(0, 6).map((publication) => (
            <div
              key={publication.id}
              className="relative rounded-xl border border-[#010100]/10 bg-white p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="absolute left-6 top-6 h-2.5 w-2.5 rounded-full border border-[#010100]/15 bg-[#E3E1E0]" />

                <div className="pl-6">
                  <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[#922842]">
                    {publication.id}
                  </p>

                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-base lg:text-lg font-normal leading-snug text-[#010100] line-clamp-2">
                    {publication.title}
                  </h3>

                  <p className="mt-2 text-[13px] text-[#6B6B6B] line-clamp-2">
                    {publication.program} &middot; {publication.year} &middot;{" "}
                    {publication.author}
                  </p>
                </div>
              </div>

              <div className="pl-6">
                <Link href={`/view?id=${publication.id}`} className="mt-4 flex items-center gap-1 border-t border-dashed border-[#010100]/10 pt-4 text-sm text-[#922842] cursor-pointer hover:opacity-80 transition-opacity">
                  <FileText size={14} />
                  View Abstract
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
