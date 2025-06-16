import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabase"

// Type definitions
export interface Project {
  id: string
  title: string
  summary: string
  description: string
  image?: string
  technologies: string[]
  demoUrl?: string
  githubUrl?: string
  date: string
  linkedinImported?: boolean
  lastUpdated?: string
}

export interface Skill {
  id: string
  name: string
  level: number
  category: string
  linkedinImported?: boolean
  endorsements?: number
  lastUpdated?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
  description: string
  logo?: string
  credentialUrl?: string
  verificationStatus?: "verified" | "pending" | "expired"
  autoImported?: boolean
}

export interface CTFEvent {
  id: string
  name: string
  date: string
  difficulty: "Easy" | "Medium" | "Hard"
  team: string
  rank: number
  totalTeams: number
  flagsCaptured: number
  description?: string
  platform?: string
  points?: number
  writeupUrl?: string
  challenges?: any[]
}

export interface DigitalBadge {
  id: string
  name: string
  issuer: string
  date: string
  description: string
  badgeUrl: string
  verificationUrl?: string
  platform: "linkedin" | "canvas" | "credly" | "other"
  skills?: string[]
  image?: string
}

export interface BugBountyFinding {
  id: string
  title: string
  platform: "hackerone" | "bugcrowd" | "intigriti" | "other"
  severity: "critical" | "high" | "medium" | "low" | "info"
  status: "resolved" | "triaged" | "duplicate" | "not-applicable"
  bounty?: number
  date: string
  description: string
  cve?: string
  reportUrl?: string
  company: string
}

export interface SecurityArticle {
  id: string
  title: string
  platform: string
  url: string
  publishedDate: string
  summary: string
  tags: string[]
  readTime?: number
  views?: number
  claps?: number
}

export interface OSINTCapability {
  id: string
  name: string
  category: string
  description: string
  tools: string[]
  examples?: string[]
  proficiencyLevel: number
}

export interface SiteInfo {
  id?: string
  name: string
  title: string
  description: string
  email: string
  github?: string
  linkedin?: string
  twitter?: string
  resume?: string
  icon?: string
  backgroundImage?: string
  backgroundOpacity: number
  theme: any
  siteUrl?: string
  linkedinProfileUrl?: string
  autoImportSettings?: any
  underConstructionMode?: any
}

// Fallback data for when Supabase is not configured
const fallbackSiteInfo: SiteInfo = {
  id: "default",
  name: "Cybersecurity Professional",
  title: "Cybersecurity Specialist & Ethical Hacker",
  description: "Passionate about cybersecurity, ethical hacking, and protecting digital assets.",
  email: "contact@example.com",
  github: "https://github.com/username",
  linkedin: "https://linkedin.com/in/username",
  backgroundOpacity: 0.7,
  theme: {
    primary: "#3b82f6",
    secondary: "#1e40af",
    accent: "#06b6d4",
  },
  underConstructionMode: {
    enabled: true,
    message: "We're working hard to bring you something amazing. Stay tuned!",
    estimatedCompletion: "Soon",
    progressPercentage: 75,
    allowAdminAccess: true,
  },
}

// Initialize application
export async function initializeApplication(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, using fallback mode")
    return false
  }

  try {
    const { data, error } = await supabase.from("site_info").select("count").limit(1)
    if (error) {
      console.error("Database connection failed:", error)
      return false
    }
    console.log("Database connection successful")
    return true
  } catch (error) {
    console.error("Error initializing application:", error)
    return false
  }
}

// Helper functions to transform between database and app types
function transformProjectFromDb(dbProject: any): Project {
  return {
    id: dbProject.id,
    title: dbProject.title,
    summary: dbProject.summary,
    description: dbProject.description,
    image: dbProject.image || undefined,
    technologies: dbProject.technologies || [],
    demoUrl: dbProject.demo_url || undefined,
    githubUrl: dbProject.github_url || undefined,
    date: dbProject.date,
    linkedinImported: dbProject.linkedin_imported || false,
    lastUpdated: dbProject.last_updated,
  }
}

