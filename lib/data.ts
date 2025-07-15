import { createClient } from "@supabase/supabase-js"

// Types for our data structures
export interface SiteInfo {
  id?: string
  name: string
  title: string
  description: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  twitter?: string
  site_url: string
  avatar_url?: string
  background_url?: string
  theme_color?: string
  under_construction_mode?: UnderConstructionSettings
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

export interface Project {
  id: string
  title: string
  summary: string
  description: string
  technologies: string[]
  github_url?: string
  demo_url?: string
  image?: string
  featured: boolean
  date: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: number
  description?: string
  endorsements?: number
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiry_date?: string
  credential_id?: string
  credential_url?: string
  description: string
  verification_status?: string
  created_at: string
  updated_at: string
}

export interface CTFEvent {
  id: string
  name: string
  platform: string
  rank: number
  total_teams?: number
  points?: number
  date: string
  difficulty: string
  team: string
  flags_captured: number
  description?: string
  writeup_url?: string
  created_at: string
  updated_at: string
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
  created_at: string
}

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials not found, using mock data")
    return null
  }

  try {
    return createClient(supabaseUrl, supabaseKey)
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    return null
  }
}

const supabase = getSupabaseClient()

// Fallback data when database is not available
const fallbackSiteInfo: SiteInfo = {
  name: "Alex Johnson",
  title: "Cybersecurity Professional & Ethical Hacker",
  description:
    "Passionate cybersecurity professional specializing in penetration testing, vulnerability assessment, and secure system design. Experienced in both offensive and defensive security practices.",
  email: "alex.johnson@cybersec.dev",
  phone: "+1 (555) 123-4567",
  location: "Remote / Global",
  linkedin: "https://linkedin.com/in/alexjohnson",
  github: "https://github.com/alexjohnson",
  twitter: "https://twitter.com/alexjohnson",
  site_url: process.env.SITE_URL || process.env.VERCEL_URL || "https://cybersecurity-portfolio.vercel.app",
  avatar_url: "/images/avatar-photo.jpg",
  background_url: "/images/background.jpeg",
  theme_color: "#0ea5e9",
  under_construction_mode: {
    enabled: false,
    message: "We're working hard to bring you something amazing. Stay tuned!",
    estimated_completion: "Soon",
    progress_percentage: 75,
    allow_admin_access: true,
  },
}

const fallbackProjects: Project[] = [
  {
    id: "1",
    title: "Network Security Assessment Tool",
    summary: "Automated vulnerability scanner for network infrastructure",
    description:
      "A comprehensive network security assessment tool built with Python that automates the process of scanning network infrastructure for common vulnerabilities. Features include port scanning, service enumeration, and vulnerability detection with detailed reporting capabilities.",
    technologies: ["Python", "Nmap", "Scapy", "SQLite", "Flask"],
    github_url: "https://github.com/example/network-scanner",
    demo_url: "https://demo.example.com",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    date: "2024-01-15",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Web Application Penetration Testing Framework",
    summary: "Custom framework for automated web application security testing",
    description:
      "A modular penetration testing framework designed specifically for web applications. Includes automated SQL injection detection, XSS testing, authentication bypass attempts, and comprehensive reporting with remediation suggestions.",
    technologies: ["Python", "Selenium", "BeautifulSoup", "Burp Suite API", "Django"],
    github_url: "https://github.com/example/web-pentest-framework",
    demo_url: "https://demo.example.com",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    date: "2023-11-20",
    created_at: "2023-11-20T00:00:00Z",
    updated_at: "2023-11-20T00:00:00Z",
  },
]

