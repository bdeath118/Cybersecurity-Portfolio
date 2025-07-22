"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { SiteInfo, UnderConstructionSettings } from "@/lib/types"
import { updateSiteInfo, updateUnderConstructionSettings } from "@/lib/data" // Assuming these are Server Actions or API calls

interface AdvancedSettingsManagerProps {
  initialSiteInfo: SiteInfo
  initialUnderConstructionSettings: UnderConstructionSettings
}

export function AdvancedSettingsManager({
  initialSiteInfo,
  initialUnderConstructionSettings,
}: AdvancedSettingsManagerProps) {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(initialSiteInfo)
  const [underConstructionSettings, setUnderConstructionSettings] = useState<UnderConstructionSettings>(
    initialUnderConstructionSettings,
  )
  const { toast } = useToast()

  useEffect(() => {
    setSiteInfo(initialSiteInfo)
  }, [initialSiteInfo])

  useEffect(() => {
    setUnderConstructionSettings(initialUnderConstructionSettings)
  }, [initialUnderConstructionSettings])

  const handleSiteInfoSave = async () => {
    try {
      await updateSiteInfo(siteInfo)
      toast({ title: "Success", description: "Site information updated successfully." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update site information: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleUnderConstructionSave = async () => {
    try {
      await updateUnderConstructionSettings(underConstructionSettings)
      toast({ title: "Success", description: "Under Construction settings updated successfully." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update Under Construction settings: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
      console.error("Error updating under construction settings:", error)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              value={siteInfo.site_name}
              onChange={(e) => setSiteInfo({ ...siteInfo, site_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="site-title">Site Title</Label>
            <Input
              id="site-title"
              value={siteInfo.title}
              onChange={(e) => setSiteInfo({ ...siteInfo, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea
              id="site-description"
              value={siteInfo.description}
              onChange={(e) => setSiteInfo({ ...siteInfo, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="seo-title">SEO Title</Label>
            <Input
              id="seo-title"
              value={siteInfo.seo_title}
              onChange={(e) => setSiteInfo({ ...siteInfo, seo_title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="seo-description">SEO Description</Label>
            <Textarea
              id="seo-description"
              value={siteInfo.seo_description}
              onChange={(e) => setSiteInfo({ ...siteInfo, seo_description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              value={siteInfo.keywords.join(", ")}
              onChange={(e) => setSiteInfo({ ...siteInfo, keywords: e.target.value.split(",").map((k) => k.trim()) })}
            />
          </div>
          <div>
            <Label htmlFor="site-url">Site URL</Label>
            <Input
              id="site-url"
              value={siteInfo.site_url}
              onChange={(e) => setSiteInfo({ ...siteInfo, site_url: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="social-image-url">Social Share Image URL</Label>
            <Input
              id="social-image-url"
              value={siteInfo.social_image_url}
              onChange={(e) => setSiteInfo({ ...siteInfo, social_image_url: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="avatar-url">Avatar URL</Label>
            <Input
              id="avatar-url"
              value={siteInfo.avatar_url}
              onChange={(e) => setSiteInfo({ ...siteInfo, avatar_url: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="theme-color">Theme Color (Hex)</Label>
            <Input
              id="theme-color"
              type="color"
              value={siteInfo.theme_color}
              onChange={(e) => setSiteInfo({ ...siteInfo, theme_color: e.target.value })}
            />
          </div>
          <Button onClick={handleSiteInfoSave}>Save Site Info</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Under Construction Mode</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="under-construction-enabled">Enable Under Construction Mode</Label>
            <Switch
              id="under-construction-enabled"
              checked={underConstructionSettings.enabled}
              onCheckedChange={(checked) =>
                setUnderConstructionSettings({ ...underConstructionSettings, enabled: checked })
              }
            />
          </div>
          <div>
            <Label htmlFor="under-construction-message">Message</Label>
            <Textarea
              id="under-construction-message"
              value={underConstructionSettings.message}
              onChange={(e) => setUnderConstructionSettings({ ...underConstructionSettings, message: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="under-construction-completion">Estimated Completion</Label>
            <Input
              id="under-construction-completion"
              value={underConstructionSettings.estimatedCompletion}
              onChange={(e) =>
                setUnderConstructionSettings({ ...underConstructionSettings, estimatedCompletion: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="under-construction-progress">Progress Percentage</Label>
            <Input
              id="under-construction-progress"
              type="number"
              min="0"
              max="100"
              value={underConstructionSettings.progressPercentage}
              onChange={(e) =>
                setUnderConstructionSettings({
                  ...underConstructionSettings,
                  progressPercentage: Number.parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="under-construction-admin-access">Allow Admin Access During Construction</Label>
            <Switch
              id="under-construction-admin-access"
              checked={underConstructionSettings.allowAdminAccess}
              onCheckedChange={(checked) =>
                setUnderConstructionSettings({ ...underConstructionSettings, allowAdminAccess: checked })
              }
            />
          </div>
          <Button onClick={handleUnderConstructionSave}>Save Under Construction Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}
