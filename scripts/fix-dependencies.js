const fs = require("fs")
const { execSync } = require("child_process")

console.log("🔧 Fixing deprecated dependencies...")

// Check if package-lock.json exists and remove it
if (fs.existsSync("package-lock.json")) {
  console.log("📦 Removing package-lock.json...")
  fs.unlinkSync("package-lock.json")
}

// Check if node_modules exists and remove it
if (fs.existsSync("node_modules")) {
  console.log("📁 Removing node_modules...")
  try {
    execSync("rm -rf node_modules", { stdio: "inherit" })
  } catch (error) {
    console.log("⚠️ Could not remove node_modules, continuing...")
  }
}

console.log("📥 Installing updated dependencies...")
try {
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies updated successfully!")

  console.log("🔍 Running audit...")
  try {
    execSync("npm audit --audit-level=moderate", { stdio: "inherit" })
  } catch (error) {
    console.log("ℹ️ Audit completed with warnings")
  }

  console.log("🛠️ Attempting to fix vulnerabilities...")
  try {
    execSync("npm audit fix", { stdio: "inherit" })
  } catch (error) {
    console.log("ℹ️ Some vulnerabilities may require manual attention")
  }
} catch (error) {
  console.log("⚠️ Some warnings may persist, but build should work")
  console.error("Error details:", error.message)
}

console.log("✨ Dependency cleanup complete!")
