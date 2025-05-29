import fs from "fs/promises"
import path from "path"
import type { Project, Skill, Certification, CTFEvent, SiteInfo, DigitalBadge } from "./types"

// File paths
const DATA_DIR = path.join(process.cwd(), "data")
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json")
const SKILLS_FILE = path.join(DATA_DIR, "skills.json")
const CERTIFICATIONS_FILE = path.join(DATA_DIR, "certifications.json")
const CTF_EVENTS_FILE = path.join(DATA_DIR, "ctf-events.json")
const SITE_INFO_FILE = path.join(DATA_DIR, "site-info.json")
const DIGITAL_BADGES_FILE = path.join(DATA_DIR, "digital-badges.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Generic file operations with error handling
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.warn(`File ${filePath} not found, using default value`)
    return defaultValue
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    await ensureDataDir()
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error)
    throw error
  }
}

// Default data
const defaultSiteInfo: SiteInfo = {
  name: "John Doe",
  title: "Cybersecurity Professional",
  description: "Passionate about cybersecurity, ethical hacking, and protecting digital assets.",
  email: "john.doe@example.com",
  github: "https://github.com/johndoe",
  linkedin: "https://linkedin.com/in/johndoe",
  twitter: "https://twitter.com/johndoe",
  icon: "/images/avatar-photo.jpg",
  backgroundImage: "/images/background.jpeg",
  backgroundOpacity: 80,
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
  },
  siteUrl: "https://cybersecurity-portfolio-bdeath118.vercel.app",
  linkedinProfileUrl: "",
  autoImportSettings: {
    linkedinEnabled: false,
    badgesEnabled: true,
    importFrequency: "daily",
  },
}

// Projects
export async function getProjects(): Promise<Project[]> {
  return readJsonFile(PROJECTS_FILE, [])
}

export async function getProject(id: string): Promise<Project | null> {
  const projects = await getProjects()
  return projects.find((p) => p.id === id) || null
}

export async function addProject(project: Omit<Project, "id">): Promise<Project> {
  const projects = await getProjects()
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
  }
  projects.push(newProject)
  await writeJsonFile(PROJECTS_FILE, projects)
  return newProject
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const projects = await getProjects()
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return null

  projects[index] = { ...projects[index], ...updates }
  await writeJsonFile(PROJECTS_FILE, projects)
  return projects[index]
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects()
  const filteredProjects = projects.filter((p) => p.id !== id)
  if (filteredProjects.length === projects.length) return false

  await writeJsonFile(PROJECTS_FILE, filteredProjects)
  return true
}

// Skills
export async function getSkills(): Promise<Skill[]> {
  return readJsonFile(SKILLS_FILE, [])
}

