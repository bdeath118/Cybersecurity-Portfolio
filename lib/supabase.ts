import { createClient } from "@supabase/supabase-js"

// Environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate Supabase configuration
export function isSupabaseConfigured(): boolean {
  const hasValidUrl =
    supabaseUrl &&
    supabaseUrl !== "your_supabase_project_url_here" &&
    supabaseUrl.startsWith("https://") &&
    supabaseUrl.includes(".supabase.co")

  const hasValidKey =
    supabaseAnonKey && supabaseAnonKey !== "your_supabase_anon_key_here" && supabaseAnonKey.length > 50

  const isConfigured = Boolean(hasValidUrl && hasValidKey)

  if (!isConfigured) {
    console.warn("⚠️ Supabase not properly configured:")
    console.warn("   - URL valid:", Boolean(hasValidUrl))
    console.warn("   - Key valid:", Boolean(hasValidKey))
    console.warn("   - Current URL:", supabaseUrl?.substring(0, 30) + "...")
  }

  return isConfigured
}

// Create Supabase client with validation
function createSupabaseClient() {
  if (!isSupabaseConfigured()) {
    console.warn("⚠️ Creating mock Supabase client - database operations will fail gracefully")

    // Return a mock client that prevents errors
    return {
      from: () => ({
        select: () => ({ data: null, error: new Error("Supabase not configured") }),
        insert: () => ({ data: null, error: new Error("Supabase not configured") }),
        update: () => ({ data: null, error: new Error("Supabase not configured") }),
        delete: () => ({ data: null, error: new Error("Supabase not configured") }),
        eq: () => ({ data: null, error: new Error("Supabase not configured") }),
        single: () => ({ data: null, error: new Error("Supabase not configured") }),
        order: () => ({ data: null, error: new Error("Supabase not configured") }),
        limit: () => ({ data: null, error: new Error("Supabase not configured") }),
      }),
      auth: {
        signIn: () => ({ data: null, error: new Error("Supabase not configured") }),
        signOut: () => ({ data: null, error: new Error("Supabase not configured") }),
        getUser: () => ({ data: null, error: new Error("Supabase not configured") }),
      },
    } as any
  }

  try {
    return createClient(supabaseUrl!, supabaseAnonKey!)
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error)
    throw error
  }
}

// Create admin client with service role key
function createSupabaseAdminClient() {
  if (!isSupabaseConfigured() || !supabaseServiceKey) {
    console.warn("⚠️ Creating mock Supabase admin client")
    return createSupabaseClient() // Return regular client as fallback
  }

  try {
    return createClient(supabaseUrl!, supabaseServiceKey)
  } catch (error) {
    console.error("❌ Failed to create Supabase admin client:", error)
    return createSupabaseClient() // Fallback to regular client
  }
}

// Export clients
export const supabase = createSupabaseClient()
export const supabaseAdmin = createSupabaseAdminClient()

// Export configuration status
export const SUPABASE_CONFIGURED = isSupabaseConfigured()

// Log configuration status
if (typeof window === "undefined") {
  // Only log on server side
  if (SUPABASE_CONFIGURED) {
    console.log("✅ Supabase configured successfully")
  } else {
    console.log("⚠️ Supabase not configured - using fallback data")
  }
}

// Database types
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
