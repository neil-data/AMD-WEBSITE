"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const links = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Students & Recruiters", href: "/#students-recruiters" },
  { label: "Skill Galaxy", href: "/skills" }
];

export function SiteNavbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="font-display text-lg font-semibold tracking-tightest">
          SkillRank AI
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-text-secondary md:flex">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/auth?role=student&mode=login" className="rounded-xl border border-border px-3 py-1 text-xs text-text-secondary hover:text-text-primary">
            Login
          </Link>
          <Link href="/auth?role=student&mode=signup" className="rounded-xl border border-white/25 bg-white/5 px-3 py-1 text-xs hover:shadow-glow">
            Sign Up
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
