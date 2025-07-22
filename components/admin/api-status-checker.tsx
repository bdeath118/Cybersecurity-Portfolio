"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ApiStatus {
  endpoint: string
  status: "loading" | "success" | "error"
  message: string
}

export function ApiStatusChecker() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([])
  const [loadingAll, setLoadingAll] = useState(false)
  const { toast } = useToast()

  const endpoints = [
    "/api/health",
    "/api/healthz",
    "/api/projects",
    "/api/skills",
    "/api/certifications",
    "/api/ctf-events",
    "/api/digital-badges",
    "/api/site-info",
    "/api/bug-bounty",
    "/api/security-articles",
    "/api/osint-capabilities",
    "/api/integrations/status",
    "/api/under-construction",
    "/api/admin/credentials",
    "/api/login",
    "/api/debug-auth",
    // Add more API endpoints as needed
  ]

  const checkApiStatus = async (endpoint: string): Promise<ApiStatus> => {
    try {
      const response = await fetch(endpoint, { cache: "no-store" })
      if (response.ok) {
        const data = await response.json()
        return {
          endpoint,
          status: "success",
          message: `OK: ${JSON.stringify(data).substring(0, 100)}...`,
        }
      } else {
        const errorText = await response.text()
        return {
          endpoint,
          status: "error",
          message: `Error ${response.status}: ${errorText.substring(0, 100)}...`,
        }
      }
    } catch (error: any) {
      return {
        endpoint,
        status: "error",
        message: `Network Error: ${error.message || "Could not connect"}`,
      }
    }
  }

  const runAllChecks = async () => {
    setLoadingAll(true)
    setApiStatuses(endpoints.map((endpoint) => ({ endpoint, status: "loading", message: "Checking..." })))
    const results = await Promise.all(endpoints.map(checkApiStatus))
    setApiStatuses(results)
    setLoadingAll(false)
    toast({ title: "API Status Check Complete", description: "All API endpoints have been checked." })
  }

  useEffect(() => {
    runAllChecks()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Status Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Monitor the health and responsiveness of your backend API endpoints.
        </p>
        <Button onClick={runAllChecks} disabled={loadingAll} className="mb-6">
          {loadingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          {loadingAll ? "Checking All..." : "Re-check All Endpoints"}
        </Button>
        <div className="space-y-4">
          {apiStatuses.map((api) => (
            <div key={api.endpoint} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                {api.status === "loading" && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
                {api.status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {api.status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                <span className="font-medium">{api.endpoint}</span>
              </div>
              <p
                className={`text-sm ${api.status === "success" ? "text-green-600" : api.status === "error" ? "text-red-600" : "text-gray-500"}`}
              >
                {api.message}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
