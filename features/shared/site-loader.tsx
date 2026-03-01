"use client";

import { motion } from "framer-motion";

export function SiteLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="space-y-4 text-center">
        <motion.div
          className="mx-auto h-14 w-14 rounded-full border-2 border-border border-t-white"
          animate={{ rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.7, ease: "linear" }}
        />
        <motion.p
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.9, ease: "easeInOut" }}
          className="text-sm text-text-secondary"
        >
          Loading SkillRank...
        </motion.p>
      </div>
    </div>
  );
}
