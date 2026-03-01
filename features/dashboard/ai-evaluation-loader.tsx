"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function AiEvaluationLoader() {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold">AI Evaluation</h3>
      <div className="space-y-2">
        {[0, 1, 2].map((v) => (
          <motion.div
            key={v}
            className="h-3 rounded bg-white/10"
            animate={{ opacity: [0.3, 1, 0.3], x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.1, delay: v * 0.15 }}
          />
        ))}
      </div>
    </Card>
  );
}
