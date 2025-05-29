import { EnhancedDashboard } from "@/components/admin/enhanced-dashboard"
import { checkAuth } from "@/lib/actions"

export default async function AdminDashboardPage() {
  // Check authentication
  await checkAuth()

  return <EnhancedDashboard />
}
