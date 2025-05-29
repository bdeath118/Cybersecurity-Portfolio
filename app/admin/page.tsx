import { redirect } from "next/navigation"
import { verifySession } from "@/lib/auth"

export default async function AdminPage() {
  const session = await verifySession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome, admin!</p>
    </div>
  )
}
