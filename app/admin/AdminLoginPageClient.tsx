"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, AlertCircle } from "lucide-react"

export default function AdminLoginPageClient() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting login with:", { username, password: "***" })

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      console.log("Login response status:", response.status)

      const data = await response.json()
      console.log("Login response data:", data)

      if (response.ok && data.success) {
        console.log("Login successful, redirecting to dashboard")
        router.push("/admin/dashboard")
      } else {
        const errorMessage = data.error || "Login failed"
        console.error("Login failed:", errorMessage)
        setError(errorMessage)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fillTestCredentials = () => {
    // Use environment variables if available, otherwise use defaults
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin"
    setUsername(adminUsername)
    setPassword("") // Don't auto-fill password for security
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Access the cybersecurity portfolio admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter admin username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter admin password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <Button type="button" variant="outline" className="w-full bg-transparent" onClick={fillTestCredentials}>
              Fill Test Credentials
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Information:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Environment: {process.env.NODE_ENV}</div>
              <div>Admin Username: {process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin (default)"}</div>
              <div>Password: Set via ADMIN_PASSWORD env var</div>
            </div>
            <div className="mt-2">
              <a
                href="/api/debug-auth"
                target="_blank"
                className="text-xs text-blue-600 hover:underline"
                rel="noreferrer"
              >
                View Auth Debug Info
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
