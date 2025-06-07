"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Construction, AlertTriangle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UnderConstructionSettings {
  enabled: boolean
  message: string
  estimatedCompletion: string
  progressPercentage: number
  allowAdminAccess: boolean
}

export function UnderConstructionManager() {
  const [settings, setSettings] = useState<UnderConstructionSettings>({
    enabled: false,
    message: "We're working hard to bring you something amazing.",
    estimatedCompletion: "Soon",
    progressPercentage: 75,
    allowAdminAccess: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const response = await fetch("/api/under-construction")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to load under construction settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const response = await fetch("/api/under-construction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Under construction settings updated successfully",
        })
      } else {
        throw new Error(data.error || "Failed to update settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save under construction settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  function toggleConstructionMode() {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }))
  }

  if (loading) {
    return <div className="text-center py-8">Loading under construction settings...</div>
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Under Construction Mode
            {settings.enabled ? (
              <Badge variant="destructive" className="ml-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="default" className="ml-2 bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Inactive
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {settings.enabled
              ? "Your site is currently showing the under construction page to visitors"
              : "Your site is live and accessible to all visitors"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Construction Mode Status</h3>
              <p className="text-sm text-muted-foreground">
                {settings.enabled ? "Site is in maintenance mode" : "Site is publicly accessible"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {settings.enabled && (
                <Button variant="outline" size="sm" asChild>
                  <a href="/under-construction" target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Page
                  </a>
                </Button>
              )}
              <Button onClick={toggleConstructionMode} variant={settings.enabled ? "destructive" : "default"} size="sm">
                {settings.enabled ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Disable
                  </>
                ) : (
                  <>
                    <Construction className="h-4 w-4 mr-2" />
                    Enable
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Construction Page Configuration</CardTitle>
          <CardDescription>Customize the message and appearance of your under construction page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Display Message</Label>
            <Textarea
              id="message"
              placeholder="Enter the message to display to visitors"
              value={settings.message}
              onChange={(e) => setSettings((prev) => ({ ...prev, message: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Estimated Completion */}
          <div className="space-y-2">
            <Label htmlFor="completion">Estimated Completion</Label>
            <Input
              id="completion"
              placeholder="e.g., Soon, 2 weeks, January 2024"
              value={settings.estimatedCompletion}
              onChange={(e) => setSettings((prev) => ({ ...prev, estimatedCompletion: e.target.value }))}
            />
          </div>

          {/* Progress Percentage */}
          <div className="space-y-4">
            <Label>Progress Percentage: {settings.progressPercentage}%</Label>
            <Slider
              value={[settings.progressPercentage]}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, progressPercentage: value[0] }))}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${settings.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Admin Access */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Allow Admin Access</h3>
              <p className="text-sm text-muted-foreground">Show admin login button on construction page</p>
            </div>
            <Switch
              checked={settings.allowAdminAccess}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, allowAdminAccess: checked }))}
            />
          </div>

          {/* Save Button */}
          <Button onClick={saveSettings} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
        </CardContent>
      </Card>

      {/* Warning Card */}
      {settings.enabled && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-5 w-5" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-yellow-800 dark:text-yellow-200">
              <p className="font-medium">Under Construction Mode is Currently Active</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>All visitors will see the under construction page</li>
                <li>Only admin users can access the full site</li>
                <li>Search engines will not index the site content</li>
                <li>Remember to disable this mode when ready to go live</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
