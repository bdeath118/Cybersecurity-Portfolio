"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trash2,
  Plus,
  ExternalLink,
  Shield,
  DollarSign,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { BugBountyFinding } from "@/lib/types"

interface HackerOneStats {
  reputation: number
  signal: number
  totalBounties: number
  totalReports: number
  resolvedReports: number
}

export function EnhancedBugBountyManager() {
  const [findings, setFindings] = useState<BugBountyFinding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isImporting, setIsImporting] = useState(false)
  const [hackerOneConnected, setHackerOneConnected] = useState(false)
  const [hackerOneStats, setHackerOneStats] = useState<HackerOneStats | null>(null)
  const { toast } = useToast()

  const [newFinding, setNewFinding] = useState<Partial<BugBountyFinding>>({
    title: "",
    platform: "hackerone",
    severity: "medium",
    status: "resolved",
    bounty: 0,
    description: "",
    reportUrl: "",
    cve: "",
    date: new Date().toISOString().split("T")[0],
    company: "",
  })

  useEffect(() => {
    fetchFindings()
    checkHackerOneConnection()
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

  const checkHackerOneConnection = async () => {
    try {
      const response = await fetch("/api/integrations/hackerone")
      const data = await response.json()

      if (data.success && data.connected) {
        setHackerOneConnected(true)
        if (data.profile) {
          setHackerOneStats({
            reputation: data.profile.reputation || 0,
            signal: data.profile.signal || 0,
            totalBounties: 0, // Will be calculated from findings
            totalReports: 0, // Will be calculated from findings
            resolvedReports: 0, // Will be calculated from findings
          })
        }
      }
    } catch (error) {
      console.error("Error checking HackerOne connection:", error)
    }
  }

  const importFromHackerOne = async () => {
    setIsImporting(true)
    try {
      const response = await fetch("/api/integrations/hackerone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "import-reports" }),
      })

      const data = await response.json()

      if (data.success) {
        // Add imported findings to local storage
        for (const finding of data.findings) {
          await fetch("/api/bug-bounty", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finding),
          })
        }

        await fetchFindings()
        toast({
          title: "Import Successful",
          description: `Imported ${data.imported} findings from HackerOne`,
        })
      } else {
        throw new Error(data.message || "Import failed")
      }
    } catch (error) {
      console.error("Error importing from HackerOne:", error)
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import from HackerOne",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
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
          platform: "hackerone",
          severity: "medium",
          status: "resolved",
          bounty: 0,
          description: "",
          reportUrl: "",
          cve: "",
          date: new Date().toISOString().split("T")[0],
          company: "",
        })
        toast({
          title: "Success",
          description: "Bug bounty finding added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding finding:", error)
      toast({
        title: "Error",
        description: "Failed to add bug bounty finding",
        variant: "destructive",
      })
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
        toast({
          title: "Success",
          description: "Bug bounty finding deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting finding:", error)
      toast({
        title: "Error",
        description: "Failed to delete bug bounty finding",
        variant: "destructive",
      })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-blue-500 text-white"
      case "info":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "hackerone":
        return "bg-black text-white"
      case "bugcrowd":
        return "bg-orange-600 text-white"
      case "intigriti":
        return "bg-blue-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  // Calculate statistics
  const totalBounties = findings.reduce((sum, finding) => sum + (finding.bounty || 0), 0)
  const hackerOneFindings = findings.filter((f) => f.platform === "hackerone")
  const resolvedFindings = findings.filter((f) => f.status === "resolved")

  if (isLoading) {
    return <div>Loading bug bounty findings...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="add-finding">Add Finding</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bounties</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalBounties.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all platforms</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{findings.length}</div>
                <p className="text-xs text-muted-foreground">{resolvedFindings.length} resolved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">HackerOne Reports</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hackerOneFindings.length}</div>
                <p className="text-xs text-muted-foreground">{hackerOneConnected ? "Connected" : "Not connected"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reputation</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hackerOneStats?.reputation || 0}</div>
                <p className="text-xs text-muted-foreground">HackerOne reputation</p>
              </CardContent>
            </Card>
          </div>

          {/* HackerOne Integration Status */}
          {hackerOneConnected ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                HackerOne integration is active. You can import your latest findings automatically.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                HackerOne integration is not configured. Add your API credentials to import findings automatically.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="findings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Bug Bounty Findings</h3>
            {hackerOneConnected && (
              <Button onClick={importFromHackerOne} disabled={isImporting} size="sm">
                {isImporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Import from HackerOne
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {findings.map((finding) => (
              <Card key={finding.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {finding.title}
                        <Badge className={getSeverityColor(finding.severity)}>{finding.severity}</Badge>
                        <Badge className={getPlatformColor(finding.platform)}>{finding.platform}</Badge>
                        <Badge variant="outline">{finding.status}</Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span>{finding.company}</span>
                        <span>{finding.date}</span>
                        {finding.bounty && finding.bounty > 0 && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />${finding.bounty}
                          </span>
                        )}
                        {finding.cve && <Badge variant="secondary">{finding.cve}</Badge>}
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
        </TabsContent>

        <TabsContent value="add-finding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
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
                  <Label htmlFor="company">Company/Program</Label>
                  <Input
                    id="company"
                    value={newFinding.company}
                    onChange={(e) => setNewFinding({ ...newFinding, company: e.target.value })}
                    placeholder="e.g., Example Corp"
                  />
                </div>
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={newFinding.platform}
                    onValueChange={(value) => setNewFinding({ ...newFinding, platform: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hackerone">HackerOne</SelectItem>
                      <SelectItem value="bugcrowd">Bugcrowd</SelectItem>
                      <SelectItem value="intigriti">Intigriti</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="bounty">Bounty Amount ($)</Label>
                  <Input
                    id="bounty"
                    type="number"
                    value={newFinding.bounty}
                    onChange={(e) => setNewFinding({ ...newFinding, bounty: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Discovery Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newFinding.date}
                    onChange={(e) => setNewFinding({ ...newFinding, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cve">CVE ID (if assigned)</Label>
                  <Input
                    id="cve"
                    value={newFinding.cve}
                    onChange={(e) => setNewFinding({ ...newFinding, cve: e.target.value })}
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
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>HackerOne Integration</CardTitle>
              <CardDescription>
                Connect your HackerOne account to automatically import bug bounty findings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hackerOneConnected ? (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Successfully connected to HackerOne account: bdragon118@hotmail.com
                    </AlertDescription>
                  </Alert>

                  {hackerOneStats && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{hackerOneStats.reputation}</div>
                        <div className="text-sm text-muted-foreground">Reputation</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{hackerOneStats.signal}</div>
                        <div className="text-sm text-muted-foreground">Signal</div>
                      </div>
                    </div>
                  )}

                  <Button onClick={importFromHackerOne} disabled={isImporting} className="w-full">
                    {isImporting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Importing Reports...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Import Latest Reports
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    HackerOne integration is not configured. Please add your API credentials in the environment
                    variables:
                    <br />
                    <code className="text-xs">HACKERONE_API_TOKEN</code> and{" "}
                    <code className="text-xs">HACKERONE_USERNAME</code>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
