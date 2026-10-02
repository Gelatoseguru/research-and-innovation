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
    image: "/One.jpg",
  },
  {
    id: "02",
    title: "Sharing Research",
    text1:
      "Working through archives shouldn't feel like digging through a dark basement. We designed this interface to mimic an open gallery—clean lines, precise spacing, and accessible records that respect the intellectual property of our scholars.",
    text2:
      "Whether you are working from a desktop in the main library or browsing through your mobile layout on the campus green, the experience scales with premium fluidity.",
    image: "/Two.jpeg",
  },
  {
    id: "03",
    title: "Grow, Digitize, Connect",
    text1:
      " Academic work is meant to be indexed and quoted. Digitize legacy print thesis, standardize metadata across programs, and link related works across departments.",
    text2:
      "By establishing clean pathways, LNU elevates our collective institutional footprint effortlessly.",
    image: "/Grow.jpg",
  },
];

export default function About() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="about" className="relative z-20 -mt-20 rounded-t-[40px] pt-32 pb-32 border-t border-[#010100]/10 bg-[#E3E1E0] w-full overflow-hidden">
      
      <motion.div
        initial={{ y: 120 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* 
          LAYOUT ENGINE: 
          - Increased total max-width to allow the content to populate the side regions beautifully.
          - Utilized a custom 12-column split layout with a structural 1-column gap in the middle.
        */}
        <div className="max-w-[90vw] xl:max-w-[85vw] mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-12 items-stretch gap-12 lg:gap-0 min-h-[650px]">
          
          {/* LEFT COLUMN (Spans 4 Columns out of 12) */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-6 py-8 min-w-0 text-left">
            <div>
              {/* Red Accent Brand Identifier Tag */}
              <p className="font-[family-name:var(--font-mono)] text-xL uppercase tracking-[0.2em] text-[#922842]">
                About the archive
              </p>
              
              {/* Header Content */}
              <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl text-[#010100] leading-tight tracking-tight w-full">
                To Preserve research produced by our students.
              </h2>
            </div>

            {/* Dynamic Content Switching Box */}
            <div className="mt-6 border-t border-[#6B6B6B]/10 pt-8 w-full">
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

          {/* GAP ADJUSTER: 1-Column Empty Separation Layer (Spans Column 5) */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* RIGHT COLUMN: SQUARED CONTAINER ACCORDION CAROUSEL (Spans remaining 7 Columns) */}
          <div className="lg:col-span-7 flex h-[500px] lg:h-auto bg-[#C8C8C8] overflow-hidden w-full rounded-1xl border border-neutral-400/30 shadow-sm">
            {ARCHIVE_TABS.map((tab, idx) => {
              const isActive = activeTab === idx;

              return (
                <motion.div
                  key={tab.id}
                  layout
                  transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
                  className={`relative flex h-full overflow-hidden last:border-r-0 border-r border-neutral-400/20 ${
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
                            sizes="(max-width: 1024px) 100vw, 40vw"
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
      </motion.div>
    </section>
  );
}