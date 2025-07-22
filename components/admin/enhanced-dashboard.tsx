"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Activity, ShieldCheck, Bug, Award, Users } from "lucide-react"
import type {
  Project,
  Skill,
  Certification,
  CTFEvent,
  DigitalBadge,
  BugBountyProgram,
  SecurityArticle,
  OSINTCapability,
  SiteInfo,
} from "@/lib/types"

interface EnhancedDashboardProps {
  projects: Project[]
  skills: Skill[]
  certifications: Certification[]
  ctfEvents: CTFEvent[]
  digitalBadges: DigitalBadge[]
  bugBountyPrograms: BugBountyProgram[]
  securityArticles: SecurityArticle[]
  osintCapabilities: OSINTCapability[]
  siteInfo: SiteInfo
}

export function EnhancedDashboard({
  projects,
  skills,
  certifications,
  ctfEvents,
  digitalBadges,
  bugBountyPrograms,
  securityArticles,
  osintCapabilities,
  siteInfo,
}: EnhancedDashboardProps) {
  // --- Key Metrics ---
  const totalProjects = projects.length
  const totalCertifications = certifications.length
  const totalSkills = skills.length
  const totalCTFEvents = ctfEvents.length
  const totalBugBountyPrograms = bugBountyPrograms.length
  const totalSecurityArticles = securityArticles.length
  const totalOSINTCapabilities = osintCapabilities.length

  // --- Data for Charts (simplified for demo) ---
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const projectsByCategory = projects.reduce(
    (acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const ctfEventsByPlatform = ctfEvents.reduce(
    (acc, event) => {
      acc[event.platform] = (acc[event.platform] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Overview Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <BarChart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Showcasing your work</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Certifications</CardTitle>
          <Award className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCertifications}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Validated expertise</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Skills Listed</CardTitle>
          <ShieldCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSkills}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Diverse capabilities</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CTF Engagements</CardTitle>
          <Bug className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCTFEvents}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Practical experience</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bug Bounty Programs</CardTitle>
          <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBugBountyPrograms}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Active participation</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Security Articles</CardTitle>
          <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSecurityArticles}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Knowledge sharing</p>
        </CardContent>
      </Card>

      {/* Charts/Detailed Info */}
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Skills Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(skillsByCategory).map(([category, count]) => (
            <div key={category} className="flex justify-between items-center py-1">
              <span>{category}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
          {Object.keys(skillsByCategory).length === 0 && (
            <p className="text-sm text-gray-500">No skills data available.</p>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <CardTitle>Projects by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(projectsByCategory).map(([category, count]) => (
            <div key={category} className="flex justify-between items-center py-1">
              <span>{category}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
          {Object.keys(projectsByCategory).length === 0 && (
            <p className="text-sm text-gray-500">No projects data available.</p>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Recent CTF Engagements</CardTitle>
        </CardHeader>
        <CardContent>
          {ctfEvents.length > 0 ? (
            <ul className="space-y-2">
              {ctfEvents.slice(0, 3).map((event) => (
                <li key={event.id} className="flex justify-between items-center text-sm">
                  <span>
                    {event.name} ({event.platform})
                  </span>
                  <span className="font-medium">{event.rank}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No CTF events recorded.</p>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Site Information Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 dark:text-gray-200">
          <p>
            <strong>Site Name:</strong> {siteInfo.site_name}
          </p>
          <p>
            <strong>Title:</strong> {siteInfo.title}
          </p>
          <p>
            <strong>Description:</strong> {siteInfo.description}
          </p>
          <p>
            <strong>Email:</strong> {siteInfo.email_address}
          </p>
          <p>
            <strong>LinkedIn:</strong> {siteInfo.linkedin_profile_url}
          </p>
          <p>
            <strong>GitHub:</strong> {siteInfo.github_username}
          </p>
          <p>
            <strong>Credly:</strong> {siteInfo.credly_username}
          </p>
          <p>
            <strong>HackerOne:</strong> {siteInfo.hackerone_username}
          </p>
          <p>
            <strong>Hack The Box:</strong> {siteInfo.hackthebox_username}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
