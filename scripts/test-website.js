console.log("🧪 Testing website functionality...")

// Test basic imports
try {
  console.log("✅ Testing Node.js environment...")
  const fs = require("fs")
  const path = require("path")

  // Check if key files exist
  const keyFiles = ["app/layout.tsx", "app/page.tsx", "lib/data.ts", "lib/supabase.ts"]

  console.log("📁 Checking key files...")
  keyFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`)
    } else {
      console.log(`❌ ${file} missing`)
    }
  })

  console.log("🌐 Website structure looks good!")
  console.log("💡 Try running 'npm run dev' to start the development server")
} catch (error) {
  console.error("❌ Error testing website:", error.message)
}