function transformProjectToDb(project: Partial<Project>): any {
  const dbProject: any = {}
  if (project.title !== undefined) dbProject.title = project.title
  if (project.summary !== undefined) dbProject.summary = project.summary
  if (project.description !== undefined) dbProject.description = project.description
  if (project.image !== undefined) dbProject.image = project.image
  if (project.technologies !== undefined) dbProject.technologies = project.technologies
  if (project.demoUrl !== undefined) dbProject.demo_url = project.demoUrl
  if (project.githubUrl !== undefined) dbProject.github_url = project.githubUrl
  if (project.date !== undefined) dbProject.date = project.date
  if (project.linkedinImported !== undefined) dbProject.linkedin_imported = project.linkedinImported
  return dbProject
}

function transformSkillFromDb(dbSkill: any): Skill {
  return {
    id: dbSkill.id,
    name: dbSkill.name,
    level: dbSkill.level,
    category: dbSkill.category,
    linkedinImported: dbSkill.linkedin_imported || false,
    endorsements: dbSkill.endorsements || 0,
    lastUpdated: dbSkill.last_updated,
  }
}

function transformSkillToDb(skill: Partial<Skill>): any {
  const dbSkill: any = {}
  if (skill.name !== undefined) dbSkill.name = skill.name
  if (skill.level !== undefined) dbSkill.level = skill.level
  if (skill.category !== undefined) dbSkill.category = skill.category
  if (skill.linkedinImported !== undefined) dbSkill.linkedin_imported = skill.linkedinImported
  if (skill.endorsements !== undefined) dbSkill.endorsements = skill.endorsements
  return dbSkill
}

function transformCertificationFromDb(dbCert: any): Certification {
  return {
    id: dbCert.id,
    name: dbCert.name,
    issuer: dbCert.issuer,
    date: dbCert.date,
    expiryDate: dbCert.expiry_date || undefined,
    description: dbCert.description,
    logo: dbCert.logo || undefined,
    credentialUrl: dbCert.credential_url || undefined,
    verificationStatus: dbCert.verification_status as "verified" | "pending" | "expired",
    autoImported: dbCert.auto_imported || false,
  }
}

function transformCertificationToDb(cert: Partial<Certification>): any {
  const dbCert: any = {}
  if (cert.name !== undefined) dbCert.name = cert.name
  if (cert.issuer !== undefined) dbCert.issuer = cert.issuer
  if (cert.date !== undefined) dbCert.date = cert.date
  if (cert.expiryDate !== undefined) dbCert.expiry_date = cert.expiryDate
  if (cert.description !== undefined) dbCert.description = cert.description
  if (cert.logo !== undefined) dbCert.logo = cert.logo
  if (cert.credentialUrl !== undefined) dbCert.credential_url = cert.credentialUrl
  if (cert.verificationStatus !== undefined) dbCert.verification_status = cert.verificationStatus
  if (cert.autoImported !== undefined) dbCert.auto_imported = cert.autoImported
  return dbCert
}

function transformCTFEventFromDb(dbEvent: any): CTFEvent {
  return {
    id: dbEvent.id,
    name: dbEvent.name,
    date: dbEvent.date,
    difficulty: dbEvent.difficulty as "Easy" | "Medium" | "Hard",
    team: dbEvent.team,
    rank: dbEvent.rank,
    totalTeams: dbEvent.total_teams,
    flagsCaptured: dbEvent.flags_captured,
    description: dbEvent.description || undefined,
    platform: dbEvent.platform || undefined,
    points: dbEvent.points || undefined,
    writeupUrl: dbEvent.writeup_url || undefined,
    challenges: [],
  }
}

function transformCTFEventToDb(event: Partial<CTFEvent>): any {
  const dbEvent: any = {}
  if (event.name !== undefined) dbEvent.name = event.name
  if (event.date !== undefined) dbEvent.date = event.date
  if (event.difficulty !== undefined) dbEvent.difficulty = event.difficulty
  if (event.team !== undefined) dbEvent.team = event.team
  if (event.rank !== undefined) dbEvent.rank = event.rank
  if (event.totalTeams !== undefined) dbEvent.total_teams = event.totalTeams
  if (event.flagsCaptured !== undefined) dbEvent.flags_captured = event.flagsCaptured
  if (event.description !== undefined) dbEvent.description = event.description
  if (event.platform !== undefined) dbEvent.platform = event.platform
  if (event.points !== undefined) dbEvent.points = event.points
  if (event.writeupUrl !== undefined) dbEvent.writeup_url = event.writeupUrl
  return dbEvent
}

