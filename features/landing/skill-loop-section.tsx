"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/section-title";

const phases = ["Learn", "Solve", "Explain", "Teach", "Unlock"];

export function SkillLoopSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16">
      <SectionTitle title="Skill Loop" subtitle="A verified cycle for compounding capability and trust." />
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {phases.map((phase, index) => (
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.25 }}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-secondary"
          >
            {phase}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
