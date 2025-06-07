"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Play, Bug } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TestCase {
  id: string
  name: string
  description: string
  category: "critical" | "important" | "optional"
  test: () => Promise<TestResult>
}

interface TestResult {
  status: "pending" | "success" | "warning" | "error"
  message: string
  details?: string
  fix?: string
}

interface TestSuite {
  name: string
  tests: TestCase[]
  color: string
}

export function ComprehensiveTesting() {
  const [results, setResults] = useState<Record<string, TestResult>>({})
  const [testing, setTesting] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const testSuites: TestSuite[] = [
    {
      name: "Core Functionality",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      tests: [
        {
          id: "homepage-load",
          name: "Homepage Loading",
          description: "Verify homepage loads correctly",
          category: "critical",
          test: async () => {
            try {
              const response = await fetch("/")
              if (response.ok) {
                return { status: "success", message: "Homepage loads successfully" }
              }
              return {
                status: "error",
                message: "Homepage failed to load",
                details: `HTTP ${response.status}`,
                fix: "Check server configuration and routing",
              }
            } catch (error) {
              return {
                status: "error",
                message: "Network error",
                details: error instanceof Error ? error.message : "Unknown error",
                fix: "Check network connectivity and server status",
              }
            }
          },
        },
        {
          id: "admin-auth",
          name: "Admin Authentication",
          description: "Verify admin login system works",
          category: "critical",
          test: async () => {
            try {
              const response = await fetch("/api/auth/verify")
              if (response.ok) {
                return { status: "success", message: "Authentication system is working" }
              }
              return {
                status: "warning",
                message: "Authentication endpoint accessible but may need login",
                fix: "Ensure admin credentials are properly configured",
              }
            } catch (error) {
              return {
                status: "error",
                message: "Authentication system error",
                details: error instanceof Error ? error.message : "Unknown error",
                fix: "Check authentication configuration and database connection",
              }
            }
          },
        },
        {
          id: "site-info-api",
          name: "Site Information API",
          description: "Test site information retrieval",
          category: "critical",
          test: async () => {
            try {
              const response = await fetch("/api/site-info")
              if (response.ok) {
                const data = await response.json()
                if (data && typeof data === "object") {
                  return { status: "success", message: "Site information API working correctly" }
                }
                return {
                  status: "warning",
                  message: "API returns empty or invalid data",
                  fix: "Check site information configuration in admin dashboard",
                }
              }
              return {
                status: "error",
                message: "Site information API failed",
                details: `HTTP ${response.status}`,
                fix: "Check API route implementation and database connection",
              }
            } catch (error) {
              return {
                status: "error",
                message: "Site information API error",
                details: error instanceof Error ? error.message : "Unknown error",
                fix: "Check API route configuration and server logs",
              }
            }
          },
        },
      ],
    },
    {
      name: "Content Management",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      tests: [
        {
          id: "projects-api",
          name: "Projects API",
          description: "Test projects data management",
          category: "important",
          test: async () => {
            try {
              const response = await fetch("/api/projects")
              if (response.ok) {
                return { status: "success", message: "Projects API working correctly" }
              }
              return {
                status: "error",
                message: "Projects API failed",
                details: `HTTP ${response.status}`,
                fix: "Check projects API route and data storage",
              }
            } catch (error) {
              return {
                status: "error",
                message: "Projects API error",
                details: error instanceof Error ? error.message : "Unknown error",
                fix: "Check API implementation and database connection",
              }
            }
          },
        },
        {
          id: "skills-api",
          name: "Skills API",
          description: "Test skills data management",
          category: "important",
          test: async () => {
            try {
              const response = await fetch("/api/skills")
              if (response.ok) {
                return { status: "success", message: "Skills API working correctly" }
              }
              return {
                status: "error",
                message: "Skills API failed",
                details: `HTTP ${response.status}`,
                fix: "Check skills API route and data storage",
              }
            } catch (error) {
              return {
                status: "error",
                message: "Skills API error",
                details: error instanceof Error ? error.message : "Unknown error",
                fix: "Check API implementation and database connection",
              }
            }
          },
        },
        {
          id: "certifications-api",
          name: "Certifications API",
          description: "Test certifications data management",
          category: "important",
          test: async () => {
            try {
              const response = await fetch("/api/certifications")
              if (response.ok) {
                return { status: "success", message: "Certifications API working correctly" }
              }
              return {
                status: "error",
                message: "Certifications API failed",
                details: `HTTP ${response.status}`,
                fix: "Check certifications API route and data storage",
              }
            } catch (error) {
              return {
                status: "error",
                message: "Certifications API error",
                details: error instanceof Error ? error.message : "Unknown error",
                fix: "Check API implementation and database connection",
              }
            }
          },
        },
      ],
    },
    {
      name: "Security Features",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      tests: [
        {
          id: "under-construction-api",
          name: "Under Construction API",
          description: "Test construction mode management",
          category: "important",
          test: async () => {
            try {
              const response = await fetch("/api/under-construction")
              if (response.ok) {
                return { status: "success", message: "Under Construction API working correctly" }
              }
              return {
                status: "error",
                message: "Under Construction API failed",
                details: `HTTP ${response.status}`,
                fix: "Check under construction API route implementation",
              }
            } catch (error) {
              return {
                status: "error",
                message: "Under Construction API error",
                details: error instanceof Error ? error.message : "Unknown error",
                fix: "Check API route configuration",
              }
            }
          },
        },
        {
          id: "security-headers",
          name: "Security Headers",
          description: "Verify security headers are present",
          category: "important",
          test: async () => {
            try {
              const response = await fetch("/")
              const headers = response.headers

              const securityHeaders = ["x-frame-options", "x-content-type-options", "referrer-policy"]

              const missingHeaders = securityHeaders.filter((header) => !headers.get(header))

              if (missingHeaders.length === 0) {
                return { status: "success", message: "All security headers are present" }
              } else if (missingHeaders.length < securityHeaders.length) {
                return {
                  status: "warning",
                  message: "Some security headers are missing",
                  details: `Missing: ${missingHeaders.join(", ")}`,
                  fix: "Add missing security headers in vercel.json or middleware",
                }
              } else {
                return {
                  status: "error",
                  message: "Security headers are not configured",
                  details: "No security headers found",
                  fix: "Configure security headers in vercel.json",
                }
              }
            } catch (error) {
              return {
                status: "error",
                message: "Failed to check security headers",
                details: error instanceof Error ? error.message : "Unknown error",
                fix: "Check network connectivity and server configuration",
              }
            }
          },
        },
      ],
    },
    {
      name: "Performance & Optimization",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      tests: [
        {
          id: "page-load-speed",
          name: "Page Load Speed",
          description: "Measure homepage load time",
          category: "optional",
          test: async () => {
            const startTime = Date.now()
            try {
              const response = await fetch("/")
              const loadTime = Date.now() - startTime

              if (loadTime < 1000) {
                return { status: "success", message: `Fast load time: ${loadTime}ms` }
              } else if (loadTime < 3000) {
                return {
                  status: "warning",
                  message: `Moderate load time: ${loadTime}ms`,
                  fix: "Consider optimizing images and reducing bundle size",
                }
              } else {
                return {
                  status: "error",
                  message: `Slow load time: ${loadTime}ms`,
                  details: "Page takes too long to load",
                  fix: "Optimize performance: compress images, minimize JavaScript, use CDN",
                }
              }
            } catch (error) {
              return {
                status: "error",
                message: "Failed to measure load time",
                details: error instanceof Error ? error.message : "Unknown error",
                fix: "Check network connectivity and server performance",
              }
            }
          },
        },
        {
          id: "responsive-design",
          name: "Responsive Design",
          description: "Check mobile viewport configuration",
          category: "optional",
          test: async () => {
            try {
              const response = await fetch("/")
              const html = await response.text()

              if (html.includes("viewport") && html.includes("width=device-width")) {
                return { status: "success", message: "Responsive design viewport configured correctly" }
              } else {
                return {
                  status: "warning",
                  message: "Viewport meta tag may be missing or incorrect",
                  fix: "Add proper viewport meta tag to layout.tsx",
                }
              }
            } catch (error) {
              return {
                status: "error",
                message: "Failed to check responsive design",
                details: error instanceof Error ? error.message : "Unknown error",
                fix: "Check page HTML structure and meta tags",
              }
            }
          },
        },
      ],
    },
  ]

  const allTests = testSuites.flatMap((suite) => suite.tests)

  async function runAllTests() {
    setTesting(true)
    setProgress(0)
    setResults({})

    // Initialize all tests as pending
    const initialResults: Record<string, TestResult> = {}
    allTests.forEach((test) => {
      initialResults[test.id] = { status: "pending", message: "Waiting to run..." }
    })
    setResults(initialResults)

    try {
      for (let i = 0; i < allTests.length; i++) {
        const test = allTests[i]
        setProgress(((i + 1) / allTests.length) * 100)

        try {
          const result = await test.test()
          setResults((prev) => ({
            ...prev,
            [test.id]: result,
          }))
        } catch (error) {
          setResults((prev) => ({
            ...prev,
            [test.id]: {
              status: "error",
              message: "Test execution failed",
              details: error instanceof Error ? error.message : "Unknown error",
              fix: "Check test implementation and dependencies",
            },
          }))
        }

        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      const finalResults = Object.values(results)
      const successCount = finalResults.filter((r) => r.status === "success").length
      const warningCount = finalResults.filter((r) => r.status === "warning").length
      const errorCount = finalResults.filter((r) => r.status === "error").length

      toast({
        title: "Testing Complete",
        description: `${successCount} passed, ${warningCount} warnings, ${errorCount} errors`,
        variant: errorCount > 0 ? "destructive" : warningCount > 0 ? "default" : "default",
      })
    } catch (error) {
      toast({
        title: "Testing Failed",
        description: "Failed to complete test suite",
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
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  function getStatusBadge(status: TestResult["status"]) {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500 text-white">Pass</Badge>
      case "warning":
        return <Badge className="bg-yellow-500 text-white">Warning</Badge>
      case "error":
        return <Badge variant="destructive">Fail</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const criticalTests = allTests.filter((t) => t.category === "critical")
  const criticalResults = criticalTests.map((t) => results[t.id]).filter(Boolean)
  const criticalPassed = criticalResults.filter((r) => r.status === "success").length

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Comprehensive Testing Suite
          </CardTitle>
          <CardDescription>
            Run comprehensive tests to identify and fix issues in your cybersecurity portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Critical Tests: {criticalPassed}/{criticalTests.length} passing
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Tests: {Object.values(results).filter((r) => r.status === "success").length}/{allTests.length}{" "}
                  passing
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

            {testing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Results by Suite */}
      {testSuites.map((suite) => (
        <Card key={suite.name}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className={suite.color}>{suite.name}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {suite.tests.map((test) => {
                  const result = results[test.id]
                  return (
                    <div key={test.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result?.status)}
                          <div>
                            <p className="font-medium">{test.name}</p>
                            <p className="text-sm text-muted-foreground">{test.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {test.category}
                          </Badge>
                          {getStatusBadge(result?.status)}
                        </div>
                      </div>

                      {result && (
                        <div className="ml-7 space-y-2">
                          <p className="text-sm">{result.message}</p>
                          {result.details && <p className="text-xs text-muted-foreground">Details: {result.details}</p>}
                          {result.fix && result.status !== "success" && (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                <strong>Fix:</strong> {result.fix}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
