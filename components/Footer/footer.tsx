import Image from "next/image";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { fraunces, mono, inter } from "@/components/fonts";

export default function Footer() {
  return (
    /* 
      THE PARALLAX REVEAL ENGINE:
      - Uses `clip-path` to establish a clean bounding-box viewport layer mask.
      - Height matches the true structural footprint layout depth.
    */
    <footer 
      className={`${fraunces.variable} ${mono.variable} ${inter.variable} relative h-[950px] sm:h-[700px] md:h-[650px] w-full`}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      {/* 
        STICKY CONTAINER TRACK:
        - Keeps the footer locked at the base layout coordinate layer.
      */}
      <div className="fixed bottom-0 left-0 h-[600px] sm:h-[500px] md:h-[650px] w-full overflow-hidden border-t border-[#010100]/10 bg-[#F4F3F2] text-[#010100]">
        
        {/* Subtle light background gradient ambient glow */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -left-24 -top-24 h-72 w-72 animate-[blob_11s_ease-in-out_infinite] rounded-full bg-[#922842] blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-80 w-80 animate-[blob_14s_ease-in-out_infinite_1s] rounded-full bg-[#922842] blur-3xl" />
        </div>

        {/* Updated layout wrapper to match wide screen limits seamlessly */}
        <div className="relative mx-auto max-w-[85vw] xl:max-w-[85vw] px-4 pt-20 pb-12 w-full h-full flex flex-col justify-between">
          
          {/* UPPER GRID PANEL: LOGO LEFT, CONTENT COLS PUSHED RIGHT */}
          <div className="grid gap-10 grid-cols-1 md:grid-cols-12 items-start w-full">
            
            {/* LEFT FRAME: LOGO (Spans 3 cols out of 12) */}
            <div className="md:col-span-3 flex flex-col justify-start items-start md:pl-25">
              <div className="flex items-center gap-3">
                <Image
                  src="/SHOE.png"
                  alt="Lyceum-Northwestern University seal"
                  width={400}
                  height={400}
                  className="h-40 w-auto object-contain mix-blend-multiply"
                />
              </div>
            </div>

            {/* RIGHT FRAME: NAVIGATION LINKS GRID (Spans remaining 9 cols out of 12) */}
            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left w-full md:justify-items-end">
              
              {/* COLUMN 1: ABOUT */}
              <div className="flex flex-col w-full sm:max-w-[200px]">
                <p className="font-[family-name:var(--font-mono)] text-xs font-semibold uppercase tracking-[0.2em] text-[#010100] pb-3 border-b border-[#010100]/10">
                  About
                </p>
                <ul className="font-[family-name:var(--font-fraunces)] mt-5 space-y-3 text-sm text-[#57564F]">
                  <li><a href="#publications" className="hover:text-[#922842] transition-colors duration-200">Publications</a></li>
                  <li><a href="#authors" className="hover:text-[#922842] transition-colors duration-200">Authors</a></li>
                  <li><a href="#programs" className="hover:text-[#922842] transition-colors duration-200">Programs</a></li>
                </ul>
              </div>

              {/* COLUMN 2: EDUCATION */}
              <div className="flex flex-col w-full sm:max-w-[200px]">
                <p className="font-[family-name:var(--font-mono)] text-xs font-semibold uppercase tracking-[0.2em] text-[#010100] pb-3 border-b border-[#010100]/10">
                  Education
                </p>
                <ul className="font-[family-name:var(--font-fraunces)] mt-5 space-y-3 text-sm text-[#57564F]">
                  <li><a href="#about" className="hover:text-[#922842] transition-colors duration-200">About</a></li>
                  <li><a href="#services" className="hover:text-[#922842] transition-colors duration-200">Services</a></li>
                  <li><a href="#goals" className="hover:text-[#922842] transition-colors duration-200">Goals</a></li>
                </ul>
              </div>

              {/* COLUMN 3: CONTACT LINKS */}
              <div className="flex flex-col w-full sm:max-w-[240px]">
                <p className="font-[family-name:var(--font-mono)] text-xs font-semibold uppercase tracking-[0.2em] text-[#010100] pb-3 border-b border-[#010100]/10">
                  Contact
                </p>
                <ul className="font-[family-name:var(--font-fraunces)] mt-5 space-y-3 text-sm text-[#57564F]">
                  <li className="flex items-center gap-2.5"><Mail size={14} className="text-[#922842] flex-shrink-0" /> RIMO@lnu.edu.ph</li>
                  <li className="flex items-center gap-2.5"><Phone size={14} className="text-[#922842] flex-shrink-0" /> (075) 522-0000</li>
                  <li className="flex items-center gap-2.5"><MapPin size={14} className="text-[#922842] flex-shrink-0" /> Dagupan City</li>
                </ul>
              </div>

            </div>
          </div>

          {/* LOWER SECTION: TYPOGRAPHIC IDENTITY (LNU ARCHIVES Left, Metadata Right) */}
          <div className="mt-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end w-full">
            
            {/* Left Align Big Banner */}
            <div className="flex flex-col">
              <h2 className="font-[family-name:var(--font-fraunces)] text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#791B37]/90 leading-none">
                LNU <span className="text-[#8A8988]">ARCHIVES</span>
              </h2>
              <div className="flex items-center gap-3 mt-4">
                {/* Made structural layout line longer */}
                <span className="h-px w-24 bg-[#010100]/30" />
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-[#8A8988]">
                  Searchable record of graduate research.
                </p>
              </div>
            </div>

            {/* Right Align Metadata */}
            <div className="flex flex-col items-start gap-4 md:items-end balance-metadata">
              <p className="font-[family-name:var(--font-fraunces)] text-xs italic text-[#57564F]">
                &copy; {new Date().getFullYear()} All rights reserved
              </p>
              
              {/* Round Solid Social Badges */}
              <div className="flex items-center gap-2">
                <a href="https://lyceum.edu.ph/research/" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-[#010100]/5 hover:bg-[#922842] flex items-center justify-center text-[#57564F] hover:text-white transition-all duration-200">
                  <Globe size={13} />
                </a>
              </div>
            </div>
            
          </div>

          {/* BOTTOM SUBTEXT: Fully left-aligned to clear any empty space bugs */}
          <div className="font-[family-name:var(--font-mono)] mt-5 border-t border-[#010100]/8 pt-6 text-[9px] tracking-widest uppercase text-[#8A8988] text-left w-full ">
            Research and Innovation Management Office of LNU.
          </div>

        </div>
      </div>
    </footer>
  );
}