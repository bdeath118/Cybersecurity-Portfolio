import { Shield, Wrench, Clock, ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUnderConstructionSettings } from "@/lib/data"

export async function generateMetadata() {
  return {
    title: "Under Construction | Cyber Security Portfolio",
    description: "This page is currently under construction. Please check back soon for updates.",
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function UnderConstructionPage() {
  let settings
  try {
    settings = await getUnderConstructionSettings()
  } catch (error) {
    console.error("Error loading under construction settings:", error)
    // Use default settings if there's an error
    settings = {
      enabled: false,
      message: "We're working hard to bring you something amazing.",
      estimatedCompletion: "Soon",
      progressPercentage: 75,
      allowAdminAccess: true,
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/background.jpeg')",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Admin Access Button - Top Right */}
      {settings.allowAdminAccess && (
        <div className="absolute top-4 right-4 z-20">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Settings className="h-4 w-4 mr-2" />
              Admin Access
            </Button>
          </Link>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Icon Section */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <Shield className="h-16 w-16 text-primary animate-pulse" />
            <Wrench className="h-12 w-12 text-yellow-500 animate-bounce" />
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            Under
            <br />
            <span className="text-primary">Construction</span>
          </h1>

          {/* Dynamic Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            {settings.message}
            <br />
            This cybersecurity portfolio is being enhanced with new features.
          </p>

          {/* Status Indicators */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Security Features Active</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Estimated Completion: {settings.estimatedCompletion}</span>
            </div>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Progress</span>
              <span>{settings.progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${settings.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!settings.enabled && (
              <Link href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portfolio
                </Button>
              </Link>
            )}
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Shield className="h-4 w-4 mr-2" />
                Contact Admin
              </Button>
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-sm text-gray-400 mt-12">
            Thank you for your patience while we enhance your cybersecurity experience.
          </p>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping opacity-20" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-30" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce opacity-25" />
      </div>
    </div>
  )
}