const fallbackSkills: Skill[] = [
  {
    id: "1",
    name: "Penetration Testing",
    category: "Security Testing",
    level: 95,
    description: "Advanced penetration testing methodologies",
    endorsements: 15,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Vulnerability Assessment",
    category: "Security Testing",
    level: 90,
    description: "Comprehensive vulnerability identification",
    endorsements: 12,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Web Application Security",
    category: "Application Security",
    level: 88,
    description: "OWASP Top 10 and beyond",
    endorsements: 18,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Network Security",
    category: "Infrastructure",
    level: 85,
    description: "Network architecture and security",
    endorsements: 20,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Python",
    category: "Programming",
    level: 92,
    description: "Security automation and tooling",
    endorsements: 25,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    name: "Linux Administration",
    category: "Systems",
    level: 87,
    description: "Advanced Linux system administration",
    endorsements: 16,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

const fallbackCertifications: Certification[] = [
  {
    id: "1",
    name: "Certified Ethical Hacker (CEH)",
    issuer: "EC-Council",
    date: "2023-06-15",
    expiry_date: "2026-06-15",
    description: "Comprehensive ethical hacking and penetration testing certification",
    credential_id: "ECC123456789",
    verification_status: "verified",
    created_at: "2023-06-15T00:00:00Z",
    updated_at: "2023-06-15T00:00:00Z",
  },
  {
    id: "2",
    name: "OSCP - Offensive Security Certified Professional",
    issuer: "Offensive Security",
    date: "2023-09-20",
    description: "Advanced penetration testing certification with hands-on lab experience",
    credential_id: "OS-12345",
    verification_status: "verified",
    created_at: "2023-09-20T00:00:00Z",
    updated_at: "2023-09-20T00:00:00Z",
  },
  {
    id: "3",
    name: "CompTIA Security+",
    issuer: "CompTIA",
    date: "2022-03-10",
    expiry_date: "2025-03-10",
    description: "Foundational cybersecurity skills and knowledge certification",
    credential_id: "COMP123456",
    verification_status: "verified",
    created_at: "2022-03-10T00:00:00Z",
    updated_at: "2022-03-10T00:00:00Z",
  },
]

const fallbackCTFEvents: CTFEvent[] = [
  {
    id: "1",
    name: "CyberDefenders Blue Team CTF",
    platform: "CyberDefenders",
    rank: 15,
    total_teams: 200,
    points: 2500,
    date: "2024-01-20",
    difficulty: "Advanced",
    team: "SecureTeam",
    flags_captured: 8,
    description: "Blue team focused CTF with incident response and forensics challenges",
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "2",
    name: "HackTheBox University CTF",
    platform: "HackTheBox",
    rank: 42,
    total_teams: 150,
    points: 1800,
    date: "2023-12-05",
    difficulty: "Intermediate",
    team: "Solo",
    flags_captured: 6,
    description: "University-level CTF covering web exploitation and cryptography",
    created_at: "2023-12-05T00:00:00Z",
    updated_at: "2023-12-05T00:00:00Z",
  },
]

const fallbackDigitalBadges: DigitalBadge[] = [
  {
    id: "1",
    name: "Cybersecurity Fundamentals",
    issuer: "IBM",
    date: "2023-08-15",
    description: "Foundational cybersecurity concepts and practices",
    badge_url: "https://www.credly.com/badges/example-1",
    platform: "Credly",
    skills: ["Cybersecurity", "Risk Management", "Security Frameworks"],
    created_at: "2023-08-15T00:00:00Z",
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
    created_at: "2023-06-20T00:00:00Z",
  },
]

// Helper function to handle database operations with fallbacks
async function withFallback<T>(operation: () => Promise<T>, fallback: T, operationName: string): Promise<T> {
  if (!supabase) {
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

// Site Info functions
export async function getSiteInfo(): Promise<SiteInfo> {
  return withFallback(
    async () => {
      const { data, error } = await supabase!.from("site_info").select("*").single()
      if (error) throw error
      return data || fallbackSiteInfo
    },
    fallbackSiteInfo,
    "getSiteInfo",
  )
}

export async function updateSiteInfo(updates: Partial<SiteInfo>): Promise<SiteInfo> {
  return withFallback(
    async () => {
      const { data, error } = await supabase!
        .from("site_info")
        .upsert({ ...updates, updated_at: new Date().toISOString() })
        .select()
        .single()
      if (error) throw error
      return data
    },
    { ...fallbackSiteInfo, ...updates },
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

// Projects functions
export async function getProjects(): Promise<Project[]> {
  return withFallback(
    async () => {
      const { data, error } = await supabase!.from("projects").select("*").order("date", { ascending: false })
      if (error) throw error
      return data || []
    },
    fallbackProjects,
    "getProjects",
  )
}

export async function getProject(id: string): Promise<Project | null> {
  return withFallback(
    async () => {
      const { data, error } = await supabase!.from("projects").select("*").eq("id", id).single()
      if (error) throw error
      return data
    },
    fallbackProjects.find((p) => p.id === id) || null,
    "getProject",
  )
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter((project) => project.featured)
}

// Skills functions
export async function getSkills(): Promise<Skill[]> {
  return withFallback(
    async () => {
      const { data, error } = await supabase!.from("skills").select("*").order("level", { ascending: false })
      if (error) throw error
      return data || []
    },
    fallbackSkills,
    "getSkills",
  )
}

export async function getSkillsByCategory(): Promise<Record<string, Skill[]>> {
  const skills = await getSkills()
  return skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )
}

// Certifications functions
export async function getCertifications(): Promise<Certification[]> {
  return withFallback(
    async () => {
      const { data, error } = await supabase!.from("certifications").select("*").order("date", { ascending: false })
      if (error) throw error
      return data || []
    },
    fallbackCertifications,
    "getCertifications",
  )
}

// CTF Events functions
export async function getCTFEvents(): Promise<CTFEvent[]> {
  return withFallback(
    async () => {
      const { data, error } = await supabase!.from("ctf_events").select("*").order("date", { ascending: false })
      if (error) throw error
      return data || []
    },
    fallbackCTFEvents,
    "getCTFEvents",
  )
}

export async function getCTFEvent(id: string): Promise<CTFEvent | null> {
  return withFallback(
    async () => {
      const { data, error } = await supabase!.from("ctf_events").select("*").eq("id", id).single()
      if (error) throw error
      return data
    },
    fallbackCTFEvents.find((c) => c.id === id) || null,
    "getCTFEvent",
  )
}

// Digital Badges functions
export async function getDigitalBadges(): Promise<DigitalBadge[]> {
  return withFallback(
    async () => {
      const { data, error } = await supabase!.from("digital_badges").select("*").order("date", { ascending: false })
      if (error) throw error
      return data || []
    },
    fallbackDigitalBadges,
    "getDigitalBadges",
  )
}

// User validation for admin authentication
export async function validateUser(username: string, password: string): Promise<boolean> {
  console.log("🔐 Validating user credentials")

  // Get admin credentials from environment variables
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  console.log("Environment check:", {
    hasAdminUsername: !!adminUsername,
    hasAdminPassword: !!adminPassword,
    providedUsername: username,
  })

  // If environment variables are set, use them
  if (adminUsername && adminPassword) {
    const isValid = username === adminUsername && password === adminPassword
    console.log("Environment auth result:", isValid)
    return isValid
  }

  // Fallback credentials for development/demo
  const fallbackValid = username === "admin" && password === "admin123"
  console.log("Fallback auth result:", fallbackValid)
  return fallbackValid
}

// Statistics functions
export async function getPortfolioStats() {
  try {
    const [projects, skills, certifications, ctfEvents] = await Promise.all([
      getProjects(),
      getSkills(),
      getCertifications(),
      getCTFEvents(),
    ])

    return {
      projectsCount: projects.length,
      skillsCount: skills.length,
      certificationsCount: certifications.length,
      ctfEventsCount: ctfEvents.length,
      featuredProjectsCount: projects.filter((p) => p.featured).length,
    }
  } catch (error) {
    console.error("Error fetching portfolio stats:", error)
    return {
      projectsCount: fallbackProjects.length,
      skillsCount: fallbackSkills.length,
      certificationsCount: fallbackCertifications.length,
      ctfEventsCount: fallbackCTFEvents.length,
      featuredProjectsCount: fallbackProjects.filter((p) => p.featured).length,
    }
  }
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

// Initialize application data
export async function initializeApplication(): Promise<void> {
  if (!supabase) {
    console.warn("⚠️ Supabase not configured, skipping database initialization")
    return
  }

  try {
    // Check if site_info exists, if not create default
    const { data: siteInfo } = await supabase.from("site_info").select("*").limit(1).single()

    if (!siteInfo) {
      await supabase.from("site_info").insert([fallbackSiteInfo])
      console.log("✅ Default site info created")
    }
  } catch (error) {
    console.error("❌ Failed to initialize app:", error)
  }
}

// Export all default data
export {
  fallbackSiteInfo as defaultSiteInfo,
  fallbackProjects as defaultProjects,
  fallbackSkills as defaultSkills,
  fallbackCertifications as defaultCertifications,
  fallbackCTFEvents as defaultCTFEvents,
  fallbackDigitalBadges as defaultDigitalBadges,
}
