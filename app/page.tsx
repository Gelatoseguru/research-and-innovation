"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/hero";
import About from "@/components/About/about";
import Goals from "@/components/Goals/Goals";
import Publications from "@/components/Publications/publications";
import Footer from "@/components/Footer/footer";
import Preloader from "@/components/Load/Preloader";


// ---- LNU palette (from palette.txt) -----------------------------------
// Alabaster Grey  #E3E1E0  -> page background
// Dim Grey        #6B6B6B  -> secondary text, borders, ring text
// Black           #292928  -> primary text
// Dark Amaranth   #922842  -> primary accent (maroon)
// Dark Amaranth 2 #791B37  -> deep accent / dark sections

export default function Home() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return true;

    const shouldSkipPreloader = sessionStorage.getItem("skip-home-preloader") === "true";
    if (shouldSkipPreloader) {
      sessionStorage.removeItem("skip-home-preloader");
    }

    return !shouldSkipPreloader;
  });

  // Prevent scrolling while the preloader is running
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isLoading]);

  return (
    <>
      {/* 1. Preloader Overlay */}
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

        <Navbar />
        <Hero />
        <About />
        <Goals />
        <Publications />
        <Footer />

    </>
  );
}
