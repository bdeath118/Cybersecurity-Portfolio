import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { AdminDashboard } from "@/components/admin/dashboard"

export default function AdminDashboardPage() {
  // Simple auth check
  const authCookie = cookies().get("admin-auth")

  if (!authCookie || authCookie.value !== "authenticated") {
    redirect("/admin")
  }

  return <AdminDashboard />
}
