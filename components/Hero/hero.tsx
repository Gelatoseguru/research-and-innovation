"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Search, Archive } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const logoOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0] ) ;
  const imageScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.08]);
  const contentOpacity = useTransform(scrollYProgress, [0.18, 0.32, 0.82], [0, 1, 1]);
  const contentY = useTransform(scrollYProgress, [0.18, 0.32], [56, 0]);
  const [hideLogo, setHideLogo] = useState(false);

useMotionValueEvent(scrollYProgress, "change", (latest) => {
  if (latest > 0.25) {
    setHideLogo(true);
  }
});
const [showContent, setShowContent] = useState(false);

useMotionValueEvent(scrollYProgress, "change", (latest) => {
  if (latest > 0.32) {
    setShowContent(true);
  }
});


  return (
    <section ref={sectionRef} id="top" className="relative h-[200vh]">
      <div className="sticky top-0 z-0 h-screen overflow-hidden bg-[#E3E1E0]">
        <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
          <Image
            src="/22.webp"
            alt="Lyceum Northwestern University"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/75" />
        </motion.div>

        <motion.div
  className="absolute inset-0 z-10 flex items-center justify-center px-10 pointer-events-none md:px-20 lg:px-32"
  style={{ opacity: hideLogo ? 0 : logoOpacity }}
>
          <Image
            src="/SHOE.png"
            alt="Lyceum Northwestern University"
            width={440}
            height={440}
            priority
            className="h-auto w-full max-w-[260px] object-contain drop-shadow-2xl md:max-w-[400px]"
          />
        </motion.div>

        <motion.div
  className="absolute inset-0 z-20 flex items-center"
  style={{
    opacity: showContent ? 1 : contentOpacity,
    y: showContent ? 0 : contentY,
  }}
>

          <div className="mx-auto w-full max-w-[1325px] px-6 pt-10 md:pt-20">
            <div className="grid items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="mb-5 font-[family-name:var(--font-mono)] text-xl uppercase tracking-[0.2em] text-[#922842]">
                  University research repository
                </p>
                <h1 className="font-[family-name:var(--font-display)] text-[40px] leading-[1.08] tracking-tight md:text-7xl">
                  The Permanent Record of
                  <br className="hidden md:block" />
                  <span className="ml-1 text-[#922842] md:ml-0">LNU</span> Scholarly Works.
                </h1>
                <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-[#3d3d3c]">
                  Explore the intellectual achievements of Lyceum Northwestern University through a digital archive designed to preserve and showcase graduate research. The idea that continue to advance
                  learning, innovation, and scholarly excellence.
                </p>
              </div>

              <div className="flex justify-center md:justify-end">
                <div className="flex h-70 w-70 -rotate-3 flex-col items-center justify-center gap-2 rounded-full border-[3px] border-dashed border-[#6E2E35] text-[#6E2E35]">
                  <Archive size={40} />
                  <p className="font-[family-name:var(--font-mono)] text-xl tracking-[0.25em]">ARCHIVES</p>
                  <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.3em] text-[#8a4a52]">
                    RIMO &middot; VERIFIED
                  </p>
                  <p className="font-[family-name:var(--font-mono)] text-[10px]">EST. 2026</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
