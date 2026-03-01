import Link from "next/link";
import { SiteNavbar } from "@/features/landing/site-navbar";
import { HeroSection } from "@/features/landing/hero-section";
import { HomeContextSection } from "@/features/landing/home-context-section";
import { LandingFeatures } from "@/features/landing/landing-features";
import { HowItWorksSection } from "@/features/landing/how-it-works-section";
import { StudentsRecruitersSection } from "@/features/landing/students-recruiters-section";
import { LandingFooter } from "@/features/landing/landing-footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-bg">
      <div className="relative z-10">
      <SiteNavbar />
      <HeroSection />
      <HomeContextSection />
      <LandingFeatures />
      <HowItWorksSection />
      <StudentsRecruitersSection />
      <section className="mx-auto w-full max-w-7xl px-6 pb-20">
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <h3 className="font-display text-3xl font-semibold tracking-tightest">Ready to start your verified skill journey?</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm font-light text-text-secondary">
            Enter as student or recruiter and open your role-specific workspace in seconds.
          </p>
          <Link
            href="/auth"
            className="mt-6 inline-flex rounded-xl border border-white/30 bg-white/5 px-5 py-2 text-sm transition hover:shadow-glow"
          >
            Continue to Login / Sign Up
          </Link>
        </div>
      </section>
      <LandingFooter />
      </div>
    </main>
  );
}