export async function addSkill(skill: Omit<Skill, "id">): Promise<Skill> {
  const skills = await getSkills()
  const newSkill: Skill = {
    ...skill,
    id: Date.now().toString(),
  }
  skills.push(newSkill)
  await writeJsonFile(SKILLS_FILE, skills)
  return newSkill
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill | null> {
  const skills = await getSkills()
  const index = skills.findIndex((s) => s.id === id)
  if (index === -1) return null

  skills[index] = { ...skills[index], ...updates }
  await writeJsonFile(SKILLS_FILE, skills)
  return skills[index]
}

export async function deleteSkill(id: string): Promise<boolean> {
  const skills = await getSkills()
  const filteredSkills = skills.filter((s) => s.id !== id)
  if (filteredSkills.length === skills.length) return false

  await writeJsonFile(SKILLS_FILE, filteredSkills)
  return true
}

// Certifications
export async function getCertifications(): Promise<Certification[]> {
  return readJsonFile(CERTIFICATIONS_FILE, [])
}

export async function addCertification(certification: Omit<Certification, "id">): Promise<Certification> {
  const certifications = await getCertifications()
  const newCertification: Certification = {
    ...certification,
    id: Date.now().toString(),
  }
  certifications.push(newCertification)
  await writeJsonFile(CERTIFICATIONS_FILE, certifications)
  return newCertification
}

export async function updateCertification(id: string, updates: Partial<Certification>): Promise<Certification | null> {
  const certifications = await getCertifications()
  const index = certifications.findIndex((c) => c.id === id)
  if (index === -1) return null

  certifications[index] = { ...certifications[index], ...updates }
  await writeJsonFile(CERTIFICATIONS_FILE, certifications)
  return certifications[index]
}

export async function deleteCertification(id: string): Promise<boolean> {
  const certifications = await getCertifications()
  const filteredCertifications = certifications.filter((c) => c.id !== id)
  if (filteredCertifications.length === certifications.length) return false

  await writeJsonFile(CERTIFICATIONS_FILE, filteredCertifications)
  return true
}

// CTF Events
export async function getCTFEvents(): Promise<CTFEvent[]> {
  return readJsonFile(CTF_EVENTS_FILE, [])
}

export async function getCTFEvent(id: string): Promise<CTFEvent | null> {
  const events = await getCTFEvents()
  return events.find((e) => e.id === id) || null
}

export async function addCTFEvent(event: Omit<CTFEvent, "id">): Promise<CTFEvent> {
  const events = await getCTFEvents()
  const newEvent: CTFEvent = {
    ...event,
    id: Date.now().toString(),
  }
  events.push(newEvent)
  await writeJsonFile(CTF_EVENTS_FILE, events)
  return newEvent
}

export async function updateCTFEvent(id: string, updates: Partial<CTFEvent>): Promise<CTFEvent | null> {
  const events = await getCTFEvents()
  const index = events.findIndex((e) => e.id === id)
  if (index === -1) return null

  events[index] = { ...events[index], ...updates }
  await writeJsonFile(CTF_EVENTS_FILE, events)
  return events[index]
}

export async function deleteCTFEvent(id: string): Promise<boolean> {
  const events = await getCTFEvents()
  const filteredEvents = events.filter((e) => e.id !== id)
  if (filteredEvents.length === events.length) return false

  await writeJsonFile(CTF_EVENTS_FILE, filteredEvents)
  return true
}

// Digital Badges
export async function getDigitalBadges(): Promise<DigitalBadge[]> {
  return readJsonFile(DIGITAL_BADGES_FILE, [])
}

export async function addDigitalBadge(badge: Omit<DigitalBadge, "id">): Promise<DigitalBadge> {
  const badges = await getDigitalBadges()
  const newBadge: DigitalBadge = {
    ...badge,
    id: Date.now().toString(),
  }
  badges.push(newBadge)
  await writeJsonFile(DIGITAL_BADGES_FILE, badges)
  return newBadge
}

export async function updateDigitalBadge(id: string, updates: Partial<DigitalBadge>): Promise<DigitalBadge | null> {
  const badges = await getDigitalBadges()
  const index = badges.findIndex((b) => b.id === id)
  if (index === -1) return null

  badges[index] = { ...badges[index], ...updates }
  await writeJsonFile(DIGITAL_BADGES_FILE, badges)
  return badges[index]
}

export async function deleteDigitalBadge(id: string): Promise<boolean> {
  const badges = await getDigitalBadges()
  const filteredBadges = badges.filter((b) => b.id !== id)
  if (filteredBadges.length === badges.length) return false

  await writeJsonFile(DIGITAL_BADGES_FILE, filteredBadges)
  return true
}

// Site Info
export async function getSiteInfo(): Promise<SiteInfo> {
  return readJsonFile(SITE_INFO_FILE, defaultSiteInfo)
}

export async function updateSiteInfo(updates: Partial<SiteInfo>): Promise<SiteInfo> {
  const currentInfo = await getSiteInfo()
  const updatedInfo = { ...currentInfo, ...updates }
  await writeJsonFile(SITE_INFO_FILE, updatedInfo)
  return updatedInfo
}

// Session management (simplified)
let currentSession: { userId: string; username: string } | null = null

export async function loginUser(username: string, password: string): Promise<boolean> {
  // Simple hash function for password comparison
  const simpleHash = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString()
  }

  const adminUsername = process.env.ADMIN_USERNAME || "admin"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  console.log("Login attempt:", { username, providedPassword: password })
  console.log("Expected credentials:", { adminUsername, adminPassword })

  if (username === adminUsername && password === adminPassword) {
    currentSession = { userId: "admin", username }
    console.log("Login successful")
    return true
  }

  console.log("Login failed")
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

// User validation function (for backward compatibility)
export async function validateUser(
  username: string,
  password: string,
): Promise<{ id: string; username: string } | null> {
  const adminUsername = process.env.ADMIN_USERNAME || "admin"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  if (username === adminUsername && password === adminPassword) {
    return { id: "admin", username }
  }

  return null
}

// Alias functions for backward compatibility
export async function getCTFEventById(id: string): Promise<CTFEvent | null> {
  return getCTFEvent(id)
}

export async function getProjectById(id: string): Promise<Project | null> {
  return getProject(id)
}
