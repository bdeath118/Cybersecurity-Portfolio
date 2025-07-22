import { createClient } from "@supabase/supabase-js"

// Ensure these are set in your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://icustcymiynpwjfoogtc.supabase.co/"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.warn("NEXT_PUBLIC_SUPABASE_URL is not set. Supabase client may not function correctly.")
}
if (!supabaseAnonKey) {
  console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Supabase client may not function correctly.")
}

// Client-side Supabase client (for use in browser environments)
export const supabase = createClient(supabaseUrl, supabaseAnonKey!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Server-side Supabase client (for use in API routes, server components, server actions)
// This client uses the service role key for elevated privileges,
// which should NEVER be exposed to the client-side.
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    console.error("SUPABASE_SERVICE_ROLE_KEY is not set. Admin client cannot be created.")
    throw new Error("Supabase service role key is missing.")
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Database types
export interface Database {
  public: {
    Tables: {
      site_info: {
        Row: {
          id: string
          name: string
          title: string
          description: string
          email: string
          phone: string | null
          location: string | null
          github: string | null
          linkedin: string | null
          twitter: string | null
          site_url: string
          avatar_url: string | null
          background_url: string | null
          theme_color: string | null
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
          phone?: string | null
          location?: string | null
          github?: string | null
          linkedin?: string | null
          twitter?: string | null
          site_url: string
          avatar_url?: string | null
          background_url?: string | null
          theme_color?: string | null
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
          phone?: string | null
          location?: string | null
          github?: string | null
          linkedin?: string | null
          twitter?: string | null
          site_url?: string
          avatar_url?: string | null
          background_url?: string | null
          theme_color?: string | null
          under_construction_mode?: any | null
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          summary: string
          description: string
          technologies: string[]
          github_url: string | null
          demo_url: string | null
          image: string | null
          featured: boolean
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          description: string
          technologies: string[]
          github_url?: string | null
          demo_url?: string | null
          image?: string | null
          featured?: boolean
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          description?: string
          technologies?: string[]
          github_url?: string | null
          demo_url?: string | null
          image?: string | null
          featured?: boolean
          date?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          level: number
          description: string | null
          endorsements: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          level: number
          description?: string | null
          endorsements?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          level?: number
          description?: string | null
          endorsements?: number | null
          updated_at?: string
        }
      }
      certifications: {
        Row: {
          id: string
          name: string
          issuer: string
          date: string
          expiry_date: string | null
          credential_id: string | null
          credential_url: string | null
          description: string
          verification_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          issuer: string
          date: string
          expiry_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          description: string
          verification_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          issuer?: string
          date?: string
          expiry_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          description?: string
          verification_status?: string | null
          updated_at?: string
        }
      }
      ctf_events: {
        Row: {
          id: string
          name: string
          platform: string
          rank: number
          total_teams: number | null
          points: number | null
          date: string
          difficulty: string
          team: string
          flags_captured: number
          description: string | null
          writeup_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          platform: string
          rank: number
          total_teams?: number | null
          points?: number | null
          date: string
          difficulty: string
          team: string
          flags_captured: number
          description?: string | null
          writeup_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          platform?: string
          rank?: number
          total_teams?: number | null
          points?: number | null
          date?: string
          difficulty?: string
          team?: string
          flags_captured?: number
          description?: string | null
          writeup_url?: string | null
          updated_at?: string
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
    }
  }
}

// Initialize Supabase connection on module load
let supabaseAdmin: any

if (typeof window === "undefined") {
  // Server-side initialization
  supabaseAdmin = createAdminClient()
}

// Test connection function
export async function testSupabaseConnection() {
  if (typeof window !== "undefined") {
    console.warn("Supabase connection test is only available on server-side.")
    return false
  }

  try {
    const { data, error } = await supabaseAdmin.from("site_info").select("count", { count: "exact", head: true })
    if (error) {
      console.warn("Supabase connection test failed:", error.message)
      return false
    }
    console.log("✅ Supabase connection successful")
    return true
  } catch (error) {
    console.error("❌ Supabase connection error:", error)
    return false
  }
}
