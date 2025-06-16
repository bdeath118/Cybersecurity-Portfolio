const fs = require("fs")
const { execSync } = require("child_process")

console.log("🔧 Fixing webpack build issues...\n")

// 1. Fix package.json dependencies
console.log("📦 Updating package.json with stable versions...")
if (fs.existsSync("package-fixed.json")) {
  fs.copyFileSync("package-fixed.json", "package.json")
  console.log("✅ Package.json updated with stable versions")
}

// 2. Fix ESLint configuration
console.log("🔧 Fixing ESLint configuration...")
if (fs.existsSync("eslint.config.fixed.js")) {
  fs.copyFileSync("eslint.config.fixed.js", "eslint.config.js")
  console.log("✅ ESLint config fixed")
}

// 3. Fix TypeScript configuration
console.log("📝 Updating TypeScript configuration...")
if (fs.existsSync("tsconfig.fixed.json")) {
  fs.copyFileSync("tsconfig.fixed.json", "tsconfig.json")
  console.log("✅ TypeScript config updated")
}

// 4. Fix Next.js configuration
console.log("⚙️ Updating Next.js configuration...")
if (fs.existsSync("next.config.fixed.mjs")) {
  fs.copyFileSync("next.config.fixed.mjs", "next.config.mjs")
  console.log("✅ Next.js config updated")
}

// 5. Clean and reinstall dependencies
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

  console.log("📥 Installing fixed dependencies...")
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed successfully")
} catch (error) {
  console.error("❌ Error during dependency installation:", error.message)
}

console.log("\n🎉 Webpack issues fixed! Try building again.")
