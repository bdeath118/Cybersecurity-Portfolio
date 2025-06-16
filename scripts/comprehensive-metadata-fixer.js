import { readFileSync, writeFileSync, readdirSync, statSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class MetadataConflictFixer {
  constructor() {
    this.conflicts = []
    this.fixedFiles = []
    this.allMetadataFiles = []
    this.errors = []
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

  scanFile(filePath) {
    try {
      const content = readFileSync(filePath, "utf8")
      const lines = content.split("\n")

      // More comprehensive regex patterns
      const staticMetadataPattern = /export\s+const\s+metadata\s*[:=]/
      const generateMetadataPattern = /export\s+(?:async\s+)?function\s+generateMetadata/
      const staticMetadataLinePattern = /^\s*export\s+const\s+metadata\s*[:=]/

      const hasStaticMetadata = staticMetadataPattern.test(content)
      const hasGenerateMetadata = generateMetadataPattern.test(content)

      if (hasStaticMetadata || hasGenerateMetadata) {
        const fileInfo = {
          file: filePath,
          hasStatic: hasStaticMetadata,
          hasGenerate: hasGenerateMetadata,
          conflict: hasStaticMetadata && hasGenerateMetadata,
          staticLines: [],
          generateLines: [],
        }

        // Find line numbers
        lines.forEach((line, index) => {
          if (staticMetadataLinePattern.test(line)) {
            fileInfo.staticLines.push(index + 1)
          }
          if (/export\s+(?:async\s+)?function\s+generateMetadata/.test(line)) {
            fileInfo.generateLines.push(index + 1)
          }
        })

        this.allMetadataFiles.push(fileInfo)

        if (fileInfo.conflict) {
          this.conflicts.push(fileInfo)
          this.log(`CONFLICT FOUND: ${filePath}`, "error")
          this.log(`  Static metadata on lines: ${fileInfo.staticLines.join(", ")}`, "warning")
          this.log(`  Generate metadata on lines: ${fileInfo.generateLines.join(", ")}`, "warning")
        }
      }
    } catch (error) {
      this.errors.push({ file: filePath, error: error.message })
      this.log(`Error scanning ${filePath}: ${error.message}`, "error")
    }
  }

  scanDirectory(dir) {
    try {
      const items = readdirSync(dir)

      for (const item of items) {
        // Skip common directories that shouldn't be scanned
        if (item.startsWith(".") || ["node_modules", "dist", "build", "out", ".next", "coverage"].includes(item)) {
          continue
        }

        const fullPath = join(dir, item)

        try {
          const stat = statSync(fullPath)

          if (stat.isDirectory()) {
            this.scanDirectory(fullPath)
          } else if (/\.(tsx?|jsx?)$/.test(item)) {
            this.scanFile(fullPath)
          }
        } catch (error) {
          this.log(`Could not process: ${fullPath}`, "warning")
        }
      }
    } catch (error) {
      this.log(`Could not read directory: ${dir}`, "error")
    }
  }

  fixConflict(fileInfo) {
    try {
      const content = readFileSync(fileInfo.file, "utf8")

      // Create backup
      const backupPath = fileInfo.file + ".backup"
      writeFileSync(backupPath, content)

      // Remove static metadata exports more precisely
      let fixedContent = content

      // Pattern to match export const metadata = { ... } including multiline
      const staticMetadataRegex = /export\s+const\s+metadata\s*[:=]\s*\{[^}]*\}(?:\s*;)?/gs
      const simpleStaticMetadataRegex = /export\s+const\s+metadata\s*[:=][^;]*;?/g

      // Try comprehensive pattern first
      if (staticMetadataRegex.test(content)) {
        fixedContent = fixedContent.replace(staticMetadataRegex, "")
      } else {
        // Fallback to simpler pattern
        fixedContent = fixedContent.replace(simpleStaticMetadataRegex, "")
      }

      // Clean up extra whitespace
      fixedContent =
        fixedContent
          .replace(/\n\s*\n\s*\n/g, "\n\n") // Remove triple+ newlines
          .replace(/^\s*\n/, "") // Remove leading newlines
          .trim() + "\n"

      if (fixedContent !== content) {
        writeFileSync(fileInfo.file, fixedContent)
        this.fixedFiles.push(fileInfo.file)
        this.log(`FIXED: ${fileInfo.file}`, "fix")
        this.log(`  Backup created: ${backupPath}`, "info")
        return true
      } else {
        this.log(`No changes needed for: ${fileInfo.file}`, "warning")
        return false
      }
    } catch (error) {
      this.log(`Failed to fix ${fileInfo.file}: ${error.message}`, "error")
      return false
    }
  }

  generateReport() {
    this.log("\n" + "=".repeat(60), "info")
    this.log("METADATA CONFLICT SCAN REPORT", "info")
    this.log("=".repeat(60), "info")

    this.log(`Total files scanned: ${this.allMetadataFiles.length}`, "info")
    this.log(`Conflicts found: ${this.conflicts.length}`, this.conflicts.length > 0 ? "error" : "success")
    this.log(`Files fixed: ${this.fixedFiles.length}`, "success")
    this.log(`Errors encountered: ${this.errors.length}`, this.errors.length > 0 ? "warning" : "success")

    if (this.allMetadataFiles.length > 0) {
      this.log("\nALL METADATA FILES:", "info")
      this.allMetadataFiles.forEach((file) => {
        const status = file.conflict ? "❌ CONFLICT" : "✅ OK"
        const types = []
        if (file.hasStatic) types.push("static")
        if (file.hasGenerate) types.push("generate")
        this.log(`  ${status} ${file.file} (${types.join(", ")})`)
      })
    }

    if (this.fixedFiles.length > 0) {
      this.log("\nFIXED FILES:", "success")
      this.fixedFiles.forEach((file) => this.log(`  ✅ ${file}`))
    }

    if (this.errors.length > 0) {
      this.log("\nERRORS:", "error")
      this.errors.forEach((error) => this.log(`  ❌ ${error.file}: ${error.error}`))
    }
  }

  async run() {
    this.log("Starting comprehensive metadata conflict scan...", "info")

    // Scan the entire project
    this.scanDirectory(".")

    // Fix any conflicts found
    if (this.conflicts.length > 0) {
      this.log(`\nFixing ${this.conflicts.length} conflicts...`, "fix")
      for (const conflict of this.conflicts) {
        this.fixConflict(conflict)
      }
    }

    // Generate report
    this.generateReport()

    return {
      conflicts: this.conflicts.length,
      fixed: this.fixedFiles.length,
      errors: this.errors.length,
    }
  }
}

// Run the fixer
const fixer = new MetadataConflictFixer()
const results = await fixer.run()

if (results.conflicts === 0) {
  console.log("\n🎉 No metadata conflicts found! Project is ready for deployment.")
} else if (results.fixed > 0) {
  console.log(`\n🔧 Fixed ${results.fixed} conflicts. Please test the build now.`)
} else {
  console.log("\n⚠️ Conflicts found but could not be automatically fixed. Manual intervention required.")
}
