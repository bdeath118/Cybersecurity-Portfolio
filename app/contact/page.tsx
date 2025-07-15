import type { Metadata } from "next"
import { getSiteInfo } from "@/lib/data"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteInfo = await getSiteInfo()

    return {
      title: "Contact",
      description: `Get in touch with ${siteInfo.name} about cybersecurity opportunities, collaborations, or security consulting services.`,
      keywords: [
        "contact",
        "cybersecurity consulting",
        "security services",
        "collaboration",
        "hire cybersecurity expert",
      ],
      openGraph: {
        title: `Contact | ${siteInfo.name}`,
        description: `Get in touch about cybersecurity opportunities`,
        type: "website",
        images: [
          {
            url: siteInfo.backgroundImage || "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: "Contact",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Contact | ${siteInfo.name}`,
        description: "Get in touch about cybersecurity opportunities",
        images: [siteInfo.backgroundImage || "/images/background.jpeg"],
      },
      alternates: {
        canonical: "/contact",
      },
    }
  } catch (error) {
    console.error("Error generating contact metadata:", error)
    return {
      title: "Contact",
      description: "Get in touch about cybersecurity opportunities",
      keywords: ["contact", "cybersecurity consulting", "security services"],
    }
  }
}

export default async function ContactPage() {
  const siteInfo = await getSiteInfo()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Contact</h1>
        <p className="text-lg text-muted-foreground">
          Get in touch about cybersecurity opportunities, collaborations, or consulting services.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="grid gap-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Professional Contact</h2>
            <div className="space-y-3">
              <p>
                <strong>Email:</strong> {siteInfo.email}
              </p>
              {siteInfo.linkedin && (
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={siteInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {siteInfo.linkedin}
                  </a>
                </p>
              )}
              {siteInfo.github && (
                <p>
                  <strong>GitHub:</strong>{" "}
                  <a
                    href={siteInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {siteInfo.github}
                  </a>
                </p>
              )}
              {siteInfo.twitter && (
                <p>
                  <strong>Twitter:</strong>{" "}
                  <a
                    href={siteInfo.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {siteInfo.twitter}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Services</h2>
            <ul className="space-y-2">
              <li>• Penetration Testing</li>
              <li>• Security Consulting</li>
              <li>• Vulnerability Assessments</li>
              <li>• Security Training</li>
              <li>• Code Review</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
