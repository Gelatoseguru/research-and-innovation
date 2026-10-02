"use client";

import Image from "next/image";

const programsData = [
  {
    id: "man",
    code: "MAN",
    title: "Master of Arts in Nursing",
    description: "The BSN improves patient safety, advancing evidence-based clinical practices, shaping healthcare policy, and enhancing health system efficiency.",
    logoSrc: "/nursing_logo-2.png",
  },
  {
    id: "maed",
    code: "MAEd",
    title: "Master of Arts in Education",
    description: "A discipline in the study of business management, organizational behavior and market operation.",
    logoSrc: "/CBE-LOGO.png",
  },
  {
    id: "phd",
    code: "PhD",
    title: "Doctor of Philosophy",
    description: "Ph.D. programs drive research forward by producing original knowledge, filling gaps in existing academic fields, and testing new ideas or methods.",
    logoSrc: "/medicine_logo.png",
  },
];

export default function ArchivingLandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#E3E1E0] text-[#010100] font-fraunces  text-zinc-900 selection:bg-[#922842] selection:text-white pt-24 px-6 pb-24 relative overflow-hidden">

      {/* Background Image & Readable Overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/photo.jpg"
          alt="Background"
          fill
          priority
          className="object-cover object-center opacity-25 blur-[2px]"
        />
        {/* More opaque solid-to-light gradient background to ensure high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-zinc-100/70 to-[#922842]/10" />
      </div>
      
               <main className="relative z-10 max-w-7xl mx-auto pt-12 px-6">
  {/* Header & Line */}
  <div className="mb-12 border-b border-zinc-400/60 pb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
    <h1 className="text-5xl sm:text-7xl font-light tracking-tight font-[family-name:var(--font-fraunces)] text-[#010100]">
      Our <span className="text-[#922842] font-normal">Programs</span>
    </h1>
    <p className="text-xs font-mono text-zinc-700 uppercase tracking-wider mt-1 font-medium">
      &bull; Institutional Archive &bull; 
    </p>
  </div>

  {/* Rest of your content... */}


        {/* Directory Layout: Large Centered Logos & Program Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          {programsData.map((prog) => (
            <div 
              key={prog.id}
              className="group flex flex-col items-center text-center cursor-pointer p-4 transition-all duration-300"
            >
              {/* Large Independent Logo */}
              <div className="relative w-36 h-36 md:w-40 md:h-40 mb-6 transition-transform duration-300 group-hover:scale-105">
                <Image 
                  src={prog.logoSrc}
                  alt={`${prog.title} Logo`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Program Name */}
              <h3 className="font-bold text-lg md:text-xl text-[#010100] font-[family-name:var(--font-fraunces)] mb-2 group-hover:text-[#791B37] transition-colors">
                {prog.title}
              </h3>

              {/* Smooth Hover-Reveal Description with higher contrast text */}
              <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden w-full">
                <p className="text-xs md:text-sm text-zinc-800 font-medium leading-relaxed pt-2 px-2">
                  {prog.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}