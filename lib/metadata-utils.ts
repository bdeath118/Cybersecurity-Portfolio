import { getSiteInfo } from "./data"

export async function getBaseMetadata() {
  try {
    const siteInfo = await getSiteInfo()
    return {
      title: siteInfo.name || "Cyber Security Portfolio",
      description: siteInfo.description || "A portfolio showcasing cybersecurity expertise",
      siteName: siteInfo.name || "Cyber Security Portfolio",
    }
  } catch (error) {
    return {
      title: "Cyber Security Portfolio",
      description: "A portfolio showcasing cybersecurity expertise",
      siteName: "Cyber Security Portfolio",
    }
  }
}

export function createMetadata(
  title: string,
  description: string,
  options: {
    noIndex?: boolean
    ogImage?: string
  } = {},
) {
  const metadata = {
    title,
    description,
    robots: options.noIndex ? { index: false, follow: false } : undefined,
  }

  if (options.ogImage) {
    return {
      ...metadata,
      openGraph: {
        images: [{ url: options.ogImage }],
      },
    }
  }

  return metadata
}
