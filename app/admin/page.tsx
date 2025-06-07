import AdminLoginPageClient from "./AdminLoginPageClient"

export async function generateMetadata() {
  return {
    title: "Admin Login | Cyber Security Portfolio",
    description: "Admin login page",
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default function AdminLoginPage() {
  return <AdminLoginPageClient />
}
