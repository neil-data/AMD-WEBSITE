"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

const tracks = [
  {
    title: "Students",
    items: ["Solve DSA challenges", "Exchange learning sessions", "Track leaderboard rank"],
    login: "/auth?role=student&mode=login",
    signup: "/auth?role=student&mode=signup"
  },
  {
    title: "Recruiters",
    items: ["Open hiring queue", "Filter by verified performance", "Review complete record logs"],
    login: "/auth?role=recruiter&mode=login",
    signup: "/auth?role=recruiter&mode=signup"
  }
];

export function StudentsRecruitersSection() {
  return (
    <section id="students-recruiters" className="mx-auto w-full max-w-7xl px-6 py-16">
      <SectionTitle title="Students & Recruiters" subtitle="Role-specific entry points with dedicated experience after sign-in." />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {tracks.map((track, index) => (
          <motion.div
            key={track.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.24, delay: index * 0.04 }}
          >
            <Card className="h-full transition hover:shadow-glow">
              <h3 className="font-display text-2xl font-semibold tracking-tightest">{track.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                {track.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href={track.login} className="rounded-xl border border-white/25 bg-white/5 px-4 py-2 text-xs hover:shadow-glow">
                  Login
                </Link>
                <Link href={track.signup} className="rounded-xl border border-border bg-surface px-4 py-2 text-xs text-text-secondary hover:text-text-primary">
                  Sign Up
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
