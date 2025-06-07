import { readFileSync, readdirSync } from "fs"
import { join } from "path"

function checkMetadataConflicts(dir) {
  const conflicts = []

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
            conflicts.push(filePath)
          }
        } catch (error) {
          console.log(`Could not read file: ${filePath}`)
        }
      }
    }
  }

  scanDirectory(dir)
  return conflicts
}

// Check for conflicts in the app directory
const conflicts = checkMetadataConflicts("./app")

if (conflicts.length > 0) {
  console.log("❌ Metadata conflicts found in:")
  conflicts.forEach((file) => console.log(`  - ${file}`))
  console.log('\n🔧 Fix: Remove either "metadata" export or "generateMetadata" function from each file.')
} else {
  console.log("✅ No metadata conflicts found!")
}

console.log("\n📋 Metadata export summary:")
console.log('- Use "export const metadata = {...}" for static metadata')
console.log('- Use "export async function generateMetadata() {...}" for dynamic metadata')
console.log("- Use only one of them in the same file")
