import { spawn } from "child_process"
import { readFileSync, writeFileSync } from "fs"

class BuildTester {
  constructor() {
    this.buildErrors = []
    this.warnings = []
    this.fixes = []
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0]
    const prefix = {
      info: "ℹ️",
      success: "✅",
      warning: "⚠️",
      error: "❌",
      fix: "🔧",
    }[type]
    console.log(`[${timestamp}] ${prefix} ${message}`)
  }

  async runBuild() {
    return new Promise((resolve) => {
      this.log("Running npm run build...", "info")

      const buildProcess = spawn("npm", ["run", "build"], {
        stdio: "pipe",
        shell: true,
      })

      let stdout = ""
      let stderr = ""

      buildProcess.stdout.on("data", (data) => {
        const output = data.toString()
        stdout += output
        console.log(output.trim())
      })

      buildProcess.stderr.on("data", (data) => {
        const output = data.toString()
        stderr += output
        console.error(output.trim())
      })

      buildProcess.on("close", (code) => {
        this.log(`Build process exited with code: ${code}`, code === 0 ? "success" : "error")
        resolve({
          success: code === 0,
          stdout,
          stderr,
          exitCode: code,
        })
      })
    })
  }

  analyzeBuildOutput(buildResult) {
    const { stdout, stderr } = buildResult
    const fullOutput = stdout + stderr

    // Check for metadata conflicts
    if (fullOutput.includes('"metadata" and "generateMetadata" cannot be exported at the same time')) {
      this.buildErrors.push({
        type: "metadata_conflict",
        message: "Metadata and generateMetadata conflict detected",
        solution: "Remove static metadata exports",
      })
    }

    // Check for TypeScript errors
    if (fullOutput.includes("Type error:") || fullOutput.includes("TS")) {
      const tsErrors = fullOutput.match(/Type error:.*$/gm) || []
      tsErrors.forEach((error) => {
        this.buildErrors.push({
          type: "typescript",
          message: error.trim(),
          solution: "Fix TypeScript type errors",
        })
      })
    }

    // Check for ESLint errors
    if (fullOutput.includes("ESLint")) {
      this.warnings.push({
        type: "eslint",
        message: "ESLint warnings detected",
        solution: "Run npm run lint to see details",
      })
    }

    // Check for import/export errors
    if (fullOutput.includes("Module not found") || fullOutput.includes("Cannot resolve")) {
      const importErrors = fullOutput.match(/Module not found.*$/gm) || []
      importErrors.forEach((error) => {
        this.buildErrors.push({
          type: "import",
          message: error.trim(),
          solution: "Check import paths and ensure files exist",
        })
      })
    }

    // Check for Next.js config warnings
    if (fullOutput.includes("Invalid next.config")) {
      this.warnings.push({
        type: "nextjs_config",
        message: "Invalid Next.js configuration detected",
        solution: "Update next.config.mjs to remove deprecated options",
      })
    }
  }

  async fixCommonIssues() {
    this.log("Attempting to fix common build issues...", "fix")

    // Fix 1: Ensure no static metadata exports in any file
    try {
      const { spawn } = await import("child_process")
      const metadataFixer = spawn("node", ["scripts/comprehensive-metadata-fixer.js"], {
        stdio: "inherit",
        shell: true,
      })

      await new Promise((resolve) => {
        metadataFixer.on("close", resolve)
      })

      this.fixes.push("Ran comprehensive metadata fixer")
    } catch (error) {
      this.log(`Could not run metadata fixer: ${error.message}`, "warning")
    }

    // Fix 2: Update Next.js config if needed
    try {
      const configPath = "next.config.mjs"
      const configContent = readFileSync(configPath, "utf8")

      if (configContent.includes("swcMinify")) {
        const fixedConfig = configContent.replace(/swcMinify:\s*true,?\s*/g, "")
        writeFileSync(configPath, fixedConfig)
        this.fixes.push("Removed deprecated swcMinify from next.config.mjs")
        this.log("Fixed Next.js config", "fix")
      }
    } catch (error) {
      this.log("Could not check/fix Next.js config", "warning")
    }

    // Fix 3: Check for common TypeScript issues
    try {
      const tsconfigPath = "tsconfig.json"
      const tsconfigContent = readFileSync(tsconfigPath, "utf8")
      const tsconfig = JSON.parse(tsconfigContent)

      let needsUpdate = false

      // Ensure proper module resolution
      if (tsconfig.compilerOptions.moduleResolution !== "bundler") {
        tsconfig.compilerOptions.moduleResolution = "bundler"
        needsUpdate = true
      }

      // Ensure proper target
      if (tsconfig.compilerOptions.target !== "ES2022") {
        tsconfig.compilerOptions.target = "ES2022"
        needsUpdate = true
      }

      if (needsUpdate) {
        writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2))
        this.fixes.push("Updated TypeScript configuration")
        this.log("Fixed TypeScript config", "fix")
      }
    } catch (error) {
      this.log("Could not check/fix TypeScript config", "warning")
    }
  }

  generateReport() {
    this.log("\n" + "=".repeat(60), "info")
    this.log("BUILD TEST REPORT", "info")
    this.log("=".repeat(60), "info")

    if (this.buildErrors.length === 0) {
      this.log("🎉 No build errors found!", "success")
    } else {
      this.log(`❌ Found ${this.buildErrors.length} build errors:`, "error")
      this.buildErrors.forEach((error, index) => {
        this.log(`\n${index + 1}. ${error.type.toUpperCase()}:`, "error")
        this.log(`   ${error.message}`, "error")
        this.log(`   Solution: ${error.solution}`, "info")
      })
    }

    if (this.warnings.length > 0) {
      this.log(`\n⚠️ Found ${this.warnings.length} warnings:`, "warning")
      this.warnings.forEach((warning, index) => {
        this.log(`${index + 1}. ${warning.message}`, "warning")
        this.log(`   Solution: ${warning.solution}`, "info")
      })
    }

    if (this.fixes.length > 0) {
      this.log(`\n🔧 Applied ${this.fixes.length} fixes:`, "fix")
      this.fixes.forEach((fix, index) => {
        this.log(`${index + 1}. ${fix}`, "fix")
      })
    }
  }

  async run() {
    this.log("Starting build test and fix process...", "info")

    // First, try to fix common issues
    await this.fixCommonIssues()

    // Run the build
    const buildResult = await this.runBuild()

    // Analyze the output
    this.analyzeBuildOutput(buildResult)

    // Generate report
    this.generateReport()

    return {
      success: buildResult.success,
      errors: this.buildErrors.length,
      warnings: this.warnings.length,
      fixes: this.fixes.length,
    }
  }
}

// Run the build tester
const tester = new BuildTester()
const results = await tester.run()

if (results.success) {
  console.log("\n🎉 Build successful! Ready for deployment.")
} else {
  console.log(`\n❌ Build failed with ${results.errors} errors. Check the report above for solutions.`)
}
