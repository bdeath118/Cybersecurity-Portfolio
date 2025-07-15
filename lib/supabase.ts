import { createClient } from "@supabase/supabase-js"

// Supabase configuration with the provided URL
const supabaseUrl = "https://icustcymiynpwjfoogtc.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate Supabase configuration
export function isSupabaseConfigured(): boolean {
  const hasValidUrl = Boolean(supabaseUrl && supabaseUrl.startsWith("https://") && supabaseUrl.includes(".supabase.co"))
  const hasValidKey = Boolean(supabaseAnonKey && supabaseAnonKey.length > 50)

  console.log("Supabase Configuration Check:", {
    url: supabaseUrl,
    hasAnonKey: Boolean(supabaseAnonKey),
    hasServiceKey: Boolean(supabaseServiceKey),
    isConfigured: hasValidUrl && hasValidKey,
  })

  return hasValidUrl && hasValidKey
}

// Create client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey || "dummy-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Create server-side Supabase client with service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey || "dummy-key", {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Test connection function
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("site_info").select("count", { count: "exact", head: true })
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
if (typeof window === "undefined") {
  // Server-side initialization
  testSupabaseConnection()
}
