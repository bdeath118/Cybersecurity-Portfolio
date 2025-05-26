import fs from "fs/promises"
import path from "path"
import { getSiteInfo } from "./data"

// Initialize the application data files
export async function initializeApp() {
  try {
    // Check if site_info.json exists, if not create it
    const siteInfoPath = path.join(process.cwd(), "site_info.json")

    try {
      await fs.access(siteInfoPath)
      console.log("✅ site_info.json exists")
    } catch (error) {
      console.log("📝 Creating site_info.json...")
      const defaultSiteInfo = await getSiteInfo()
      const jsonData = JSON.stringify(defaultSiteInfo, null, 2)
      await fs.writeFile(siteInfoPath, jsonData, "utf-8")
      console.log("✅ Created site_info.json with default data")
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    try {
      await fs.access(uploadsDir)
      console.log("✅ uploads directory exists")
    } catch (error) {
      console.log("📁 Creating uploads directory...")
      await fs.mkdir(uploadsDir, { recursive: true })
      console.log("✅ Created uploads directory")
    }
  } catch (error) {
    console.error("❌ Error initializing app:", error)
  }
}
