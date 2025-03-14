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
}

export interface Skill {
  id: string
  name: string
  level: number
  category: string
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
}

export interface CTFChallenge {
  id: string
  name: string
  category: string
  points: number
  solved: boolean
  description?: string
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
  twitter?: string
  theme?: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
  }
  icon?: string
  backgroundImage?: string
  backgroundOpacity?: number
}

