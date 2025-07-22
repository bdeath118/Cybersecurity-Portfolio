import { initializeSupabaseData } from "../lib/data.js"
const { createClient } = require("@supabase/supabase-js")
const {
  fallbackSiteInfo,
  fallbackProjects,
  fallbackSkills,
  fallbackCertifications,
  fallbackCTFEvents,
  fallbackDigitalBadges,
  fallbackBugBountyPrograms,
  fallbackSecurityArticles,
  fallbackOSINTCapabilities,
} = require("../lib/data") // Adjust path if necessary

// Ensure environment variables are loaded for the script
require("dotenv").config({ path: ".env.local" }) // For local development

const SUPABASE_URL = process.env.SUPABASE_URL || "https://icustcymiynpwjfoogtc.supabase.co/"
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "❌ Supabase URL or Service Role Key is not set. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.",
  )
  process.exit(1)
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function main() {
  console.log("🚀 Initializing Supabase with fallback data...")

  try {
    await initializeSupabaseData()
    console.log("✅ Supabase initialization completed successfully!")
  } catch (error) {
    console.error("❌ Supabase initialization failed:", error)
    process.exit(1)
  }

  console.log("🚀 Starting Supabase data seeding...")

  const tables = [
    { name: "site_info", data: [fallbackSiteInfo], isSingle: true },
    { name: "projects", data: fallbackProjects },
    { name: "skills", data: fallbackSkills },
    { name: "certifications", data: fallbackCertifications },
    { name: "ctf_events", data: fallbackCTFEvents },
    { name: "digital_badges", data: fallbackDigitalBadges },
    { name: "bug_bounty_programs", data: fallbackBugBountyPrograms },
    { name: "security_articles", data: fallbackSecurityArticles },
    { name: "osint_capabilities", data: fallbackOSINTCapabilities },
  ]

  for (const table of tables) {
    console.log(`\n--- Processing table: ${table.name} ---`)
    try {
      // Clear existing data for idempotency (optional, but good for seeding)
      console.log(`Clearing existing data from ${table.name}...`)
      const { error: deleteError } = await supabaseAdmin.from(table.name).delete().neq("id", "0") // Delete all rows, assuming 'id' exists

      if (deleteError) {
        console.warn(
          `⚠️ Warning: Could not clear data from ${table.name}. Error: ${deleteError.message}. Proceeding with upsert.`,
        )
      } else {
        console.log(`✅ Cleared existing data from ${table.name}.`)
      }

      // Insert new data
      console.log(`Inserting ${table.data.length} records into ${table.name}...`)
      const { data, error: insertError } = await supabaseAdmin
        .from(table.name)
        .upsert(table.data, {
          onConflict: "id", // Assuming 'id' is the primary key for upsert
          ignoreDuplicates: false,
        })
        .select()

      if (insertError) {
        console.error(`❌ Error inserting data into ${table.name}:`, insertError.message)
      } else {
        console.log(`✅ Successfully inserted data into ${table.name}.`)
        // console.log('Inserted data:', data); // Uncomment for debugging
      }
    } catch (error) {
      console.error(`❌ An unexpected error occurred while processing ${table.name}:`, error.message)
    }
  }

  console.log("\n🎉 Supabase data seeding complete!")
}

main()
