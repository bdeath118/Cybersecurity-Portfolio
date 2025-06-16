"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Shield, Clock, Settings } from "lucide-react"

interface UnderConstructionSettings {
  enabled: boolean
  message: string
  estimatedCompletion: string
  progress: number
  allowAdminAccess: boolean
}

export default function UnderConstructionPage() {
  const [settings, setSettings] = useState<UnderConstructionSettings>({
    enabled: true,
    message: "We're working hard to bring you something amazing. Stay tuned!",
    estimatedCompletion: "Soon",
    progress: 75,
    allowAdminAccess: true,
  })

  const [isAdmin, setIsAdmin] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<string>("/images/background.jpeg")

  useEffect(() => {
    // Check if user is admin
    const adminAuth = document.cookie.includes("admin-auth=authenticated")
    setIsAdmin(adminAuth)

    // Load settings from API with error handling
    fetch("/api/under-construction")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }))
        }
      })
      .catch((error) => {
        console.warn("Failed to load construction settings, using defaults:", error)
      })

    // Load site info to get background image
    fetch("/api/site-info")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch site info")
        return res.json()
      })
      .then((data) => {
        if (data.backgroundImage) {
          setBackgroundImage(data.backgroundImage)
        }
      })
      .catch((error) => {
        console.warn("Failed to load site info, using default background:", error)
      })
  }, [])

  const handleAdminAccess = () => {
    window.location.href = "/admin"
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="backdrop-blur-md bg-white/90 border-white/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <Shield className="h-16 w-16 mx-auto text-blue-600 mb-4 drop-shadow-lg" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-sm">Under Construction</h1>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">{settings.message}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-700 font-medium">Estimated completion: {settings.estimatedCompletion}</span>
              </div>
              <div className="space-y-2">
                <Progress value={settings.progress} className="w-full h-3" />
                <p className="text-sm text-gray-600 font-medium">{settings.progress}% Complete</p>
              </div>
            </div>

            {isAdmin && settings.allowAdminAccess && (
              <div className="border-t border-gray-200 pt-6">
                <Button
                  onClick={handleAdminAccess}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                >
                  <Settings className="h-4 w-4" />
                  Admin Access
                </Button>
              </div>
            )}

            <div className="mt-8 text-sm text-gray-600 bg-gray-50/80 rounded-lg p-4">
              <p className="font-medium mb-2">🛡️ Cybersecurity Portfolio</p>
              <p>Thank you for your patience while we enhance your cybersecurity experience.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
