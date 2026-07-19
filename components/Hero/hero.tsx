import { Search, Archive } from "lucide-react";
import { fraunces, mono, inter } from "@/components/fonts";
import HeroBackground from "@/components/Hero/HeroBackground";

export default function Hero() {
    return (
    <section id="top" className="relative max-h-screen overflow-hidden">

      <HeroBackground src="/images/try.jpg" />

      <div className="relative mx-auto flex min-h-[1000px] max-w-[1325px] items-center px-6 pb-20 pt-16 md:pt-24 top-0.03">
        <div className="grid w-full items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">

          <div>
            <p className="mb-5 font-[family-name:var(--font-mono)] text-2xs uppercase tracking-[0.2em] text-[#922842]">
              University research repository
            </p>
           <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[1.08] tracking-tight md:text-6xl">
  The Permanent Record of
  <br className="hidden md:block" />
  <span className="md:ml-0 ml-1 text-[#922842]">LNU</span> Scholarly Works.
</h1>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-[#3d3d3c]">
              Explore the intellectual achievements of Lyceum Northwestern University through a digital archive
              designed to preserve and showcase graduate research. The idea that continue to advance 
              learning, innovation, and scholarly excellence.
            </p>

            <form className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-[#922842] bg-white p-1.5 pl-4">
              <Search size={16} className="text-[#6B6B6B]" />
              <input
                type="text"
                placeholder="Search by title, keyword, or author"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8f8f8f]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#922842] px-4 py-2 text-sm text-white"
              >
                Search
              </button>
            </form>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="flex h-70 w-70 -rotate-3 flex-col items-center justify-center gap-2 rounded-full border-[3px] border-dashed border-[#6E2E35] text-[#6E2E35]">
              <Archive size={40} />
              <p className="font-[family-name:var(--font-mono)] text-xl tracking-[0.25em]">
                ARCHIVES
              </p>
              <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.3em] text-[#8a4a52]">
                RIMO &middot; VERIFIED
              </p>
              <p className="font-[family-name:var(--font-mono)] text-[10px]">
                EST. 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    )
}


