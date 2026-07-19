import Image from "next/image";
import { Mail, Phone, MapPin, Globe,  } from "lucide-react";
import { fraunces, mono, inter } from "@/components/fonts";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-[#010100]/10 bg-[#F4F3F2] text-[#010100]">
      
      {/* Subtle light background gradient ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -left-24 -top-24 h-72 w-72 animate-[blob_11s_ease-in-out_infinite] rounded-full bg-[#922842] blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-80 w-80 animate-[blob_14s_ease-in-out_infinite_1s] rounded-full bg-[#791B37] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-12">
        
        {/* UPPER GRID PANEL: 4-COLUMN SYMMETRICAL COLUMNS */}
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 md:grid-cols-4">
          
          {/* COLUMN 1: BRIEF OVERVIEW ARCHIVE DETAILED PROFILE */}
          <div className="flex flex-col">
            
            <div className="mt-5 flex items-center gap-3">
              <Image
                src="/BLCK.png"
                alt="Lyceum-Northwestern University seal"
                width={400}
                height={400}
                className="h-40 w-50 object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* COLUMN 2: ABOUT */}
          <div className="flex flex-col">
            <p className="font-[family-name:var(--font-mono)] text-xs font-semibold uppercase tracking-[0.2em] text-[#010100] pb-3 border-b border-[#010100]/10">
              About
            </p>
            <ul className="font-[family-name:var(--font-fraunces)] mt-5 space-y-3 text-XS text-[#57564F]">
              <li><a href="#publications" className="hover:text-[#922842] transition-colors duration-200">Publications</a></li>
              <li><a href="#authors" className="hover:text-[#922842] transition-colors duration-200">Authors</a></li>
              <li><a href="#programs" className="hover:text-[#922842] transition-colors duration-200">Programs</a></li>
            </ul>
          </div>

          {/* COLUMN 3: EDUCATION */}
          <div className="flex flex-col">
            <p className="font-[family-name:var(--font-mono)] text-xs font-semibold uppercase tracking-[0.2em] text-[#010100] pb-3 border-b border-[#010100]/10">
              Education
            </p>
            <ul className="font-[family-name:var(--font-fraunces)] mt-5 space-y-3 text-XS text-[#57564F]">
              <li><a href="#about" className="hover:text-[#922842] transition-colors duration-200">About</a></li>
              <li><a href="#services" className="hover:text-[#922842] transition-colors duration-200">Services</a></li>
              <li><a href="#goals" className="hover:text-[#922842] transition-colors duration-200">Goals</a></li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT LINKS */}
          <div className="flex flex-col">
            <p className="font-[family-name:var(--font-mono)] text-xs font-semibold uppercase tracking-[0.2em] text-[#010100] pb-3 border-b border-[#010100]/10">
              Contact
            </p>
            <ul className="font-[family-name:var(--font-fraunces)] mt-5 space-y-3 text-XS text-[#57564F]">
              <li className="flex items-center gap-2.5"><Mail size={14} className="text-[#922842] flex-shrink-0" /> RIMO@lnu.edu.ph</li>
              <li className="flex items-center gap-2.5"><Phone size={14} className="text-[#922842] flex-shrink-0" /> (075) 522-0000</li>
              <li className="flex items-center gap-2.5"><MapPin size={14} className="text-[#922842] flex-shrink-0" /> Dagupan City</li>
            </ul>
          </div>
        </div>

        {/* LOWER SECTION: MASSIVE TYPOGRAPHIC IDENTITY SYSTEM (Exact Match to Your Screenshot Structure) */}
        <div className="mt-28 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          
          {/* Main big display label */}
          <div className="flex flex-col">
            <h2 className="font-[family-name:var(--font-fraunces)] text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#791B37]/90 leading-none">
              LNU <span className="text-[#8A8988]">ARCHIVES</span>
            </h2>
            <div className="flex items-center gap-3 mt-4">
              <span className="h-px w-10 bg-[#010100]/30" />
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-[#8A8988]">
                Searchable record of graduate research.
              </p>
            </div>
          </div>

          {/* Right Align Metadata info matching image 2 grid row */}
          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="font-[family-name:var(--font-fraunces)] text-xs italic text-[#57564F]">
              &copy; {new Date().getFullYear()} All rights reserved
            </p>
            
            {/* Round Solid Social Badges */}
            <div className="flex items-center gap-2">
              <a href="https://lyceum.edu.ph/research/" target="_blank" className="h-8 w-8 rounded-full bg-[#010100]/5 hover:bg-[#922842] flex items-center justify-center text-[#57564F] hover:text-white transition-all duration-200">
                <Globe size={13} />
              </a>

            </div>
          </div>
          
        </div>

        {/* BOTTOM LEGAL DISCLAIMER SUBTEXT */}
        <div className="font-[family-name:var(--font-mono)] mt-12 border-t border-[#010100]/5 pt-6 text-[9px] tracking-widest uppercase text-[#8A8988] text-center md:text-left">
          Reasearch and Innovation Management Office of LNU, Dagupan City.
        </div>

      </div>
    </footer>
  );
}