function transformDigitalBadgeFromDb(dbBadge: any): DigitalBadge {
  return {
    id: dbBadge.id,
    name: dbBadge.name,
    issuer: dbBadge.issuer,
    date: dbBadge.date,
    description: dbBadge.description,
    badgeUrl: dbBadge.badge_url,
    verificationUrl: dbBadge.verification_url || undefined,
    platform: dbBadge.platform as "linkedin" | "canvas" | "credly" | "other",
    skills: dbBadge.skills || [],
    image: dbBadge.image || undefined,
  }
}

function transformDigitalBadgeToDb(badge: Partial<DigitalBadge>): any {
  const dbBadge: any = {}
  if (badge.name !== undefined) dbBadge.name = badge.name
  if (badge.issuer !== undefined) dbBadge.issuer = badge.issuer
  if (badge.date !== undefined) dbBadge.date = badge.date
  if (badge.description !== undefined) dbBadge.description = badge.description
  if (badge.badgeUrl !== undefined) dbBadge.badge_url = badge.badgeUrl
  if (badge.verificationUrl !== undefined) dbBadge.verification_url = badge.verificationUrl
  if (badge.platform !== undefined) dbBadge.platform = badge.platform
  if (badge.skills !== undefined) dbBadge.skills = badge.skills
  if (badge.image !== undefined) dbBadge.image = badge.image
  return dbBadge
}

function transformSiteInfoFromDb(dbSiteInfo: any): SiteInfo {
  return {
    id: dbSiteInfo.id,
    name: dbSiteInfo.name,
    title: dbSiteInfo.title,
    description: dbSiteInfo.description,
    email: dbSiteInfo.email,
    github: dbSiteInfo.github || undefined,
    linkedin: dbSiteInfo.linkedin || undefined,
    twitter: dbSiteInfo.twitter || undefined,
    resume: dbSiteInfo.resume || undefined,
    icon: dbSiteInfo.icon || undefined,
    backgroundImage: dbSiteInfo.background_image || undefined,
    backgroundOpacity: dbSiteInfo.background_opacity || 0.7,
    theme: dbSiteInfo.theme || {},
    siteUrl: dbSiteInfo.site_url || undefined,
    linkedinProfileUrl: dbSiteInfo.linkedin_profile_url || undefined,
    autoImportSettings: dbSiteInfo.auto_import_settings || undefined,
    underConstructionMode: dbSiteInfo.under_construction_mode || undefined,
  }
}

function transformSiteInfoToDb(siteInfo: Partial<SiteInfo>): any {
  const dbSiteInfo: any = {}
  if (siteInfo.name !== undefined) dbSiteInfo.name = siteInfo.name
  if (siteInfo.title !== undefined) dbSiteInfo.title = siteInfo.title
  if (siteInfo.description !== undefined) dbSiteInfo.description = siteInfo.description
  if (siteInfo.email !== undefined) dbSiteInfo.email = siteInfo.email
  if (siteInfo.github !== undefined) dbSiteInfo.github = siteInfo.github
  if (siteInfo.linkedin !== undefined) dbSiteInfo.linkedin = siteInfo.linkedin
  if (siteInfo.twitter !== undefined) dbSiteInfo.twitter = siteInfo.twitter
  if (siteInfo.resume !== undefined) dbSiteInfo.resume = siteInfo.resume
  if (siteInfo.icon !== undefined) dbSiteInfo.icon = siteInfo.icon
  if (siteInfo.backgroundImage !== undefined) dbSiteInfo.background_image = siteInfo.backgroundImage
  if (siteInfo.backgroundOpacity !== undefined) dbSiteInfo.background_opacity = siteInfo.backgroundOpacity
  if (siteInfo.theme !== undefined) dbSiteInfo.theme = siteInfo.theme
  if (siteInfo.siteUrl !== undefined) dbSiteInfo.site_url = siteInfo.siteUrl
  if (siteInfo.linkedinProfileUrl !== undefined) dbSiteInfo.linkedin_profile_url = siteInfo.linkedinProfileUrl
  if (siteInfo.autoImportSettings !== undefined) dbSiteInfo.auto_import_settings = siteInfo.autoImportSettings
  if (siteInfo.underConstructionMode !== undefined) dbSiteInfo.under_construction_mode = siteInfo.underConstructionMode
  return dbSiteInfo
}

