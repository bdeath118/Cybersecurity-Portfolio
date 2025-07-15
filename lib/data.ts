import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabase"

// Type definitions for our data structures
export interface Project {
  id: string
  title: string
  summary: string
  description: string
  image?: string
  technologies: string[]
  demo_url?: string
  github_url?: string
  date: string
  linkedin_imported?: boolean
  last_updated?: string
  created_at?: string
}

export interface Skill {
  id: string
  name: string
  level: number
  category: string
  linkedin_imported?: boolean
  endorsements?: number
  last_updated?: string
  created_at?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiry_date?: string
  description: string
  logo?: string
  credential_url?: string
  verification_status?: string
  auto_imported?: boolean
  created_at?: string
}

export interface CTFEvent {
  id: string
  name: string
  date: string
  difficulty: string
  team: string
  rank: number
  total_teams: number
  flags_captured: number
  description?: string
  platform?: string
  points?: number
  writeup_url?: string
  created_at?: string
}

export interface DigitalBadge {
  id: string
  name: string
  issuer: string
  date: string
  description: string
  badge_url: string
  verification_url?: string
  platform: string
  skills?: string[]
  image?: string
  created_at?: string
}

export interface SiteInfo {
  id: string
  name: string
  title: string
  description: string
  email: string
  github?: string
  linkedin?: string
  twitter?: string
  resume?: string
  icon?: string
  background_image?: string
  background_opacity: number
  theme: any
  site_url?: string
  linkedin_profile_url?: string
  auto_import_settings?: any
  under_construction_mode?: any
  created_at?: string
  updated_at?: string
}

export interface UnderConstructionSettings {
  enabled: boolean
  message: string
  estimated_completion?: string
  progress_percentage?: number
  allow_admin_access?: boolean
  contact_email?: string
}

// Default data for when database is not available
const defaultProjects: Project[] = [
  {
    id: "1",
    title: "Network Security Assessment Tool",
    summary: "Automated vulnerability scanner for network infrastructure",
    description:
      "A comprehensive network security assessment tool built with Python that automates the process of scanning network infrastructure for common vulnerabilities. Features include port scanning, service enumeration, and vulnerability detection with detailed reporting capabilities.",
    image: "/placeholder.svg?height=400&width=600",
    technologies: ["Python", "Nmap", "Scapy", "SQLite", "Flask"],
    demo_url: "https://demo.example.com",
    github_url: "https://github.com/example/network-scanner",
    date: "2024-01-15",
    linkedin_imported: false,
  },
  {
    id: "2",
    title: "Web Application Penetration Testing Framework",
    summary: "Custom framework for automated web application security testing",
    description:
      "A modular penetration testing framework designed specifically for web applications. Includes automated SQL injection detection, XSS testing, authentication bypass attempts, and comprehensive reporting with remediation suggestions.",
    image: "/placeholder.svg?height=400&width=600",
    technologies: ["Python", "Selenium", "BeautifulSoup", "Burp Suite API", "Django"],
    demo_url: "https://demo.example.com",
    github_url: "https://github.com/example/web-pentest-framework",
    date: "2023-11-20",
    linkedin_imported: false,
  },
]

const defaultSkills: Skill[] = [
  { id: "1", name: "Penetration Testing", level: 90, category: "Security Testing", endorsements: 15 },
  { id: "2", name: "Network Security", level: 85, category: "Infrastructure Security", endorsements: 12 },
  { id: "3", name: "Web Application Security", level: 88, category: "Application Security", endorsements: 18 },
  { id: "4", name: "Python", level: 92, category: "Programming", endorsements: 25 },
  { id: "5", name: "Linux Administration", level: 87, category: "System Administration", endorsements: 20 },
  { id: "6", name: "Vulnerability Assessment", level: 89, category: "Security Testing", endorsements: 16 },
]

const defaultCertifications: Certification[] = [
  {
    id: "1",
    name: "Certified Ethical Hacker (CEH)",
    issuer: "EC-Council",
    date: "2023-06-15",
    expiry_date: "2026-06-15",
    description: "Comprehensive ethical hacking and penetration testing certification",
    verification_status: "verified",
    auto_imported: false,
  },
  {
    id: "2",
    name: "CompTIA Security+",
    issuer: "CompTIA",
    date: "2022-03-10",
    expiry_date: "2025-03-10",
    description: "Foundational cybersecurity skills and knowledge certification",
    verification_status: "verified",
    auto_imported: false,
  },
]

