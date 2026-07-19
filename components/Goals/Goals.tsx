import { goals } from "./goals-data";
import { fraunces, mono } from "@/components/fonts";

export default function Goals() {
  return (
    <section id="goals" className="border-t border-[#010100]/10 bg-[#791B37] text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[#e7c3cf]">
          LNU
        </p>

        <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-3xl leading-tight">
          GOALS
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {goals.map((g) => (
            <div
              key={g.title}
              className="rounded-2xl border border-white/25 p-6"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl italic">
                {g.title}
              </h3>

              <p className="mt-3 text-[14px] leading-relaxed text-white/85">
                {g.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}