const fs = require("fs")

console.log("🔍 VALIDATING ENVIRONMENT CONFIGURATION...")
console.log("=".repeat(50))

// Check for environment files
const envFiles = [".env.local", ".env"]
let foundEnvFile = false

envFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    foundEnvFile = true
    console.log(`✅ Found environment file: ${file}`)

    const content = fs.readFileSync(file, "utf8")

    // Check for placeholder values
    const placeholders = [
      "your_supabase_project_url_here",
      "your_anon_key_here",
      "your_service_role_key_here",
      "placeholder",
    ]

    let hasPlaceholders = false
    placeholders.forEach((placeholder) => {
      if (content.includes(placeholder)) {
        hasPlaceholders = true
        console.log(`❌ Found placeholder value: ${placeholder}`)
      }
    })

    if (!hasPlaceholders) {
      console.log("✅ No placeholder values found")
    }

    // Check for required variables
    const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

    requiredVars.forEach((varName) => {
      if (content.includes(`${varName}=`)) {
        const match = content.match(new RegExp(`${varName}=(.+)`))
        if (match && match[1] && match[1].trim() && !match[1].includes("your_")) {
          console.log(`✅ ${varName} is properly set`)
        } else {
          console.log(`❌ ${varName} has invalid or placeholder value`)
        }
      } else {
        console.log(`❌ ${varName} is missing`)
      }
    })
  }
})

if (!foundEnvFile) {
  console.log("❌ No environment file found")
  console.log("💡 Create .env.local with your Supabase credentials")
}

console.log("\n" + "=".repeat(50))
console.log("🚀 ENVIRONMENT VALIDATION COMPLETE")
console.log("=".repeat(50))

if (!foundEnvFile) {
  console.log("❌ ENVIRONMENT NOT READY")
  console.log("Create .env.local with proper Supabase credentials")
} else {
  console.log("✅ ENVIRONMENT FILE EXISTS")
  console.log("Check above for any configuration issues")
}
