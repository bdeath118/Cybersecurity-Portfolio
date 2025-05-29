"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TestResult {
  name: string
  status: "pass" | "fail" | "warning" | "pending"
  message: string
  action?: string
}

export function TestingChecklist() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()

  const testSuite = [
    {
      name: "Environment Variables",
      test: async () => {
        const response = await fetch("/api/env-check")
        const data = await response.json()
        return {
          status: data.summary?.allRequiredPresent ? "pass" : "fail",
          message: data.summary?.allRequiredPresent
            ? "All required environment variables are set"
            : `${data.summary?.missing || 0} required variables missing`,
        }
      },
    },
    {
      name: "Admin Authentication",
      test: async () => {
        try {
          const response = await fetch("/api/debug-auth")
          const data = await response.json()
          return {
            status: data.success ? "pass" : "fail",
            message: data.success ? "Authentication system working" : "Authentication system has issues",
          }
        } catch (error) {
          return {
            status: "fail",
            message: "Failed to test authentication",
          }
        }
      },
    },
    {
      name: "Site Accessibility",
      test: async () => {
        try {
          const response = await fetch("/")
          return {
            status: response.ok ? "pass" : "fail",
            message: response.ok ? "Homepage loads successfully" : "Homepage failed to load",
          }
        } catch (error) {
          return {
            status: "fail",
            message: "Failed to access homepage",
          }
        }
      },
    },
    {
      name: "API Endpoints",
      test: async () => {
        const endpoints = ["/api/projects", "/api/skills", "/api/certifications", "/api/digital-badges"]
        let passCount = 0

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint)
            if (response.ok) passCount++
          } catch (error) {
            // Endpoint failed
          }
        }

        return {
          status: passCount === endpoints.length ? "pass" : passCount > 0 ? "warning" : "fail",
          message: `${passCount}/${endpoints.length} API endpoints working`,
        }
      },
    },
    {
      name: "LinkedIn Integration",
      test: async () => {
        try {
          const response = await fetch("/api/import-settings")
          const data = await response.json()
          return {
            status: data.linkedinProfileUrl ? "pass" : "warning",
            message: data.linkedinProfileUrl
              ? "LinkedIn profile URL configured"
              : "LinkedIn integration not configured",
          }
        } catch (error) {
          return {
            status: "fail",
            message: "Failed to check LinkedIn integration",
          }
        }
      },
    },
    {
      name: "Badge Platforms",
      test: async () => {
        try {
          const response = await fetch("/api/import-settings")
          const data = await response.json()
          const configured = [data.credlyUsername, data.canvasApiKey].filter(Boolean).length
          return {
            status: configured > 0 ? "pass" : "warning",
            message: `${configured}/2 badge platforms configured`,
          }
        } catch (error) {
          return {
            status: "fail",
            message: "Failed to check badge platforms",
          }
        }
      },
    },
    {
      name: "Security Scan",
      test: async () => {
        try {
          const response = await fetch("/api/security-scan")
          const data = await response.json()
          return {
            status: data.status === "secure" ? "pass" : data.status === "warning" ? "warning" : "fail",
            message: data.message || "Security scan completed",
          }
        } catch (error) {
          return {
            status: "fail",
            message: "Failed to run security scan",
          }
        }
      },
    },
    {
      name: "Live Site Accessibility",
      test: async () => {
        try {
          const response = await fetch("https://cybersecurity-portfolio-bdeath118.vercel.app")
          return {
            status: response.ok ? "pass" : "fail",
            message: response.ok ? "Live site loads successfully" : "Live site failed to load",
          }
        } catch (error) {
          return {
            status: "fail",
            message: "Failed to access live site",
          }
        }
      },
    },
  ]

  async function runTests() {
    setIsRunning(true)
    const results: TestResult[] = []

    for (const test of testSuite) {
      try {
        const result = await test.test()
        results.push({
          name: test.name,
          status: result.status as "pass" | "fail" | "warning",
          message: result.message,
        })
      } catch (error) {
        results.push({
          name: test.name,
          status: "fail",
          message: "Test failed to execute",
        })
      }
    }

    setTests(results)
    setIsRunning(false)

    const passCount = results.filter((r) => r.status === "pass").length
    const totalCount = results.length

    toast({
      title: "Testing Complete",
      description: `${passCount}/${totalCount} tests passed`,
      variant: passCount === totalCount ? "default" : "destructive",
    })
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500 animate-spin" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return <Badge className="bg-green-500">Pass</Badge>
      case "fail":
        return <Badge variant="destructive">Fail</Badge>
      case "warning":
        return <Badge variant="secondary">Warning</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const passCount = tests.filter((t) => t.status === "pass").length
  const failCount = tests.filter((t) => t.status === "fail").length
  const warningCount = tests.filter((t) => t.status === "warning").length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          System Testing Checklist
          <Button onClick={runTests} disabled={isRunning} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "Running..." : "Run Tests"}
          </Button>
        </CardTitle>
        <CardDescription>Comprehensive testing of all portfolio features and integrations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{passCount}</div>
            <div className="text-sm text-muted-foreground">Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{failCount}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-muted-foreground">{test.message}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(test.status)}
                {test.action && (
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Fix
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href="/api/env-check" target="_blank" rel="noreferrer">
                Check Env Vars
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="/api/debug-auth" target="_blank" rel="noreferrer">
                Debug Auth
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="/" target="_blank" rel="noreferrer">
                View Site
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="/admin" target="_blank" rel="noreferrer">
                Test Login
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="https://cybersecurity-portfolio-bdeath118.vercel.app" target="_blank" rel="noreferrer">
                View Live Site
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
