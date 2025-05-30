"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, ExternalLink, Shield, DollarSign } from "lucide-react"
import type { BugBountyFinding } from "@/lib/types"

export function BugBountyManager() {
  const [findings, setFindings] = useState<BugBountyFinding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newFinding, setNewFinding] = useState<Partial<BugBountyFinding>>({
    title: "",
    platform: "",
    severity: "medium",
    status: "resolved",
    bountyAmount: 0,
    description: "",
    reportUrl: "",
    cveId: "",
    discoveredDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchFindings()
  }, [])

  const fetchFindings = async () => {
    try {
      const response = await fetch("/api/bug-bounty")
      if (response.ok) {
        const data = await response.json()
        setFindings(data)
      }
    } catch (error) {
      console.error("Error fetching bug bounty findings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addFinding = async () => {
    if (!newFinding.title || !newFinding.platform) return

    try {
      const response = await fetch("/api/bug-bounty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newFinding,
          id: Date.now().toString(),
        }),
      })

      if (response.ok) {
        await fetchFindings()
        setNewFinding({
          title: "",
          platform: "",
          severity: "medium",
          status: "resolved",
          bountyAmount: 0,
          description: "",
          reportUrl: "",
          cveId: "",
          discoveredDate: new Date().toISOString().split("T")[0],
        })
      }
    } catch (error) {
      console.error("Error adding finding:", error)
    }
  }

  const deleteFinding = async (id: string) => {
    try {
      const response = await fetch("/api/bug-bounty", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        await fetchFindings()
      }
    } catch (error) {
      console.error("Error deleting finding:", error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      case "info":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return <div>Loading bug bounty findings...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Add New Bug Bounty Finding
          </CardTitle>
          <CardDescription>Document your security research and vulnerability discoveries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Vulnerability Title</Label>
              <Input
                id="title"
                value={newFinding.title}
                onChange={(e) => setNewFinding({ ...newFinding, title: e.target.value })}
                placeholder="e.g., SQL Injection in Login Form"
              />
            </div>
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                value={newFinding.platform}
                onChange={(e) => setNewFinding({ ...newFinding, platform: e.target.value })}
                placeholder="e.g., HackerOne, Bugcrowd"
              />
            </div>
            <div>
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={newFinding.severity}
                onValueChange={(value) => setNewFinding({ ...newFinding, severity: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="info">Informational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={newFinding.status}
                onValueChange={(value) => setNewFinding({ ...newFinding, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="triaged">Triaged</SelectItem>
                  <SelectItem value="duplicate">Duplicate</SelectItem>
                  <SelectItem value="not-applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bountyAmount">Bounty Amount ($)</Label>
              <Input
                id="bountyAmount"
                type="number"
                value={newFinding.bountyAmount}
                onChange={(e) => setNewFinding({ ...newFinding, bountyAmount: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="cveId">CVE ID (if assigned)</Label>
              <Input
                id="cveId"
                value={newFinding.cveId}
                onChange={(e) => setNewFinding({ ...newFinding, cveId: e.target.value })}
                placeholder="e.g., CVE-2024-1234"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newFinding.description}
              onChange={(e) => setNewFinding({ ...newFinding, description: e.target.value })}
              placeholder="Describe the vulnerability and its impact..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="reportUrl">Report URL</Label>
            <Input
              id="reportUrl"
              value={newFinding.reportUrl}
              onChange={(e) => setNewFinding({ ...newFinding, reportUrl: e.target.value })}
              placeholder="https://hackerone.com/reports/..."
            />
          </div>
          <Button onClick={addFinding} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Finding
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {findings.map((finding) => (
          <Card key={finding.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {finding.title}
                    <Badge className={getSeverityColor(finding.severity)}>{finding.severity}</Badge>
                    <Badge variant="outline">{finding.status}</Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span>{finding.platform}</span>
                    {finding.bountyAmount > 0 && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />${finding.bountyAmount}
                      </span>
                    )}
                    {finding.cveId && <Badge variant="secondary">{finding.cveId}</Badge>}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {finding.reportUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={finding.reportUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => deleteFinding(finding.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {finding.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{finding.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {findings.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No bug bounty findings yet. Add your first security discovery!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
