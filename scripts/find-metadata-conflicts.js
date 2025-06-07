import { readFileSync, readdirSync } from "fs"
import { join } from "path"

function findAllMetadataUsage(dir) {
  const results = {
    staticMetadata: [],
    dynamicMetadata: [],
    conflicts: [],
  }

  function scanDirectory(currentDir) {
    const items = readdirSync(currentDir, { withFileTypes: true })

    for (const item of items) {
      if (item.isDirectory() && !item.name.startsWith(".") && !item.name.includes("node_modules")) {
        scanDirectory(join(currentDir, item.name))
      } else if (item.name.endsWith(".tsx") || item.name.endsWith(".ts")) {
        const filePath = join(currentDir, item.name)
        try {
          const content = readFileSync(filePath, "utf8")

          const hasMetadata = /export\s+const\s+metadata\s*=/.test(content)
          const hasGenerateMetadata = /export\s+async\s+function\s+generateMetadata/.test(content)

          if (hasMetadata && hasGenerateMetadata) {
            results.conflicts.push(filePath)
          } else if (hasMetadata) {
            results.staticMetadata.push(filePath)
          } else if (hasGenerateMetadata) {
            results.dynamicMetadata.push(filePath)
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }

  scanDirectory(dir)
  return results
}

// Analyze metadata usage
const results = findAllMetadataUsage("./app")

console.log("📊 Metadata Usage Analysis:")
console.log(`\n✅ Files with generateMetadata: ${results.dynamicMetadata.length}`)
results.dynamicMetadata.forEach((file) => console.log(`  - ${file}`))

console.log(`\n📄 Files with static metadata: ${results.staticMetadata.length}`)
results.staticMetadata.forEach((file) => console.log(`  - ${file}`))

console.log(`\n❌ Files with conflicts: ${results.conflicts.length}`)
results.conflicts.forEach((file) => console.log(`  - ${file}`))

if (results.conflicts.length > 0) {
  console.log("\n🔧 Run 'node scripts/fix-metadata-conflicts.js' to automatically fix conflicts")
} else {
  console.log("\n✅ No metadata conflicts detected!")
}
