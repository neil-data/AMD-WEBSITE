import { notFound, redirect } from "next/navigation";

export default function DashboardRolePage({ params }: { params: { role: string } }) {
  if (params.role === "student") {
    redirect("/dashboard/student/overview");
  }

  if (params.role === "recruiter") {
    redirect("/dashboard/recruiter/overview");
  }

  if (params.role === "admin") {
    redirect("/dashboard/admin/overview");
  }

  notFound();
}
