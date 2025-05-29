"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ExternalLink, Globe, Shield, Zap } from "lucide-react"

interface DeploymentStatus {
  status: string
  url: string
  environment: string
  authConfigured: boolean
  integrations: {
    linkedin: boolean
    credly: boolean
    canvas: boolean
  }
  features: {
    autoImport: boolean
    digitalBadges: boolean
    adminDashboard: boolean
    securityScan: boolean
  }
}

export function SiteVerification() {
  const [status, setStatus] = useState<DeploymentStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await fetch("/api/deployment-status")
        const data = await response.json()
        setStatus(data)
      } catch (error) {
        console.error("Failed to check deployment status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Verification</CardTitle>
          <CardDescription>Checking deployment status...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Verification</CardTitle>
          <CardDescription>Failed to load deployment status</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const integrationCount = Object.values(status.integrations).filter(Boolean).length
  const featureCount = Object.values(status.features).filter(Boolean).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Site Verification
        </CardTitle>
        <CardDescription>
          Deployment status for: <strong>cybersecurity-portfolio-bdeath118.vercel.app</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Deployment Status */}
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <div className="font-semibold text-green-800">Site Deployed Successfully</div>
              <div className="text-sm text-green-600">Environment: {status.environment}</div>
            </div>
          </div>
          <Button size="sm" asChild>
            <a href={status.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Site
            </a>
          </Button>
        </div>

        {/* Authentication Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5" />
              <h3 className="font-semibold">Authentication</h3>
            </div>
            <div className="flex items-center gap-2">
              {status.authConfigured ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Admin credentials configured</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Using default credentials</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5" />
              <h3 className="font-semibold">Features</h3>
            </div>
            <div className="text-sm">
              <Badge variant="outline">{featureCount}/4 Active</Badge>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div>
          <h3 className="font-semibold mb-3">Integrations ({integrationCount}/3 configured)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 border rounded">
              {status.integrations.linkedin ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm">LinkedIn</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded">
              {status.integrations.credly ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm">Credly</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded">
              {status.integrations.canvas ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm">Canvas</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href="/admin" target="_blank" rel="noreferrer">
                Admin Login
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="/api/env-check" target="_blank" rel="noreferrer">
                Check Config
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={status.url} target="_blank" rel="noreferrer">
                View Homepage
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={`${status.url}/projects`} target="_blank" rel="noreferrer">
                View Projects
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
