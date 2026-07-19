import React from 'react';

// Tailored LNU Archiving Data matching the structure in the video screenshots
const ARCHIVE_DATA = [
  {
    id: "01",
    title: "College of Computer Studies: Capstone Registries",
    year: "2026",
    categories: ["WEB DEVELOPMENT", "SYSTEM ARCHITECTURE", "DATABASE MANAGEMENT", "UI/UX DESIGN"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "02",
    title: "College of Criminology: Forensic Case Archives",
    year: "2025",
    categories: ["CASE DOCUMENTATION", "CRIMINALISTICS DATA", "FINGERPRINT ARCHIVE"],
    image: "https://images.unsplash.com/photo-1530811751296-a8c51f47f97b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "03",
    title: "College of Allied Health Sciences: Research Journals",
    year: "2025",
    categories: ["CLINICAL STUDIES", "HEALTH DATA SCIENCE", "EPIDEMIOLOGY LOGS"],
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "04",
    title: "College of Engineering & Architecture: Blueprint Vault",
    year: "2025",
    categories: ["3D ENVIRONMENT DESIGN", "STRUCTURAL MODELING", "CAD BLUEPRINTS", "RENDERING"],
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
  }
];

export default function ProgramsPage() {
  return (
    // Outer scroll container that allows a smooth scroll experience over your own bottom footer
    <div className="relative min-h-screen bg-[#D5D5D5] font-mono text-neutral-800 antialiased selection:bg-neutral-800 selection:text-white">
      
      {/* 
        MAIN CONTENT PANEL CONTAINER
        - mb-[50vh] ensures there is enough scrolling headroom for your footer layout to reveal itself.
        - z-10 keeps it stacked neatly over standard fixed or background layers.
      */}
      <div className="relative z-10 w-full bg-[#D5D5D5] pb-24 shadow-2xl">
        
        {/* Navigation / Header Line */}
        <nav className="max-w-7xl mx-auto px-8 pt-8 flex justify-between items-center text-[11px] tracking-widest text-neutral-600">
          <div className="flex gap-12">
            <a href="#home" className="hover:text-black transition-colors">HOME</a>
            <a href="#works" className="hover:text-black transition-colors text-black font-bold">WORKS</a>
            <a href="#about" className="hover:text-black transition-colors">ABOUT</a>
            <a href="#contact" className="hover:text-black transition-colors">CONTACT</a>
          </div>
        </nav>

        {/* Action Link Row */}
        <div className="max-w-7xl mx-auto px-8 mt-12">
          <a href="#all" className="inline-flex items-center gap-2 text-[11px] tracking-widest text-neutral-600 hover:text-black transition-colors">
            ← SEE ALL WORKS
          </a>
        </div>

        {/* Main Split Layout Grid */}
        <main className="max-w-7xl mx-auto px-8 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel Placeholder: The Acrylic Keyring Showcase Asset */}
          <section className="lg:col-span-3 flex justify-start items-center pt-8">
            <div className="w-36 h-64 bg-neutral-100 rounded-lg shadow-inner border border-neutral-300 flex flex-col items-center justify-center p-4 relative overflow-hidden opacity-80 mix-blend-multiply">
              <div className="w-6 h-6 rounded-full border border-neutral-400 absolute top-3 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-neutral-400" />
              </div>
              <div className="text-[9px] text-center tracking-tighter text-neutral-400 font-sans font-bold leading-tight mt-4">
                LNU <br /> ARCHIVES
              </div>
            </div>
          </section>

          {/* Right Panel: The Interactive Custom Tabbed Window Container */}
          <section className="lg:col-span-9 w-full bg-[#C8C8C8] rounded-bl-xl rounded-br-xl shadow-md border border-neutral-400/40 relative">
            
            {/* The Unique Angled Tab header shape on the top left */}
            <div className="absolute -top-[39px] left-0 h-10 bg-[#C8C8C8] flex items-center px-6 rounded-t-xl border-t border-x border-neutral-400/40 after:content-[''] after:absolute after:bottom-0 after:-right-[20px] after:w-0 after:h-0 after:border-b-[40px] after:border-b-[#C8C8C8] after:border-r-[20px] after:border-r-transparent">
              <span className="text-[11px] tracking-widest text-neutral-700 font-bold">06</span>
            </div>

            {/* Core Box Title */}
            <div className="pt-10 px-8 pb-8">
              <h1 className="text-5xl font-serif text-neutral-900 tracking-tight font-normal">
                3D Tech
              </h1>
            </div>

            {/* Column Label Reference Line */}
            <div className="grid grid-cols-12 px-8 pb-2 text-[10px] tracking-widest text-neutral-500 font-bold uppercase border-b border-dotted border-neutral-400">
              <div className="col-span-8">Project Title</div>
              <div className="col-span-4 text-left">Preview</div>
            </div>

            {/* Dynamic Hover-Triggered Row List Container */}
            <div className="divide-y divide-dotted divide-neutral-400">
              {ARCHIVE_DATA.map((item) => (
                <div 
                  key={item.id}
                  className="group grid grid-cols-12 px-8 py-0 items-start relative transition-all duration-500 ease-in-out hover:bg-neutral-300/30 overflow-hidden"
                >
                  
                  {/* Left Metadata Panel: Expands layout height and opacity on Hover */}
                  <div className="col-span-8 flex flex-col justify-between py-6 self-stretch min-h-[100px] transition-all duration-500 ease-in-out">
                    <h2 className="text-xl font-serif font-normal text-neutral-800 tracking-wide pr-6 group-hover:text-black">
                      {item.title}
                    </h2>
                    
                    {/* Disappearing/Appearing Tags Sub-Block */}
                    <div className="mt-8 grid grid-cols-2 gap-4 max-h-0 opacity-0 pointer-events-none transition-all duration-500 ease-in-out group-hover:max-h-32 group-hover:opacity-100 group-hover:pointer-events-auto">
                      <div className="text-[11px] text-neutral-600 font-sans font-medium">
                        {item.year}
                      </div>
                      <div className="text-[10px] text-neutral-600 flex flex-col gap-1 tracking-wider uppercase">
                        {item.categories.map((cat, i) => (
                          <span key={i}>{cat}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Image Strip Viewport Container */}
                  <div className="col-span-4 py-4 h-full flex items-center justify-start">
                    <div className="w-full h-16 rounded overflow-hidden border border-neutral-400/40 shadow-sm transition-all duration-500 ease-in-out group-hover:h-52">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover grayscale brightness-90 contrast-110 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </section>
        </main>
      </div>

      {/* Decorative Empty Spacer to allow a clean bottom footer overlay pull-up style */}
      <div className="h-[20vh] pointer-events-none" />
    </div>
  );
}