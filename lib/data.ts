import type { Project, Skill, Certification, CTFEvent, User, SiteInfo } from "./types"
import { hashPassword } from "./auth"

// Sample data
const projects: Project[] = [
  {
    id: "1",
    title: "Network Security Assessment Tool",
    summary: "Automated vulnerability scanner for network infrastructure",
    description:
      "Developed a comprehensive network security assessment tool that automates the process of identifying vulnerabilities in network infrastructure. The tool performs port scanning, service enumeration, and vulnerability assessment using custom scripts and integration with popular security frameworks.",
    image: "/placeholder.svg?height=300&width=400",
    technologies: ["Python", "Nmap", "Metasploit", "Docker"],
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com/example/network-scanner",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "Incident Response Dashboard",
    summary: "Real-time security incident monitoring and response platform",
    description:
      "Built a centralized dashboard for security incident response teams to monitor, track, and respond to security events in real-time. Features include automated alert correlation, incident timeline visualization, and integration with SIEM systems.",
    image: "/placeholder.svg?height=300&width=400",
    technologies: ["React", "Node.js", "ElasticSearch", "Kibana"],
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com/example/incident-dashboard",
    date: "2023-11-20",
  },
]

const skills: Skill[] = [
  { id: "1", name: "Penetration Testing", level: 90, category: "Security Testing" },
  { id: "2", name: "Network Security", level: 85, category: "Infrastructure" },
  { id: "3", name: "Python", level: 88, category: "Programming" },
  { id: "4", name: "Linux Administration", level: 82, category: "Systems" },
  { id: "5", name: "SIEM Tools", level: 75, category: "Monitoring" },
]

const certifications: Certification[] = [
  {
    id: "1",
    name: "Certified Ethical Hacker (CEH)",
    issuer: "EC-Council",
    date: "2023-06-15",
    expiryDate: "2026-06-15",
    description:
      "Comprehensive certification covering ethical hacking methodologies and penetration testing techniques.",
    logo: "/placeholder.svg?height=100&width=100",
    credentialUrl: "https://cert.eccouncil.org/verify",
  },
  {
    id: "2",
    name: "CompTIA Security+",
    issuer: "CompTIA",
    date: "2022-03-10",
    expiryDate: "2025-03-10",
    description:
      "Foundation-level cybersecurity certification covering network security, compliance, and operational security.",
    logo: "/placeholder.svg?height=100&width=100",
    credentialUrl: "https://www.certmetrics.com/comptia",
  },
]

const ctfEvents: CTFEvent[] = [
  {
    id: "1",
    name: "DEF CON CTF Qualifier",
    date: "2024-05-25",
    difficulty: "Hard",
    team: "CyberWarriors",
    rank: 15,
    totalTeams: 200,
    flagsCaptured: 8,
    description:
      "Participated in the prestigious DEF CON CTF qualifier, focusing on reverse engineering and cryptography challenges.",
    challenges: [
      { id: "1", name: "Crypto Challenge 1", category: "Cryptography", points: 500, solved: true },
      { id: "2", name: "Rev Challenge 2", category: "Reverse Engineering", points: 750, solved: true },
    ],
  },
]

// Default users with hashed passwords
const users: User[] = [
  {
    id: "1",
    username: "admin",
    password: hashPassword("admin123"), // Hash the default password
  },
]

let siteInfo: SiteInfo = {
  name: "John Doe",
  title: "Cybersecurity Professional",
  description:
    "Passionate cybersecurity professional specializing in penetration testing, incident response, and security architecture.",
  email: "john.doe@example.com",
  github: "https://github.com/johndoe",
  linkedin: "https://linkedin.com/in/johndoe",
  twitter: "https://twitter.com/johndoe",
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
  },
  icon: "/images/avatar-photo.jpg",
  backgroundImage: "/images/background.jpeg",
  backgroundOpacity: 80,
}

// Helper function to generate IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Site Info functions
export async function getSiteInfo(): Promise<SiteInfo> {
  return siteInfo
}

