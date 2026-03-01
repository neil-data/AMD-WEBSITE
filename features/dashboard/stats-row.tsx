"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 20, stiffness: 120 });
  const display = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, motionValue, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

const stats = [
  { label: "SkillRank", value: 821 },
  { label: "Integrity", value: 87 },
  { label: "Percentile", value: 94 }
];

export function StatsRow() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <motion.div key={stat.label} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="hover:shadow-glow">
            <p className="text-xs font-light text-text-secondary">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold">
              <CountUp value={stat.value} />
              {stat.label !== "SkillRank" ? "%" : ""}
            </p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
