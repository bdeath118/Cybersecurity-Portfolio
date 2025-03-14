import fs from "fs/promises"
import path from "path"
import type { Project, Skill, Certification, CTFEvent, SiteInfo, User } from "./types"
import { hashPassword } from "./auth"

const DATA_DIR = path.join(process.cwd(), "data")

// Helper function to ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch (error) {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Helper function to read JSON file
async function readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
  try {
    await ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)

    try {
      const data = await fs.readFile(filePath, "utf8")
      return JSON.parse(data) as T
    } catch (error) {
      // If file doesn't exist, create it with default value
      await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), "utf8")
      return defaultValue
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return defaultValue
  }
}

// Helper function to write JSON file
async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  try {
    await ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8")
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    throw error
  }
}

// Projects
export async function getProjects(limit?: number): Promise<Project[]> {
  const defaultProjects: Project[] = [
    {
      id: "1",
      title: "Network Vulnerability Scanner",
      summary: "Automated tool for identifying security vulnerabilities in network infrastructure",
      description:
        "Developed a comprehensive network vulnerability scanner that automates the process of identifying security weaknesses in network infrastructure. The tool performs port scanning, service enumeration, and vulnerability detection using a database of known exploits.",
      image: "/placeholder.svg?height=200&width=400",
      technologies: ["Python", "Nmap", "Docker", "PostgreSQL"],
      date: "2023-05-15",
    },
    {
      id: "2",
      title: "Secure Authentication System",
      summary: "Multi-factor authentication system with biometric verification",
      description:
        "Designed and implemented a secure authentication system featuring multi-factor authentication, biometric verification, and protection against common attack vectors like brute force, credential stuffing, and session hijacking.",
      image: "/placeholder.svg?height=200&width=400",
      technologies: ["Node.js", "React", "JWT", "Biometrics API"],
      date: "2022-11-03",
    },
    {
      id: "3",
      title: "Malware Analysis Framework",
      summary: "Automated malware analysis and classification system",
      description:
        "Built a malware analysis framework that automates the process of analyzing suspicious files, extracting indicators of compromise, and classifying malware families using machine learning algorithms.",
      image: "/placeholder.svg?height=200&width=400",
      technologies: ["Python", "TensorFlow", "Docker", "Elasticsearch"],
      date: "2023-02-20",
    },
  ]

  const projects = await readJsonFile<Project[]>("projects.json", defaultProjects)

  if (limit && limit > 0) {
    return projects.slice(0, limit)
  }

  return projects
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects()
  return projects.find((project) => project.id === id) || null
}

export async function addProject(project: Omit<Project, "id">): Promise<Project> {
  const projects = await getProjects()
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
  }

  await writeJsonFile("projects.json", [...projects, newProject])
  return newProject
}

export async function updateProject(id: string, project: Partial<Project>): Promise<Project | null> {
  const projects = await getProjects()
  const index = projects.findIndex((p) => p.id === id)

  if (index === -1) return null

  const updatedProject = { ...projects[index], ...project }
  projects[index] = updatedProject

  await writeJsonFile("projects.json", projects)
  return updatedProject
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects()
  const filteredProjects = projects.filter((project) => project.id !== id)

  await writeJsonFile("projects.json", filteredProjects)
  return filteredProjects.length < projects.length
}

// Skills
export async function getSkills(): Promise<Skill[]> {
  const defaultSkills: Skill[] = [
    {
      id: "1",
      name: "Penetration Testing",
      level: 90,
      category: "Security",
    },
    {
      id: "2",
      name: "Network Security",
      level: 85,
      category: "Security",
    },
    {
      id: "3",
      name: "Malware Analysis",
      level: 75,
      category: "Security",
    },
    {
      id: "4",
      name: "Python",
      level: 80,
      category: "Programming",
    },
    {
      id: "5",
      name: "JavaScript",
      level: 70,
      category: "Programming",
    },
    {
      id: "6",
      name: "Incident Response",
      level: 85,
      category: "Security",
    },
  ]

  return await readJsonFile<Skill[]>("skills.json", defaultSkills)
}

