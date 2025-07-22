"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { UnderConstructionSettings } from "@/lib/types"
import { updateUnderConstructionSettings } from "@/lib/data" // Assuming this is a Server Action or API call

interface UnderConstructionManagerProps {
  initialUnderConstructionSettings: UnderConstructionSettings
}

export function UnderConstructionManager({ initialUnderConstructionSettings }: UnderConstructionManagerProps) {
  const [settings, setSettings] = useState<UnderConstructionSettings>(initialUnderConstructionSettings)
  const { toast } = useToast()

  useEffect(() => {
    setSettings(initialUnderConstructionSettings)
  }, [initialUnderConstructionSettings])

  const handleSave = async () => {
    try {
      await updateUnderConstructionSettings(settings)
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Under Construction Mode</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="under-construction-enabled">Enable Under Construction Mode</Label>
          <Switch
            id="under-construction-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
          />
        </div>
        <div>
          <Label htmlFor="under-construction-message">Message</Label>
          <Textarea
            id="under-construction-message"
            value={settings.message}
            onChange={(e) => setSettings({ ...settings, message: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="under-construction-completion">Estimated Completion</Label>
          <Input
            id="under-construction-completion"
            value={settings.estimatedCompletion}
            onChange={(e) => setSettings({ ...settings, estimatedCompletion: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="under-construction-progress">Progress Percentage</Label>
          <Input
            id="under-construction-progress"
            type="number"
            min="0"
            max="100"
            value={settings.progressPercentage}
            onChange={(e) =>
              setSettings({
                ...settings,
                progressPercentage: Number.parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="under-construction-admin-access">Allow Admin Access During Construction</Label>
          <Switch
            id="under-construction-admin-access"
            checked={settings.allowAdminAccess}
            onCheckedChange={(checked) => setSettings({ ...settings, allowAdminAccess: checked })}
          />
        </div>
        <Button onClick={handleSave}>Save Under Construction Settings</Button>
      </CardContent>
    </Card>
  )
}
