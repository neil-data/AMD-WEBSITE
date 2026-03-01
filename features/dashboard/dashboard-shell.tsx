"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BriefcaseBusiness, FileClock, GaugeCircle, Home, ShieldCheck, Trophy, UsersRound } from "lucide-react";
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

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className={`border-r border-border bg-surface p-4 transition-all ${collapsed ? "w-20" : "w-64"}`}>
        <button className="mb-6 rounded-lg border border-border px-2 py-1 text-xs" onClick={() => setCollapsed((p) => !p)}>
          {collapsed ? "Expand" : "Collapse"}
        </button>
        <nav className="space-y-2">
          {nav.map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={`/dashboard/${role}/${item.section}`}
                className={`group relative flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${
                  activeSection === item.section
                    ? "border-white/25 bg-white/5 text-text-primary"
                    : "border-transparent text-text-secondary hover:border-border hover:text-text-primary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {!collapsed ? <span>{item.label}</span> : null}
                {activeSection === item.section ? <span className="absolute left-0 top-2 h-6 w-[2px] bg-white" /> : null}
              </Link>
            </motion.div>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <h1 className="text-sm font-semibold">{roleLabel}</h1>
          <div className="flex items-center gap-2">
            <Link href={finalSwitchHref} className="rounded-xl border border-border px-3 py-1 text-xs text-text-secondary hover:text-text-primary">
              {switchLabel}
            </Link>
            <button className="rounded-xl border border-border px-3 py-1 text-xs">{user?.email ?? "Account"}</button>
            <button onClick={handleLogout} className="rounded-xl border border-border px-3 py-1 text-xs text-text-secondary hover:text-text-primary">
              Logout
            </button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
