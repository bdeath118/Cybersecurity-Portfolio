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
  challenges?: CTFChallenge[]
  platform?: "ctftime" | "picoctf" | "tryhackme" | "hackthebox" | "other"
  points?: number
  writeupUrl?: string
}

export interface CTFChallenge {
  id: string
  name: string
  category: string
  points: number
  solved: boolean
  description?: string
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
  platform: "medium" | "personal" | "dev.to" | "hashnode" | "other"
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
  category: "reconnaissance" | "social-media" | "domain-analysis" | "threat-intelligence" | "other"
  description: string
  tools: string[]
  examples?: string[]
  proficiencyLevel: number
}

export interface User {
  id: string
  username: string
  password: string
}

export interface SiteInfo {
  name: string
  title: string
  description: string
  email: string
  github?: string
  linkedin?: string
  linkedinProfileUrl?: string
  resume?: string
  theme?: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
  }
  icon?: string
  backgroundImage?: string
  backgroundOpacity?: number
  siteUrl?: string
  autoImportSettings?: {
    linkedinEnabled: boolean
    badgesEnabled: boolean
    lastImport?: string
    importFrequency: "daily" | "weekly" | "manual"
  }
}

export interface LinkedInProfile {
  name: string
  headline: string
  summary: string
  experience: LinkedInExperience[]
  skills: LinkedInSkill[]
  projects: LinkedInProject[]
}

export interface LinkedInExperience {
  title: string
  company: string
  duration: string
  description: string
  skills?: string[]
}

export interface LinkedInSkill {
  name: string
  endorsements: number
}

export interface LinkedInProject {
  name: string
  description: string
  url?: string
  skills?: string[]
  date?: string
}

export interface ImportSettings {
  linkedinProfileUrl?: string
  credlyUsername?: string
  canvasApiKey?: string
  autoImportEnabled: boolean
  importFrequency: "daily" | "weekly" | "manual"
  lastImport?: string
  // CTF Platform Settings
  ctftimeUsername?: string
  picoctfUsername?: string
  tryhackmeUsername?: string
  hacktheboxUsername?: string
  // Bug Bounty Platform Settings
  hackeroneUsername?: string
  bugcrowdUsername?: string
  // Blog Platform Settings
  mediumUsername?: string
  personalBlogRss?: string
  devtoUsername?: string
}

export interface CyberSecurityIntegration {
  id: string
  platform: string
  username?: string
  apiKey?: string
  isConnected: boolean
  lastSync?: string
  syncEnabled: boolean
  dataTypes: string[]
}
