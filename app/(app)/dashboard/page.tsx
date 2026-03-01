import { redirect } from "next/navigation";

export default function DashboardPage({
  searchParams
}: {
  searchParams?: {
    role?: "student" | "recruiter" | "admin";
    section?: "overview" | "challenges" | "exchange" | "leaderboard" | "candidates" | "logs" | "analytics";
  };
}) {
  const role =
    searchParams?.role === "recruiter" || searchParams?.role === "admin"
      ? searchParams.role
      : "student";
  const section = searchParams?.section ?? "overview";

  const studentSection = section === "overview" || section === "challenges" || section === "exchange" || section === "leaderboard" ? section : "overview";
  const recruiterSection = section === "overview" || section === "candidates" || section === "logs" ? section : "overview";
  const adminSection = section === "overview" || section === "logs" || section === "analytics" ? section : "overview";

  if (role === "student") {
    redirect(`/dashboard/student/${studentSection}`);
  }

  if (role === "recruiter") {
    redirect(`/dashboard/recruiter/${recruiterSection}`);
  }

  redirect(`/dashboard/admin/${adminSection}`);
}

