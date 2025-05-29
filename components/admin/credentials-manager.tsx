"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Save, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
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
}

export function CredentialsManager() {
  const [credentials, setCredentials] = useState<AllCredentials>({
    linkedin: { clientId: "", clientSecret: "", configured: false },
    credly: { clientId: "", clientSecret: "", configured: false },
    canvas: { clientId: "", clientSecret: "", configured: false },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCredentials() {
      try {
        const response = await fetch("/api/admin/credentials")
        const data = await response.json()
        setCredentials(data)
      } catch (error) {
        console.error("Error fetching credentials:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCredentials()
  }, [])

  async function handleSaveCredentials(platform: string, formData: FormData) {
    setSaving(platform)
    try {
      const response = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform,
          clientId: formData.get("clientId"),
          clientSecret: formData.get("clientSecret"),
        }),
      })

      if (response.ok) {
        const updatedCredentials = await response.json()
        setCredentials((prev) => ({
          ...prev,
          [platform]: updatedCredentials[platform],
        }))
        toast({
          title: "Success",
          description: `${platform} credentials saved successfully`,
        })
      } else {
        throw new Error("Failed to save credentials")
      }
    } catch (error) {
      console.error("Error saving credentials:", error)
      toast({
        title: "Error",
        description: "Failed to save credentials",
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
    return <div className="text-center py-8">Loading credentials...</div>
  }

  const platforms = [
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "Connect to LinkedIn to import professional projects and skills",
      docsUrl: "https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow",
      setupSteps: [
        "Go to LinkedIn Developer Portal",
        "Create a new app",
        "Add redirect URI: https://cybersecurity-portfolio-bdeath118.vercel.app/api/auth/linkedin/callback",
        "Copy Client ID and Client Secret",
      ],
    },
    {
      id: "credly",
      name: "Credly",
      description: "Connect to Credly to import digital badges and certifications",
      docsUrl: "https://developers.credly.com/",
      setupSteps: [
        "Go to Credly Developer Portal",
        "Create a new application",
        "Add redirect URI: https://cybersecurity-portfolio-bdeath118.vercel.app/api/auth/credly/callback",
        "Copy Client ID and Client Secret",
      ],
    },
    {
      id: "canvas",
      name: "Canvas LMS",
      description: "Connect to Canvas to import learning achievements and badges",
      docsUrl: "https://canvas.instructure.com/doc/api/",
      setupSteps: [
        "Go to your Canvas instance Developer Keys",
        "Create a new developer key",
        "Add redirect URI: https://cybersecurity-portfolio-bdeath118.vercel.app/api/auth/canvas/callback",
        "Copy Client ID and Client Secret",
      ],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Credentials</CardTitle>
        <CardDescription>
          Configure OAuth credentials for external platform integrations. These are stored securely and used for
          authentication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="linkedin" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {platforms.map((platform) => (
              <TabsTrigger key={platform.id} value={platform.id} className="flex items-center gap-2">
                {credentials[platform.id as keyof AllCredentials].configured ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                {platform.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {platforms.map((platform) => (
            <TabsContent key={platform.id} value={platform.id} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{platform.name} Integration</h3>
                  <p className="text-sm text-muted-foreground">{platform.description}</p>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Setup Instructions:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {platform.setupSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                      <Button variant="outline" size="sm" asChild className="mt-2">
                        <a href={platform.docsUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Documentation
                        </a>
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>

                <form action={(formData) => handleSaveCredentials(platform.id, formData)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${platform.id}-clientId`}>Client ID</Label>
                      <Input
                        id={`${platform.id}-clientId`}
                        name="clientId"
                        placeholder="Enter Client ID"
                        defaultValue={credentials[platform.id as keyof AllCredentials].clientId}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${platform.id}-clientSecret`}>Client Secret</Label>
                      <div className="relative">
                        <Input
                          id={`${platform.id}-clientSecret`}
                          name="clientSecret"
                          type={showSecrets[platform.id] ? "text" : "password"}
                          placeholder="Enter Client Secret"
                          defaultValue={credentials[platform.id as keyof AllCredentials].clientSecret}
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
                      {credentials[platform.id as keyof AllCredentials].configured ? (
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

                {credentials[platform.id as keyof AllCredentials].configured && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Credentials are configured! You can now use the "Connect {platform.name}" button in the Import
                      Settings to authenticate with your account.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
