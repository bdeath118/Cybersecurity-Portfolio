import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Your actual working Supabase credentials
const WORKING_SUPABASE_URL = "https://icustcymiynpwjfoogtc.supabase.co"
const WORKING_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljdXN0Y3ltaXlucHdqZm9vZ3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzU4NjUsImV4cCI6MjA2NDkxMTg2NX0.HmHQMgGafnULLbUlygCXeAtFDV4S-FhTXyuZBPrXClI"
const WORKING_SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljdXN0Y3ltaXlucHdqZm9vZ3RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTMzNTg2NSwiZXhwIjoyMDY0OTExODY1fQ.F6BdeGINMlqD2VoEvhl80tuKrAWEVzGUCSHWt-XOuIc"

// Function to check if environment variable is a placeholder
function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true
  if (value.includes("your_supabase_project_url_here")) return true
  if (value.includes("placeholder")) return true
  if (value.includes("your_")) return true
  if (value.length < 10) return true
  return false
}

// Get environment variables
const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const envSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const envSupabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Use working credentials if environment variables are placeholders
const finalSupabaseUrl = isPlaceholder(envSupabaseUrl) ? WORKING_SUPABASE_URL : envSupabaseUrl!
const finalSupabaseAnonKey = isPlaceholder(envSupabaseAnonKey) ? WORKING_SUPABASE_ANON_KEY : envSupabaseAnonKey!
const finalSupabaseServiceKey = isPlaceholder(envSupabaseServiceKey)
  ? WORKING_SUPABASE_SERVICE_KEY
  : envSupabaseServiceKey!

console.log("🔧 Supabase Configuration:")
console.log("- URL:", finalSupabaseUrl.substring(0, 30) + "...")
console.log("- Using working credentials:", isPlaceholder(envSupabaseUrl) ? "YES" : "NO")

// Singleton pattern to prevent multiple instances
let supabaseInstance: SupabaseClient | null = null
let supabaseAdminInstance: SupabaseClient | null = null

// Create singleton client-side Supabase client
function createSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(finalSupabaseUrl, finalSupabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: "cybersecurity-portfolio-auth",
        },
        global: {
          headers: {
            "X-Client-Info": "cybersecurity-portfolio@1.0.0",
          },
        },
      })

      console.log("✅ Supabase client created successfully")
    } catch (error) {
      console.error("❌ Failed to create Supabase client:", error)
      throw error
    }
  }

  return supabaseInstance
}

// Create singleton server-side Supabase client
function createSupabaseAdminClient(): SupabaseClient {
  if (!supabaseAdminInstance) {
    try {
      supabaseAdminInstance = createClient(finalSupabaseUrl, finalSupabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: {
          headers: {
            "X-Client-Info": "cybersecurity-portfolio-admin@1.0.0",
          },
        },
      })

      console.log("✅ Supabase admin client created successfully")
    } catch (error) {
      console.error("❌ Failed to create Supabase admin client:", error)
      // Fallback to regular client
      supabaseAdminInstance = createSupabaseClient()
    }
  }

  return supabaseAdminInstance
}

// Export singleton instances
export const supabase = createSupabaseClient()
export const supabaseAdmin = createSupabaseAdminClient()

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(finalSupabaseUrl && finalSupabaseAnonKey)
}

// Helper function to check if admin operations are available
export function isSupabaseAdminAvailable(): boolean {
  return !!(finalSupabaseServiceKey && finalSupabaseUrl && finalSupabaseAnonKey)
}

// Helper function to get client info
export function getSupabaseClientInfo() {
  return {
    hasClient: !!supabaseInstance,
    hasAdminClient: !!supabaseAdminInstance,
    isConfigured: isSupabaseConfigured(),
    hasServiceKey: !!finalSupabaseServiceKey,
    url: finalSupabaseUrl,
    usingWorkingCredentials: isPlaceholder(envSupabaseUrl),
  }
}

