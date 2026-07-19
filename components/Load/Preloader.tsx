"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

const TARGET_TEXT = "Built for Archives®";
const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@#&";

export default function Preloader({ onComplete }: PreloaderProps) {
  const [displayText, setDisplayText] = useState("");
  const [isScrambling, setIsScrambling] = useState(true);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 35; // Duration of the scramble effect
    let intervalId: NodeJS.Timeout;

    const scramble = () => {
      if (frame >= totalFrames) {
        setDisplayText(TARGET_TEXT);
        setIsScrambling(false);
        clearInterval(intervalId);
        
        // Hold on the fully resolved text for a brief moment before zooming
        setTimeout(() => {
          setIsZooming(true);
        }, 800);
        return;
      }

      // Generate a mix of resolved letters and random characters
      const progress = frame / totalFrames;
      const result = TARGET_TEXT.split("")
        .map((char, index) => {
          if (char === " ") return " ";
          
          // Gradually lock in correct characters from left to right
          if (index / TARGET_TEXT.length < progress && Math.random() > 0.1) {
            return TARGET_TEXT[index];
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplayText(result);
      frame++;
    };

    intervalId = setInterval(scramble, 40);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isZooming && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="text-center select-none"
            animate={
              isZooming
                ? {
                    scale: 60,
                    opacity: 0,
                  }
                : { scale: 1 }
            }
            transition={{
              duration: 1.2,
              ease: [0.76, 0, 0.24, 1], // Custom cubic-bezier for a dramatic cinematic zoom
            }}
            onAnimationComplete={() => {
              if (isZooming) onComplete();
            }}
          >
            <h1 
              className="text-white text-lg md:text-xl font-medium tracking-wider"
              style={{ fontFamily: "serif" }} // Using a serif font to match the video's aesthetic
            >
              {/* Add a subtle flicker effect when it is scrambling */}
              <span className={isScrambling ? "animate-pulse opacity-90" : "opacity-100"}>
                {displayText}
              </span>
            </h1>
            
            {/* The elegant underline seen in the first frame */}
            <motion.div 
              className="h-[1px] bg-neutral-700 mt-2 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}