const defaultCTFEvents: CTFEvent[] = [
  {
    id: "1",
    name: "CyberDefenders Blue Team CTF",
    date: "2024-01-20",
    difficulty: "Advanced",
    team: "SecureTeam",
    rank: 15,
    total_teams: 200,
    flags_captured: 8,
    description: "Blue team focused CTF with incident response and forensics challenges",
    platform: "CyberDefenders",
    points: 2500,
  },
  {
    id: "2",
    name: "HackTheBox University CTF",
    date: "2023-12-05",
    difficulty: "Intermediate",
    team: "Solo",
    rank: 42,
    total_teams: 150,
    flags_captured: 6,
    description: "University-level CTF covering web exploitation and cryptography",
    platform: "HackTheBox",
    points: 1800,
  },
]

const defaultDigitalBadges: DigitalBadge[] = [
  {
    id: "1",
    name: "Cybersecurity Fundamentals",
    issuer: "IBM",
    date: "2023-08-15",
    description: "Foundational cybersecurity concepts and practices",
    badge_url: "https://www.credly.com/badges/example-1",
    platform: "Credly",
    skills: ["Cybersecurity", "Risk Management", "Security Frameworks"],
  },
  {
    id: "2",
    name: "Ethical Hacker",
    issuer: "EC-Council",
    date: "2023-06-20",
    description: "Ethical hacking and penetration testing expertise",
    badge_url: "https://www.credly.com/badges/example-2",
    platform: "Credly",
    skills: ["Penetration Testing", "Vulnerability Assessment", "Network Security"],
  },
]

const defaultSiteInfo: SiteInfo = {
  id: "1",
  name: process.env.ADMIN_USERNAME || "Alex Johnson",
  title: "Cybersecurity Professional & Ethical Hacker",
  description:
    "Passionate cybersecurity professional specializing in penetration testing, vulnerability assessment, and secure system design. Experienced in both offensive and defensive security practices.",
  email: "alex.johnson@example.com",
  github: process.env.GITHUB_USERNAME
    ? `https://github.com/${process.env.GITHUB_USERNAME}`
    : "https://github.com/alexjohnson",
  linkedin: process.env.LINKEDIN_PROFILE_URL || "https://linkedin.com/in/alexjohnson",
  twitter: "https://twitter.com/alexjohnson",
  background_image: "/images/background.jpeg",
  background_opacity: 0.7,
  theme: {
    primary: "#3b82f6",
    secondary: "#1e40af",
    accent: "#06b6d4",
  },
  site_url:
    process.env.SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://cybersecurity-portfolio.vercel.app",
  linkedin_profile_url: process.env.LINKEDIN_PROFILE_URL || "https://linkedin.com/in/alexjohnson",
  auto_import_settings: {
    linkedin: { enabled: false, last_sync: null },
    credly: { enabled: false, last_sync: null },
    github: { enabled: false, last_sync: null },
  },
  under_construction_mode: {
    enabled: false,
    message: "We're working hard to bring you something amazing. Stay tuned!",
    estimated_completion: "Soon",
    progress_percentage: 75,
    allow_admin_access: true,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Helper function to handle database operations with fallbacks
async function withFallback<T>(operation: () => Promise<T>, fallback: T, operationName: string): Promise<T> {
  if (!isSupabaseConfigured()) {
    console.warn(`⚠️ Supabase not configured, using fallback data for ${operationName}`)
    return fallback
  }

  try {
    return await operation()
  } catch (error) {
    console.error(`❌ Database operation failed for ${operationName}:`, error)
    console.warn(`⚠️ Using fallback data for ${operationName}`)
    return fallback
  }
}

// Initialize application data
export async function initializeApplication(): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.warn("⚠️ Supabase not configured, skipping database initialization")
    return
  }

  try {
    // Check if site_info exists, if not create default
    const { data: siteInfo } = await supabase.from("site_info").select("*").limit(1).single()

    if (!siteInfo) {
      await supabase.from("site_info").insert([defaultSiteInfo])
      console.log("✅ Default site info created")
    }

    // Seed default data if tables are empty
    const { data: projects } = await supabase.from("projects").select("id").limit(1)
    if (!projects || projects.length === 0) {
      await supabase.from("projects").insert(defaultProjects)
      console.log("✅ Default projects seeded")
    }

    const { data: skills } = await supabase.from("skills").select("id").limit(1)
    if (!skills || skills.length === 0) {
      await supabase.from("skills").insert(defaultSkills)
      console.log("✅ Default skills seeded")
    }

    const { data: certifications } = await supabase.from("certifications").select("id").limit(1)
    if (!certifications || certifications.length === 0) {
      await supabase.from("certifications").insert(defaultCertifications)
      console.log("✅ Default certifications seeded")
    }

    const { data: ctfEvents } = await supabase.from("ctf_events").select("id").limit(1)
    if (!ctfEvents || ctfEvents.length === 0) {
      await supabase.from("ctf_events").insert(defaultCTFEvents)
      console.log("✅ Default CTF events seeded")
    }

    const { data: digitalBadges } = await supabase.from("digital_badges").select("id").limit(1)
    if (!digitalBadges || digitalBadges.length === 0) {
      await supabase.from("digital_badges").insert(defaultDigitalBadges)
      console.log("✅ Default digital badges seeded")
    }
  } catch (error) {
    console.error("❌ Failed to initialize app:", error)
  }
}

