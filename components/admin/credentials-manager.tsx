"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Save, ExternalLink, CheckCircle, AlertCircle, Shield, Bug, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PlatformCredentials {
  clientId: string
  clientSecret: string
  configured: boolean
}

interface AllCredentials {
  linkedin: PlatformCredentials
  credly: PlatformCredentials
  canvas: PlatformCredentials
  ctftime: PlatformCredentials
  hackerone: PlatformCredentials
  bugcrowd: PlatformCredentials
  medium: PlatformCredentials
  shodan: PlatformCredentials
}

const defaultCredentials: AllCredentials = {
  linkedin: { clientId: "", clientSecret: "", configured: false },
  credly: { clientId: "", clientSecret: "", configured: false },
  canvas: { clientId: "", clientSecret: "", configured: false },
  ctftime: { clientId: "", clientSecret: "", configured: false },
  hackerone: { clientId: "", clientSecret: "", configured: false },
  bugcrowd: { clientId: "", clientSecret: "", configured: false },
  medium: { clientId: "", clientSecret: "", configured: false },
  shodan: { clientId: "", clientSecret: "", configured: false },
}

export function CredentialsManager() {
  const [credentials, setCredentials] = useState<AllCredentials>(defaultCredentials)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCredentials() {
      try {
        setError(null)
        console.log("Fetching credentials...")

        const response = await fetch("/api/admin/credentials", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
        })

        console.log("Response status:", response.status)
        console.log("Response headers:", Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const contentType = response.headers.get("content-type")
        console.log("Content-Type:", contentType)

        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text()
          console.error("Non-JSON response:", text)
          throw new Error(`Expected JSON, got: ${contentType}`)
        }

        const data = await response.json()
        console.log("Received data:", data)

        // Ensure we have valid data structure
        if (data && typeof data === "object") {
          const validatedCredentials = { ...defaultCredentials }

          // Safely merge the received data
          Object.keys(defaultCredentials).forEach((platform) => {
            if (data[platform] && typeof data[platform] === "object") {
              validatedCredentials[platform as keyof AllCredentials] = {
                clientId: data[platform].clientId || "",
                clientSecret: data[platform].clientSecret || "",
                configured: Boolean(data[platform].configured),
              }
            }
          })

          setCredentials(validatedCredentials)
        } else {
          console.warn("Invalid data structure, using defaults")
          setCredentials(defaultCredentials)
        }
      } catch (error) {
        console.error("Error fetching credentials:", error)
        setError(`Failed to load credentials: ${error instanceof Error ? error.message : "Unknown error"}`)
        setCredentials(defaultCredentials)
      } finally {
        setLoading(false)
      }
    }

    fetchCredentials()
  }, [])

  async function handleSaveCredentials(platform: string, formData: FormData) {
    setSaving(platform)
    setError(null)

    try {
      const response = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          platform,
          clientId: formData.get("clientId"),
          clientSecret: formData.get("clientSecret"),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }

      const updatedCredentials = await response.json()

      if (updatedCredentials && typeof updatedCredentials === "object") {
        setCredentials((prev) => ({
          ...prev,
          [platform]: updatedCredentials[platform] || prev[platform as keyof AllCredentials],
        }))

        toast({
          title: "Success",
          description: `${platform} credentials saved successfully`,
        })
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error saving credentials:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(`Failed to save credentials: ${errorMessage}`)
      toast({
        title: "Error",
        description: `Failed to save credentials: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  const toggleShowSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">Loading credentials...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Credentials</CardTitle>
          <CardDescription>Configure OAuth credentials for cybersecurity platform integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const platformCategories = [
    {
      name: "Professional",
      icon: Shield,
      platforms: [
        {
          id: "linkedin",
          name: "LinkedIn",
          description: "Import professional projects and skills",
          docsUrl: "https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow",
        },
        {
          id: "credly",
          name: "Credly",
          description: "Import digital badges and certifications",
          docsUrl: "https://developers.credly.com/",
        },
        {
          id: "canvas",
          name: "Canvas LMS",
          description: "Import learning achievements and badges",
          docsUrl: "https://canvas.instructure.com/doc/api/",
        },
      ],
    },
    {
      name: "CTF & Security",
      icon: Bug,
      platforms: [
        {
          id: "ctftime",
          name: "CTFtime",
          description: "Import CTF competition results and rankings",
          docsUrl: "https://ctftime.org/api/",
        },
        {
          id: "hackerone",
          name: "HackerOne",
          description: "Import bug bounty findings and reputation",
          docsUrl: "https://api.hackerone.com/",
        },
        {
          id: "bugcrowd",
          name: "Bugcrowd",
          description: "Import vulnerability discoveries and bounties",
          docsUrl: "https://docs.bugcrowd.com/",
        },
      ],
    },
    {
      name: "Content & OSINT",
      icon: FileText,
      platforms: [
        {
          id: "medium",
          name: "Medium",
          description: "Import security articles and publications",
          docsUrl: "https://github.com/Medium/medium-api-docs",
        },
        {
          id: "shodan",
          name: "Shodan",
          description: "Demonstrate OSINT and reconnaissance skills",
          docsUrl: "https://developer.shodan.io/",
        },
      ],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Cybersecurity Platform Credentials
        </CardTitle>
        <CardDescription>
          Configure OAuth credentials for cybersecurity platform integrations. These are stored securely and used for
          authentication with external services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="Professional" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {platformCategories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger key={category.name} value={category.name} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {category.name}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {platformCategories.map((category) => (
            <TabsContent key={category.name} value={category.name} className="space-y-6">
              {category.platforms.map((platform) => (
                <Card key={platform.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {credentials[platform.id as keyof AllCredentials]?.configured ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                          {platform.name}
                        </CardTitle>
                        <CardDescription>{platform.description}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={platform.docsUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Docs
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form action={(formData) => handleSaveCredentials(platform.id, formData)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${platform.id}-clientId`}>Client ID / API Key</Label>
                          <Input
                            id={`${platform.id}-clientId`}
                            name="clientId"
                            placeholder="Enter Client ID or API Key"
                            defaultValue={credentials[platform.id as keyof AllCredentials]?.clientId || ""}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${platform.id}-clientSecret`}>Client Secret / API Secret</Label>
                          <div className="relative">
                            <Input
                              id={`${platform.id}-clientSecret`}
                              name="clientSecret"
                              type={showSecrets[platform.id] ? "text" : "password"}
                              placeholder="Enter Client Secret or API Secret"
                              defaultValue={credentials[platform.id as keyof AllCredentials]?.clientSecret || ""}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => toggleShowSecret(platform.id)}
                            >
                              {showSecrets[platform.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {credentials[platform.id as keyof AllCredentials]?.configured ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-sm text-green-600">Configured</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-5 w-5 text-yellow-500" />
                              <span className="text-sm text-yellow-600">Not configured</span>
                            </>
                          )}
                        </div>
                        <Button type="submit" disabled={saving === platform.id}>
                          <Save className="h-4 w-4 mr-2" />
                          {saving === platform.id ? "Saving..." : "Save Credentials"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
