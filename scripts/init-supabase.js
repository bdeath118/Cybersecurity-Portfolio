import { initializeSupabaseData } from "../lib/data.js"

async function main() {
  console.log("🚀 Initializing Supabase with fallback data...")

  try {
    await initializeSupabaseData()
    console.log("✅ Supabase initialization completed successfully!")
  } catch (error) {
    console.error("❌ Supabase initialization failed:", error)
    process.exit(1)
  }
}

main()
