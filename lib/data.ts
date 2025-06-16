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

// Fallback data for when database is empty
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
    enabled: false,
    message: "We're working hard to bring you something amazing. Stay tuned!",
    estimatedCompletion: "Soon",
    progressPercentage: 75,
    allowAdminAccess: true,
  },
}

// Initialize application
export async function initializeApplication(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.warn("⚠️ Supabase not configured")
    return false
  }

  try {
    const { data, error } = await supabase.from("site_info").select("count").limit(1)
    if (error) {
      console.error("Database connection failed:", error)
      return false
    }
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("Error initializing application:", error)
    return false
  }
}

// Data access functions
export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    console.warn("⚠️ Supabase not configured, returning empty projects array")
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

export async function getSkills(): Promise<Skill[]> {
  if (!isSupabaseConfigured()) {
    console.warn("⚠️ Supabase not configured, returning empty skills array")
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

export async function getCertifications(): Promise<Certification[]> {
  if (!isSupabaseConfigured()) {
    console.warn("⚠️ Supabase not configured, returning empty certifications array")
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

export async function getCTFEvents(): Promise<CTFEvent[]> {
  if (!isSupabaseConfigured()) {
    console.warn("⚠️ Supabase not configured, returning empty CTF events array")
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

export async function getDigitalBadges(): Promise<DigitalBadge[]> {
  if (!isSupabaseConfigured()) {
    console.warn("⚠️ Supabase not configured, returning empty digital badges array")
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

export async function getSiteInfo(): Promise<SiteInfo> {
  if (!isSupabaseConfigured()) {
    console.warn("⚠️ Supabase not configured, returning fallback site info")
    return fallbackSiteInfo
  }

  try {
    const { data, error } = await supabase.from("site_info").select("*").limit(1).single()
    if (error) {
      console.warn("Site info not found, using fallback:", error.message)
      return fallbackSiteInfo
    }
    return data ? transformSiteInfoFromDb(data) : fallbackSiteInfo
  } catch (error) {
    console.error("Error fetching site info:", error)
    return fallbackSiteInfo
  }
}

export async function getUnderConstructionSettings() {
  const siteInfo = await getSiteInfo()
  return (
    siteInfo.underConstructionMode || {
      enabled: false,
      message: "We're working hard to bring you something amazing. Stay tuned!",
      estimatedCompletion: "Soon",
      progressPercentage: 75,
      allowAdminAccess: true,
    }
  )
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
