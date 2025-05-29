"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, Database, Globe, Download, Upload, Trash2, AlertTriangle, CheckCircle } from "lucide-react"
import { updateAdvancedSettings, exportData, runSecurityScan } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export function AdvancedSettingsManager() {
  const [settings, setSettings] = useState({
    siteUrl: "",
    enableAnalytics: false,
    enableSEO: true,
    customCSS: "",
    customJS: "",
    maintenanceMode: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [securityStatus, setSecurityStatus] = useState<"unknown" | "secure" | "warning" | "error">("unknown")
  const { toast } = useToast()

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/advanced-settings")
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error("Error fetching advanced settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  async function handleSaveSettings(formData: FormData) {
    setSaving(true)
    try {
      const result = await updateAdvancedSettings(formData)
      if (result.success) {
        setSettings(result.settings)
        toast({
          title: "Success",
          description: "Advanced settings updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update advanced settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleExportData() {
    try {
      const result = await exportData()
      if (result.success) {
        // Create download link
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`
        a.click()
        URL.revokeObjectURL(url)

        toast({
          title: "Success",
          description: "Data exported successfully",
        })
      }
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      })
    }
  }

  async function handleSecurityScan() {
    try {
      const result = await runSecurityScan()
      setSecurityStatus(result.status)

      toast({
        title: result.status === "secure" ? "Security Scan Complete" : "Security Issues Found",
        description: result.message,
        variant: result.status === "secure" ? "default" : "destructive",
      })
    } catch (error) {
      console.error("Error running security scan:", error)
      setSecurityStatus("error")
      toast({
        title: "Error",
        description: "Failed to run security scan",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading advanced settings...</div>
  }

  return (
    <div className="space-y-6">
      {/* Site Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Site Configuration
          </CardTitle>
          <CardDescription>Configure global site settings and URLs</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  name="siteUrl"
                  placeholder="https://your-domain.com"
                  defaultValue={settings.siteUrl}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enableAnalytics">Enable Analytics</Label>
                <Switch name="enableAnalytics" defaultChecked={settings.enableAnalytics} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customCSS">Custom CSS</Label>
              <Textarea
                id="customCSS"
                name="customCSS"
                placeholder="/* Add your custom CSS here */"
                rows={6}
                defaultValue={settings.customCSS}
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security & Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Maintenance
          </CardTitle>
          <CardDescription>Security scanning and maintenance tools</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Security Status</h3>
              <p className="text-sm text-muted-foreground">Run security scan to check for vulnerabilities</p>
            </div>
            <div className="flex items-center gap-2">
              {securityStatus === "secure" && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Secure
                </Badge>
              )}
              {securityStatus === "warning" && (
                <Badge variant="secondary">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Warnings
                </Badge>
              )}
              {securityStatus === "error" && (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Issues Found
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={handleSecurityScan}>
                Run Scan
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Maintenance Mode</h3>
              <p className="text-sm text-muted-foreground">Enable to show maintenance page to visitors</p>
            </div>
            <Switch name="maintenanceMode" defaultChecked={settings.maintenanceMode} />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export, import, and manage your portfolio data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Data Export Information</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Exports all projects, skills, certifications, and badges</li>
              <li>• Includes site configuration and theme settings</li>
              <li>• Data is exported in JSON format</li>
              <li>• Can be used for backup or migration purposes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
