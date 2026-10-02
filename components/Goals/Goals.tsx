"use client";

import { useState } from "react";
import { goals } from "./goals-data";
import { fraunces, mono } from "@/components/fonts";

export default function Goals() {
  const [activeTab, setActiveTab] = useState("MISSION");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTabClick = (tab: string) => {
    if (tab === activeTab || isAnimating) return;
    
    // Trigger the blur out/scale down animation
    setIsAnimating(true);
    
    // Wait for the transition to finish, swap the content, then animate back in
    setTimeout(() => {
      setActiveTab(tab);
      setIsAnimating(false);
    }, 400); 
  };

  return (
    <section 
      id="goals" 
      className=" relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-[#E3E1E0] py-24 transition-colors duration-300"
    >
      {/* Navigation Tabs */}
      <div className="absolute top-12 z-30 flex space-x-8">
        {["MISSION", "VISION", "GOALS"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`${mono.className} text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#791B37] ${
              activeTab === tab 
                ? "text-[#791B37] font-bold border-b-2 border-[#791B37] pb-1" 
                : "text-neutral-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Massive Background Text (Acts as a watermark) */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-full -translate-x-1/2 -translate-y-1/2 text-center select-none">
        <h1 
          className={`${fraunces.className} text-[15vw] md:text-[12vw] font-black text-[#791B37]/10 tracking-tighter transition-all duration-700`}
        >
          {activeTab === "GOALS" ? "OUR GOALS" : `OUR ${activeTab}`}
        </h1>
      </div>

      {/* Foreground Content Container with Smooth Blur/Pop Transition */}
      <div 
        className={`relative z-10 w-full max-w-4xl px-6 transition-all duration-400 ease-in-out flex flex-col items-center justify-center
          ${isAnimating ? "opacity-0 blur-md scale-95" : "opacity-100 blur-0 scale-100"}
        `}
      >
        {activeTab === "MISSION" && (
          <div className="text-center">
            <p className="text-xl md:text-3xl leading-relaxed text-[#010100] font-light max-w-3xl mx-auto">
              <span className="text-[#922842] font-bold mr-2">"</span>
              Managament of research in the university toward the generation of new ideas, innovations and technology relevant not only to local and regional
              development, but also of national and global significance.
              <span className="text-[#922842] font-bold ml-2">"</span>
            </p>
          </div>
        )}

        {activeTab === "VISION" && (
          <div className="text-center">
            <p className="text-xl md:text-3xl leading-relaxed text-[#010100] font-light max-w-3xl mx-auto">
              <span className="text-[#922842] font-bold mr-2">"</span>
              A model of excellence in research management in the Region.
              <span className="text-[#922842] font-bold ml-2">"</span>
            </p>
          </div>
        )}

    {activeTab === "GOALS" && (
  <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto w-full mt-10">
    {goals.map((g) => (
      <div
        key={g.title}
        className="rounded-xl border border-[#6B6B6B]/20 bg-white/10 backdrop-blur-md p-8 shadow-sm transition hover:shadow-md"
      >
        <h3 className={`${fraunces.className} text-xl text-[#791B37]`}>
          {g.title}
        </h3>
        <p className="mt-4 text-[15px] leading-relaxed text-[#010100]/80">
          {g.body}
        </p>
      </div>
    ))} 
  </div>
        )}
      </div>
    </section>
  );
}