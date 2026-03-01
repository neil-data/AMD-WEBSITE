"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

const plans = [
  { name: "Starter", value: "$0", note: "Core challenge verification" },
  { name: "Pro", value: "$29", note: "Integrity analytics + exchange" },
  { name: "Enterprise", value: "Custom", note: "Recruiter trust suite + API" }
];

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto w-full max-w-7xl px-6 py-16">
      <SectionTitle title="Pricing" subtitle="Monochrome, simple, scalable." />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <motion.div key={plan.name} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="transition hover:shadow-glow">
              <p className="text-sm text-text-secondary">{plan.name}</p>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tightest">{plan.value}</p>
              <p className="mt-1 text-sm text-text-secondary">{plan.note}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
