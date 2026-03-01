"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { revealUp, staggerContainer } from "@/lib/motion";

const items = [
  {
    title: "DSA challenges inspired by real interview patterns",
    image: "/images/features/dsa-challenges.svg",
    alt: "Coding challenge interface illustration",
    skill: "Algorithms",
    progress: 92
  },
  {
    title: "Learning exchange where students teach and review peers",
    image: "/images/features/learning-exchange.svg",
    alt: "Students collaborating in a learning exchange",
    skill: "Collaboration",
    progress: 87
  },
  {
    title: "Role-based dashboards for students and recruiters",
    image: "/images/features/role-dashboards.svg",
    alt: "Student and recruiter dashboard panels",
    skill: "Insights",
    progress: 90
  },
  {
    title: "Leaderboard with performance trends and consistency score",
    image: "/images/features/leaderboard.svg",
    alt: "Leaderboard ranking and score trends",
    skill: "Consistency",
    progress: 95
  }
];

function MagneticSkillCard({
  title,
  image,
  alt,
  skill,
  progress
}: {
  title: string;
  image: string;
  alt: string;
  skill: string;
  progress: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (event.clientX - centerX) / (rect.width / 2);
    const y = (event.clientY - centerY) / (rect.height / 2);
    setRotateY(x * 8);
    setRotateX(-y * 8);
  };

  const resetTilt = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetTilt}
      animate={{ rotateX, rotateY, scale: isHovered ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      style={{ transformStyle: "preserve-3d" }}
      className="[perspective:1100px]"
    >
      <Card className="h-full transition hover:shadow-glow">
        <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-border bg-bg/40">
          <Image src={image} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0.45 }}
            className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-transparent"
          />
        </div>

        <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
          <span>{skill}</span>
          <motion.span
            animate={{ boxShadow: isHovered ? "0 0 14px rgba(255,255,255,0.7)" : "0 0 0px rgba(255,255,255,0)" }}
            className="rounded-full border border-white/30 px-2 py-1 text-[10px] text-text-primary"
          >
            AI Verified
          </motion.span>
        </div>

        <p className="text-sm text-text-primary">{title}</p>

        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-text-secondary">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full border border-border bg-bg/50">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: isHovered ? `${progress}%` : "25%" }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              className="h-full bg-white"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function LandingFeatures() {
  return (
    <section id="features" className="mx-auto w-full max-w-7xl px-6 py-16">
      <SectionTitle title="Features" subtitle="Built for speed, trust, and measurable hiring outcomes." />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-8 grid gap-4 md:grid-cols-2"
      >
        {items.map((feature) => (
          <motion.div key={feature.title} variants={revealUp} whileHover={{ scale: 1.02 }} transition={{ ease: "easeInOut" }}>
            <MagneticSkillCard {...feature} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
