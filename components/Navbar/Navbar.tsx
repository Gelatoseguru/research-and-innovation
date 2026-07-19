"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Menu } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { fraunces, mono, inter } from "@/components/fonts";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  // Hook into Framer Motion's global scroll values
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // Hide navbar if scrolling down AND past the top threshold (over 80px down)
    if (latest > previous && latest > 80) {
      setIsHidden(true);
      setIsSearchOpen(false); // Clean up search bar state when scrolling away
      setIsMenuOpen(false);   // Close mobile menu when scrolling away
    } else {
      // Instantly bring it back when scrolling up
      setIsHidden(false);
    }
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    console.log("Searching for:", searchQuery);
    
    // Seamlessly jump down to publications layout anchor view after form submit
    const el = document.getElementById("publications");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <motion.header 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      className="fixed top-0 left-0 right-0 z-40 w-full px-8 py-5 pointer-events-none bg- backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between w-full relative">
        
        {/* 1. LEFT SIDE: STANDALONE BRAND LOGO */}
        <a 
          href="#top" 
          className="flex items-center gap-3 pointer-events-auto transition-transform duration-200 hover:scale-[1.02]"
        >
          <Image
            src="/BLCK.png"
            alt="Lyceum-Northwestern University seal"
            width={56}
            height={56}
            className="h-16 w-16 object-contain"
          />
          <div className="flex flex-col justify-center leading-none">
            <span className="font-[family-name:var(--font-fraunces)] text-sm tracking-[0.2em] font-semibold text-[#922842]">
              LNU
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.25em] font-medium text-[#010100] mt-1">
              ARCHIVES
            </span>
          </div>
        </a>

        {/* RIGHT CONTAINER */}
        <div className="flex items-center gap-4 pointer-events-auto h-12">
          
          {/* AnimatePresence swaps seamlessly between menu tabs and the search input container */}
          <AnimatePresence mode="wait">
            {!isSearchOpen ? (
              /* 2. MENU PILL CONTAINER (Hidden on small screens with mobile-first hidden query, visible on md+) */
              <motion.nav
                key="nav-links"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="hidden md:flex items-center bg-[#E3E1E0]/80 backdrop-blur-md px-2 py-1.5 rounded-xl border border-[#010100]/5 shadow-sm"
              >
                <Link 
                  href="#about" 
                  className="px-5 py-2 text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#010100] transition-colors rounded-lg"
                >
                  About
                </Link>
                <Link 
                  href="#goals" 
                  className="px-5 py-2 text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#010100] transition-colors rounded-lg"
                >
                  Goals
                </Link>
                <Link 
                  href="#publications" 
                  className="px-5 py-2 text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#010100] transition-colors rounded-lg"
                >
                  Publications
                </Link>
                <Link
                  href="#programs"
                  className="px-5 py-2 text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#010100] transition-colors rounded-lg"
                >
                  Programs
                </Link>
              </motion.nav>
            ) : (
              /* 3. FLUID INTEGRATED EXPANDED INPUT FORM GRID */
              <motion.form
                key="search-form"
                onSubmit={handleSearchSubmit}
                initial={{ opacity: 0, width: 80 }}
                animate={{ opacity: 1, width: typeof window !== "undefined" && window.innerWidth < 640 ? 200 : 420 }} 
                exit={{ opacity: 0, width: 80 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="flex items-center gap-2 rounded-xl border border-[#922842] bg-white p-1.5 pl-4 shadow-md w-full max-w-md h-11"
              >
                <Search size={16} className="text-[#6B6B6B] flex-shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, keyword, or author"
                  className="w-full bg-transparent text-sm outline-none text-[#010100] placeholder:text-[#8f8f8f]"
                />
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-[#6B6B6B] hover:text-[#010100]"
                  >
                    <X size={14} />
                  </button>
                )}

                <button
                  type="submit"
                  className="rounded-lg bg-[#922842] px-4 py-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-white hover:bg-[#791B37] transition-colors flex-shrink-0"
                >
                  Search
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* 4. TOGGLE EMBEDDED CONTROL TRIGGER ACTION */}
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isMenuOpen) setIsMenuOpen(false);
            }}
            className={`rounded-xl p-2.5 shadow-sm transition-all flex items-center justify-center border h-11 w-11 ${
              isSearchOpen 
                ? "bg-white text-[#6B6B6B] border-[#010100]/10 hover:text-[#010100]" 
                : "bg-[#922842] text-white border-transparent hover:bg-[#791B37]"
            }`}
            title={isSearchOpen ? "Close Search" : "Open Search"}
          >
            {isSearchOpen ? (
              <X size={16} strokeWidth={2.5} />
            ) : (
              <Search size={16} strokeWidth={2.5} />
            )}
          </button>

          {/* 5. HAMBURGER DROPDOWN CONTROL (Only visible when screen layout drops below desktop md size) */}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (isSearchOpen) setIsSearchOpen(false);
            }}
            className="md:hidden rounded-xl p-2.5 shadow-sm border h-11 w-11 flex items-center justify-center bg-[#E3E1E0]/80 backdrop-blur-md border-[#010100]/5 text-[#6B6B6B] hover:text-[#010100]"
          >
            {isMenuOpen ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
          </button>

        </div>

        {/* 6. RESPONSIVE DROPDOWN PANEL OVERLAY */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute top-16 right-0 left-0 mx-auto w-full max-w-sm bg-[#E3E1E0]/95 backdrop-blur-lg rounded-xl border border-[#010100]/5 p-4 shadow-xl flex flex-col gap-2 pointer-events-auto md:hidden"
            >
              <Link 
                href="#about" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#010100] hover:bg-white/40 transition-all rounded-lg"
              >
                About
              </Link>
              <Link 
                href="#goals" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#010100] hover:bg-white/40 transition-all rounded-lg"
              >
                Goals
              </Link>
              <Link 
                href="#publications" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#010100] hover:bg-white/40 transition-all rounded-lg"
              >
                Publications
              </Link>

              <Link
                href="#programs"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#010100] hover:bg-white/40 transition-all rounded-lg"
              >
                Programs
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  );
}






