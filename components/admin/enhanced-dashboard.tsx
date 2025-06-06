"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectsManager } from "./projects-manager"
import { SkillsManager } from "./skills-manager"
import { CertificationsManager } from "./certifications-manager"
import { CTFManager } from "./ctf-manager"
import { DigitalBadgesManager } from "./digital-badges-manager"
import { AdvancedSettingsManager } from "./advanced-settings-manager"
import { SiteInfoManager } from "./site-info-manager"
import { BugBountyManager } from "./bug-bounty-manager"
import { SecurityArticlesManager } from "./security-articles-manager"
import { OSINTCapabilitiesManager } from "./osint-capabilities-manager"
import { LinkedAccountsManager } from "./linked-accounts-manager"
import { ImportSettingsManager } from "./import-settings-manager"
import { TestingChecklist } from "./testing-checklist"
import { SiteVerification } from "./site-verification"
import {
  FolderOpen,
  Award,
  Shield,
  Trophy,
  Palette,
  Settings,
  User,
  Bug,
  FileText,
  Search,
  Link,
  Download,
  CheckSquare,
  Globe,
} from "lucide-react"

export function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState("projects")

  const tabs = [
    // Core Content Management
    {
      id: "projects",
      label: "Projects",
      icon: <FolderOpen className="h-4 w-4" />,
      component: <ProjectsManager />,
      description: "Manage cybersecurity projects and case studies",
      category: "content",
    },
    {
      id: "skills",
      label: "Skills",
      icon: <Award className="h-4 w-4" />,
      component: <SkillsManager />,
      description: "Track technical skills and proficiency levels",
      category: "content",
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: <Shield className="h-4 w-4" />,
      component: <CertificationsManager />,
      description: "Manage professional certifications",
      category: "content",
    },
    {
      id: "badges",
      label: "Digital Badges",
      icon: <Award className="h-4 w-4" />,
      component: <DigitalBadgesManager />,
      description: "Showcase digital achievements and micro-credentials",
      category: "content",
    },
    {
      id: "ctf",
      label: "CTF Events",
      icon: <Trophy className="h-4 w-4" />,
      component: <CTFManager />,
      description: "Document CTF competitions and achievements",
      category: "content",
    },

    // Security-Specific Content
    {
      id: "bug-bounty",
      label: "Bug Bounty",
      icon: <Bug className="h-4 w-4" />,
      component: <BugBountyManager />,
      description: "Track vulnerability discoveries and bounties",
      category: "security",
    },
    {
      id: "security-articles",
      label: "Security Articles",
      icon: <FileText className="h-4 w-4" />,
      component: <SecurityArticlesManager />,
      description: "Manage cybersecurity publications and blog posts",
      category: "security",
    },
    {
      id: "osint",
      label: "OSINT Capabilities",
      icon: <Search className="h-4 w-4" />,
      component: <OSINTCapabilitiesManager />,
      description: "Showcase open-source intelligence skills",
      category: "security",
    },

    // Integrations & Automation
    {
      id: "linked-accounts",
      label: "Linked Accounts",
      icon: <Link className="h-4 w-4" />,
      component: <LinkedAccountsManager />,
      description: "Connect external platforms and services",
      category: "integrations",
    },
    {
      id: "import-settings",
      label: "Auto Import",
      icon: <Download className="h-4 w-4" />,
      component: <ImportSettingsManager />,
      description: "Configure automated data imports",
      category: "integrations",
    },

    // Site Configuration
    {
      id: "appearance",
      label: "Appearance",
      icon: <Palette className="h-4 w-4" />,
      component: <AdvancedSettingsManager />,
      description: "Customize theme and visual settings",
      category: "settings",
    },
    {
      id: "site",
      label: "Site Settings",
      icon: <User className="h-4 w-4" />,
      component: <SiteInfoManager />,
      description: "Configure personal information and site details",
      category: "settings",
    },
    {
      id: "advanced",
      label: "Advanced",
      icon: <Settings className="h-4 w-4" />,
      component: <AdvancedSettingsManager />,
      description: "Advanced configuration options",
      category: "settings",
    },

    // Testing & Deployment
    {
      id: "testing",
      label: "Testing",
      icon: <CheckSquare className="h-4 w-4" />,
      component: <TestingChecklist />,
      description: "Pre-deployment testing checklist",
      category: "deployment",
    },
    {
      id: "verification",
      label: "Site Verification",
      icon: <Globe className="h-4 w-4" />,
      component: <SiteVerification />,
      description: "Verify site configuration and deployment",
      category: "deployment",
    },
  ]

  const categories = {
    content: { label: "Content Management", color: "bg-blue-100 text-blue-800" },
    security: { label: "Security Portfolio", color: "bg-red-100 text-red-800" },
    integrations: { label: "Integrations", color: "bg-green-100 text-green-800" },
    settings: { label: "Configuration", color: "bg-purple-100 text-purple-800" },
    deployment: { label: "Testing & Deployment", color: "bg-orange-100 text-orange-800" },
  }

  const groupedTabs = tabs.reduce(
    (acc, tab) => {
      if (!acc[tab.category]) {
        acc[tab.category] = []
      }
      acc[tab.category].push(tab)
      return acc
    },
    {} as Record<string, typeof tabs>,
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Cybersecurity Portfolio Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your cybersecurity portfolio content, integrations, and site configuration
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="space-y-4">
          {Object.entries(groupedTabs).map(([category, categoryTabs]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={categories[category as keyof typeof categories].color}>
                  {categories[category as keyof typeof categories].label}
                </Badge>
              </div>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
                {categoryTabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 text-xs">
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </CardTitle>
                <CardDescription>{tab.description}</CardDescription>
              </CardHeader>
              <CardContent>{tab.component}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
