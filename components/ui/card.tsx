import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass rounded-2xl border border-border bg-surface/70 p-6", className)}>{children}</div>;
}
