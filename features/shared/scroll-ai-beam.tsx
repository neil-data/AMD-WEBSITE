"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollAiBeam() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 130, damping: 26, mass: 0.25 });

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-[3px] bg-white/5">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-white/50 via-white to-white/60 shadow-[0_0_16px_rgba(255,255,255,0.75)]"
        style={{ scaleX: smooth }}
      />
      <motion.div
        className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,1)]"
        style={{ scale: smooth }}
      />
    </div>
  );
}