// Projects CRUD operations
export async function getProjects(): Promise<Project[]> {
  return withFallback(
    async () => {
      const { data, error } = await supabase.from("projects").select("*").order("date", { ascending: false })

      if (error) throw error
      return data || []
    },
    defaultProjects,
    "getProjects",
  )
}

export async function getProject(id: string): Promise<Project | null> {
  return withFallback(
    async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

      if (error) throw error
      return data
    },
    defaultProjects.find((p) => p.id === id) || null,
    "getProject",
  )
}

export async function addProject(project: Omit<Project, "id" | "created_at">): Promise<Project> {
  return withFallback(
    async () => {
      const newProject = {
        ...project,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      }

      const { data, error } = await supabaseAdmin.from("projects").insert([newProject]).select().single()

      if (error) throw error
      return data
    },
    { ...project, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Project,
    "addProject",
  )
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  return withFallback(
    async () => {
      const { data, error } = await supabaseAdmin
        .from("projects")
        .update({ ...updates, last_updated: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    { ...defaultProjects.find((p) => p.id === id), ...updates } as Project,
    "updateProject",
  )
}

export async function deleteProject(id: string): Promise<void> {
  return withFallback(
    async () => {
      const { error } = await supabaseAdmin.from("projects").delete().eq("id", id)

      if (error) throw error
    },
    undefined,
    "deleteProject",
  )
}

// Skills CRUD operations
export async function getSkills(): Promise<Skill[]> {
  return withFallback(
    async () => {
      const { data, error } = await supabase.from("skills").select("*").order("level", { ascending: false })

      if (error) throw error
      return data || []
    },
    defaultSkills,
    "getSkills",
  )
}

export async function addSkill(skill: Omit<Skill, "id" | "created_at">): Promise<Skill> {
  return withFallback(
    async () => {
      const newSkill = {
        ...skill,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      }

      const { data, error } = await supabaseAdmin.from("skills").insert([newSkill]).select().single()

      if (error) throw error
      return data
    },
    { ...skill, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Skill,
    "addSkill",
  )
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
  return withFallback(
    async () => {
      const { data, error } = await supabaseAdmin
        .from("skills")
        .update({ ...updates, last_updated: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    { ...defaultSkills.find((s) => s.id === id), ...updates } as Skill,
    "updateSkill",
  )
}

export async function deleteSkill(id: string): Promise<void> {
  return withFallback(
    async () => {
      const { error } = await supabaseAdmin.from("skills").delete().eq("id", id)

      if (error) throw error
    },
    undefined,
    "deleteSkill",
  )
}

// Certifications CRUD operations
export async function getCertifications(): Promise<Certification[]> {
  return withFallback(
    async () => {
      const { data, error } = await supabase.from("certifications").select("*").order("date", { ascending: false })

      if (error) throw error
      return data || []
    },
    defaultCertifications,
    "getCertifications",
  )
}

export async function addCertification(
  certification: Omit<Certification, "id" | "created_at">,
): Promise<Certification> {
  return withFallback(
    async () => {
      const newCertification = {
        ...certification,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabaseAdmin.from("certifications").insert([newCertification]).select().single()

      if (error) throw error
      return data
    },
    { ...certification, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Certification,
    "addCertification",
  )
}

export async function updateCertification(id: string, updates: Partial<Certification>): Promise<Certification> {
  return withFallback(
    async () => {
      const { data, error } = await supabaseAdmin.from("certifications").update(updates).eq("id", id).select().single()

      if (error) throw error
      return data
    },
    { ...defaultCertifications.find((c) => c.id === id), ...updates } as Certification,
    "updateCertification",
  )
}

export async function deleteCertification(id: string): Promise<void> {
  return withFallback(
    async () => {
      const { error } = await supabaseAdmin.from("certifications").delete().eq("id", id)

      if (error) throw error
    },
    undefined,
    "deleteCertification",
  )
}

// CTF Events CRUD operations
export async function getCTFEvents(): Promise<CTFEvent[]> {
  return withFallback(
    async () => {
      const { data, error } = await supabase.from("ctf_events").select("*").order("date", { ascending: false })

      if (error) throw error
      return data || []
    },
    defaultCTFEvents,
    "getCTFEvents",
  )
}

export async function getCTFEvent(id: string): Promise<CTFEvent | null> {
  return withFallback(
    async () => {
      const { data, error } = await supabase.from("ctf_events").select("*").eq("id", id).single()

      if (error) throw error
      return data
    },
    defaultCTFEvents.find((c) => c.id === id) || null,
    "getCTFEvent",
  )
}

export async function addCTFEvent(ctfEvent: Omit<CTFEvent, "id" | "created_at">): Promise<CTFEvent> {
  return withFallback(
    async () => {
      const newCTFEvent = {
        ...ctfEvent,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabaseAdmin.from("ctf_events").insert([newCTFEvent]).select().single()

      if (error) throw error
      return data
    },
    { ...ctfEvent, id: crypto.randomUUID(), created_at: new Date().toISOString() } as CTFEvent,
    "addCTFEvent",
  )
}

export async function updateCTFEvent(id: string, updates: Partial<CTFEvent>): Promise<CTFEvent> {
  return withFallback(
    async () => {
      const { data, error } = await supabaseAdmin.from("ctf_events").update(updates).eq("id", id).select().single()

      if (error) throw error
      return data
    },
    { ...defaultCTFEvents.find((c) => c.id === id), ...updates } as CTFEvent,
    "updateCTFEvent",
  )
}

export async function deleteCTFEvent(id: string): Promise<void> {
  return withFallback(
    async () => {
      const { error } = await supabaseAdmin.from("ctf_events").delete().eq("id", id)

      if (error) throw error
    },
    undefined,
    "deleteCTFEvent",
  )
}

// Digital Badges CRUD operations
export async function getDigitalBadges(): Promise<DigitalBadge[]> {
  return withFallback(
    async () => {
      const { data, error } = await supabase.from("digital_badges").select("*").order("date", { ascending: false })

      if (error) throw error
      return data || []
    },
    defaultDigitalBadges,
    "getDigitalBadges",
  )
}

export async function addDigitalBadge(badge: Omit<DigitalBadge, "id" | "created_at">): Promise<DigitalBadge> {
  return withFallback(
    async () => {
      const newBadge = {
        ...badge,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabaseAdmin.from("digital_badges").insert([newBadge]).select().single()

      if (error) throw error
      return data
    },
    { ...badge, id: crypto.randomUUID(), created_at: new Date().toISOString() } as DigitalBadge,
    "addDigitalBadge",
  )
}

export async function updateDigitalBadge(id: string, updates: Partial<DigitalBadge>): Promise<DigitalBadge> {
  return withFallback(
    async () => {
      const { data, error } = await supabaseAdmin.from("digital_badges").update(updates).eq("id", id).select().single()

      if (error) throw error
      return data
    },
    { ...defaultDigitalBadges.find((b) => b.id === id), ...updates } as DigitalBadge,
    "updateDigitalBadge",
  )
}

export async function deleteDigitalBadge(id: string): Promise<void> {
  return withFallback(
    async () => {
      const { error } = await supabaseAdmin.from("digital_badges").delete().eq("id", id)

      if (error) throw error
    },
    undefined,
    "deleteDigitalBadge",
  )
}

// Site Info operations
export async function getSiteInfo(): Promise<SiteInfo> {
  return withFallback(
    async () => {
      const { data, error } = await supabase.from("site_info").select("*").limit(1).single()

      if (error) throw error
      return data || defaultSiteInfo
    },
    defaultSiteInfo,
    "getSiteInfo",
  )
}

export async function updateSiteInfo(updates: Partial<SiteInfo>): Promise<SiteInfo> {
  return withFallback(
    async () => {
      const { data, error } = await supabaseAdmin
        .from("site_info")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", "1")
        .select()
        .single()

      if (error) throw error
      return data
    },
    { ...defaultSiteInfo, ...updates } as SiteInfo,
    "updateSiteInfo",
  )
}

// Under Construction Settings
export async function getUnderConstructionSettings(): Promise<UnderConstructionSettings> {
  try {
    const siteInfo = await getSiteInfo()
    return (
      siteInfo.under_construction_mode || {
        enabled: false,
        message: "We're working hard to bring you something amazing. Stay tuned!",
        estimated_completion: "Soon",
        progress_percentage: 75,
        allow_admin_access: true,
      }
    )
  } catch (error) {
    console.error("Error fetching under construction settings:", error)
    return {
      enabled: false,
      message: "We're working hard to bring you something amazing. Stay tuned!",
      estimated_completion: "Soon",
      progress_percentage: 75,
      allow_admin_access: true,
    }
  }
}

export async function updateUnderConstructionSettings(settings: UnderConstructionSettings): Promise<SiteInfo> {
  return updateSiteInfo({ under_construction_mode: settings })
}

// Authentication functions
interface User {
  id: string
  username: string
}

let currentSession: User | null = null

export async function validateUser(username: string, password: string): Promise<User | null> {
  // Check environment variables first
  const adminUsername = process.env.ADMIN_USERNAME || "admin"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  console.log("🔐 Validating credentials...")
  console.log("📝 Provided username:", username)
  console.log("🔑 Expected username:", adminUsername)
  console.log("🔒 Password check:", password === adminPassword ? "✅ Match" : "❌ No match")

  if (username === adminUsername && password === adminPassword) {
    console.log("✅ Environment variable authentication successful")
    return { id: "admin", username }
  }

  // If env vars don't match, check database (if configured)
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin.from("admin_users").select("*").eq("username", username).single()

      if (error || !data) {
        console.log("❌ Database user not found")
        return null
      }

      // In a real app, you'd hash the password and compare
      if (data.password_hash === password) {
        console.log("✅ Database authentication successful")
        return { id: data.id, username: data.username }
      }
    } catch (error) {
      console.error("❌ Database authentication error:", error)
    }
  }

  console.log("❌ Authentication failed")
  return null
}

export async function loginUser(username: string, password: string): Promise<boolean> {
  const user = await validateUser(username, password)
  if (user) {
    currentSession = user
    console.log("✅ User logged in:", user.username)
    return true
  }
  console.log("❌ Login failed")
  return false
}

export async function logoutUser(): Promise<void> {
  console.log("👋 User logged out:", currentSession?.username || "Unknown")
  currentSession = null
}

export async function getCurrentUser(): Promise<User | null> {
  return currentSession
}

export async function isAuthenticated(): Promise<boolean> {
  return currentSession !== null
}

// Legacy compatibility functions
export async function readData(type: string): Promise<any[]> {
  switch (type) {
    case "projects":
      return getProjects()
    case "skills":
      return getSkills()
    case "certifications":
      return getCertifications()
    case "ctf_events":
      return getCTFEvents()
    case "digital_badges":
      return getDigitalBadges()
    default:
      return []
  }
}

export async function writeData(type: string, data: any[]): Promise<void> {
  console.warn(`writeData is deprecated. Use specific add/update functions for ${type}`)
}

// Export all data fetching functions for easy access
export {
  initializeApplication as initializeApp,
  defaultSiteInfo,
  defaultProjects,
  defaultSkills,
  defaultCertifications,
  defaultCTFEvents,
  defaultDigitalBadges,
}
