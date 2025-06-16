import { readFileSync, writeFileSync, readdirSync, statSync } from "fs"
import { join } from "path"

function findExactConflict() {
  const conflicts = []

  function scanFile(filePath) {
    try {
      const content = readFileSync(filePath, "utf8")
      const lines = content.split("\n")

      let hasStaticMetadata = false
      let hasGenerateMetadata = false
      let staticLine = -1
      let generateLine = -1

      lines.forEach((line, index) => {
        if (/export\s+const\s+metadata\s*=/.test(line)) {
          hasStaticMetadata = true
          staticLine = index + 1
        }
        if (/export\s+async\s+function\s+generateMetadata/.test(line)) {
          hasGenerateMetadata = true
          generateLine = index + 1
        }
      })

      if (hasStaticMetadata && hasGenerateMetadata) {
        conflicts.push({
          file: filePath,
          staticLine,
          generateLine,
          content: content,
        })
      }

      return { hasStaticMetadata, hasGenerateMetadata, staticLine, generateLine }
    } catch (error) {
      return null
    }
  }

  function scanDirectory(dir) {
    try {
      const items = readdirSync(dir)

      for (const item of items) {
        const fullPath = join(dir, item)

        if (item.startsWith(".") || item === "node_modules") continue

        try {
          const stat = statSync(fullPath)

          if (stat.isDirectory()) {
            scanDirectory(fullPath)
          } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
            const result = scanFile(fullPath)
            if (result && result.hasStaticMetadata && result.hasGenerateMetadata) {
              console.log(`❌ CONFLICT FOUND: ${fullPath}`)
              console.log(`   Static metadata at line: ${result.staticLine}`)
              console.log(`   Generate metadata at line: ${result.generateLine}`)
            }
          }
        } catch (error) {
          // Skip files we can't access
        }
      }
    } catch (error) {
      // Skip directories we can't access
    }
  }

  // Scan the entire project
  scanDirectory(".")

  return conflicts
}

console.log("🔍 Scanning for exact metadata conflicts...")
const conflicts = findExactConflict()

if (conflicts.length > 0) {
  console.log(`\n❌ Found ${conflicts.length} conflict(s):`)

  conflicts.forEach(({ file, staticLine, generateLine, content }) => {
    console.log(`\nFile: ${file}`)
    console.log(`Static metadata at line ${staticLine}`)
    console.log(`Generate metadata at line ${generateLine}`)

    // Show the problematic lines
    const lines = content.split("\n")
    console.log("\nProblematic content:")
    console.log(`Line ${staticLine}: ${lines[staticLine - 1]}`)
    console.log(`Line ${generateLine}: ${lines[generateLine - 1]}`)

    // Fix the conflict by removing static metadata
    console.log(`\n🔧 Fixing ${file}...`)

    const fixedContent = content
      .replace(/export\s+const\s+metadata\s*=[\s\S]*?(?=\n\s*export|\n\s*$|\n\s*\/\/|\n\s*function)/, "")
      .replace(/\n\n\n+/g, "\n\n")

    // Create backup
    writeFileSync(file + ".backup", content)
    writeFileSync(file, fixedContent)

    console.log(`✅ Fixed ${file}`)
  })
} else {
  console.log("✅ No metadata conflicts found!")
}
