"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  LogIn,
  LogOut,
  RefreshCw,
  Shield,
  Linkedin,
  Github,
  Award,
  Target,
  Bug,
  FileText,
  Search,
  Trophy,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface LinkedAccount {
  id: string
  platform: string
  username: string
  email?: string
  avatarUrl?: string
  connectedAt: string
  lastSync?: string
  status: "active" | "expired" | "error"
  error?: string
}

export function LinkedAccountsManager() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const { toast } = useToast()

  // Cybersecurity-focused platforms
  const platforms = [
    // Professional Platforms
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "Import professional skills, projects, and badges",
      icon: <Linkedin className="h-6 w-6" />,
      color: "bg-[#0077B5]",
      textColor: "text-white",
      category: "Professional",
    },
    {
      id: "github",
      name: "GitHub",
      description: "Showcase security tools and repositories",
      icon: <Github className="h-6 w-6" />,
      color: "bg-[#24292e]",
      textColor: "text-white",
      category: "Professional",
    },

    // CTF Platforms
    {
      id: "ctftime",
      name: "CTFtime",
      description: "Import CTF competition results and rankings",
      icon: <Trophy className="h-6 w-6" />,
      color: "bg-[#FF6B35]",
      textColor: "text-white",
      category: "CTF Platforms",
    },
    {
      id: "picoctf",
      name: "picoCTF",
      description: "Showcase educational CTF achievements",
      icon: <Target className="h-6 w-6" />,
      color: "bg-[#2E8B57]",
      textColor: "text-white",
      category: "CTF Platforms",
    },
    {
      id: "tryhackme",
      name: "TryHackMe",
      description: "Import cybersecurity learning progress and badges",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-[#212C42]",
      textColor: "text-white",
      category: "CTF Platforms",
    },
    {
      id: "hackthebox",
      name: "HackTheBox",
      description: "Import penetration testing challenges and achievements",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-[#9FEF00]",
      textColor: "text-black",
      category: "CTF Platforms",
    },

    // Bug Bounty Platforms
    {
      id: "hackerone",
      name: "HackerOne",
      description: "Display bug bounty findings and reputation",
      icon: <Bug className="h-6 w-6" />,
      color: "bg-[#494649]",
      textColor: "text-white",
      category: "Bug Bounty",
    },
    {
      id: "bugcrowd",
      name: "Bugcrowd",
      description: "Showcase security research and bounties",
      icon: <Bug className="h-6 w-6" />,
      color: "bg-[#F26822]",
      textColor: "text-white",
      category: "Bug Bounty",
    },
    {
      id: "intigriti",
      name: "Intigriti",
      description: "Import ethical hacking achievements",
      icon: <Bug className="h-6 w-6" />,
      color: "bg-[#1A1A1A]",
      textColor: "text-white",
      category: "Bug Bounty",
    },

    // Security Blogs & Content
    {
      id: "medium",
      name: "Medium",
      description: "Import security articles and publications",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-[#00AB6C]",
      textColor: "text-white",
      category: "Content Platforms",
    },
    {
      id: "devto",
      name: "Dev.to",
      description: "Showcase technical security content",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-[#0A0A0A]",
      textColor: "text-white",
      category: "Content Platforms",
    },
    {
      id: "hashnode",
      name: "Hashnode",
      description: "Import cybersecurity blog posts",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-[#2962FF]",
      textColor: "text-white",
      category: "Content Platforms",
    },

    // Certification Platforms
    {
      id: "credly",
      name: "Credly",
      description: "Import digital badges and certifications",
      icon: <Award className="h-6 w-6" />,
      color: "bg-[#FF6B00]",
      textColor: "text-white",
      category: "Certifications",
    },
    {
      id: "canvas",
      name: "Canvas LMS",
      description: "Import learning achievements and badges",
      icon: <Award className="h-6 w-6" />,
      color: "bg-[#E72429]",
      textColor: "text-white",
      category: "Certifications",
    },

    // OSINT & Research Tools
    {
      id: "shodan",
      name: "Shodan",
      description: "Demonstrate OSINT and reconnaissance capabilities",
      icon: <Search className="h-6 w-6" />,
      color: "bg-[#C4302B]",
      textColor: "text-white",
      category: "OSINT Tools",
    },
    {
      id: "maltego",
      name: "Maltego",
      description: "Showcase threat intelligence and investigation skills",
      icon: <Search className="h-6 w-6" />,
      color: "bg-[#1B365D]",
      textColor: "text-white",
      category: "OSINT Tools",
    },
  ]

  // Group platforms by category
  const platformsByCategory = platforms.reduce(
    (acc, platform) => {
      if (!acc[platform.category]) {
        acc[platform.category] = []
      }
      acc[platform.category].push(platform)
      return acc
    },
    {} as Record<string, typeof platforms>,
  )

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch("/api/integrations")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setAccounts(data)
      } catch (error) {
        console.error("Error fetching linked accounts:", error)
        toast({
          title: "Error",
          description: "Failed to load linked accounts",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [toast])

  const handleConnect = (platformId: string) => {
    setSelectedPlatform(platformId)
    setShowConnectDialog(true)
  }

  const initiateOAuthFlow = async (platformId: string) => {
    try {
      window.location.href = `/api/auth/${platformId}/login`
    } catch (error) {
      console.error(`Error initiating ${platformId} OAuth flow:`, error)
      toast({
        title: "Error",
        description: `Failed to connect to ${platformId}`,
        variant: "destructive",
      })
    }
  }

  const handleRefresh = async (accountId: string) => {
    setRefreshing(accountId)
    try {
      const response = await fetch(`/api/integrations/${accountId}/refresh`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to refresh account data")
      }

      const updatedAccount = await response.json()

      setAccounts((prev) => prev.map((account) => (account.id === accountId ? updatedAccount : account)))

      toast({
        title: "Success",
        description: "Account data refreshed successfully",
      })
    } catch (error: any) {
      console.error("Error refreshing account:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to refresh account data",
        variant: "destructive",
      })
    } finally {
      setRefreshing(null)
    }
  }

  const handleDisconnect = async (accountId: string) => {
    setDisconnecting(accountId)
    try {
      const response = await fetch(`/api/integrations/${accountId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to disconnect account")
      }

      setAccounts((prev) => prev.filter((account) => account.id !== accountId))

      toast({
        title: "Success",
        description: "Account disconnected successfully",
      })
    } catch (error: any) {
      console.error("Error disconnecting account:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect account",
        variant: "destructive",
      })
    } finally {
      setDisconnecting(null)
    }
  }

  const getAccountStatus = (account: LinkedAccount) => {
    switch (account.status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Token Expired
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleTestIntegration = async (platformId: string) => {
    try {
      const response = await fetch(`/api/integrations/${platformId}/test`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Integration test failed")
      }

      toast({
        title: "Integration Test Passed",
        description: `Successfully connected to ${platformId}`,
      })
    } catch (error: any) {
      console.error(`Integration test failed for ${platformId}:`, error)
      toast({
        title: "Integration Test Failed",
        description: error.message || `Failed to connect to ${platformId}`,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading linked accounts...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Linked Accounts</h2>
        <p className="text-muted-foreground">
          Connect your cybersecurity platforms to automatically import achievements, findings, and content
        </p>
      </div>

      {/* Connected Accounts */}
      {accounts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Connected Accounts</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {accounts.map((account) => {
              const platform = platforms.find((p) => p.id === account.platform)

              return (
                <Card key={account.id} className="overflow-hidden">
                  <CardHeader className={`${platform?.color || "bg-gray-100"} ${platform?.textColor || "text-black"}`}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {platform?.icon}
                        {platform?.name || account.platform}
                        {getAccountStatus(account)}
                      </CardTitle>
                    </div>
                    <CardDescription className={platform?.textColor || "text-black"}>
                      Connected on {formatDate(account.connectedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        {account.avatarUrl ? (
                          <img
                            src={account.avatarUrl || "/placeholder.svg"}
                            alt={account.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200">
                            <span className="text-xl font-bold text-gray-500">
                              {account.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{account.username}</h3>
                        {account.email && <p className="text-sm text-muted-foreground">{account.email}</p>}
                        {account.lastSync && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Last synced: {formatDate(account.lastSync)}
                          </p>
                        )}
                      </div>
                    </div>

                    {account.error && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{account.error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefresh(account.id)}
                      disabled={refreshing === account.id}
                    >
                      {refreshing === account.id ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh Data
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(account.id)}
                      disabled={disconnecting === account.id}
                    >
                      {disconnecting === account.id ? (
                        <>
                          <LogOut className="h-4 w-4 mr-2" />
                          Disconnecting...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4 mr-2" />
                          Disconnect
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      <Separator />

      {/* Available Platforms by Category */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Connect New Platforms</h2>
          <p className="text-muted-foreground">
            Enhance your cybersecurity portfolio by connecting specialized platforms
          </p>
        </div>

        {Object.entries(platformsByCategory).map(([category, categoryPlatforms]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-medium text-primary">{category}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryPlatforms
                .filter((platform) => !accounts.some((account) => account.platform === platform.id))
                .map((platform) => (
                  <Card key={platform.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className={`${platform.color} ${platform.textColor}`}>
                      <CardTitle className="flex items-center gap-2 text-base">
                        {platform.icon}
                        {platform.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </CardContent>
                    <CardFooter className="flex gap-2 border-t bg-muted/50 px-4 py-3">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={`https://${platform.id}.com`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit
                        </a>
                      </Button>
                      <Button variant="default" size="sm" className="flex-1" onClick={() => handleConnect(platform.id)}>
                        <LogIn className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleTestIntegration(platform.id)}
                      >
                        Test
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {platforms.find((p) => p.id === selectedPlatform)?.name}</DialogTitle>
            <DialogDescription>
              You'll be redirected to {platforms.find((p) => p.id === selectedPlatform)?.name} to authorize access to
              your account.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Secure Authentication</AlertTitle>
              <AlertDescription>
                We use OAuth to securely connect to your account. We never store your password.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowConnectDialog(false)
                if (selectedPlatform) {
                  initiateOAuthFlow(selectedPlatform)
                }
              }}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Continue to {platforms.find((p) => p.id === selectedPlatform)?.name}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
