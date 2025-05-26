"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  addProject,
  updateProject,
  deleteProject,
  addSkill,
  updateSkill,
  deleteSkill,
  addCertification,
  updateCertification,
  deleteCertification,
  addCTFEvent,
  updateCTFEvent,
  deleteCTFEvent,
} from "./data"

// Import auth functions from auth module
import { authenticateUser, logoutUser } from "./auth"

// Add these imports at the top
import fs from "fs/promises"
import path from "path"

// Helper function to read site info from JSON file with fallback
async function getSiteInfo() {
  try {
    const filePath = path.join(process.cwd(), "site_info.json")
    const fileContent = await fs.readFile(filePath, "utf-8")
    return JSON.parse(fileContent)
  } catch (error) {
    // If file doesn't exist, get from data module and create the file
    console.log("site_info.json not found, creating from default data...")
    const { getSiteInfo: getDefaultSiteInfo } = await import("./data")
    const defaultSiteInfo = await getDefaultSiteInfo()

    // Create the file with default data
    try {
      await writeJsonFile("site_info.json", defaultSiteInfo)
      console.log("Created site_info.json with default data")
    } catch (writeError) {
      console.error("Error creating site_info.json:", writeError)
    }

    return defaultSiteInfo
  }
}

// Helper function to write site info to JSON file
async function writeJsonFile(filename: string, data: any) {
  try {
    const filePath = path.join(process.cwd(), filename)
    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, jsonData, "utf-8")
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error)
  }
}

// Authentication
export async function login(username: string, password: string) {
  return await authenticateUser(username, password)
}

export async function logout() {
  await logoutUser()
}

// Auth check
export async function checkAuth() {
  const authCookie = cookies().get("admin-auth")

  if (!authCookie || authCookie.value !== "authenticated") {
    redirect("/admin")
  }
}

// Projects
export async function createProject(formData: FormData) {
  await checkAuth()

  const title = formData.get("title") as string
  const summary = formData.get("summary") as string
  const description = formData.get("description") as string
  const image = formData.get("image") as string
  const technologies = (formData.get("technologies") as string).split(",").map((t) => t.trim())
  const demoUrl = (formData.get("demoUrl") as string) || undefined
  const githubUrl = (formData.get("githubUrl") as string) || undefined
  const date = formData.get("date") as string

  const project = await addProject({
    title,
    summary,
    description,
    image: image || undefined,
    technologies,
    demoUrl,
    githubUrl,
    date,
  })

  return { success: true, project }
}

export async function editProject(id: string, formData: FormData) {
  await checkAuth()

  const title = formData.get("title") as string
  const summary = formData.get("summary") as string
  const description = formData.get("description") as string
  const image = formData.get("image") as string
  const technologies = (formData.get("technologies") as string).split(",").map((t) => t.trim())
  const demoUrl = (formData.get("demoUrl") as string) || undefined
  const githubUrl = (formData.get("githubUrl") as string) || undefined
  const date = formData.get("date") as string

  const project = await updateProject(id, {
    title,
    summary,
    description,
    image: image || undefined,
    technologies,
    demoUrl,
    githubUrl,
    date,
  })

  return { success: !!project, project }
}

export async function removeProject(id: string) {
  await checkAuth()

  const success = await deleteProject(id)
  return { success }
}

// Skills
export async function createSkill(formData: FormData) {
  await checkAuth()

  const name = formData.get("name") as string
  const level = Number.parseInt(formData.get("level") as string)
  const category = formData.get("category") as string

  const skill = await addSkill({
    name,
    level,
    category,
  })

  return { success: true, skill }
}

export async function editSkill(id: string, formData: FormData) {
  await checkAuth()

  const name = formData.get("name") as string
  const level = Number.parseInt(formData.get("level") as string)
  const category = formData.get("category") as string

  const skill = await updateSkill(id, {
    name,
    level,
    category,
  })

  return { success: !!skill, skill }
}

export async function removeSkill(id: string) {
  await checkAuth()

  const success = await deleteSkill(id)
  return { success }
}

// Certifications
export async function createCertification(formData: FormData) {
  await checkAuth()

  const name = formData.get("name") as string
  const issuer = formData.get("issuer") as string
  const date = formData.get("date") as string
  const expiryDate = (formData.get("expiryDate") as string) || undefined
  const description = formData.get("description") as string
  const logo = (formData.get("logo") as string) || undefined
  const credentialUrl = (formData.get("credentialUrl") as string) || undefined

  const certification = await addCertification({
    name,
    issuer,
    date,
    expiryDate,
    description,
    logo,
    credentialUrl,
  })

  return { success: true, certification }
}

export async function editCertification(id: string, formData: FormData) {
  await checkAuth()

  const name = formData.get("name") as string
  const issuer = formData.get("issuer") as string
  const date = formData.get("date") as string
  const expiryDate = (formData.get("expiryDate") as string) || undefined
  const description = formData.get("description") as string
  const logo = (formData.get("logo") as string) || undefined
  const credentialUrl = (formData.get("credentialUrl") as string) || undefined

  const certification = await updateCertification(id, {
    name,
    issuer,
    date,
    expiryDate,
    description,
    logo,
    credentialUrl,
  })

  return { success: !!certification, certification }
}

export async function removeCertification(id: string) {
  await checkAuth()

  const success = await deleteCertification(id)
  return { success }
}

// CTF Events
export async function createCTFEvent(formData: FormData) {
  await checkAuth()

  const name = formData.get("name") as string
  const date = formData.get("date") as string
  const difficulty = formData.get("difficulty") as "Easy" | "Medium" | "Hard"
  const team = formData.get("team") as string
  const rank = Number.parseInt(formData.get("rank") as string)
  const totalTeams = Number.parseInt(formData.get("totalTeams") as string)
  const flagsCaptured = Number.parseInt(formData.get("flagsCaptured") as string)
  const description = (formData.get("description") as string) || undefined

  const event = await addCTFEvent({
    name,
    date,
    difficulty,
    team,
    rank,
    totalTeams,
    flagsCaptured,
    description,
    challenges: [],
  })

  return { success: true, event }
}

