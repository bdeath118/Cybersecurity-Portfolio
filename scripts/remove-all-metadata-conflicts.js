import { readFileSync, writeFileSync, readdirSync } from "fs"
import { join } from "path"

function removeAllMetadataConflicts(dir) {
  const processedFiles = []

  function processDirectory(currentDir) {
    const items = readdirSync(currentDir, { withFileTypes: true })

    for (const item of items) {
      if (item.isDirectory() && !item.name.startsWith(".") && item.name !== "node_modules") {
        processDirectory(join(currentDir, item.name))
      } else if (item.name.endsWith(".tsx") || item.name.endsWith(".ts")) {
        const filePath = join(currentDir, item.name)
        try {
          let content = readFileSync(filePath, "utf8")
          let modified = false

          // Check for both exports
          const hasMetadata = /export\s+const\s+metadata\s*=/.test(content)
          const hasGenerateMetadata = /export\s+async\s+function\s+generateMetadata/.test(content)

          if (hasMetadata && hasGenerateMetadata) {
            // Remove static metadata export completely
            content = content.replace(
              /export\s+const\s+metadata\s*=\s*{[\s\S]*?}[\s\S]*?(?=\n\n|\nexport|\n\/\/|\nfunction|\nconst|\nlet|\nvar|$)/g,
              "",
            )
            modified = true
          } else if (hasMetadata && !hasGenerateMetadata) {
            // Convert static metadata to generateMetadata
            const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*({[\s\S]*?})/s)
            if (metadataMatch) {
              const metadataObject = metadataMatch[1]
              content = content.replace(
                /export\s+const\s+metadata\s*=\s*{[\s\S]*?}/s,
                `export async function generateMetadata() {\n  return ${metadataObject}\n}`,
              )
              modified = true
            }
          }

          if (modified) {
            // Clean up extra whitespace
            content = content.replace(/\n\n\n+/g, "\n\n")
            writeFileSync(filePath, content)
            processedFiles.push(filePath)
          }
        } catch (error) {
          console.warn(`Could not process ${filePath}:`, error.message)
        }
      }
    }
  }

  processDirectory(dir)
  return processedFiles
}

// Process all files
const processedFiles = removeAllMetadataConflicts("./app")

if (processedFiles.length > 0) {
  console.log("✅ Processed files:")
  processedFiles.forEach((file) => console.log(`  - ${file}`))
} else {
  console.log("✅ No metadata conflicts found!")
}

console.log("\n📋 All files now use generateMetadata for dynamic metadata")
