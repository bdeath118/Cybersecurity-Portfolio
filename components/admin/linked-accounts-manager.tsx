"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Loader2, RefreshCw } from "lucide-react"
import type { IntegrationStatus } from "@/lib/types"
import { updateIntegrationStatus, syncIntegrationData, testIntegration } from "@/lib/data" // Assuming these are Server Actions or API calls

interface LinkedAccountsManagerProps {
  initialIntegrationStatus: IntegrationStatus[]
}

export function LinkedAccountsManager({ initialIntegrationStatus }: LinkedAccountsManagerProps) {
  const [integrationStatuses, setIntegrationStatuses] = useState<IntegrationStatus[]>(initialIntegrationStatus)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIntegrationStatuses(initialIntegrationStatus)
  }, [initialIntegrationStatus])

  const handleToggleEnabled = async (platform: string, enabled: boolean) => {
    setLoading(true)
    try {
      const updatedStatus = await updateIntegrationStatus(platform, { enabled })
      setIntegrationStatuses((prev) => prev.map((s) => (s.platform === platform ? updatedStatus : s)))
      toast({ title: "Success", description: `${platform} integration ${enabled ? "enabled" : "disabled"}.` })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update ${platform} status: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async (platform: string) => {
    setLoading(true)
    setIntegrationStatuses((prev) =>
      prev.map((s) => (s.platform === platform ? { ...s, status: "syncing", message: "Syncing..." } : s)),
    )
    try {
      const result = await syncIntegrationData(platform)
      setIntegrationStatuses((prev) =>
        prev.map((s) =>
          s.platform === platform
            ? {
                ...s,
                status: result.success ? "success" : "error",
                message: result.message,
                last_synced: result.success ? new Date().toISOString() : s.last_synced,
              }
            : s,
        ),
      )
      if (result.success) {
        toast({ title: "Sync Successful", description: result.message })
      } else {
        toast({ title: "Sync Failed", description: result.message, variant: "destructive" })
      }
    } catch (error: any) {
      setIntegrationStatuses((prev) =>
        prev.map((s) =>
          s.platform === platform
            ? { ...s, status: "error", message: `An unexpected error occurred: ${error.message}` }
            : s,
        ),
      )
      toast({
        title: "Sync Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async (platform: string) => {
    setLoading(true)
    setIntegrationStatuses((prev) =>
      prev.map((s) => (s.platform === platform ? { ...s, status: "testing", message: "Testing connection..." } : s)),
    )
    try {
      const result = await testIntegration(platform)
      setIntegrationStatuses((prev) =>
        prev.map((s) =>
          s.platform === platform ? { ...s, status: result.success ? "success" : "error", message: result.message } : s,
        ),
      )
      if (result.success) {
        toast({ title: "Test Successful", description: result.message })
      } else {
        toast({ title: "Test Failed", description: result.message, variant: "destructive" })
      }
    } catch (error: any) {
      setIntegrationStatuses((prev) =>
        prev.map((s) =>
          s.platform === platform
            ? { ...s, status: "error", message: `An unexpected error occurred during test: ${error.message}` }
            : s,
        ),
      )
      toast({
        title: "Test Error",
        description: `An unexpected error occurred during test: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Linked Accounts & Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Manage connections to external platforms to automatically import data for your portfolio.
        </p>
        <div className="space-y-6">
          {integrationStatuses.map((integration) => (
            <div
              key={integration.platform}
              className="border rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold capitalize">{integration.platform}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      integration.status === "success"
                        ? "text-green-600"
                        : integration.status === "error"
                          ? "text-red-600"
                          : integration.status === "syncing" || integration.status === "testing"
                            ? "text-blue-600"
                            : "text-yellow-600"
                    }`}
                  >
                    {integration.status}
                  </span>
                </p>
                {integration.last_synced && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last Synced: {new Date(integration.last_synced).toLocaleString()}
                  </p>
                )}
                {integration.message && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Message: {integration.message}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`${integration.platform}-enabled`}
                    checked={integration.enabled}
                    onCheckedChange={(checked) => handleToggleEnabled(integration.platform, checked)}
                    disabled={loading}
                  />
                  <Label htmlFor={`${integration.platform}-enabled`}>Enabled</Label>
                </div>
                <Button
                  onClick={() => handleSync(integration.platform)}
                  disabled={loading || !integration.enabled || integration.status === "syncing"}
                  className="w-full sm:w-auto"
                >
                  {integration.status === "syncing" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {integration.status === "syncing" ? "Syncing..." : "Sync Now"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestConnection(integration.platform)}
                  disabled={loading || integration.status === "testing"}
                  className="w-full sm:w-auto"
                >
                  {integration.status === "testing" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  {integration.status === "testing" ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
