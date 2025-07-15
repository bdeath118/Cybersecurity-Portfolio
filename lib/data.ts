import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabase"

// Type definitions
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

// Fallback data based on the cybersecurity background from knowledge base
const fallbackSiteInfo: SiteInfo = {
  id: "1",
  name: "Alex Johnson",
  title: "Cybersecurity Professional & Ethical Hacker",
  description:
    "Passionate cybersecurity professional specializing in penetration testing, vulnerability assessment, and secure system design. Experienced in both offensive and defensive security practices with a focus on protecting digital infrastructure.",
  email: "alex.johnson@cybersec.dev",
  phone: "+1 (555) 123-4567",
  location: "Remote / Global",
  linkedin: process.env.LINKEDIN_PROFILE_URL || "https://linkedin.com/in/alexjohnson",
  github: process.env.GITHUB_USERNAME
    ? `https://github.com/${process.env.GITHUB_USERNAME}`
    : "https://github.com/alexjohnson",
  twitter: "https://twitter.com/alexjohnson_sec",
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
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const fallbackProjects: Project[] = [
  {
    id: "1",
    title: "Network Security Assessment Tool",
    summary: "Automated vulnerability scanner for network infrastructure with digital shield protection",
    description:
      "A comprehensive network security assessment tool built with Python that automates the process of scanning network infrastructure for common vulnerabilities. Features include port scanning, service enumeration, vulnerability detection with detailed reporting capabilities, and a digital shield interface for secure operations.",
    technologies: ["Python", "Nmap", "Scapy", "SQLite", "Flask", "Digital Forensics"],
    github_url: "https://github.com/alexjohnson/network-scanner",
    demo_url: "https://demo.cybersec-tools.dev",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    date: "2024-01-15",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Web Application Penetration Testing Framework",
    summary: "Custom framework for automated web application security testing with advanced threat detection",
    description:
      "A modular penetration testing framework designed specifically for web applications. Includes automated SQL injection detection, XSS testing, authentication bypass attempts, and comprehensive reporting with remediation suggestions. Features a futuristic interface inspired by cybersecurity digital shields.",
    technologies: ["Python", "Selenium", "BeautifulSoup", "Burp Suite API", "Django", "Security Analytics"],
    github_url: "https://github.com/alexjohnson/web-pentest-framework",
    demo_url: "https://demo.webpentest.dev",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    date: "2023-11-20",
    created_at: "2023-11-20T00:00:00Z",
    updated_at: "2023-11-20T00:00:00Z",
  },
  {
    id: "3",
    title: "Digital Forensics Investigation Suite",
    summary: "Advanced digital forensics toolkit for incident response and evidence analysis",
    description:
      "Comprehensive digital forensics suite for investigating security incidents and analyzing digital evidence. Includes memory analysis, disk imaging, network packet analysis, and automated report generation with chain of custody tracking.",
    technologies: ["Python", "Volatility", "Autopsy", "Wireshark", "Sleuth Kit", "Machine Learning"],
    github_url: "https://github.com/alexjohnson/forensics-suite",
    featured: false,
    date: "2023-09-10",
    created_at: "2023-09-10T00:00:00Z",
    updated_at: "2023-09-10T00:00:00Z",
  },
]

const fallbackSkills: Skill[] = [
  {
    id: "1",
    name: "Penetration Testing",
    category: "Security Testing",
    level: 95,
    description: "Advanced penetration testing methodologies and frameworks",
    endorsements: 25,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Vulnerability Assessment",
    category: "Security Testing",
    level: 92,
    description: "Comprehensive vulnerability identification and risk assessment",
    endorsements: 22,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Web Application Security",
    category: "Application Security",
    level: 90,
    description: "OWASP Top 10 and advanced web application security testing",
    endorsements: 28,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Network Security",
    category: "Infrastructure Security",
    level: 88,
    description: "Network architecture security and digital infrastructure protection",
    endorsements: 20,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Python Security Development",
    category: "Programming",
    level: 94,
    description: "Security automation, tooling, and exploit development",
    endorsements: 30,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    name: "Linux System Administration",
    category: "Systems",
    level: 89,
    description: "Advanced Linux system administration and hardening",
    endorsements: 18,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "7",
    name: "Digital Forensics",
    category: "Investigation",
    level: 85,
    description: "Digital evidence analysis and incident response",
    endorsements: 15,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "8",
    name: "Threat Intelligence",
    category: "Analysis",
    level: 87,
    description: "Threat hunting and intelligence analysis",
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
    description:
      "Comprehensive ethical hacking and penetration testing certification covering advanced attack vectors and defensive strategies",
    credential_id: "ECC-CEH-123456789",
    verification_status: "verified",
    created_at: "2023-06-15T00:00:00Z",
    updated_at: "2023-06-15T00:00:00Z",
  },
  {
    id: "2",
    name: "OSCP - Offensive Security Certified Professional",
    issuer: "Offensive Security",
    date: "2023-09-20",
    description:
      "Advanced penetration testing certification with hands-on lab experience and practical exploitation techniques",
    credential_id: "OS-OSCP-12345",
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
    description:
      "Foundational cybersecurity skills and knowledge certification covering network security, compliance, and operational security",
    credential_id: "COMP-SEC-789012",
    verification_status: "verified",
    created_at: "2022-03-10T00:00:00Z",
    updated_at: "2022-03-10T00:00:00Z",
  },
  {
    id: "4",
    name: "CISSP - Certified Information Systems Security Professional",
    issuer: "(ISC)²",
    date: "2024-02-28",
    expiry_date: "2027-02-28",
    description:
      "Advanced cybersecurity leadership certification covering security and risk management, asset security, and security architecture",
    credential_id: "ISC2-CISSP-345678",
    verification_status: "verified",
    created_at: "2024-02-28T00:00:00Z",
    updated_at: "2024-02-28T00:00:00Z",
  },
]

const fallbackCTFEvents: CTFEvent[] = [
  {
    id: "1",
    name: "DEF CON CTF Qualifier 2024",
    platform: "DEF CON",
    rank: 42,
    total_teams: 1200,
    points: 2850,
    date: "2024-05-15",
    difficulty: "Expert",
    team: "CyberShield Warriors",
    flags_captured: 12,
    description: "Qualified for DEF CON finals with advanced exploitation and digital forensics challenges",
    writeup_url: "https://blog.cybersec.dev/defcon-2024-writeup",
    created_at: "2024-05-15T00:00:00Z",
    updated_at: "2024-05-15T00:00:00Z",
  },
  {
    id: "2",
    name: "PicoCTF 2024",
    platform: "PicoCTF",
    rank: 15,
    total_teams: 5000,
    points: 4200,
    date: "2024-03-20",
    difficulty: "Advanced",
    team: "Solo",
    flags_captured: 18,
    description: "Top 1% finish in international competition with focus on cryptography and reverse engineering",
    writeup_url: "https://blog.cybersec.dev/picoctf-2024-writeup",
    created_at: "2024-03-20T00:00:00Z",
    updated_at: "2024-03-20T00:00:00Z",
  },
  {
    id: "3",
    name: "CyberDefenders Blue Team CTF",
    platform: "CyberDefenders",
    rank: 8,
    total_teams: 300,
    points: 3200,
    date: "2024-01-20",
    difficulty: "Advanced",
    team: "Digital Shield Defenders",
    flags_captured: 15,
    description: "Blue team focused CTF with incident response, digital forensics, and threat hunting challenges",
    writeup_url: "https://blog.cybersec.dev/cyberdefenders-2024-writeup",
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },
]

const fallbackDigitalBadges: DigitalBadge[] = [
  {
    id: "1",
    name: "Cybersecurity Fundamentals",
    issuer: "IBM Security",
    date: "2023-08-15",
    description: "Foundational cybersecurity concepts, digital shield protection, and security frameworks",
    badge_url: "https://www.credly.com/badges/cybersecurity-fundamentals-123",
    verification_url: "https://www.credly.com/badges/cybersecurity-fundamentals-123",
    platform: "Credly",
    skills: ["Cybersecurity", "Risk Management", "Security Frameworks", "Digital Protection"],
    created_at: "2023-08-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Ethical Hacker Professional",
    issuer: "EC-Council",
    date: "2023-06-20",
    description: "Advanced ethical hacking and penetration testing expertise with digital forensics capabilities",
    badge_url: "https://www.credly.com/badges/ethical-hacker-professional-456",
    verification_url: "https://www.credly.com/badges/ethical-hacker-professional-456",
    platform: "Credly",
    skills: ["Penetration Testing", "Vulnerability Assessment", "Network Security", "Digital Forensics"],
    created_at: "2023-06-20T00:00:00Z",
  },
  {
    id: "3",
    name: "Cloud Security Specialist",
    issuer: "AWS",
    date: "2024-01-10",
    description: "Advanced cloud security architecture and digital infrastructure protection",
    badge_url: "https://www.credly.com/badges/cloud-security-specialist-789",
    verification_url: "https://www.credly.com/badges/cloud-security-specialist-789",
    platform: "Credly",
    skills: ["Cloud Security", "AWS Security", "Infrastructure Protection", "Security Architecture"],
    created_at: "2024-01-10T00:00:00Z",
  },
]

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

// Site Info functions
export async function getSiteInfo(): Promise<SiteInfo> {
  return withFallback(
    async () => {
      const { data, error } = await supabase.from("site_info").select("*").single()
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
      const { data, error } = await supabaseAdmin
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
      const { data, error } = await supabase.from("projects").select("*").order("date", { ascending: false })
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
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()
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
      const { data, error } = await supabase.from("skills").select("*").order("level", { ascending: false })
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
      const { data, error } = await supabase.from("certifications").select("*").order("date", { ascending: false })
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
      const { data, error } = await supabase.from("ctf_events").select("*").order("date", { ascending: false })
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
      const { data, error } = await supabase.from("ctf_events").select("*").eq("id", id).single()
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
      const { data, error } = await supabase.from("digital_badges").select("*").order("date", { ascending: false })
      if (error) throw error
      return data || []
    },
    fallbackDigitalBadges,
    "getDigitalBadges",
  )
}

// User validation for admin authentication using environment variables
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

  // Primary authentication using environment variables
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

// Initialize Supabase with fallback data
export async function initializeSupabaseData(): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.warn("⚠️ Supabase not configured, skipping database initialization")
    return
  }

  try {
    console.log("🔄 Initializing Supabase with fallback data...")

    // Initialize site_info
    const { data: existingSiteInfo } = await supabase.from("site_info").select("id").single()
    if (!existingSiteInfo) {
      await supabaseAdmin.from("site_info").insert([fallbackSiteInfo])
      console.log("✅ Site info initialized")
    }

    // Initialize projects
    const { data: existingProjects } = await supabase.from("projects").select("id").limit(1)
    if (!existingProjects || existingProjects.length === 0) {
      await supabaseAdmin.from("projects").insert(fallbackProjects)
      console.log("✅ Projects initialized")
    }

    // Initialize skills
    const { data: existingSkills } = await supabase.from("skills").select("id").limit(1)
    if (!existingSkills || existingSkills.length === 0) {
      await supabaseAdmin.from("skills").insert(fallbackSkills)
      console.log("✅ Skills initialized")
    }

    // Initialize certifications
    const { data: existingCertifications } = await supabase.from("certifications").select("id").limit(1)
    if (!existingCertifications || existingCertifications.length === 0) {
      await supabaseAdmin.from("certifications").insert(fallbackCertifications)
      console.log("✅ Certifications initialized")
    }

    // Initialize CTF events
    const { data: existingCTFEvents } = await supabase.from("ctf_events").select("id").limit(1)
    if (!existingCTFEvents || existingCTFEvents.length === 0) {
      await supabaseAdmin.from("ctf_events").insert(fallbackCTFEvents)
      console.log("✅ CTF events initialized")
    }

    // Initialize digital badges
    const { data: existingBadges } = await supabase.from("digital_badges").select("id").limit(1)
    if (!existingBadges || existingBadges.length === 0) {
      await supabaseAdmin.from("digital_badges").insert(fallbackDigitalBadges)
      console.log("✅ Digital badges initialized")
    }

    console.log("🎉 Supabase initialization complete!")
  } catch (error) {
    console.error("❌ Failed to initialize Supabase data:", error)
  }
}

// Export fallback data for reference
export {
  fallbackSiteInfo as defaultSiteInfo,
  fallbackProjects as defaultProjects,
  fallbackSkills as defaultSkills,
  fallbackCertifications as defaultCertifications,
  fallbackCTFEvents as defaultCTFEvents,
  fallbackDigitalBadges as defaultDigitalBadges,
}
