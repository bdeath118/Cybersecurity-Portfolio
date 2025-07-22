import type { DigitalBadge } from "./types"

// Mock data for Credly badges
const mockCredlyBadges: DigitalBadge[] = [
  {
    id: "credly-ibm-cybersec",
    name: "IBM Cybersecurity Analyst Professional Certificate",
    issuer: "IBM",
    issue_date: "2022-09-01",
    credential_url: "https://www.credly.com/badges/ibm-cybersecurity-analyst-professional-certificate",
    image_url:
      "https://images.credly.com/images/a7234567-8901-2345-6789-012345678901/IBM_Cybersecurity_Analyst_Professional_Certificate.png",
    description: "Demonstrates proficiency in cybersecurity analysis, threat intelligence, and incident response.",
  },
  {
    id: "credly-cnd",
    name: "Certified Network Defender (CND)",
    issuer: "EC-Council",
    issue_date: "2023-04-20",
    credential_url: "https://www.credly.com/badges/certified-network-defender",
    image_url: "https://images.credly.com/images/b8345678-9012-3456-7890-123456789012/CND_Badge.png",
    description: "Validates skills in protecting, detecting, and responding to network attacks.",
  },
  {
    id: "credly-aws-security",
    name: "AWS Certified Security - Specialty",
    issuer: "Amazon Web Services (AWS)",
    issue_date: "2024-01-10",
    credential_url: "https://www.credly.com/badges/aws-certified-security-specialty",
    image_url: "https://images.credly.com/images/c9456789-0123-4567-8901-234567890123/AWS_Cloud_Practitioner.png", // Using a placeholder image for now
    description: "Recognizes expertise in securing data and workloads in the AWS cloud.",
  },
  {
    id: "credly-comptia-a",
    name: "CompTIA A+",
    issuer: "CompTIA",
    issue_date: "2021-05-01",
    credential_url: "https://www.credly.com/badges/comptia-a-plus",
    image_url: "https://images.credly.com/images/original_images/a_plus_ce.png",
    description: "Foundational IT skills for entry-level IT professionals.",
  },
  {
    id: "credly-google-it-support",
    name: "Google IT Support Professional Certificate",
    issuer: "Google",
    issue_date: "2021-03-15",
    credential_url: "https://www.credly.com/badges/google-it-support-professional-certificate",
    image_url: "https://images.credly.com/images/original_images/google-it-support-professional-certificate.png",
    description: "Covers troubleshooting, customer service, networking, operating systems, and system administration.",
  },
]

/**
 * Simulates fetching digital badges from Credly.
 * In a real application, this would involve making API calls to Credly.
 * @param username The Credly username to fetch badges for.
 * @param limit Optional limit for the number of badges to return.
 * @returns A promise that resolves to an array of DigitalBadge objects.
 */
export async function getCredlyBadges(username: string, limit?: number): Promise<DigitalBadge[]> {
  console.log(`Simulating fetching Credly badges for username: ${username}`)
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Filter mock data based on a hypothetical username match or just return all
  // For a real integration, you'd use the username to query the actual Credly API.
  const badges = mockCredlyBadges.filter(
    (badge) =>
      badge.issuer.includes("IBM") ||
      badge.issuer.includes("EC-Council") ||
      badge.issuer.includes("Amazon Web Services") ||
      badge.issuer.includes("CompTIA") ||
      badge.issuer.includes("Google"),
  )

  return limit ? badges.slice(0, limit) : badges
}