// Data access functions
export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, returning empty projects array")
    return []
  }

  try {
    const { data, error } = await supabase.from("projects").select("*").order("date", { ascending: false })
    if (error) {
      console.error("Error fetching projects:", error)
      return []
    }
    return data?.map(transformProjectFromDb) || []
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export async function getProject(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured")
    return null
  }

  try {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()
    if (error) {
      console.error("Error fetching project:", error)
      return null
    }
    return data ? transformProjectFromDb(data) : null
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export async function addProject(project: Omit<Project, "id">): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return null
  }

  try {
    const projectData = transformProjectToDb(project)
    projectData.created_at = new Date().toISOString()
    projectData.last_updated = new Date().toISOString()

    const { data, error } = await supabaseAdmin.from("projects").insert(projectData).select().single()
    if (error) {
      console.error("Error adding project:", error)
      return null
    }
    return data ? transformProjectFromDb(data) : null
  } catch (error) {
    console.error("Error adding project:", error)
    return null
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return null
  }

  try {
    const projectData = transformProjectToDb(updates)
    projectData.last_updated = new Date().toISOString()

    const { data, error } = await supabaseAdmin.from("projects").update(projectData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating project:", error)
      return null
    }
    return data ? transformProjectFromDb(data) : null
  } catch (error) {
    console.error("Error updating project:", error)
    return null
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return false
  }

  try {
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id)
    if (error) {
      console.error("Error deleting project:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("Error deleting project:", error)
    return false
  }
}

export async function getSkills(): Promise<Skill[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, returning empty skills array")
    return []
  }

  try {
    const { data, error } = await supabase.from("skills").select("*").order("level", { ascending: false })
    if (error) {
      console.error("Error fetching skills:", error)
      return []
    }
    return data?.map(transformSkillFromDb) || []
  } catch (error) {
    console.error("Error fetching skills:", error)
    return []
  }
}

export async function addSkill(skill: Omit<Skill, "id">): Promise<Skill | null> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return null
  }

  try {
    const skillData = transformSkillToDb(skill)
    skillData.created_at = new Date().toISOString()
    skillData.last_updated = new Date().toISOString()

    const { data, error } = await supabaseAdmin.from("skills").insert(skillData).select().single()
    if (error) {
      console.error("Error adding skill:", error)
      return null
    }
    return data ? transformSkillFromDb(data) : null
  } catch (error) {
    console.error("Error adding skill:", error)
    return null
  }
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill | null> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return null
  }

  try {
    const skillData = transformSkillToDb(updates)
    skillData.last_updated = new Date().toISOString()

    const { data, error } = await supabaseAdmin.from("skills").update(skillData).eq("id", id).select().single()
    if (error) {
      console.error("Error updating skill:", error)
      return null
    }
    return data ? transformSkillFromDb(data) : null
  } catch (error) {
    console.error("Error updating skill:", error)
    return null
  }
}

export async function deleteSkill(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return false
  }

  try {
    const { error } = await supabaseAdmin.from("skills").delete().eq("id", id)
    if (error) {
      console.error("Error deleting skill:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("Error deleting skill:", error)
    return false
  }
}

export async function getCertifications(): Promise<Certification[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, returning empty certifications array")
    return []
  }

  try {
    const { data, error } = await supabase.from("certifications").select("*").order("date", { ascending: false })
    if (error) {
      console.error("Error fetching certifications:", error)
      return []
    }
    return data?.map(transformCertificationFromDb) || []
  } catch (error) {
    console.error("Error fetching certifications:", error)
    return []
  }
}

export async function addCertification(certification: Omit<Certification, "id">): Promise<Certification | null> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return null
  }

  try {
    const certData = transformCertificationToDb(certification)
    certData.created_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin.from("certifications").insert(certData).select().single()
    if (error) {
      console.error("Error adding certification:", error)
      return null
    }
    return data ? transformCertificationFromDb(data) : null
  } catch (error) {
    console.error("Error adding certification:", error)
    return null
  }
}

