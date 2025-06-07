import type React from "react"

export async function generateMetadata() {
  return {
    title: "Admin Dashboard | Cyber Security Portfolio",
    description: "Admin dashboard for managing portfolio content",
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-background">{children}</div>
}
