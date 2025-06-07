"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProjectsManager } from "./projects-manager"
import { SkillsManager } from "./skills-manager"
import { CertificationsManager } from "./certifications-manager"
import { CTFManager } from "./ctf-manager"
import { DigitalBadgesManager } from "./digital-badges-manager"
import { AdvancedSettingsManager } from "./advanced-settings-manager"
import { SiteInfoManager } from "./site-info-manager"
import { EnhancedBugBountyManager } from "./enhanced-bug-bounty-manager"
import { SecurityArticlesManager } from "./security-articles-manager"
import { OSINTCapabilitiesManager } from "./osint-capabilities-manager"
import { LinkedAccountsManager } from "./linked-accounts-manager"
import { ImportSettingsManager } from "./import-settings-manager"
import { SiteVerification } from "./site-verification"
import { UnderConstructionManager } from "./under-construction-manager"
import { APIStatusChecker } from "./api-status-checker"
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
  Construction,
  Activity,
  Home,
} from "lucide-react"
import { ComprehensiveTesting } from "./comprehensive-testing"

export function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    // Overview
    {
      id: "overview",
      label: "Overview",
      icon: <Home className="h-4 w-4" />,
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700 dark:text-blue-200 mb-3">
                  Manage your portfolio content including projects, skills, and certifications.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    Projects
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Skills
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Certifications
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-red-900 dark:text-red-100">Security Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 dark:text-red-200 mb-3">
                  Showcase your cybersecurity expertise and achievements.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    Bug Bounty
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    CTF Events
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    OSINT
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-900 dark:text-green-100">HackerOne Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700 dark:text-green-200 mb-3">
                  Connected to HackerOne for automatic bug bounty import.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    Connected
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Auto Import
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab("projects")}
                  className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <FolderOpen className="h-6 w-6 mb-2 text-blue-600" />
                  <div className="font-medium">Add Project</div>
                  <div className="text-sm text-muted-foreground">Create new portfolio project</div>
                </button>
                <button
                  onClick={() => setActiveTab("bug-bounty")}
                  className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Bug className="h-6 w-6 mb-2 text-red-600" />
                  <div className="font-medium">Import HackerOne</div>
                  <div className="text-sm text-muted-foreground">Sync bug bounty findings</div>
                </button>
                <button
                  onClick={() => setActiveTab("construction")}
                  className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Construction className="h-6 w-6 mb-2 text-orange-600" />
                  <div className="font-medium">Site Mode</div>
                  <div className="text-sm text-muted-foreground">Toggle construction mode</div>
                </button>
                <button
                  onClick={() => setActiveTab("testing")}
                  className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <CheckSquare className="h-6 w-6 mb-2 text-purple-600" />
                  <div className="font-medium">Run Tests</div>
                  <div className="text-sm text-muted-foreground">Verify site functionality</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      description: "Dashboard overview and quick actions",
      category: "overview",
    },

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
      component: <EnhancedBugBountyManager />,
      description: "Track vulnerability discoveries and HackerOne integration",
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

    // Site Management
    {
      id: "construction",
      label: "Under Construction",
      icon: <Construction className="h-4 w-4" />,
      component: <UnderConstructionManager />,
      description: "Manage site construction mode",
      category: "management",
    },
    {
      id: "api-status",
      label: "API Status",
      icon: <Activity className="h-4 w-4" />,
      component: <APIStatusChecker />,
      description: "Monitor API endpoint health",
      category: "management",
    },

    // Testing & Deployment
    {
      id: "testing",
      label: "Testing",
      icon: <CheckSquare className="h-4 w-4" />,
      component: <ComprehensiveTesting />,
      description: "Comprehensive testing and issue detection",
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
    overview: {
      label: "Overview",
      color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
      tabs: tabs.filter((t) => t.category === "overview"),
    },
    content: {
      label: "Content Management",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      tabs: tabs.filter((t) => t.category === "content"),
    },
    security: {
      label: "Security Portfolio",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      tabs: tabs.filter((t) => t.category === "security"),
    },
    integrations: {
      label: "Integrations",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      tabs: tabs.filter((t) => t.category === "integrations"),
    },
    settings: {
      label: "Configuration",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      tabs: tabs.filter((t) => t.category === "settings"),
    },
    management: {
      label: "Site Management",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      tabs: tabs.filter((t) => t.category === "management"),
    },
    deployment: {
      label: "Testing & Deployment",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      tabs: tabs.filter((t) => t.category === "deployment"),
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-2 pb-4 border-b">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Cybersecurity Portfolio Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your cybersecurity portfolio content, integrations, and site configuration
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation */}
          <ScrollArea className="w-full">
            <div className="space-y-4 pb-4">
              {Object.entries(categories).map(([categoryKey, category]) => (
                <div key={categoryKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={`${category.color} font-medium px-3 py-1`}>{category.label}</Badge>
                  </div>
                  <TabsList
                    className="grid w-full gap-2 h-auto p-2 bg-muted/50"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(category.tabs.length, 6)}, 1fr)`,
                    }}
                  >
                    {category.tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex items-center gap-2 text-xs md:text-sm px-3 py-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        {tab.icon}
                        <span className="hidden sm:inline font-medium">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Tab Content */}
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6 mt-6">
              <Card className="shadow-sm border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">{tab.icon}</div>
                    {tab.label}
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">{tab.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-card">
                  <div className="text-foreground">{tab.component}</div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
