"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { syncIntegrationData, testIntegration } from "@/lib/actions" // Assuming these are Server Actions

interface ImportSettingsManagerProps {
  initialIntegrationStatus: {
    platform: string
    enabled: boolean
    last_synced: string | null
    status: "idle" | "syncing" | "success" | "error"
    message: string | null
  }[]
}

export function ImportSettingsManager({ initialIntegrationStatus }: ImportSettingsManagerProps) {
  const [integrationStatus, setIntegrationStatus] = useState(initialIntegrationStatus)
  const [isSyncing, setIsSyncing] = useState(false)
  const [testResults, setTestResults] = useState<{ platform: string; success: boolean; message: string } | null>(null)
  const { toast } = useToast()

  const handleSync = async (platform: string) => {
    setIsSyncing(true)
    setIntegrationStatus((prev) =>
      prev.map((s) => (s.platform === platform ? { ...s, status: "syncing", message: "Syncing..." } : s)),
    )
    try {
      const result = await syncIntegrationData(platform)
      if (result.success) {
        setIntegrationStatus((prev) =>
          prev.map((s) =>
            s.platform === platform
              ? { ...s, status: "success", message: result.message, last_synced: new Date().toISOString() }
              : s,
          ),
        )
        toast({ title: "Sync Successful", description: result.message })
      } else {
        setIntegrationStatus((prev) =>
          prev.map((s) => (s.platform === platform ? { ...s, status: "error", message: result.message } : s)),
        )
        toast({ title: "Sync Failed", description: result.message, variant: "destructive" })
      }
    } catch (error: any) {
      setIntegrationStatus((prev) =>
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
      setIsSyncing(false)
    }
  }

  const handleTestIntegration = async (platform: string) => {
    setTestResults({ platform, success: false, message: "Testing..." })
    try {
      const result = await testIntegration(platform)
      setTestResults({ platform, success: result.success, message: result.message })
      if (result.success) {
        toast({ title: "Test Successful", description: result.message })
      } else {
        toast({ title: "Test Failed", description: result.message, variant: "destructive" })
      }
    } catch (error: any) {
      setTestResults({ platform, success: false, message: `An unexpected error occurred: ${error.message}` })
      toast({
        title: "Test Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Integration & Import Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Manage and synchronize data from external platforms like Credly, LinkedIn, GitHub, and HackerOne.
        </p>
        <div className="space-y-6">
          {integrationStatus.map((integration) => (
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
                <Button
                  onClick={() => handleSync(integration.platform)}
                  disabled={isSyncing || !integration.enabled}
                  className="w-full sm:w-auto"
                >
                  {isSyncing && integration.status === "syncing" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Sync Now
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setTestResults(null)} // Clear previous results
                      className="w-full sm:w-auto"
                    >
                      Test Connection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Test {integration.platform} Connection</DialogTitle>
                      <DialogDescription>
                        This will attempt to connect to the {integration.platform} API using your configured
                        credentials.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Button
                        onClick={() => handleTestIntegration(integration.platform)}
                        disabled={testResults?.message === "Testing..."}
                      >
                        {testResults?.message === "Testing..." ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          "Run Test"
                        )}
                      </Button>
                      {testResults && testResults.platform === integration.platform && (
                        <div
                          className={`mt-4 p-3 rounded-md ${testResults.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          <div className="flex items-center gap-2">
                            {testResults.success ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                            <p className="font-medium">{testResults.success ? "Test Succeeded!" : "Test Failed!"}</p>
                          </div>
                          <p className="text-sm mt-1">{testResults.message}</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
