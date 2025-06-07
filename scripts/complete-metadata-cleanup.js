import { readFileSync, writeFileSync, readdirSync, statSync } from "fs"
import { join } from "path"

function findAllTsxFiles(dir, files = []) {
  const items = readdirSync(dir)

  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)

    if (stat.isDirectory() && !item.startsWith(".") && item !== "node_modules") {
      findAllTsxFiles(fullPath, files)
    } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
      files.push(fullPath)
    }
  }

  return files
}

function cleanMetadataConflicts() {
  const allFiles = findAllTsxFiles("./app")
  const processedFiles = []

  for (const filePath of allFiles) {
    try {
      let content = readFileSync(filePath, "utf8")
      let hasChanges = false

      // Check for both patterns
      const hasStaticMetadata = /export\s+const\s+metadata\s*=/.test(content)
      const hasGenerateMetadata = /export\s+async\s+function\s+generateMetadata/.test(content)

      if (hasStaticMetadata) {
        console.log(`Found static metadata in: ${filePath}`)

        if (hasGenerateMetadata) {
          // Remove static metadata, keep generateMetadata
          content = content.replace(
            /export\s+const\s+metadata\s*=[\s\S]*?(?=\n\n|\nexport|\nfunction|\nconst|\nlet|\nvar|$)/g,
            "",
          )
          hasChanges = true
          console.log(`  - Removed static metadata (keeping generateMetadata)`)
        } else {
          // Convert static to dynamic
          const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*({[\s\S]*?})/s)
          if (metadataMatch) {
            const metadataObj = metadataMatch[1]
            content = content.replace(
              /export\s+const\s+metadata\s*=\s*{[\s\S]*?}/s,
              `export async function generateMetadata() {\n  return ${metadataObj}\n}`,
            )
            hasChanges = true
            console.log(`  - Converted static to generateMetadata`)
          }
        }
      }

      if (hasChanges) {
        // Clean up whitespace
        content = content.replace(/\n\n\n+/g, "\n\n")
        content = content.replace(/^\n+/, "")

        writeFileSync(filePath, content)
        processedFiles.push(filePath)
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message)
    }
  }

  return processedFiles
}

// Run cleanup
console.log("🔍 Scanning for metadata conflicts...")
const processed = cleanMetadataConflicts()

if (processed.length > 0) {
  console.log("\n✅ Fixed metadata conflicts in:")
  processed.forEach((file) => console.log(`  - ${file}`))
} else {
  console.log("\n✅ No metadata conflicts found!")
}

console.log("\n📋 All files now use generateMetadata only")
