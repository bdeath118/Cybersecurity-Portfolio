import { getCTFEvents } from "@/lib/data"

export async function generateMetadata() {
  return {
    title: "CTF Events | Cyber Security Portfolio",
    description: "My participation in Capture The Flag cybersecurity competitions",
  }
}

export default async function CTFPage() {
  const events = await getCTFEvents()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">CTF Events</h1>
      {/* CTF content */}
    </div>
  )
}
