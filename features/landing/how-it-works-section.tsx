"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useScroll } from "framer-motion";
import { Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

const steps = [
  "Pick a DSA challenge and submit code",
  "Get instant skill score + explanation feedback",
  "Join learning exchange to mentor or be mentored",
  "Unlock leaderboard rank and recruiter visibility",
  "Recruiters review hiring panel with record logs"
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const rocketY = useMotionValue(0);
  const railTravel = 300;
  const activeIndex = lockedIndex ?? hoveredIndex;

  useEffect(() => {
    if (activeIndex !== null) {
      const targetY = (activeIndex / (steps.length - 1)) * railTravel;
      const controls = animate(rocketY, targetY, { type: "spring", stiffness: 260, damping: 22 });
      return () => controls.stop();
    }

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      rocketY.set(latest * railTravel);
    });

    return () => unsubscribe();
  }, [activeIndex, rocketY, scrollYProgress]);

  return (
    <section ref={sectionRef} id="how-it-works" className="mx-auto w-full max-w-7xl px-6 py-16">
      <SectionTitle title="How It Works" subtitle="A fast cycle from coding practice to hiring readiness." />
      <div className="mt-8 grid gap-6 lg:grid-cols-[140px_1fr]">
        <div className="relative hidden lg:block">
          <div className="sticky top-24 h-[360px] rounded-2xl border border-border bg-surface/60">
            <div className="absolute left-1/2 top-6 h-[300px] w-0.5 -translate-x-1/2 bg-border" />

            {steps.map((_, index) => {
              const markerY = (index / (steps.length - 1)) * railTravel + 24;
              const isActive = activeIndex === index;

              return (
                <button
                  key={`marker-${index}`}
                  type="button"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setLockedIndex((prev) => (prev === index ? null : index))}
                  className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-border bg-bg transition"
                  style={{ top: `${markerY}px`, boxShadow: isActive ? "0 0 0 4px rgba(255,255,255,0.12)" : "none" }}
                  aria-label={`Move rocket to step ${index + 1}`}
                />
              );
            })}

            <motion.div style={{ y: rocketY }} className="absolute left-1/2 top-5 -translate-x-1/2">
              <motion.div
                animate={{ scale: activeIndex !== null ? [1, 1.08, 1] : 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-full border border-white/30 bg-white/10 p-2"
              >
                <Rocket className="h-5 w-5 text-text-primary" />
              </motion.div>
            </motion.div>

          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card className={`flex items-center gap-3 py-4 transition ${activeIndex === index ? "border-white/30" : ""}`}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs text-text-secondary">
                  {index + 1}
                </span>
                <p className="text-sm text-text-primary">{step}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