export async function updateSiteInfo(updates: Partial<SiteInfo>): Promise<SiteInfo> {
  siteInfo = { ...siteInfo, ...updates }

  // Also try to write to JSON file if possible
  try {
    const fs = await import("fs/promises")
    const path = await import("path")

    const filePath = path.join(process.cwd(), "site_info.json")
    const jsonData = JSON.stringify(siteInfo, null, 2)
    await fs.writeFile(filePath, jsonData, "utf-8")
  } catch (error) {
    console.log("Could not write to site_info.json, using in-memory storage")
  }

  return siteInfo
}

// Project functions
export async function getProjects(limit?: number): Promise<Project[]> {
  return limit ? projects.slice(0, limit) : projects
}

export async function getProjectById(id: string): Promise<Project | null> {
  return projects.find((p) => p.id === id) || null
}

export async function addProject(project: Omit<Project, "id">): Promise<Project> {
  const newProject = { ...project, id: generateId() }
  projects.push(newProject)
  return newProject
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return null

  projects[index] = { ...projects[index], ...updates }
  return projects[index]
}

export async function deleteProject(id: string): Promise<boolean> {
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return false

  projects.splice(index, 1)
  return true
}

// Skill functions
export async function getSkills(): Promise<Skill[]> {
  return skills
}

export async function addSkill(skill: Omit<Skill, "id">): Promise<Skill> {
  const newSkill = { ...skill, id: generateId() }
  skills.push(newSkill)
  return newSkill
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill | null> {
  const index = skills.findIndex((s) => s.id === id)
  if (index === -1) return null

  skills[index] = { ...skills[index], ...updates }
  return skills[index]
}

export async function deleteSkill(id: string): Promise<boolean> {
  const index = skills.findIndex((s) => s.id === id)
  if (index === -1) return false

  skills.splice(index, 1)
  return true
}

// Certification functions
export async function getCertifications(): Promise<Certification[]> {
  return certifications
}

export async function addCertification(certification: Omit<Certification, "id">): Promise<Certification> {
  const newCertification = { ...certification, id: generateId() }
  certifications.push(newCertification)
  return newCertification
}

export async function updateCertification(id: string, updates: Partial<Certification>): Promise<Certification | null> {
  const index = certifications.findIndex((c) => c.id === id)
  if (index === -1) return null

  certifications[index] = { ...certifications[index], ...updates }
  return certifications[index]
}

export async function deleteCertification(id: string): Promise<boolean> {
  const index = certifications.findIndex((c) => c.id === id)
  if (index === -1) return false

  certifications.splice(index, 1)
  return true
}

// CTF Event functions
export async function getCTFEvents(limit?: number): Promise<CTFEvent[]> {
  return limit ? ctfEvents.slice(0, limit) : ctfEvents
}

export async function getCTFEventById(id: string): Promise<CTFEvent | null> {
  return ctfEvents.find((e) => e.id === id) || null
}

export async function addCTFEvent(event: Omit<CTFEvent, "id">): Promise<CTFEvent> {
  const newEvent = { ...event, id: generateId() }
  ctfEvents.push(newEvent)
  return newEvent
}

export async function updateCTFEvent(id: string, updates: Partial<CTFEvent>): Promise<CTFEvent | null> {
  const index = ctfEvents.findIndex((e) => e.id === id)
  if (index === -1) return null

  ctfEvents[index] = { ...ctfEvents[index], ...updates }
  return ctfEvents[index]
}

export async function deleteCTFEvent(id: string): Promise<boolean> {
  const index = ctfEvents.findIndex((e) => e.id === id)
  if (index === -1) return false

  ctfEvents.splice(index, 1)
  return true
}

// User validation function for database users
export async function validateUser(username: string, password: string): Promise<User | null> {
  const hashedPassword = hashPassword(password)
  const user = users.find((u) => u.username === username && u.password === hashedPassword)
  return user || null
}

// Authentication functions - these are wrappers that call the auth module
export async function authenticateUser(username: string, password: string) {
  // Import here to avoid circular dependency
  const { authenticateUser: authUser } = await import("./auth")
  return authUser(username, password)
}

export async function logoutUser(): Promise<void> {
  // Import here to avoid circular dependency
  const { logoutUser: authLogout } = await import("./auth")
  return authLogout()
}
