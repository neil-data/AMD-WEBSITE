import { notFound, redirect } from "next/navigation";
import { StudentDashboard } from "../../../../../features/dashboard/student-dashboard";
import { RecruiterDashboard } from "../../../../../features/dashboard/recruiter-dashboard";
import { AdminDashboard } from "../../../../../features/dashboard/admin-dashboard";

type StudentSection = "overview" | "challenges" | "exchange" | "leaderboard";
type RecruiterSection = "overview" | "candidates" | "logs";
type AdminSection = "overview" | "logs" | "analytics";

const studentSections: StudentSection[] = ["overview", "challenges", "exchange", "leaderboard"];
const recruiterSections: RecruiterSection[] = ["overview", "candidates", "logs"];
const adminSections: AdminSection[] = ["overview", "logs", "analytics"];

export default function DashboardRoleSectionPage({
  params
}: {
  params: { role: string; section: string };
}) {
  const role = params.role;
  const section = params.section;

  if (role === "student") {
    if (!studentSections.includes(section as StudentSection)) {
      redirect("/dashboard/student/overview");
    }
    return <StudentDashboard section={section} />;
  }

  if (role === "recruiter") {
    if (!recruiterSections.includes(section as RecruiterSection)) {
      redirect("/dashboard/recruiter/overview");
    }
    return <RecruiterDashboard section={section} />;
  }

  if (role === "admin") {
    if (!adminSections.includes(section as AdminSection)) {
      redirect("/dashboard/admin/overview");
    }
    return <AdminDashboard section={section} />;
  }

  notFound();
}
