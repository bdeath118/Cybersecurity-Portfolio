import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { AdminDashboard } from "@/components/admin/dashboard"
import { initializeApp } from "@/lib/init"

export default async function AdminDashboardPage() {
  // Simple auth check
  const authCookie = cookies().get("admin-auth")

  if (!authCookie || authCookie.value !== "authenticated") {
    redirect("/admin")
  }

  // Initialize app data files
  await initializeApp()

  return <AdminDashboard />
}
