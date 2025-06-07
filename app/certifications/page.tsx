import { getCertifications } from "@/lib/data"

export async function generateMetadata() {
  return {
    title: "Certifications | Cyber Security Portfolio",
    description: "My cybersecurity certifications and credentials",
  }
}

export default async function CertificationsPage() {
  const certifications = await getCertifications()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Certifications</h1>
      {/* Certifications content */}
    </div>
  )
}
