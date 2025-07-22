"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectsManager } from "@/components/admin/projects-manager"
import { SkillsManager } from "@/components/admin/skills-manager"
import { CertificationsManager } from "@/components/admin/certifications-manager"
import { CTFManager } from "@/components/admin/ctf-manager"
import { DigitalBadgesManager } from "@/components/admin/digital-badges-manager"
import { SiteInfoManager } from "@/components/admin/site-info-manager"
import { CredentialsManager } from "@/components/admin/credentials-manager"
import { AdvancedSettingsManager } from "@/components/admin/advanced-settings-manager"
import { BugBountyManager } from "@/components/admin/bug-bounty-manager"
import { SecurityArticlesManager } from "@/components/admin/security-articles-manager"
import { OSINTCapabilitiesManager } from "@/components/admin/osint-capabilities-manager"
import { FallbackManager } from "@/components/admin/fallback-manager"
import { ComprehensiveTesting } from "@/components/admin/comprehensive-testing"
import { EnhancedDashboard } from "@/components/admin/enhanced-dashboard"
import { LinkedAccountsManager } from "@/components/admin/linked-accounts-manager"
import { UnderConstructionManager } from "@/components/admin/under-construction-manager"
import type {
  Project,
  Skill,
  Certification,
  CTFEvent,
  DigitalBadge,
  SiteInfo,
  BugBountyProgram,
  SecurityArticle,
  OSINTCapability,
  IntegrationStatus,
  UnderConstructionSettings,
} from "@/lib/types"

interface AdminDashboardProps {
  projects: Project[]
  skills: Skill[]
  certifications: Certification[]
  ctfEvents: CTFEvent[]
  digitalBadges: DigitalBadge[]
  siteInfo: SiteInfo
  bugBountyPrograms: BugBountyProgram[]
  securityArticles: SecurityArticle[]
  osintCapabilities: OSINTCapability[]
  integrationStatus: IntegrationStatus[]
  underConstructionSettings: UnderConstructionSettings
}

export function AdminDashboard({
  projects,
  skills,
  certifications,
  ctfEvents,
  digitalBadges,
  siteInfo,
  bugBountyPrograms,
  securityArticles,
  osintCapabilities,
  integrationStatus,
  underConstructionSettings,
}: AdminDashboardProps) {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="site-info">Site Info</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="ctf-events">CTF Events</TabsTrigger>
          <TabsTrigger value="digital-badges">Digital Badges</TabsTrigger>
          <TabsTrigger value="bug-bounty">Bug Bounty</TabsTrigger>
          <TabsTrigger value="security-articles">Security Articles</TabsTrigger>
          <TabsTrigger value="osint-capabilities">OSINT Capabilities</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="under-construction">Under Construction</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="fallbacks">Fallbacks</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <EnhancedDashboard
            projects={projects}
            skills={skills}
            certifications={certifications}
            ctfEvents={ctfEvents}
            digitalBadges={digitalBadges}
            bugBountyPrograms={bugBountyPrograms}
            securityArticles={securityArticles}
            osintCapabilities={osintCapabilities}
            siteInfo={siteInfo}
          />
        </TabsContent>

        <TabsContent value="site-info" className="mt-6">
          <SiteInfoManager initialSiteInfo={siteInfo} />
        </TabsContent>

        <TabsContent value="credentials" className="mt-6">
          <CredentialsManager initialSiteInfo={siteInfo} />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsManager initialProjects={projects} />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillsManager initialSkills={skills} />
        </TabsContent>

        <TabsContent value="certifications" className="mt-6">
          <CertificationsManager initialCertifications={certifications} />
        </TabsContent>

        <TabsContent value="ctf-events" className="mt-6">
          <CTFManager initialCTFEvents={ctfEvents} />
        </TabsContent>

        <TabsContent value="digital-badges" className="mt-6">
          <DigitalBadgesManager initialDigitalBadges={digitalBadges} />
        </TabsContent>

        <TabsContent value="bug-bounty" className="mt-6">
          <BugBountyManager initialBugBountyPrograms={bugBountyPrograms} />
        </TabsContent>

        <TabsContent value="security-articles" className="mt-6">
          <SecurityArticlesManager initialSecurityArticles={securityArticles} />
        </TabsContent>

        <TabsContent value="osint-capabilities" className="mt-6">
          <OSINTCapabilitiesManager initialOSINTCapabilities={osintCapabilities} />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <LinkedAccountsManager initialIntegrationStatus={integrationStatus} />
        </TabsContent>

        <TabsContent value="under-construction" className="mt-6">
          <UnderConstructionManager initialUnderConstructionSettings={underConstructionSettings} />
        </TabsContent>

        <TabsContent value="testing" className="mt-6">
          <ComprehensiveTesting />
        </TabsContent>

        <TabsContent value="fallbacks" className="mt-6">
          <FallbackManager />
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <AdvancedSettingsManager
            initialSiteInfo={siteInfo}
            initialUnderConstructionSettings={underConstructionSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
