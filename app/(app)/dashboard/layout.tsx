import { DashboardShell } from "@/features/dashboard/dashboard-shell";
import { DashboardGuard } from "@/features/dashboard/dashboard-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardGuard>
      <DashboardShell>{children}</DashboardShell>
    </DashboardGuard>
  );
}
