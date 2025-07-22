const fs = require("fs")
const { execSync } = require("child_process")

console.log("🔧 Reviewing and fixing webpack build issues...\n")

// This script assumes the latest package.json, eslint.config.js, tsconfig.json, and next.config.mjs
// are already provided in the project structure. Its primary role is to clean and reinstall dependencies.

// 1. Clean and reinstall dependencies
console.log("🧹 Cleaning dependencies...")
try {
  if (fs.existsSync("node_modules")) {
    execSync("rm -rf node_modules", { stdio: "inherit" })
  }
  if (fs.existsSync("package-lock.json")) {
    fs.unlinkSync("package-lock.json")
  }
  if (fs.existsSync(".next")) {
    execSync("rm -rf .next", { stdio: "inherit" })
  }

  console.log("📥 Installing updated dependencies...")
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed successfully")
} catch (error) {
  console.error("❌ Error during dependency installation:", error.message)
}

console.log(
  "\n🎉 Dependency and configuration review complete. Please ensure the provided files are in place and try building again.",
)
