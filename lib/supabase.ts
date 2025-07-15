import { createClient } from "@supabase/supabase-js"

// Environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Create client-side Supabase client (singleton pattern)
let clientInstance: ReturnType<typeof createClient> | null = null

export function createSupabaseClient() {
  if (clientInstance) {
    return clientInstance
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase credentials not found. Using mock client.")
    return createMockClient()
  }

  if (!isValidUrl(supabaseUrl)) {
    console.error("❌ Invalid Supabase URL format:", supabaseUrl)
    return createMockClient()
  }

  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })

    console.log("✅ Supabase client initialized successfully")
    return clientInstance
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error)
    return createMockClient()
  }
}

// Create server-side Supabase client with service role key
export function createSupabaseServerClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("⚠️ Supabase server credentials not found. Using mock client.")
    return createMockClient()
  }

  if (!isValidUrl(supabaseUrl)) {
    console.error("❌ Invalid Supabase URL format:", supabaseUrl)
    return createMockClient()
  }

  try {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("❌ Failed to create Supabase server client:", error)
    return createMockClient()
  }
}

// Mock client for development/fallback
function createMockClient() {
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        single: () => Promise.resolve({ data: null, error: { message: "Mock client - no database connection" } }),
        order: (column: string, options?: any) =>
          Promise.resolve({ data: [], error: { message: "Mock client - no database connection" } }),
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: { message: "Mock client - no database connection" } }),
        }),
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: "Mock client - no database connection" } }),
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: "Mock client - no database connection" } }),
          }),
        }),
      }),
      upsert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: "Mock client - no database connection" } }),
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) =>
          Promise.resolve({ data: null, error: { message: "Mock client - no database connection" } }),
      }),
    }),
    auth: {
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Mock client - no auth" } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: {
      from: (bucket: string) => ({
        upload: () => Promise.resolve({ data: null, error: { message: "Mock client - no storage" } }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `/mock/${path}` } }),
      }),
    },
  } as any
}

// Default export for client-side usage
export default createSupabaseClient()

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl))
}

// Get configuration status
export function getSupabaseConfig() {
  return {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey,
    isValidUrl: supabaseUrl ? isValidUrl(supabaseUrl) : false,
    isConfigured: isSupabaseConfigured(),
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
