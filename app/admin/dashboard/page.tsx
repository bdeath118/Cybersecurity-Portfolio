import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { EnhancedDashboard } from "@/components/admin/enhanced-dashboard"

export async function generateMetadata() {
  return {
    title: "Dashboard | Admin",
    description: "Admin dashboard for portfolio management",
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function AdminDashboardPage() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get("admin-auth")

  if (!authCookie || authCookie.value !== "authenticated") {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-background">
      <EnhancedDashboard />
    </div>
  )
}
