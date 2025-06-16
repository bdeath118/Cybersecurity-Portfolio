import { readFileSync, writeFileSync, readdirSync, statSync } from "fs"
import { join } from "path"

function findAllMetadataConflicts(startDir = ".") {
  const conflicts = []
  const allMetadataFiles = []

  function scanDirectory(currentDir) {
    try {
      const items = readdirSync(currentDir)

      for (const item of items) {
        const fullPath = join(currentDir, item)

        // Skip node_modules, .git, .next, etc.
        if (item.startsWith(".") || item === "node_modules" || item === "dist" || item === "build") {
          continue
        }

        try {
          const stat = statSync(fullPath)

          if (stat.isDirectory()) {
            scanDirectory(fullPath)
          } else if (item.endsWith(".tsx") || item.endsWith(".ts") || item.endsWith(".js") || item.endsWith(".jsx")) {
            const content = readFileSync(fullPath, "utf8")

            const hasStaticMetadata = /export\s+const\s+metadata\s*=/.test(content)
            const hasGenerateMetadata = /export\s+async\s+function\s+generateMetadata/.test(content)

            if (hasStaticMetadata || hasGenerateMetadata) {
              allMetadataFiles.push({
                file: fullPath,
                hasStatic: hasStaticMetadata,
                hasGenerate: hasGenerateMetadata,
                conflict: hasStaticMetadata && hasGenerateMetadata,
              })

              if (hasStaticMetadata && hasGenerateMetadata) {
                conflicts.push(fullPath)
              }
            }
          }
        } catch (error) {
          console.log(`Could not process: ${fullPath}`)
        }
      }
    } catch (error) {
      console.log(`Could not read directory: ${currentDir}`)
    }
  }

  scanDirectory(startDir)

  console.log("🔍 METADATA SCAN RESULTS:")
  console.log("=" * 50)

  if (conflicts.length > 0) {
    console.log("❌ CONFLICTS FOUND:")
    conflicts.forEach((file) => console.log(`  - ${file}`))
  } else {
    console.log("✅ No conflicts found!")
  }

  console.log("\n📋 ALL METADATA FILES:")
  allMetadataFiles.forEach(({ file, hasStatic, hasGenerate, conflict }) => {
    const status = conflict ? "❌ CONFLICT" : "✅ OK"
    const types = []
    if (hasStatic) types.push("static")
    if (hasGenerate) types.push("generate")
    console.log(`  ${status} ${file} (${types.join(", ")})`)
  })

  return { conflicts, allMetadataFiles }
}

// Run the scan
const results = findAllMetadataConflicts()

// If conflicts found, try to fix them
if (results.conflicts.length > 0) {
  console.log("\n🔧 ATTEMPTING TO FIX CONFLICTS...")

  results.conflicts.forEach((filePath) => {
    try {
      const content = readFileSync(filePath, "utf8")

      // Remove static metadata export, keep generateMetadata
      const fixedContent = content
        .replace(/export\s+const\s+metadata\s*=[\s\S]*?(?=\n\n|\nexport|\n\/\/|$)/g, "")
        .replace(/\n\n\n+/g, "\n\n") // Clean up extra newlines

      // Create backup
      writeFileSync(filePath + ".backup", content)
      writeFileSync(filePath, fixedContent)

      console.log(`✅ Fixed: ${filePath}`)
    } catch (error) {
      console.log(`❌ Could not fix: ${filePath} - ${error.message}`)
    }
  })
}
