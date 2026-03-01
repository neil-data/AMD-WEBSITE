"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const items = [
  "Challenge #42 verified with low AI probability",
  "Mentorship session completed (+6 contribution)",
  "Integrity ring improved by 2%"
];

export function ActivityFeed() {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold">Recent Activity</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.2 }}
            className="rounded-xl border border-border bg-bg/60 p-3 text-sm text-text-secondary"
          >
            {item}
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
