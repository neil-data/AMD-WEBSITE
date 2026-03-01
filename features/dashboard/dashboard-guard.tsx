"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/shared/auth-provider";

function dashboardPathForRole(role: "student" | "recruiter" | "admin") {
  if (role === "recruiter") {
    return "/dashboard/recruiter/overview";
  }

  if (role === "admin") {
    return "/dashboard/admin/overview";
  }

  return "/dashboard/student/overview";
}

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    console.log("[DashboardGuard] resolved → user:", user?.email, "| role:", role, "| path:", pathname);

    if (!user) {
      router.replace("/auth?mode=login");
      return;
    }

    const routeRole = pathname.split("/").filter(Boolean)[1];
    if (!routeRole || !role) {
      return;
    }

    if (routeRole !== role) {
      console.log(`[DashboardGuard] role mismatch (url="${routeRole}" vs actual="${role}") → redirecting`);
      router.replace(dashboardPathForRole(role));
    }
  }, [loading, pathname, role, router, user]);

  // Block rendering until both auth state AND Firestore role are resolved.
  // This prevents a flash of the wrong dashboard when a stale localStorage
  // role differs from the authoritative Firestore role.
  if (loading || !user) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <div className="h-8 w-48 skeleton rounded-xl" />
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <div className="h-24 skeleton rounded-xl" />
          <div className="h-24 skeleton rounded-xl" />
          <div className="h-24 skeleton rounded-xl" />
          <div className="h-24 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
