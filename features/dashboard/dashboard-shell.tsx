"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BriefcaseBusiness, FileClock, GaugeCircle, Home, Menu, ShieldCheck, Trophy, UsersRound, X } from "lucide-react";
import { useAuth } from "@/features/shared/auth-provider";

const studentNav = [
  { label: "Overview", icon: Home, section: "overview" },
  { label: "Challenges", icon: GaugeCircle, section: "challenges" },
  { label: "Learning Exchange", icon: UsersRound, section: "exchange" },
  { label: "Leaderboard", icon: Trophy, section: "leaderboard" }
];

const recruiterNav = [
  { label: "Overview", icon: Home, section: "overview" },
  { label: "Candidates", icon: BriefcaseBusiness, section: "candidates" },
  { label: "Record Logs", icon: FileClock, section: "logs" }
];

const adminNav = [
  { label: "Overview", icon: Home, section: "overview" },
  { label: "Analytics", icon: ShieldCheck, section: "analytics" },
  { label: "Flagged Logs", icon: FileClock, section: "logs" }
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOutUser } = useAuth();
  const segments = pathname.split("/").filter(Boolean);
  const role = segments[1] === "recruiter" || segments[1] === "admin" ? segments[1] : "student";
  const activeSection = segments[2] ?? "overview";
  const nav = role === "recruiter" ? recruiterNav : role === "admin" ? adminNav : studentNav;
  const roleLabel = role === "student" ? "Student Dashboard" : role === "recruiter" ? "Recruiter Dashboard" : "Admin Dashboard";
  const switchLabel = role === "student" ? "Switch to Recruiter" : role === "recruiter" ? "Switch to Admin" : "Switch to Student";
  const finalSwitchHref = role === "student" ? "/dashboard/recruiter/overview" : role === "recruiter" ? "/dashboard/admin/overview" : "/dashboard/student/overview";

  const handleLogout = async () => {
    await signOutUser();
    router.replace("/auth?mode=login");
  };

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-1">
      {nav.map((item) => (
        <motion.div key={item.label} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Link
            href={`/dashboard/${role}/${item.section}`}
            onClick={onNavigate}
            className={`group relative flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
              activeSection === item.section
                ? "border-white/25 bg-white/5 text-text-primary"
                : "border-transparent text-text-secondary hover:border-border hover:text-text-primary"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {(!collapsed || onNavigate) ? <span>{item.label}</span> : null}
            {activeSection === item.section ? <span className="absolute left-0 top-2 h-6 w-[2px] bg-white" /> : null}
          </Link>
        </motion.div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-bg">
      {/* ── Desktop sidebar ── */}
      <aside className={`hidden md:flex flex-col border-r border-border bg-surface p-4 transition-all duration-200 ${collapsed ? "w-20" : "w-64"}`}>
        <button
          className="mb-6 rounded-lg border border-border px-2 py-1 text-xs"
          onClick={() => setCollapsed((p) => !p)}
        >
          {collapsed ? "▶" : "◀ Collapse"}
        </button>
        <NavLinks />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-surface p-5 md:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-semibold">{roleLabel}</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-border p-1.5 text-text-secondary hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <NavLinks onNavigate={() => setMobileOpen(false)} />
              <div className="mt-6 space-y-2 border-t border-border pt-4">
                <Link
                  href={finalSwitchHref}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl border border-border px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
                >
                  {switchLabel}
                </Link>
                <p className="truncate rounded-xl border border-border px-3 py-2 text-xs text-text-secondary">{user?.email ?? "Account"}</p>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-border px-3 py-2 text-left text-xs text-text-secondary hover:text-text-primary"
                >
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 md:h-16 md:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="rounded-lg border border-border p-1.5 text-text-secondary hover:text-text-primary md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="text-sm font-semibold">{roleLabel}</h1>
          </div>
          {/* Desktop header actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Link href={finalSwitchHref} className="rounded-xl border border-border px-3 py-1 text-xs text-text-secondary hover:text-text-primary">
              {switchLabel}
            </Link>
            <button className="rounded-xl border border-border px-3 py-1 text-xs">{user?.email ?? "Account"}</button>
            <button onClick={handleLogout} className="rounded-xl border border-border px-3 py-1 text-xs text-text-secondary hover:text-text-primary">
              Logout
            </button>
          </div>
          {/* Mobile logout shortcut */}
          <button onClick={handleLogout} className="rounded-xl border border-border px-3 py-1 text-xs text-text-secondary md:hidden">
            Logout
          </button>
        </header>
        <div className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