export async function updateCertification(id: string, updates: Partial<Certification>): Promise<Certification | null> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return null
  }

  try {
    const certData = transformCertificationToDb(updates)
    const { data, error } = await supabaseAdmin.from("certifications").update(certData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating certification:", error)
      return null
    }
    return data ? transformCertificationFromDb(data) : null
  } catch (error) {
    console.error("Error updating certification:", error)
    return null
  }
}

export async function deleteCertification(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return false
  }

  try {
    const { error } = await supabaseAdmin.from("certifications").delete().eq("id", id)
    if (error) {
      console.error("Error deleting certification:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("Error deleting certification:", error)
    return false
  }
}

export async function getCTFEvents(): Promise<CTFEvent[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, returning empty CTF events array")
    return []
  }

  try {
    const { data, error } = await supabase.from("ctf_events").select("*").order("date", { ascending: false })
    if (error) {
      console.error("Error fetching CTF events:", error)
      return []
    }
    return data?.map(transformCTFEventFromDb) || []
  } catch (error) {
    console.error("Error fetching CTF events:", error)
    return []
  }
}

export async function getCTFEvent(id: string): Promise<CTFEvent | null> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured")
    return null
  }

  try {
    const { data, error } = await supabase.from("ctf_events").select("*").eq("id", id).single()
    if (error) {
      console.error("Error fetching CTF event:", error)
      return null
    }
    return data ? transformCTFEventFromDb(data) : null
  } catch (error) {
    console.error("Error fetching CTF event:", error)
    return null
  }
}

export async function addCTFEvent(event: Omit<CTFEvent, "id">): Promise<CTFEvent | null> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return null
  }

  try {
    const eventData = transformCTFEventToDb(event)
    eventData.created_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin.from("ctf_events").insert(eventData).select().single()
    if (error) {
      console.error("Error adding CTF event:", error)
      return null
    }
    return data ? transformCTFEventFromDb(data) : null
  } catch (error) {
    console.error("Error adding CTF event:", error)
    return null
  }
}

export async function updateCTFEvent(id: string, updates: Partial<CTFEvent>): Promise<CTFEvent | null> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return null
  }

  try {
    const eventData = transformCTFEventToDb(updates)
    const { data, error } = await supabaseAdmin.from("ctf_events").update(eventData).eq("id", id).select().single()
    if (error) {
      console.error("Error updating CTF event:", error)
      return null
    }
    return data ? transformCTFEventFromDb(data) : null
  } catch (error) {
    console.error("Error updating CTF event:", error)
    return null
  }
}

export async function deleteCTFEvent(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return false
  }

  try {
    const { error } = await supabaseAdmin.from("ctf_events").delete().eq("id", id)
    if (error) {
      console.error("Error deleting CTF event:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("Error deleting CTF event:", error)
    return false
  }
}

export async function getDigitalBadges(): Promise<DigitalBadge[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, returning empty digital badges array")
    return []
  }

  try {
    const { data, error } = await supabase.from("digital_badges").select("*").order("date", { ascending: false })
    if (error) {
      console.error("Error fetching digital badges:", error)
      return []
    }
    return data?.map(transformDigitalBadgeFromDb) || []
  } catch (error) {
    console.error("Error fetching digital badges:", error)
    return []
  }
}

export async function addDigitalBadge(badge: Omit<DigitalBadge, "id">): Promise<DigitalBadge | null> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return null
  }

  try {
    const badgeData = transformDigitalBadgeToDb(badge)
    badgeData.created_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin.from("digital_badges").insert(badgeData).select().single()
    if (error) {
      console.error("Error adding digital badge:", error)
      return null
    }
    return data ? transformDigitalBadgeFromDb(data) : null
  } catch (error) {
    console.error("Error adding digital badge:", error)
    return null
  }
}

export async function updateDigitalBadge(id: string, updates: Partial<DigitalBadge>): Promise<DigitalBadge | null> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return null
  }

  try {
    const badgeData = transformDigitalBadgeToDb(updates)
    const { data, error } = await supabaseAdmin.from("digital_badges").update(badgeData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating digital badge:", error)
      return null
    }
    return data ? transformDigitalBadgeFromDb(data) : null
  } catch (error) {
    console.error("Error updating digital badge:", error)
    return null
  }
}

