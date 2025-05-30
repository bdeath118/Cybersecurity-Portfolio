"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectsManager } from "./projects-manager"
import { SkillsManager } from "./skills-manager"
import { CertificationsManager } from "./certifications-manager"
import { CTFManager } from "./ctf-manager"
import { SiteInfoManager } from "./site-info-manager"
import { DigitalBadgesManager } from "./digital-badges-manager"
import { ImportSettingsManager } from "./import-settings-manager"
import { AdvancedSettingsManager } from "./advanced-settings-manager"
import { CredentialsManager } from "./credentials-manager"
import { LinkedAccountsManager } from "./linked-accounts-manager"
import { BugBountyManager } from "./bug-bounty-manager"
import { SecurityArticlesManager } from "./security-articles-manager"
import { OSINTCapabilitiesManager } from "./osint-capabilities-manager"
import {
  FolderOpen,
  Award,
  BadgeIcon as Certificate,
  Trophy,
  Settings,
  Badge,
  Download,
  Palette,
  Key,
  Link,
  Shield,
  FileText,
  Search,
} from "lucide-react"

export function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState("projects")

  const tabs = [
    { id: "projects", label: "Projects", icon: FolderOpen, component: ProjectsManager },
    { id: "skills", label: "Skills", icon: Award, component: SkillsManager },
    { id: "certifications", label: "Certifications", icon: Certificate, component: CertificationsManager },
    { id: "badges", label: "Digital Badges", icon: Badge, component: DigitalBadgesManager },
    { id: "ctf", label: "CTF Events", icon: Trophy, component: CTFManager },
    { id: "bug-bounty", label: "Bug Bounty", icon: Shield, component: BugBountyManager },
    { id: "articles", label: "Security Articles", icon: FileText, component: SecurityArticlesManager },
    { id: "osint", label: "OSINT Capabilities", icon: Search, component: OSINTCapabilitiesManager },
    { id: "linked-accounts", label: "Linked Accounts", icon: Link, component: LinkedAccountsManager },
    { id: "credentials", label: "Platform Credentials", icon: Key, component: CredentialsManager },
    { id: "import", label: "Import Settings", icon: Download, component: ImportSettingsManager },
    { id: "appearance", label: "Appearance", icon: Palette, component: AdvancedSettingsManager },
    { id: "site", label: "Site Settings", icon: Settings, component: SiteInfoManager },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cybersecurity Portfolio Dashboard</h1>
        <p className="text-muted-foreground">Manage your cybersecurity portfolio content and integrations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-13">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </CardTitle>
                <CardDescription>
                  {tab.id === "projects" && "Manage your cybersecurity projects and showcases"}
                  {tab.id === "skills" && "Update your technical skills and proficiency levels"}
                  {tab.id === "certifications" && "Add and manage your professional certifications"}
                  {tab.id === "badges" && "Manage your digital badges and micro-credentials"}
                  {tab.id === "ctf" && "Track your Capture The Flag competition results"}
                  {tab.id === "bug-bounty" && "Manage your bug bounty findings and security research"}
                  {tab.id === "articles" && "Track your cybersecurity articles and publications"}
                  {tab.id === "osint" && "Showcase your open-source intelligence capabilities"}
                  {tab.id === "linked-accounts" && "Connect and manage external platform accounts"}
                  {tab.id === "credentials" && "Configure OAuth credentials for platform integrations"}
                  {tab.id === "import" && "Set up automatic importing from external platforms"}
                  {tab.id === "appearance" && "Customize the look and feel of your portfolio"}
                  {tab.id === "site" && "Configure general site information and settings"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <tab.component />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// Export alias for backward compatibility
export { EnhancedDashboard as EnhancedAdminDashboard }
