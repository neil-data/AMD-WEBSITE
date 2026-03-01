import Image from "next/image";
import { SiteNavbar } from "@/features/landing/site-navbar";
import { LandingFooter } from "@/features/landing/landing-footer";
import { Card } from "@/components/ui/card";

export default function SkillsPage() {
  return (
    <main className="min-h-screen bg-bg">
      <SiteNavbar />
      <section className="mx-auto w-full max-w-7xl px-6 py-16">
        <h1 className="font-display text-5xl font-bold tracking-tightest">Skill Galaxy</h1>
        <p className="mt-3 max-w-3xl text-sm text-text-secondary">
          Explore the mapped skill relationships and understand how core capabilities connect for ranking.
        </p>
        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface/70">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/images/skills/skill-galaxy-map.svg"
              alt="Skill connection map"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-display text-xl font-semibold tracking-tightest">Frontend Strength</h3>
            <p className="mt-2 text-sm text-text-secondary">JavaScript, React, and TypeScript remain your strongest linked cluster.</p>
          </Card>
          <Card>
            <h3 className="font-display text-xl font-semibold tracking-tightest">System Growth</h3>
            <p className="mt-2 text-sm text-text-secondary">System Design and Node form the next upgrade zone for advanced recruiter roles.</p>
          </Card>
          <Card>
            <h3 className="font-display text-xl font-semibold tracking-tightest">AI Expansion</h3>
            <p className="mt-2 text-sm text-text-secondary">AI skill link unlocks from DSA and TypeScript consistency improvements.</p>
          </Card>
        </div>
      </section>
      <LandingFooter />
    </main>
  );
}
