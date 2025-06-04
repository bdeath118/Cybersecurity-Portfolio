import { CertificationsSection } from "@/components/certifications-section"
import { getCertifications, getSiteInfo } from "@/lib/data"

export async function generateMetadata() {
  try {
    const siteInfo = await getSiteInfo()
    return {
      title: `Certifications | ${siteInfo.name || "Cyber Security Portfolio"}`,
      description: "My cybersecurity certifications, credentials, and professional achievements.",
      openGraph: {
        title: "Cybersecurity Certifications",
        description: "My cybersecurity certifications, credentials, and professional achievements.",
      },
    }
  } catch {
    return {
      title: "Certifications | Cyber Security Portfolio",
      description: "Cybersecurity certifications and professional credentials.",
    }
  }
}

export default async function CertificationsPage() {
  try {
    const certifications = await getCertifications()

    return (
      <div className="container py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Certifications</h1>
          <p className="text-lg text-muted-foreground mb-8">
            My professional cybersecurity certifications and credentials.
          </p>
          <CertificationsSection certifications={certifications} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading certifications:", error)
    return (
      <div className="container py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Certifications</h1>
          <p className="text-muted-foreground">Unable to load certifications at this time.</p>
        </div>
      </div>
    )
  }
}
