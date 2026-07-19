import Image from "next/image";
import { goals } from "./goals-data";
import { fraunces, mono } from "@/components/fonts";

export default function Goals() {
  return (
    // 1. Added 'relative' and changed color themes to match your light overlay
    <section id="goals" className=" pb-40 relative bg-[#E3E1E0] text-neutral-800 transition-colors duration-300">
      
      {/* 2. Background Image Wrapper (Safely absolute pinned behind text content) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/try.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#E3E1E0]" />
      </div>

      {/* 3. Your completely untouched content block */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        {/* Adjusted tracking text to a dark muted maroon for contrast against light gray */}
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[#791B37]/80">
          LNU RIMO
        </p>

        <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-3xl leading-tight text-neutral-900">
          GOALS
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {goals.map((g) => (
            <div
              key={g.title}
              // Swapped border-white/25 to a dark subtle border for the new background theme
              className="rounded-2xl border border-neutral-800/20 bg-white/40 backdrop-blur-sm p-6 shadow-sm"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl italic text-neutral-900">
                {g.title}
              </h3>

              <p className="mt-3 text-[14px] leading-relaxed text-neutral-700">
                {g.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}