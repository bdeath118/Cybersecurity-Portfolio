import type { Metadata } from "next"
import AdminLoginPageClient from "./AdminLoginPageClient"

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin login page",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLoginPage() {
  return <AdminLoginPageClient />
}
