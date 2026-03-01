"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function IntegrityRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="flex flex-col items-center justify-center">
      <h3 className="mb-4 text-sm font-semibold">Integrity Score</h3>
      <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r="48" stroke="#1A1A1A" strokeWidth="10" fill="none" />
        <motion.circle
          cx="60"
          cy="60"
          r="48"
          stroke="#FFFFFF"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      </svg>
      <p className="-mt-20 text-2xl font-semibold">{score}%</p>
    </Card>
  );
}