export async function deleteDigitalBadge(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return false
  }

  try {
    const { error } = await supabaseAdmin.from("digital_badges").delete().eq("id", id)
    if (error) {
      console.error("Error deleting digital badge:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("Error deleting digital badge:", error)
    return false
  }
}

export async function getSiteInfo(): Promise<SiteInfo> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, returning fallback site info")
    return fallbackSiteInfo
  }

  try {
    const { data, error } = await supabase.from("site_info").select("*").limit(1).single()
    if (error) {
      console.error("Error fetching site info:", error)
      return fallbackSiteInfo
    }
    return data ? transformSiteInfoFromDb(data) : fallbackSiteInfo
  } catch (error) {
    console.error("Error fetching site info:", error)
    return fallbackSiteInfo
  }
}

export async function updateSiteInfo(updates: Partial<SiteInfo>): Promise<SiteInfo | null> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase not configured")
    return null
  }

  try {
    const siteInfoData = transformSiteInfoToDb(updates)
    siteInfoData.updated_at = new Date().toISOString()

    // Try to update existing record first
    const { data: existingData } = await supabaseAdmin.from("site_info").select("id").limit(1).single()

    if (existingData) {
      const { data, error } = await supabaseAdmin
        .from("site_info")
        .update(siteInfoData)
        .eq("id", existingData.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating site info:", error)
        return null
      }
      return data ? transformSiteInfoFromDb(data) : null
    } else {
      // Insert new record
      siteInfoData.created_at = new Date().toISOString()
      const { data, error } = await supabaseAdmin.from("site_info").insert(siteInfoData).select().single()

      if (error) {
        console.error("Error creating site info:", error)
        return null
      }
      return data ? transformSiteInfoFromDb(data) : null
    }
  } catch (error) {
    console.error("Error saving site info:", error)
    return null
  }
}

export async function getUnderConstructionSettings() {
  const siteInfo = await getSiteInfo()
  return (
    siteInfo.underConstructionMode || {
      enabled: true,
      message: "We're working hard to bring you something amazing. Stay tuned!",
      estimatedCompletion: "Soon",
      progressPercentage: 75,
      allowAdminAccess: true,
    }
  )
}

export async function updateUnderConstructionSettings(settings: any) {
  try {
    const updatedSiteInfo = await updateSiteInfo({
      underConstructionMode: settings,
    })
    return updatedSiteInfo?.underConstructionMode || settings
  } catch (error) {
    console.error("Error updating under construction settings:", error)
    throw error
  }
}

// Authentication functions
export async function validateUser(
  username: string,
  password: string,
): Promise<{ id: string; username: string } | null> {
  // Check environment variables first
  const adminUsername = process.env.ADMIN_USERNAME || "admin"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  if (username === adminUsername && password === adminPassword) {
    return { id: "admin", username }
  }

  // If env vars don't match, check database
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data, error } = await supabaseAdmin.from("admin_users").select("*").eq("username", username).single()

    if (error || !data) {
      return null
    }

    // In a real app, you'd hash the password and compare
    if (data.password_hash === password) {
      return { id: data.id, username: data.username }
    }

    return null
  } catch (error) {
    console.error("Error validating user:", error)
    return null
  }
}

// Session management (simplified)
let currentSession: { userId: string; username: string } | null = null

export async function loginUser(username: string, password: string): Promise<boolean> {
  const user = await validateUser(username, password)
  if (user) {
    currentSession = user
    return true
  }
  return false
}

export async function logoutUser(): Promise<void> {
  currentSession = null
}

export async function getCurrentUser(): Promise<{ userId: string; username: string } | null> {
  return currentSession
}

export async function isAuthenticated(): Promise<boolean> {
  return currentSession !== null
}

// Legacy file-based functions for backward compatibility
export async function readData<T>(filename: string, defaultValue: T): Promise<T> {
  console.warn(`readData is deprecated. Use specific Supabase functions instead.`)
  return defaultValue
}

export async function writeData<T>(filename: string, data: T): Promise<void> {
  console.warn(`writeData is deprecated. Use specific Supabase functions instead.`)
}

// Backward compatibility aliases
export const getProjectById = getProject
export const getCTFEventById = getCTFEvent
export const getBugBountyFindingById = async (id: string) => {
  // This would need to be implemented when bug bounty findings are added
  return null
}
