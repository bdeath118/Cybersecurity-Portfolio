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
        // Use default settings if API fails
      })
  }, [])

  const handleAdminAccess = () => {
    window.location.href = "/admin"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <Shield className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Under Construction</h1>
            <p className="text-lg text-gray-600 mb-6">{settings.message}</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-600">Estimated completion: {settings.estimatedCompletion}</span>
            </div>
            <Progress value={settings.progress} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">{settings.progress}% Complete</p>
          </div>

          {isAdmin && settings.allowAdminAccess && (
            <div className="border-t pt-6">
              <Button onClick={handleAdminAccess} className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin Access
              </Button>
            </div>
          )}

          <div className="mt-8 text-sm text-gray-500">
            <p>Thank you for your patience while we enhance your cybersecurity experience.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