export async function addSkill(skill: Omit<Skill, "id">): Promise<Skill> {
  const skills = await getSkills()
  const newSkill: Skill = {
    ...skill,
    id: Date.now().toString(),
  }

  await writeJsonFile("skills.json", [...skills, newSkill])
  return newSkill
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<Skill | null> {
  const skills = await getSkills()
  const index = skills.findIndex((s) => s.id === id)

  if (index === -1) return null

  const updatedSkill = { ...skills[index], ...skill }
  skills[index] = updatedSkill

  await writeJsonFile("skills.json", skills)
  return updatedSkill
}

export async function deleteSkill(id: string): Promise<boolean> {
  const skills = await getSkills()
  const filteredSkills = skills.filter((skill) => skill.id !== id)

  await writeJsonFile("skills.json", filteredSkills)
  return filteredSkills.length < skills.length
}

// Certifications
export async function getCertifications(): Promise<Certification[]> {
  const defaultCertifications: Certification[] = [
    {
      id: "1",
      name: "Certified Ethical Hacker (CEH)",
      issuer: "EC-Council",
      date: "2022-03-15",
      expiryDate: "2025-03-15",
      description:
        "Certified in identifying vulnerabilities in target systems and using the same knowledge and tools as a malicious hacker.",
      logo: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "2",
      name: "Certified Information Systems Security Professional (CISSP)",
      issuer: "ISC²",
      date: "2021-07-10",
      expiryDate: "2024-07-10",
      description:
        "Advanced certification for security professionals who design, implement, and manage cybersecurity programs.",
      logo: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "3",
      name: "Offensive Security Certified Professional (OSCP)",
      issuer: "Offensive Security",
      date: "2023-01-20",
      description:
        "Hands-on penetration testing certification that requires demonstrating the ability to compromise systems.",
      logo: "/placeholder.svg?height=48&width=48",
    },
  ]

  return await readJsonFile<Certification[]>("certifications.json", defaultCertifications)
}

export async function addCertification(certification: Omit<Certification, "id">): Promise<Certification> {
  const certifications = await getCertifications()
  const newCertification: Certification = {
    ...certification,
    id: Date.now().toString(),
  }

  await writeJsonFile("certifications.json", [...certifications, newCertification])
  return newCertification
}

export async function updateCertification(
  id: string,
  certification: Partial<Certification>,
): Promise<Certification | null> {
  const certifications = await getCertifications()
  const index = certifications.findIndex((c) => c.id === id)

  if (index === -1) return null

  const updatedCertification = { ...certifications[index], ...certification }
  certifications[index] = updatedCertification

  await writeJsonFile("certifications.json", certifications)
  return updatedCertification
}

export async function deleteCertification(id: string): Promise<boolean> {
  const certifications = await getCertifications()
  const filteredCertifications = certifications.filter((cert) => cert.id !== id)

  await writeJsonFile("certifications.json", filteredCertifications)
  return filteredCertifications.length < certifications.length
}

// CTF Events
export async function getCTFEvents(limit?: number): Promise<CTFEvent[]> {
  const defaultCTFEvents: CTFEvent[] = [
    {
      id: "1",
      name: "DEF CON CTF",
      date: "2023-08-10",
      difficulty: "Hard",
      team: "Security Ninjas",
      rank: 12,
      totalTeams: 204,
      flagsCaptured: 15,
      description:
        "One of the oldest and most prestigious CTF competitions, focusing on binary exploitation and reverse engineering.",
    },
    {
      id: "2",
      name: "picoCTF",
      date: "2023-03-15",
      difficulty: "Medium",
      team: "ByteBusters",
      rank: 45,
      totalTeams: 1021,
      flagsCaptured: 28,
      description: "Educational CTF designed for beginners and intermediate security enthusiasts.",
    },
    {
      id: "3",
      name: "HackTheBox CTF",
      date: "2022-11-05",
      difficulty: "Medium",
      team: "Security Ninjas",
      rank: 8,
      totalTeams: 128,
      flagsCaptured: 22,
      description:
        "Jeopardy-style CTF with a wide range of challenges including web exploitation, cryptography, and forensics.",
    },
  ]

  const ctfEvents = await readJsonFile<CTFEvent[]>("ctf_events.json", defaultCTFEvents)

  if (limit && limit > 0) {
    return ctfEvents.slice(0, limit)
  }

  return ctfEvents
}

export async function getCTFEventById(id: string): Promise<CTFEvent | null> {
  const events = await getCTFEvents()
  return events.find((event) => event.id === id) || null
}

export async function addCTFEvent(event: Omit<CTFEvent, "id">): Promise<CTFEvent> {
  const events = await getCTFEvents()
  const newEvent: CTFEvent = {
    ...event,
    id: Date.now().toString(),
  }

  await writeJsonFile("ctf_events.json", [...events, newEvent])
  return newEvent
}

export async function updateCTFEvent(id: string, event: Partial<CTFEvent>): Promise<CTFEvent | null> {
  const events = await getCTFEvents()
  const index = events.findIndex((e) => e.id === id)

  if (index === -1) return null

  const updatedEvent = { ...events[index], ...event }
  events[index] = updatedEvent

  await writeJsonFile("ctf_events.json", events)
  return updatedEvent
}

export async function deleteCTFEvent(id: string): Promise<boolean> {
  const events = await getCTFEvents()
  const filteredEvents = events.filter((event) => event.id !== id)

  await writeJsonFile("ctf_events.json", filteredEvents)
  return filteredEvents.length < events.length
}

// Site Info
export async function getSiteInfo(): Promise<SiteInfo> {
  const defaultSiteInfo: SiteInfo = {
    name: "John Doe",
    title: "Cybersecurity Professional",
    description:
      "Experienced cybersecurity professional specializing in penetration testing, vulnerability assessment, and security architecture.",
    email: "contact@example.com",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
  }

  return await readJsonFile<SiteInfo>("site_info.json", defaultSiteInfo)
}

export async function updateSiteInfo(info: Partial<SiteInfo>): Promise<SiteInfo> {
  const siteInfo = await getSiteInfo()
  const updatedInfo = { ...siteInfo, ...info }

  await writeJsonFile("site_info.json", updatedInfo)
  return updatedInfo
}

// User Authentication
export async function getUsers(): Promise<User[]> {
  const defaultUsers: User[] = [
    {
      id: "1",
      username: "admin",
      // This is just a placeholder - in a real app, use proper password hashing
      password: "admin123",
    },
  ]

  return await readJsonFile<User[]>("users.json", defaultUsers)
}

export async function validateUser(username: string, password: string): Promise<User | null> {
  const users = await getUsers()
  return (
    users.find((user) => user.username === username && hashPassword(user.password) === hashPassword(password)) || null
  )
}

export async function authenticateUser(username: string, password: string) {
  // Check if we're using environment variable credentials
  const users = await getUsers()
  const user = users.find(
    (user) => user.username === username && hashPassword(user.password) === hashPassword(password),
  )

  if (user) {
    return { success: true }
  }

  return { success: false, message: "Invalid username or password" }
}

export async function logoutUser() {
  return { success: true }
}

