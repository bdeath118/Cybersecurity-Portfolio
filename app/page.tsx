export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Cybersecurity Portfolio</h1>
        <p className="text-lg text-gray-600 mb-8">Showcasing skills, projects, and achievements in cybersecurity</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Projects</h3>
            <p className="text-gray-600">Security research and development projects</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Skills</h3>
            <p className="text-gray-600">Technical expertise and certifications</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Achievements</h3>
            <p className="text-gray-600">Bug bounties and recognition</p>
          </div>
        </div>
      </div>
    </div>
  )
}
