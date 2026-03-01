"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function SkillUnlockReveal({ unlocked }: { unlocked: boolean }) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold">Skill Unlock</h3>
      <AnimatePresence mode="wait">
        <motion.div
          key={unlocked ? "open" : "locked"}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border border-border bg-bg/50 p-4 text-sm"
        >
          {unlocked ? "Advanced distributed systems challenge unlocked." : "Complete one teaching session to unlock."}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
