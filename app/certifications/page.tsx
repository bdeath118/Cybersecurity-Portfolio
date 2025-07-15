import type { Metadata } from "next"
import { CertificationsSection } from "@/components/certifications-section"
import { getCertifications, getSiteInfo } from "@/lib/data"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteInfo = await getSiteInfo()
    const certifications = await getCertifications()

    return {
      title: "Certifications",
      description: `View ${siteInfo.name}'s cybersecurity certifications and credentials. ${certifications.length} professional certifications from leading security organizations.`,
      keywords: [
        "cybersecurity certifications",
        "security credentials",
        "professional certifications",
        "CEH",
        "CISSP",
        "CompTIA Security+",
      ],
      openGraph: {
        title: `Certifications | ${siteInfo.name}`,
        description: `Cybersecurity certifications and credentials`,
        type: "website",
        images: [
          {
            url: siteInfo.backgroundImage || "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: "Cybersecurity Certifications",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Certifications | ${siteInfo.name}`,
        description: "Cybersecurity certifications and credentials",
        images: [siteInfo.backgroundImage || "/images/background.jpeg"],
      },
      alternates: {
        canonical: "/certifications",
      },
    }
  } catch (error) {
    console.error("Error generating certifications metadata:", error)
    return {
      title: "Certifications",
      description: "Cybersecurity certifications and credentials",
      keywords: ["cybersecurity certifications", "security credentials"],
    }
  }
}

export default async function CertificationsPage() {
  const certifications = await getCertifications()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Certifications</h1>
        <p className="text-lg text-muted-foreground">My cybersecurity certifications and professional credentials.</p>
      </div>
      <CertificationsSection certifications={certifications} />
    </div>
  )
}
