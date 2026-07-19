"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const ARCHIVE_TABS = [
  {
    id: "01",
    title: "Keep the Record",
    text1:
      "LNU Archives was built so that finished research stops living in scattered folders and printed copies in a filing cabinet. Instead, every accepted study gets a permanent record: its abstract, its author, its program, and its year, searchable by anyone, anywhere on campus.",
    text2:
      "Full manuscripts stay protected. Admins from each program review upload submissions and manuscript requests. The university keeps a clear trail of who has requested what, and why.",
    image: "/he it.jpg",
  },
  {
    id: "02",
    title: "Sharing Research",
    text1:
      "Working through archives shouldn't feel like digging through a dark basement. We designed this interface to mimic an open gallery—clean lines, precise spacing, and accessible records that respect the intellectual property of our scholars.",
    text2:
      "Whether you are working from a desktop in the main library or browsing through your mobile layout on the campus green, the experience scales with premium fluidity.",
    image: "/he it.jpg",
  },
  {
    id: "03",
    title: "Grow, Digitize, Connect",
    text1:
      " Academic work is meant to be indexed and quoted. Digitize legacy print thesis, standardize metadata across programs, and link related works across departments.",
    text2:
      "By establishing clean pathways, LNU elevates our collective institutional footprint effortlessly.",
    image: "/he it.jpg",
  },
];

export default function About() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="about" className="pt-50 pb-40 border-t border-[#010100]/10 bg-[#E3E1E0] w-full overflow-hidden">
      
      {/* We use grid-cols-12 across the full width window.
        The layout uses padding left calculation to keep your left text perfectly aligned with 
        the rest of your website layout container margins while letting the right side bleed out.
      */}
      <div className="w-full grid lg:grid-cols-12 items-stretch min-h-[800px]">
        
        {/* LEFT COLUMN: BRAND & DESCRIPTIVE COPY (Spans 5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-start gap-9 py-20 px-6 lg:pr-12 lg:pl-[calc((100vw-80rem)/2+1.5rem)] min-w-0">
          <div>
            {/* Red Accent Brand Identifier Tag */}
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[#922842]">
              About the archive
            </p>
            
            {/* Header Content */}
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#010100] leading-tight tracking-tight max-w-md">
              To Preserve research produced by our students.
            </h2>
          </div>

          {/* Dynamic Content Switching Box */}
          <div className="mt-12 border-t border-[#6B6B6B]/10 pt-8 lg:max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-[15px] leading-relaxed text-[#6B6B6B] space-y-4 font-sans font-light"
              >
                <p className="text-[#010100] font-[family-name:var(--font-display)] text-lg mb-2 italic">
                  — {ARCHIVE_TABS[activeTab].title}
                </p>
                <p>{ARCHIVE_TABS[activeTab].text1}</p>
                <p>{ARCHIVE_TABS[activeTab].text2}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: FULL-BLEED ACCORDION CAROUSEL (Spans 7 Columns directly to the right viewport frame) */}
        <div className="lg:col-span-7 flex border-t lg:border-t-0 lg:border-l border-[#6B6B6B]/10 h-[500px] lg:h-auto bg-[#6B6B6B] overflow-hidden w-full">
          {ARCHIVE_TABS.map((tab, idx) => {
            const isActive = activeTab === idx;

            return (
              <motion.div
                key={tab.id}
                layout
                transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
                className={`relative flex border-r border-[#6B6B6B]/10 h-full overflow-hidden last:border-r-0 ${
                  isActive ? "flex-1 bg-[#F5F5F3]" : "w-[65px] bg-white cursor-pointer select-none hover:bg-neutral-50/80"
                }`}
                onClick={() => !isActive && setActiveTab(idx)}
              >
                {/* VERTICAL SLIP CONTROL STRIP */}
                <div className="w-[65px] flex flex-col items-center justify-start py-12 gap-12 h-full bg-[#E3E1E0] flex-shrink-0">
                  <span className="text-sm font-[family-name:var(--font-mono)] text-[#010100] tracking-wider">
                    {tab.id}
                  </span>
                  
                  <span
                    style={{ writingMode: "vertical-lr" }}
                    className={`text-[10px] uppercase tracking-[0.25em] whitespace-nowrap font-[family-name:var(--font-mono)] transition-colors duration-300 ${
                      isActive ? "text-[#791B37] font-bold" : "text-[#6B6B6B]"
                    }`}
                  >
                    {tab.title}
                  </span>
                </div>

                {/* EXPANDED INNER FULL IMAGE COVER CONTAINER */}
                <div className="flex-1 relative h-full w-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 w-full h-full"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.45 }}
                      >
                        <Image
                          src={tab.image}
                          alt={tab.title}
                          fill
                          priority
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                        {/* Blend mask overlay layer */}
                        <div className="absolute inset-0 bg-[#E3E1E0]/5 mix-blend-multiply pointer-events-none" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}