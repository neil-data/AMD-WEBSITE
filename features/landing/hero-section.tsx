"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { pageTransition } from "@/lib/motion";

export function HeroSection() {
  return (
    <motion.section
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="relative mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col justify-center gap-8 px-6 pb-8 pt-12"
    >
      <div className="space-y-6">
        <div className="gradient-line h-[1px] w-56" />
        <h1 className="max-w-4xl font-display text-5xl font-bold leading-tight tracking-tightest md:text-7xl">
          Fast Hiring Intelligence for Students and Recruiters.
        </h1>
        <p className="max-w-2xl text-base font-light text-text-secondary md:text-lg">
          Build your ranking through real DSA challenges, collaborative learning exchange, and trusted recruiter-ready records.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/auth?role=student&mode=login"
            className="rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm hover:shadow-glow"
          >
            Student Login
          </Link>
          <Link
            href="/auth?role=student&mode=signup"
            className="rounded-xl border border-border bg-surface px-5 py-3 text-sm text-text-secondary hover:text-text-primary"
          >
            Student Sign Up
          </Link>
          <Link
            href="/auth?role=recruiter&mode=login"
            className="rounded-xl border border-border bg-surface px-5 py-3 text-sm text-text-secondary hover:text-text-primary"
          >
            Recruiter Login
          </Link>
          <Link
            href="/auth?role=recruiter&mode=signup"
            className="rounded-xl border border-border bg-surface px-5 py-3 text-sm text-text-secondary hover:text-text-primary"
          >
            Recruiter Sign Up
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-secondary">
          <a href="#home-context" className="rounded-full border border-border px-3 py-1 hover:text-text-primary">
            Home Context
          </a>
          <a href="#features" className="rounded-full border border-border px-3 py-1 hover:text-text-primary">
            Features
          </a>
          <a href="#how-it-works" className="rounded-full border border-border px-3 py-1 hover:text-text-primary">
            How It Works
          </a>
          <a href="#students-recruiters" className="rounded-full border border-border px-3 py-1 hover:text-text-primary">
            Students & Recruiters
          </a>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <p className="text-xs text-text-secondary">Challenges</p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tightest">Live Practice</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <p className="text-xs text-text-secondary">Leaderboard</p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tightest">Real Rankings</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <p className="text-xs text-text-secondary">Learning Exchange</p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tightest">Peer Mentorship</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface/70 p-4">
          <p className="text-xs text-text-secondary">Hiring Logs</p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tightest">Verified Records</p>
        </div>
      </div>
    </motion.section>
  );
}
