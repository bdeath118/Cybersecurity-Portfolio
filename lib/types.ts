export interface SiteInfo {
  id: string
  site_name: string
  title: string
  description: string
  seo_title: string
  seo_description: string
  keywords: string[]
  site_url: string
  social_image_url: string
  avatar_url: string
  linkedin_profile_url: string
  github_username: string
  credly_username: string
  hackerone_username: string
  hackthebox_username: string
  email_address: string
  theme_color: string
  twitter: string
  admin_username: string
  admin_password_hash: string
  last_updated: string
}

export interface Project {
  id: string
  title: string
  description: string
  image_url: string
  github_url?: string
  live_url?: string
  technologies: string[]
  category: string
  date: string
}

export interface Skill {
  id: string
  name: string
  proficiency: number // 0-100
  category: string
  icon?: string // Lucide icon name or path
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issue_date: string
  expiration_date?: string
  credential_id?: string
  credential_url?: string
  image_url?: string
  category: string
}

export interface CTFEvent {
  id: string
  name: string
  platform: string
  date: string
  rank?: string
  score?: number
  challenges_solved?: number
  description: string
  url?: string
  image_url?: string
}

export interface DigitalBadge {
  id: string
  name: string
  issuer: string
  issue_date: string
  credential_url: string
  image_url: string
  description?: string
}

export interface BugBountyProgram {
  id: string
  name: string
  platform: string
  rewards: string
  scope: string
  url: string
  status: "active" | "inactive" | "private"
  last_updated: string
}

export interface SecurityArticle {
  id: string
  title: string
  author: string
  publish_date: string
  url: string
  summary: string
  tags: string[]
}

export interface OSINTCapability {
  id: string
  name: string
  description: string
  tools: string[]
  use_cases: string[]
}

export interface UnderConstructionSettings {
  enabled: boolean
  message: string
  estimatedCompletion: string
  progressPercentage: number
  allowAdminAccess: boolean
}

export interface PortfolioStats {
  projectsCount: number
  skillsCount: number
  certificationsCount: number
  ctfEventsCount: number
  digitalBadgesCount: number
  bugBountyProgramsCount: number
  securityArticlesCount: number
  osintCapabilitiesCount: number
}

export interface IntegrationStatus {
  platform: string
  connected: boolean
  last_synced?: string
  error?: string
  data_count?: number
}

export interface AdminCredentials {
  admin_username: string
  admin_password_hash: string
}

export interface ImportSettings {
  credly_enabled: boolean
  credly_auto_sync: boolean
  credly_last_sync?: string
  linkedin_enabled: boolean
  linkedin_auto_sync: boolean
  linkedin_last_sync?: string
  github_enabled: boolean
  github_auto_sync: boolean
  github_last_sync?: string
  hackerone_enabled: boolean
  hackerone_auto_sync: boolean
  hackerone_last_sync?: string
  canvas_enabled: boolean
  canvas_auto_sync: boolean
  canvas_last_sync?: string
}

export interface AdvancedSettings {
  enable_rate_limiting: boolean
  enable_security_headers: boolean
  enable_content_security_policy: boolean
  enable_xss_protection: boolean
  enable_csrf_protection: boolean
  enable_hsts: boolean
  enable_referrer_policy: boolean
  enable_feature_policy: boolean
  enable_client_side_encryption: boolean
  enable_server_side_encryption: boolean
  data_retention_days: number
  log_level: "debug" | "info" | "warn" | "error"
}
