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

  // Platforms that can be integrated
  const platforms = [
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "Import professional skills, projects, and badges",
      icon: <Linkedin className="h-6 w-6" />,
      color: "bg-[#0077B5]",
      textColor: "text-white",
    },
    {
      id: "github",
      name: "GitHub",
      description: "Showcase repositories and contributions",
      icon: <Github className="h-6 w-6" />,
      color: "bg-[#24292e]",
      textColor: "text-white",
    },
    {
      id: "credly",
      name: "Credly",
      description: "Import digital badges and certifications",
      icon: <Award className="h-6 w-6" />,
      color: "bg-[#FF6B00]",
      textColor: "text-white",
    },
    {
      id: "canvas",
      name: "Canvas LMS",
      description: "Import learning achievements and badges",
      icon: <Award className="h-6 w-6" />,
      color: "bg-[#E72429]",
      textColor: "text-white",
    },
    {
      id: "tryhackme",
      name: "TryHackMe",
      description: "Import cybersecurity learning progress",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-[#212C42]",
      textColor: "text-white",
    },
    {
      id: "hackthebox",
      name: "HackTheBox",
      description: "Import challenges and achievements",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-[#9FEF00]",
      textColor: "text-black",
    },
  ]

  useEffect(() => {
    async function fetchAccounts() {
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockAccounts: LinkedAccount[] = [
          {
            id: "linkedin-1",
            platform: "linkedin",
            username: "johndoe",
            email: "john.doe@example.com",
            avatarUrl: "https://i.pravatar.cc/150?u=linkedin",
            connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            lastSync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: "active",
          },
          {
            id: "github-1",
            platform: "github",
            username: "johndoe",
            avatarUrl: "https://i.pravatar.cc/150?u=github",
            connectedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            lastSync: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: "active",
          },
        ]

        setAccounts(mockAccounts)
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
      // In a real implementation, this would redirect to the OAuth flow
      // For now, we'll just simulate it
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
      // In a real implementation, this would call an API to refresh the account data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setAccounts((prev) =>
        prev.map((account) =>
          account.id === accountId ? { ...account, lastSync: new Date().toISOString(), status: "active" } : account,
        ),
      )

      toast({
        title: "Success",
        description: "Account data refreshed successfully",
      })
    } catch (error) {
      console.error("Error refreshing account:", error)
      toast({
        title: "Error",
        description: "Failed to refresh account data",
        variant: "destructive",
      })
    } finally {
      setRefreshing(null)
    }
  }

  const handleDisconnect = async (accountId: string) => {
    setDisconnecting(accountId)
    try {
      // In a real implementation, this would call an API to disconnect the account
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setAccounts((prev) => prev.filter((account) => account.id !== accountId))

      toast({
        title: "Success",
        description: "Account disconnected successfully",
      })
    } catch (error) {
      console.error("Error disconnecting account:", error)
      toast({
        title: "Error",
        description: "Failed to disconnect account",
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

  if (loading) {
    return <div className="text-center py-8">Loading linked accounts...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Linked Accounts</h2>
        <p className="text-muted-foreground">
          Connect your external accounts to automatically import content and credentials
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((account) => {
          const platform = platforms.find((p) => p.id === account.platform)

          return (
            <Card key={account.id} className="overflow-hidden">
              <CardHeader className={`${platform?.color || "bg-gray-100"} ${platform?.textColor || "text-black"}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
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
                      <p className="text-xs text-muted-foreground mt-1">Last synced: {formatDate(account.lastSync)}</p>
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

      <Separator />

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Connect New Accounts</h2>
          <p className="text-muted-foreground">
            Add more platforms to enhance your cybersecurity portfolio with additional content
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {platforms
            .filter((platform) => !accounts.some((account) => account.platform === platform.id))
            .map((platform) => (
              <Card key={platform.id} className="overflow-hidden">
                <CardHeader className={`${platform.color} ${platform.textColor}`}>
                  <CardTitle className="flex items-center gap-2">
                    {platform.icon}
                    {platform.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm">{platform.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a
                      href={`https://cybersecurity-portfolio-bdeath118.vercel.app/api/auth/${platform.id}/login`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Platform
                    </a>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full ml-2"
                    onClick={() => handleConnect(platform.id)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
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
