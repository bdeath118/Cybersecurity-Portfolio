"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, XCircle, Clock, Play, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface APIEndpoint {
  name: string
  path: string
  method: string
  description: string
  critical: boolean
}

interface TestResult {
  endpoint: string
  status: "pending" | "success" | "error"
  responseTime?: number
  statusCode?: number
  error?: string
}

const API_ENDPOINTS: APIEndpoint[] = [
  // Core Content APIs
  {
    name: "Site Information",
    path: "/api/site-info",
    method: "GET",
    description: "Site configuration and personal info",
    critical: true,
  },
  { name: "Projects", path: "/api/projects", method: "GET", description: "Portfolio projects data", critical: true },
  { name: "Skills", path: "/api/skills", method: "GET", description: "Technical skills data", critical: true },
  {
    name: "Certifications",
    path: "/api/certifications",
    method: "GET",
    description: "Professional certifications",
    critical: true,
  },
  {
    name: "CTF Events",
    path: "/api/ctf-events",
    method: "GET",
    description: "Capture The Flag events",
    critical: true,
  },
  {
    name: "Digital Badges",
    path: "/api/digital-badges",
    method: "GET",
    description: "Achievement badges",
    critical: true,
  },

  // Construction Mode API
  {
    name: "Under Construction",
    path: "/api/under-construction",
    method: "GET",
    description: "Construction mode settings",
    critical: true,
  },

  // Advanced Features
  {
    name: "Advanced Settings",
    path: "/api/advanced-settings",
    method: "GET",
    description: "Advanced site configuration",
    critical: false,
  },
  {
    name: "Import Settings",
    path: "/api/import-settings",
    method: "GET",
    description: "Data import configuration",
    critical: false,
  },
  { name: "Bug Bounty", path: "/api/bug-bounty", method: "GET", description: "Bug bounty findings", critical: false },
  {
    name: "Security Articles",
    path: "/api/security-articles",
    method: "GET",
    description: "Security research articles",
    critical: false,
  },
  {
    name: "OSINT Capabilities",
    path: "/api/osint-capabilities",
    method: "GET",
    description: "OSINT tools and capabilities",
    critical: false,
  },

  // Integration Status
  {
    name: "Integration Status",
    path: "/api/integrations/status",
    method: "GET",
    description: "External integration status",
    critical: false,
  },
  {
    name: "LinkedIn Status",
    path: "/api/auth/linkedin/status",
    method: "GET",
    description: "LinkedIn integration status",
    critical: false,
  },
  {
    name: "Credly Status",
    path: "/api/auth/credly/status",
    method: "GET",
    description: "Credly integration status",
    critical: false,
  },
  {
    name: "GitHub Status",
    path: "/api/auth/github/status",
    method: "GET",
    description: "GitHub integration status",
    critical: false,
  },

  // System Health
  { name: "Health Check", path: "/api/health", method: "GET", description: "Basic system health", critical: true },
  {
    name: "Health Monitor",
    path: "/api/healthz",
    method: "GET",
    description: "Detailed health monitoring",
    critical: true,
  },
  {
    name: "Environment Check",
    path: "/api/env-check",
    method: "GET",
    description: "Environment variables validation",
    critical: true,
  },
  {
    name: "Security Scan",
    path: "/api/security-scan",
    method: "GET",
    description: "Security configuration check",
    critical: false,
  },
  {
    name: "Deployment Status",
    path: "/api/deployment-status",
    method: "GET",
    description: "Deployment health status",
    critical: false,
  },
]

export function APIStatusChecker() {
  const [results, setResults] = useState<Record<string, TestResult>>({})
  const [testing, setTesting] = useState(false)
  const { toast } = useToast()

  async function testEndpoint(endpoint: APIEndpoint): Promise<TestResult> {
    const startTime = Date.now()

    try {
      const response = await fetch(endpoint.path, {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
      })

      const responseTime = Date.now() - startTime

      return {
        endpoint: endpoint.path,
        status: response.ok ? "success" : "error",
        responseTime,
        statusCode: response.status,
        error: response.ok ? undefined : `HTTP ${response.status}`,
      }
    } catch (error) {
      return {
        endpoint: endpoint.path,
        status: "error",
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async function runAllTests() {
    setTesting(true)
    setResults({})

    // Initialize all endpoints as pending
    const initialResults: Record<string, TestResult> = {}
    API_ENDPOINTS.forEach((endpoint) => {
      initialResults[endpoint.path] = {
        endpoint: endpoint.path,
        status: "pending",
      }
    })
    setResults(initialResults)

    try {
      // Test endpoints in parallel
      const testPromises = API_ENDPOINTS.map(async (endpoint) => {
        const result = await testEndpoint(endpoint)
        setResults((prev) => ({
          ...prev,
          [endpoint.path]: result,
        }))
        return result
      })

      await Promise.all(testPromises)

      const allResults = await Promise.all(testPromises)
      const successCount = allResults.filter((r) => r.status === "success").length
      const totalCount = allResults.length

      toast({
        title: "API Testing Complete",
        description: `${successCount}/${totalCount} endpoints are working correctly`,
        variant: successCount === totalCount ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Testing Error",
        description: "Failed to complete API testing",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  function getStatusIcon(status: TestResult["status"]) {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  function getStatusBadge(status: TestResult["status"]) {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-500">
            OK
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "pending":
        return <Badge variant="secondary">Testing...</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const criticalEndpoints = API_ENDPOINTS.filter((e) => e.critical)
  const nonCriticalEndpoints = API_ENDPOINTS.filter((e) => !e.critical)

  const criticalResults = criticalEndpoints.map((e) => results[e.path]).filter(Boolean)
  const criticalSuccess = criticalResults.filter((r) => r.status === "success").length
  const criticalTotal = criticalEndpoints.length

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            API Status During Construction Mode
          </CardTitle>
          <CardDescription>
            Verify that all admin API operations work correctly when the site is in construction mode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Critical APIs: {criticalSuccess}/{criticalTotal} working
              </p>
              <p className="text-sm text-muted-foreground">
                Total APIs: {Object.values(results).filter((r) => r.status === "success").length}/{API_ENDPOINTS.length}{" "}
                working
              </p>
            </div>
            <Button onClick={runAllTests} disabled={testing}>
              {testing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Critical APIs */}
      <Card>
        <CardHeader>
          <CardTitle>Critical APIs</CardTitle>
          <CardDescription>Essential endpoints that must work during construction mode</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {criticalEndpoints.map((endpoint) => {
                const result = results[endpoint.path]
                return (
                  <div key={endpoint.path} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result?.status)}
                      <div>
                        <p className="font-medium">{endpoint.name}</p>
                        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {result?.responseTime && (
                        <span className="text-xs text-muted-foreground">{result.responseTime}ms</span>
                      )}
                      {getStatusBadge(result?.status)}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Non-Critical APIs */}
      <Card>
        <CardHeader>
          <CardTitle>Additional APIs</CardTitle>
          <CardDescription>Optional endpoints for enhanced functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {nonCriticalEndpoints.map((endpoint) => {
                const result = results[endpoint.path]
                return (
                  <div key={endpoint.path} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result?.status)}
                      <div>
                        <p className="font-medium">{endpoint.name}</p>
                        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {result?.responseTime && (
                        <span className="text-xs text-muted-foreground">{result.responseTime}ms</span>
                      )}
                      {getStatusBadge(result?.status)}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