export async function editCTFEvent(id: string, formData: FormData) {
  await checkAuth()

  const name = formData.get("name") as string
  const date = formData.get("date") as string
  const difficulty = formData.get("difficulty") as "Easy" | "Medium" | "Hard"
  const team = formData.get("team") as string
  const rank = Number.parseInt(formData.get("rank") as string)
  const totalTeams = Number.parseInt(formData.get("totalTeams") as string)
  const flagsCaptured = Number.parseInt(formData.get("flagsCaptured") as string)
  const description = (formData.get("description") as string) || undefined

  const event = await updateCTFEvent(id, {
    name,
    date,
    difficulty,
    team,
    rank,
    totalTeams,
    flagsCaptured,
    description,
  })

  return { success: !!event, event }
}

export async function removeCTFEvent(id: string) {
  await checkAuth()

  const success = await deleteCTFEvent(id)
  return { success }
}

// Site Info with Theme
export async function updateSiteInformation(formData: FormData) {
  await checkAuth()

  // Check if this is a theme update or background opacity update
  const updateType = formData.get("updateType")

  if (updateType === "theme") {
    const primaryColor = formData.get("primaryColor") as string
    const secondaryColor = formData.get("secondaryColor") as string
    const backgroundColor = formData.get("backgroundColor") as string
    const textColor = formData.get("textColor") as string

    const siteInfo = await getSiteInfo()
    const updatedInfo = {
      ...siteInfo,
      theme: {
        primaryColor,
        secondaryColor,
        backgroundColor,
        textColor,
      },
    }

    await writeJsonFile("site_info.json", updatedInfo)
    return { success: true, info: updatedInfo }
  } else if (updateType === "backgroundOpacity") {
    const backgroundOpacity = Number.parseInt(formData.get("backgroundOpacity") as string) || 100

    const siteInfo = await getSiteInfo()
    const updatedInfo = {
      ...siteInfo,
      backgroundOpacity,
    }

    await writeJsonFile("site_info.json", updatedInfo)
    return { success: true, info: updatedInfo }
  } else {
    // Regular site info update
    const name = formData.get("name") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const email = formData.get("email") as string
    const github = (formData.get("github") as string) || undefined
    const linkedin = (formData.get("linkedin") as string) || undefined
    const twitter = (formData.get("twitter") as string) || undefined

    const siteInfo = await getSiteInfo()
    const updatedInfo = {
      ...siteInfo,
      name,
      title,
      description,
      email,
      github,
      linkedin,
      twitter,
    }

    await writeJsonFile("site_info.json", updatedInfo)
    return { success: true, info: updatedInfo }
  }
}

// Icon Upload
export async function uploadIcon(formData: FormData) {
  await checkAuth()

  const iconFile = formData.get("icon") as File

  if (!iconFile) {
    return { success: false, message: "No file provided" }
  }

  try {
    // Ensure the public directory exists
    const publicDir = path.join(process.cwd(), "public")
    const uploadsDir = path.join(publicDir, "uploads")

    try {
      await fs.access(uploadsDir)
    } catch (error) {
      await fs.mkdir(uploadsDir, { recursive: true })
    }

    // Generate a unique filename
    const fileExtension = iconFile.name.split(".").pop()
    const fileName = `site-icon-${Date.now()}.${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)

    // Convert the file to a Buffer and save it
    const buffer = Buffer.from(await iconFile.arrayBuffer())
    await fs.writeFile(filePath, buffer)

    // Update the site info with the new icon path
    const siteInfo = await getSiteInfo()
    const iconUrl = `/uploads/${fileName}`

    const updatedInfo = {
      ...siteInfo,
      icon: iconUrl,
    }

    await writeJsonFile("site_info.json", updatedInfo)

    return { success: true, iconUrl }
  } catch (error) {
    console.error("Error uploading icon:", error)
    return { success: false, message: "Failed to upload icon" }
  }
}

// Background Image Upload
export async function uploadBackgroundImage(formData: FormData) {
  await checkAuth()

  const backgroundImageFile = formData.get("backgroundImage") as File
  const backgroundOpacity = Number.parseInt(formData.get("backgroundOpacity") as string) || 100

  if (!backgroundImageFile) {
    return { success: false, message: "No file provided" }
  }

  try {
    // Ensure the public directory exists
    const publicDir = path.join(process.cwd(), "public")
    const uploadsDir = path.join(publicDir, "uploads")

    try {
      await fs.access(uploadsDir)
    } catch (error) {
      await fs.mkdir(uploadsDir, { recursive: true })
    }

    // Generate a unique filename
    const fileExtension = backgroundImageFile.name.split(".").pop()
    const fileName = `background-${Date.now()}.${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)

    // Convert the file to a Buffer and save it
    const buffer = Buffer.from(await backgroundImageFile.arrayBuffer())
    await fs.writeFile(filePath, buffer)

    // Update the site info with the new background image path and opacity
    const siteInfo = await getSiteInfo()
    const backgroundImageUrl = `/uploads/${fileName}`

    const updatedInfo = {
      ...siteInfo,
      backgroundImage: backgroundImageUrl,
      backgroundOpacity,
    }

    await writeJsonFile("site_info.json", updatedInfo)

    return { success: true, backgroundImageUrl }
  } catch (error) {
    console.error("Error uploading background image:", error)
    return { success: false, message: "Failed to upload background image" }
  }
}
