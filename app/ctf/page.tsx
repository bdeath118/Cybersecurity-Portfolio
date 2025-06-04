import { CTFSection } from "@/components/ctf-section"
import { getCTFEvents, getSiteInfo } from "@/lib/data"

export async function generateMetadata() {
  try {
    const siteInfo = await getSiteInfo()
    return {
      title: `CTF Events | ${siteInfo.name || "Cyber Security Portfolio"}`,
      description: "My Capture The Flag competition participation, achievements, and writeups.",
      openGraph: {
        title: "CTF Events & Competitions",
        description: "My Capture The Flag competition participation, achievements, and writeups.",
      },
    }
  } catch {
    return {
      title: "CTF Events | Cyber Security Portfolio",
      description: "Capture The Flag competition participation and achievements.",
    }
  }
}

export default async function CTFPage() {
  try {
    const events = await getCTFEvents()

    return (
      <div className="container py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">CTF Events</h1>
          <p className="text-lg text-muted-foreground mb-8">
            My participation in Capture The Flag competitions and cybersecurity challenges.
          </p>
          <CTFSection events={events} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading CTF events:", error)
    return (
      <div className="container py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">CTF Events</h1>
          <p className="text-muted-foreground">Unable to load CTF events at this time.</p>
        </div>
      </div>
    )
  }
}
