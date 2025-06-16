import { readFileSync, writeFileSync, readdirSync, statSync } from "fs"
import { join } from "path"

function removeAllStaticMetadata(dir = ".") {
  const fixedFiles = []

  function processFile(filePath) {
    try {
      const content = readFileSync(filePath, "utf8")

      // Check if file has static metadata export
      if (/export\s+const\s+metadata\s*=/.test(content)) {
        console.log(`🔧 Processing: ${filePath}`)

        // Remove static metadata export
        const fixedContent =
          content
            .replace(
              /export\s+const\s+metadata\s*=[\s\S]*?(?=\n\s*export|\n\s*$|\n\s*\/\/|\n\s*function|\n\s*const|\n\s*let|\n\s*var)/g,
              "",
            )
            .replace(/\n\n\n+/g, "\n\n")
            .trim() + "\n"

        // Only write if content actually changed
        if (fixedContent !== content) {
          // Create backup
          writeFileSync(filePath + ".backup", content)
          writeFileSync(filePath, fixedContent)
          fixedFiles.push(filePath)
          console.log(`✅ Fixed: ${filePath}`)
        }
      }
    } catch (error) {
      console.log(`❌ Could not process: ${filePath}`)
    }
  }

  function scanDirectory(currentDir) {
    try {
      const items = readdirSync(currentDir)

      for (const item of items) {
        if (item.startsWith(".") || item === "node_modules" || item === "dist" || item === "build") {
          continue
        }

        const fullPath = join(currentDir, item)

        try {
          const stat = statSync(fullPath)

          if (stat.isDirectory()) {
            scanDirectory(fullPath)
          } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
            processFile(fullPath)
          }
        } catch (error) {
          // Skip files we can't access
        }
      }
    } catch (error) {
      // Skip directories we can't access
    }
  }

  console.log("🔍 Scanning for static metadata exports...")
  scanDirectory(dir)

  if (fixedFiles.length > 0) {
    console.log(`\n✅ Fixed ${fixedFiles.length} files:`)
    fixedFiles.forEach((file) => console.log(`  - ${file}`))
  } else {
    console.log("\n✅ No static metadata exports found!")
  }

  return fixedFiles
}

// Run the cleanup
removeAllStaticMetadata()
