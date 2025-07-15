"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"

export default function AdminLoginPageClient() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("🔐 Attempting admin login...")

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      console.log("Login response:", data)

      if (data.success) {
        console.log("✅ Login successful, redirecting to dashboard")
        router.push("/admin/dashboard")
        router.refresh()
      } else {
        setError(data.error || "Invalid credentials")
        console.error("❌ Login failed:", data.error)
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      setError("Network error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fillTestCredentials = () => {
    // Use environment variables if available, otherwise use defaults
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin"
    setUsername(adminUsername)
    setPassword("") // Don't auto-fill password for security
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center relative">
              <Shield className="w-8 h-8 text-primary" />
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
              <CardDescription className="text-slate-300">
                Secure access to cybersecurity portfolio admin dashboard
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-200 font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary"
                  placeholder="Enter admin username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary pr-10"
                    placeholder="Enter admin password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 font-medium"
                disabled={loading || !username || !password}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 bg-transparent"
                onClick={fillTestCredentials}
                disabled={loading}
              >
                Fill Test Credentials
              </Button>
            </form>

            {/* Development Info */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Development Mode</h3>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Environment: {process.env.NODE_ENV}</div>
                  <div>Admin Username: {process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin (fallback)"}</div>
                  <div>Password: Set via ADMIN_PASSWORD env var</div>
                  <div>Supabase: Connected to icustcymiynpwjfoogtc.supabase.co</div>
                </div>
                <div className="mt-2">
                  <a
                    href="/api/debug-auth"
                    target="_blank"
                    className="text-xs text-primary hover:underline"
                    rel="noreferrer"
                  >
                    View Auth Debug Info
                  </a>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-slate-500">Secure admin access • Digital shield protection enabled</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
