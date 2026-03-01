import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 text-xs text-text-secondary md:flex-row md:items-center md:justify-between">
        <span>© 2026 SkillRank AI</span>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="hover:text-text-primary">
            Home
          </Link>
          <Link href="/#features" className="hover:text-text-primary">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-text-primary">
            How It Works
          </Link>
          <Link href="/#students-recruiters" className="hover:text-text-primary">
            Students & Recruiters
          </Link>
          <Link href="/skills" className="hover:text-text-primary">
            Skill Galaxy
          </Link>
        </div>
      </div>
    </footer>
  );
}
