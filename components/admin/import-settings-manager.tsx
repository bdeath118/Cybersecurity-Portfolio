"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, CheckCircle, XCircle, AlertCircle, LogIn } from "lucide-react"
import { updateImportSettings, triggerManualImport } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import type { ImportSettings } from "@/lib/types"
import { useSearchParams } from "next/navigation"

export function ImportSettingsManager() {
  const [settings, setSettings] = useState<ImportSettings>({
    autoImportEnabled: false,
    importFrequency: "daily",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [credlyConnected, setCredlyConnected] = useState(false)
  const [canvasConnected, setCanvasConnected] = useState(false)
  const [linkedInConnected, setLinkedInConnected] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for success or error messages in URL
    const success = searchParams.get("success")
    const error = searchParams.get("error")

    if (success) {
      if (success === "credly_connected") {
        setCredlyConnected(true)
        toast({
          title: "Success",
          description: "Successfully connected to Credly",
        })
      } else if (success === "canvas_connected") {
        setCanvasConnected(true)
        toast({
          title: "Success",
          description: "Successfully connected to Canvas",
        })
      } else if (success === "linkedin_connected") {
        setLinkedInConnected(true)
        toast({
          title: "Success",
          description: "Successfully connected to LinkedIn",
        })
      }
    }

    if (error) {
      toast({
        title: "Error",
        description: "Failed to connect. Please try again.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/import-settings")
        const data = await response.json()
        setSettings(data)

        // Check connection status
        const credlyResponse = await fetch("/api/auth/credly/status")
        const credlyData = await credlyResponse.json()
        setCredlyConnected(credlyData.connected)

        const canvasResponse = await fetch("/api/auth/canvas/status")
        const canvasData = await canvasResponse.json()
        setCanvasConnected(canvasData.connected)

        const linkedInResponse = await fetch("/api/auth/linkedin/status")
        const linkedInData = await linkedInResponse.json()
        setLinkedInConnected(linkedInData.connected)
      } catch (error) {
        console.error("Error fetching import settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  async function handleSaveSettings(formData: FormData) {
    setSaving(true)
    try {
      const result = await updateImportSettings(formData)
      if (result.success) {
        setSettings(result.settings)
        toast({
          title: "Success",
          description: "Import settings updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update import settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleManualImport() {
    setImporting(true)
    try {
      const result = await triggerManualImport()
      if (result.success) {
        toast({
          title: "Success",
          description: `Import completed. ${result.imported} items imported.`,
        })
      }
    } catch (error) {
      console.error("Error during manual import:", error)
      toast({
        title: "Error",
        description: "Failed to import data",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading import settings...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto Import Settings</CardTitle>
        <CardDescription>
          Configure automatic importing of projects, skills, and badges from external platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={handleSaveSettings} className="space-y-6">
          {/* LinkedIn Integration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">LinkedIn Integration</h3>
                <p className="text-sm text-muted-foreground">Import projects and skills from your LinkedIn profile</p>
              </div>
              <div className="flex items-center gap-2">
                {linkedInConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Button variant="outline" size="sm" asChild>
                    <a href="/api/auth/linkedin/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Connect LinkedIn
                    </a>
                  </Button>
                )}
                <Switch name="linkedinEnabled" defaultChecked={settings.autoImportEnabled} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="importFrequency">Import Frequency</Label>
                <Select name="importFrequency" defaultValue={settings.importFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="manual">Manual Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Badge Platforms */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Digital Badge Platforms</h3>
              <p className="text-sm text-muted-foreground">
                Import digital badges from various certification platforms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credlyConnection">Credly</Label>
                <div className="flex items-center gap-2">
                  {credlyConnected ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Connected</span>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href="/api/auth/credly/login">
                        <LogIn className="h-4 w-4 mr-2" />
                        Connect Credly Account
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="canvasConnection">Canvas</Label>
                <div className="flex items-center gap-2">
                  {canvasConnected ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Connected</span>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href="/api/auth/canvas/login">
                        <LogIn className="h-4 w-4 mr-2" />
                        Connect Canvas Account
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Import Status */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Import Status</h3>
              <p className="text-sm text-muted-foreground">Current status and last import information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {linkedInConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <p className="text-sm font-medium">LinkedIn</p>
                  <p className="text-xs text-muted-foreground">
                    {settings.lastImport ? `Last: ${settings.lastImport}` : "Never imported"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {credlyConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <p className="text-sm font-medium">Credly</p>
                  <p className="text-xs text-muted-foreground">{credlyConnected ? "Connected" : "Not connected"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {canvasConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="text-sm font-medium">Canvas</p>
                  <p className="text-xs text-muted-foreground">{canvasConnected ? "Connected" : "Not connected"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleManualImport} disabled={importing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${importing ? "animate-spin" : ""}`} />
              {importing ? "Importing..." : "Manual Import"}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