// Database types (keeping existing types)
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          summary: string
          description: string
          image: string | null
          technologies: string[]
          demo_url: string | null
          github_url: string | null
          date: string
          linkedin_imported: boolean
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          description: string
          image?: string | null
          technologies: string[]
          demo_url?: string | null
          github_url?: string | null
          date: string
          linkedin_imported?: boolean
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          description?: string
          image?: string | null
          technologies?: string[]
          demo_url?: string | null
          github_url?: string | null
          date?: string
          linkedin_imported?: boolean
          last_updated?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          level: number
          category: string
          linkedin_imported: boolean
          endorsements: number
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          level: number
          category: string
          linkedin_imported?: boolean
          endorsements?: number
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          level?: number
          category?: string
          linkedin_imported?: boolean
          endorsements?: number
          last_updated?: string
        }
      }
      certifications: {
        Row: {
          id: string
          name: string
          issuer: string
          date: string
          expiry_date: string | null
          description: string
          logo: string | null
          credential_url: string | null
          verification_status: string
          auto_imported: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          issuer: string
          date: string
          expiry_date?: string | null
          description: string
          logo?: string | null
          credential_url?: string | null
          verification_status?: string
          auto_imported?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          issuer?: string
          date?: string
          expiry_date?: string | null
          description?: string
          logo?: string | null
          credential_url?: string | null
          verification_status?: string
          auto_imported?: boolean
        }
      }
      ctf_events: {
        Row: {
          id: string
          name: string
          date: string
          difficulty: string
          team: string
          rank: number
          total_teams: number
          flags_captured: number
          description: string | null
          platform: string | null
          points: number | null
          writeup_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          date: string
          difficulty: string
          team: string
          rank: number
          total_teams: number
          flags_captured: number
          description?: string | null
          platform?: string | null
          points?: number | null
          writeup_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          date?: string
          difficulty?: string
          team?: string
          rank?: number
          total_teams?: number
          flags_captured?: number
          description?: string | null
          platform?: string | null
          points?: number | null
          writeup_url?: string | null
        }
      }
      digital_badges: {
        Row: {
          id: string
          name: string
          issuer: string
          date: string
          description: string
          badge_url: string
          verification_url: string | null
          platform: string
          skills: string[] | null
          image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          issuer: string
          date: string
          description: string
          badge_url: string
          verification_url?: string | null
          platform: string
          skills?: string[] | null
          image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          issuer?: string
          date?: string
          description?: string
          badge_url?: string
          verification_url?: string | null
          platform?: string
          skills?: string[] | null
          image?: string | null
        }
      }
      bug_bounty_findings: {
        Row: {
          id: string
          title: string
          platform: string
          severity: string
          status: string
          bounty: number | null
          date: string
          description: string
          cve: string | null
          report_url: string | null
          company: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          platform: string
          severity: string
          status: string
          bounty?: number | null
          date: string
          description: string
          cve?: string | null
          report_url?: string | null
          company: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          platform?: string
          severity?: string
          status?: string
          bounty?: number | null
          date?: string
          description?: string
          cve?: string | null
          report_url?: string | null
          company?: string
        }
      }
      security_articles: {
        Row: {
          id: string
          title: string
          platform: string
          url: string
          published_date: string
          summary: string
          tags: string[]
          read_time: number | null
          views: number | null
          claps: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          platform: string
          url: string
          published_date: string
          summary: string
          tags: string[]
          read_time?: number | null
          views?: number | null
          claps?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          platform?: string
          url?: string
          published_date?: string
          summary?: string
          tags?: string[]
          read_time?: number | null
          views?: number | null
          claps?: number | null
        }
      }
      osint_capabilities: {
        Row: {
          id: string
          name: string
          category: string
          description: string
          tools: string[]
          examples: string[] | null
          proficiency_level: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description: string
          tools: string[]
          examples?: string[] | null
          proficiency_level: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string
          tools?: string[]
          examples?: string[] | null
          proficiency_level?: number
        }
      }
      site_info: {
        Row: {
          id: string
          name: string
          title: string
          description: string
          email: string
          github: string | null
          linkedin: string | null
          twitter: string | null
          resume: string | null
          icon: string | null
          background_image: string | null
          background_opacity: number
          theme: any
          site_url: string | null
          linkedin_profile_url: string | null
          auto_import_settings: any | null
          under_construction_mode: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          title: string
          description: string
          email: string
          github?: string | null
          linkedin?: string | null
          twitter?: string | null
          resume?: string | null
          icon?: string | null
          background_image?: string | null
          background_opacity?: number
          theme?: any
          site_url?: string | null
          linkedin_profile_url?: string | null
          auto_import_settings?: any | null
          under_construction_mode?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          description?: string
          email?: string
          github?: string | null
          linkedin?: string | null
          twitter?: string | null
          resume?: string | null
          icon?: string | null
          background_image?: string | null
          background_opacity?: number
          theme?: any
          site_url?: string | null
          linkedin_profile_url?: string | null
          auto_import_settings?: any | null
          under_construction_mode?: any | null
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          username: string
          password_hash: string
          created_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          last_login?: string | null
        }
      }
    }
  }
}
