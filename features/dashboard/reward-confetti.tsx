"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function RewardConfetti({ trigger }: { trigger: boolean }) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold">Contribution Reward</h3>
      <div className="relative h-20 overflow-hidden rounded-xl border border-border bg-bg/40">
        {trigger
          ? Array.from({ length: 18 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute top-0 h-1.5 w-1.5 rounded-full bg-white/70"
                initial={{
                  opacity: 0,
                  x: `${(i * 13) % 100}%`,
                  y: 0
                }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, 70],
                  x: [`${(i * 13) % 100}%`, `${((i * 17) % 90) + 5}%`]
                }}
                transition={{ duration: 1.3, delay: i * 0.03, repeat: Infinity, repeatDelay: 1.8 }}
              />
            ))
          : null}
      </div>
    </Card>
  );
}
