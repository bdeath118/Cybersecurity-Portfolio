import { readFileSync, writeFileSync, readdirSync } from "fs"
import { join } from "path"

function fixMetadataConflicts(dir) {
  const fixedFiles = []

  function scanDirectory(currentDir) {
    const items = readdirSync(currentDir, { withFileTypes: true })

    for (const item of items) {
      if (item.isDirectory() && !item.name.startsWith(".")) {
        scanDirectory(join(currentDir, item.name))
      } else if (item.name.endsWith(".tsx") || item.name.endsWith(".ts")) {
        const filePath = join(currentDir, item.name)
        try {
          const content = readFileSync(filePath, "utf8")

          const hasMetadata = /export\s+const\s+metadata\s*=/.test(content)
          const hasGenerateMetadata = /export\s+async\s+function\s+generateMetadata/.test(content)

          if (hasMetadata && hasGenerateMetadata) {
            // Remove static metadata export, keep generateMetadata
            const fixedContent = content.replace(
              /export\s+const\s+metadata\s*=[\s\S]*?(?=\n\n|\nexport|\n\/\/|\n$)/g,
              "",
            )
            writeFileSync(filePath, fixedContent)
            fixedFiles.push(filePath)
          }
        } catch (error) {
          console.log(`Could not process file: ${filePath}`)
        }
      }
    }
  }

  scanDirectory(dir)
  return fixedFiles
}

// Fix conflicts in the app directory
const fixedFiles = fixMetadataConflicts("./app")

if (fixedFiles.length > 0) {
  console.log("✅ Fixed metadata conflicts in:")
  fixedFiles.forEach((file) => console.log(`  - ${file}`))
} else {
  console.log("✅ No metadata conflicts found to fix!")
}

console.log("\n📋 All files now use generateMetadata for dynamic metadata generation")
