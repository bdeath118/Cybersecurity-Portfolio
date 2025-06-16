import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Environment variable validation with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate required environment variables
if (!supabaseUrl) {
  console.error("❌ Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable")
  throw new Error("Supabase URL is required")
}

if (!supabaseAnonKey) {
  console.error("❌ Missing SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
  throw new Error("Supabase anonymous key is required")
}

// Singleton pattern to prevent multiple instances
let supabaseInstance: SupabaseClient | null = null
let supabaseAdminInstance: SupabaseClient | null = null

// Create singleton client-side Supabase client
function createSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "cybersecurity-portfolio-auth", // Unique storage key
      },
      global: {
        headers: {
          "X-Client-Info": "cybersecurity-portfolio@1.0.0",
        },
      },
    })

    console.log("🔗 Supabase client instance created")
  }

  return supabaseInstance
}

// Create singleton server-side Supabase client
function createSupabaseAdminClient(): SupabaseClient {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = supabaseServiceKey
      ? createClient(supabaseUrl, supabaseServiceKey, {
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
      : createSupabaseClient() // Fallback to regular client if service key not available

    console.log("🔗 Supabase admin client instance created")
  }

  return supabaseAdminInstance
}

// Export singleton instances
export const supabase = createSupabaseClient()
export const supabaseAdmin = createSupabaseAdminClient()

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

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Helper function to check if admin operations are available
export function isSupabaseAdminAvailable(): boolean {
  return !!(supabaseServiceKey && supabaseUrl && supabaseAnonKey)
}

// Helper function to get client info
export function getSupabaseClientInfo() {
  return {
    hasClient: !!supabaseInstance,
    hasAdminClient: !!supabaseAdminInstance,
    isConfigured: isSupabaseConfigured(),
    hasServiceKey: !!supabaseServiceKey,
  }
}

// Cleanup function for development (optional)
export function resetSupabaseClients() {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    supabaseInstance = null
    supabaseAdminInstance = null
    console.log("🔄 Supabase clients reset for development")
  }
}
