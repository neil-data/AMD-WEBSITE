"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

const pillars = [
  {
    title: "Why SkillRank",
    text: "Resumes can be noisy. We rank with challenge outcomes, explanation quality, and consistency." 
  },
  {
    title: "For Students",
    text: "Practice DSA, earn verified skill records, and climb a transparent leaderboard." 
  },
  {
    title: "For Recruiters",
    text: "Shortlist candidates from trusted logs instead of guessing from one-time snapshots." 
  }
];

export function HomeContextSection() {
  return (
    <section id="home-context" className="mx-auto w-full max-w-7xl px-6 py-16">
      <SectionTitle
        title="Home Context"
        subtitle="One platform where student growth and recruiter trust happen in the same loop."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.24, delay: index * 0.05, ease: "easeOut" }}
          >
            <Card className="h-full transition hover:shadow-glow">
              <h3 className="font-display text-xl font-semibold tracking-tightest">{pillar.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{pillar.text}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
