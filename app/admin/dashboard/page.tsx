import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { EnhancedDashboard } from "@/components/admin/enhanced-dashboard"

export default function AdminDashboardPage() {
  // Check authentication on the server side
  const authCookie = cookies().get("admin-auth")

  if (!authCookie || authCookie.value !== "authenticated") {
    redirect("/admin")
  }

  return <EnhancedDashboard />
}
