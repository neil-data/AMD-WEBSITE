"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function PercentileProgress({ value }: { value: number }) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold">Percentile Progress</h3>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-full rounded-full bg-white"
        />
      </div>
      <p className="mt-2 text-sm text-text-secondary">Top {100 - value}% remaining to elite tier.</p>
    </Card>
  );
}
