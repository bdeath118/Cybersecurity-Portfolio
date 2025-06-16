"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPageClient() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const router = useRouter()

  // Load debug info on component mount
  useEffect(() => {
    async function loadDebugInfo() {
      try {
        const response = await fetch("/api/debug-auth")
        const data = await response.json()
        setDebugInfo(data.debug)
        console.log("Debug info loaded:", data.debug)
      } catch (error) {
        console.error("Failed to load debug info:", error)
      }
    }
    loadDebugInfo()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("=== CLIENT LOGIN ATTEMPT ===")
      console.log("Username:", username)
      console.log("Password length:", password.length)

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      const data = await response.json()
      console.log("Response data:", data)

      if (response.ok && data.success) {
        console.log("Login successful, redirecting...")
        router.push("/admin/dashboard")
      } else {
        console.log("Login failed:", data.error)
        setError(data.error || "Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fillTestCredentials = () => {
    if (debugInfo?.adminUsername && debugInfo?.adminUsername !== "NOT_SET") {
      setUsername(debugInfo.adminUsername)
      setPassword("") // Don't auto-fill password for security
    } else {
      setUsername("admin")
      setPassword("admin123")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            <Button variant="outline" size="sm" onClick={fillTestCredentials} disabled={loading} className="w-full">
              Fill Test Credentials
            </Button>

            {debugInfo && (
              <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <p>
                  <strong>Debug Info:</strong>
                </p>
                <p>Admin Username: {debugInfo.adminUsername || "NOT_SET"}</p>
                <p>Admin Password: {debugInfo.hasAdminPassword ? "SET" : "NOT_SET"}</p>
                <p>Environment: {debugInfo.environment}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
