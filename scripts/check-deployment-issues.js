const fs = require("fs")
const path = require("path")

function checkMetadataConflicts(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  const issues = []

  for (const file of files) {
    const filePath = path.join(dir, file.name)

    if (file.isDirectory() && !file.name.startsWith(".") && file.name !== "node_modules") {
      issues.push(...checkMetadataConflicts(filePath))
    } else if (file.name.endsWith(".tsx") || file.name.endsWith(".ts")) {
      try {
        const content = fs.readFileSync(filePath, "utf8")

        // Check for metadata conflicts
        const hasMetadata = content.includes("export const metadata") || content.includes("export { metadata }")
        const hasGenerateMetadata =
          content.includes("export async function generateMetadata") ||
          content.includes("export function generateMetadata")

        if (hasMetadata && hasGenerateMetadata) {
          issues.push({
            file: filePath,
            issue: "Both metadata and generateMetadata exports found",
            type: "metadata_conflict",
          })
        }

        // Check for missing imports
        const imports = content.match(/import.*from ['"]([^'"]+)['"]/g) || []
        const localImports = imports.filter((imp) => imp.includes("@/") || imp.includes("./") || imp.includes("../"))

        for (const imp of localImports) {
          const match = imp.match(/from ['"]([^'"]+)['"]/)
          if (match) {
            const importPath = match[1]
            let resolvedPath

            if (importPath.startsWith("@/")) {
              resolvedPath = path.join(process.cwd(), importPath.replace("@/", ""))
            } else if (importPath.startsWith("./") || importPath.startsWith("../")) {
              resolvedPath = path.resolve(path.dirname(filePath), importPath)
            }

            if (resolvedPath) {
              const extensions = [".ts", ".tsx", ".js", ".jsx"]
              let exists = false

              for (const ext of extensions) {
                if (fs.existsSync(resolvedPath + ext)) {
                  exists = true
                  break
                }
              }

              if (!exists && fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
                const indexFiles = ["index.ts", "index.tsx", "index.js", "index.jsx"]
                for (const indexFile of indexFiles) {
                  if (fs.existsSync(path.join(resolvedPath, indexFile))) {
                    exists = true
                    break
                  }
                }
              }

              if (!exists) {
                issues.push({
                  file: filePath,
                  issue: `Missing import: ${importPath}`,
                  type: "missing_import",
                })
              }
            }
          }
        }
      } catch (error) {
        issues.push({
          file: filePath,
          issue: `Error reading file: ${error.message}`,
          type: "read_error",
        })
      }
    }
  }

  return issues
}

console.log("🔍 Checking for deployment issues...\n")

const issues = checkMetadataConflicts(process.cwd())

if (issues.length === 0) {
  console.log("✅ No deployment issues found!")
} else {
  console.log(`❌ Found ${issues.length} issues:\n`)

  const groupedIssues = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = []
    acc[issue.type].push(issue)
    return acc
  }, {})

  for (const [type, typeIssues] of Object.entries(groupedIssues)) {
    console.log(`\n📋 ${type.toUpperCase().replace("_", " ")}:`)
    for (const issue of typeIssues) {
      console.log(`  - ${issue.file}: ${issue.issue}`)
    }
  }
}
