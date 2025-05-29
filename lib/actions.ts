"use server"

import { revalidatePath } from "next/cache"
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
  updateSiteInfo,
  addDigitalBadge,
  updateDigitalBadge,
  deleteDigitalBadge,
  logoutUser,
} from "@/lib/data"
import { BadgeIntegration } from "@/lib/badge-integration"
import { LinkedInIntegration } from "@/lib/linkedin-integration"
import type { ImportSettings } from "@/lib/types"

// Project actions
export async function createProject(formData: FormData) {
  const title = formData.get("title") as string
  const summary = formData.get("summary") as string
  const description = formData.get("description") as string
  const image = formData.get("image") as string
  const technologies = (formData.get("technologies") as string).split(",").map((t) => t.trim())
  const demoUrl = formData.get("demoUrl") as string
  const githubUrl = formData.get("githubUrl") as string
  const date = formData.get("date") as string

  const project = await addProject({
    title,
    summary,
    description,
    image,
    technologies,
    demoUrl,
    githubUrl,
    date,
  })

  revalidatePath("/projects")
  revalidatePath("/admin/dashboard")
  return { success: true, project }
}

export async function editProject(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const summary = formData.get("summary") as string
  const description = formData.get("description") as string
  const image = formData.get("image") as string
  const technologies = (formData.get("technologies") as string).split(",").map((t) => t.trim())
  const demoUrl = formData.get("demoUrl") as string
  const githubUrl = formData.get("githubUrl") as string
  const date = formData.get("date") as string

  const project = await updateProject(id, {
    title,
    summary,
    description,
    image,
    technologies,
    demoUrl,
    githubUrl,
    date,
  })

  revalidatePath("/projects")
  revalidatePath(`/projects/${id}`)
  revalidatePath("/admin/dashboard")
  return { success: true, project }
}

export async function removeProject(id: string) {
  const success = await deleteProject(id)
  revalidatePath("/projects")
  revalidatePath("/admin/dashboard")
  return { success }
}

// Skill actions
export async function createSkill(formData: FormData) {
  const name = formData.get("name") as string
  const level = Number.parseInt(formData.get("level") as string)
  const category = formData.get("category") as string

  const skill = await addSkill({
    name,
    level,
    category,
  })

  revalidatePath("/skills")
  revalidatePath("/admin/dashboard")
  return { success: true, skill }
}

export async function editSkill(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const level = Number.parseInt(formData.get("level") as string)
  const category = formData.get("category") as string

  const skill = await updateSkill(id, {
    name,
    level,
    category,
  })

  revalidatePath("/skills")
  revalidatePath("/admin/dashboard")
  return { success: true, skill }
}

export async function removeSkill(id: string) {
  const success = await deleteSkill(id)
  revalidatePath("/skills")
  revalidatePath("/admin/dashboard")
  return { success }
}

// Certification actions
export async function createCertification(formData: FormData) {
  const name = formData.get("name") as string
  const issuer = formData.get("issuer") as string
  const date = formData.get("date") as string
  const expiryDate = formData.get("expiryDate") as string
  const description = formData.get("description") as string
  const logo = formData.get("logo") as string
  const credentialUrl = formData.get("credentialUrl") as string

  const certification = await addCertification({
    name,
    issuer,
    date,
    expiryDate: expiryDate || undefined,
    description,
    logo,
    credentialUrl,
  })

  revalidatePath("/certifications")
  revalidatePath("/admin/dashboard")
  return { success: true, certification }
}

export async function editCertification(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const issuer = formData.get("issuer") as string
  const date = formData.get("date") as string
  const expiryDate = formData.get("expiryDate") as string
  const description = formData.get("description") as string
  const logo = formData.get("logo") as string
  const credentialUrl = formData.get("credentialUrl") as string

  const certification = await updateCertification(id, {
    name,
    issuer,
    date,
    expiryDate: expiryDate || undefined,
    description,
    logo,
    credentialUrl,
  })

  revalidatePath("/certifications")
  revalidatePath("/admin/dashboard")
  return { success: true, certification }
}

export async function removeCertification(id: string) {
  const success = await deleteCertification(id)
  revalidatePath("/certifications")
  revalidatePath("/admin/dashboard")
  return { success }
}

// CTF Event actions
export async function createCTFEvent(formData: FormData) {
  const name = formData.get("name") as string
  const date = formData.get("date") as string
  const difficulty = formData.get("difficulty") as "Easy" | "Medium" | "Hard"
  const team = formData.get("team") as string
  const rank = Number.parseInt(formData.get("rank") as string)
  const totalTeams = Number.parseInt(formData.get("totalTeams") as string)
  const flagsCaptured = Number.parseInt(formData.get("flagsCaptured") as string)
  const description = formData.get("description") as string

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

  revalidatePath("/ctf")
  revalidatePath("/admin/dashboard")
  return { success: true, event }
}

export async function editCTFEvent(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const date = formData.get("date") as string
  const difficulty = formData.get("difficulty") as "Easy" | "Medium" | "Hard"
  const team = formData.get("team") as string
  const rank = Number.parseInt(formData.get("rank") as string)
  const totalTeams = Number.parseInt(formData.get("totalTeams") as string)
  const flagsCaptured = Number.parseInt(formData.get("flagsCaptured") as string)
  const description = formData.get("description") as string

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

  revalidatePath("/ctf")
  revalidatePath(`/ctf/${id}`)
  revalidatePath("/admin/dashboard")
  return { success: true, event }
}

export async function removeCTFEvent(id: string) {
  const success = await deleteCTFEvent(id)
  revalidatePath("/ctf")
  revalidatePath("/admin/dashboard")
  return { success }
}

// Site info actions
export async function updateSiteInformation(formData: FormData) {
  const name = formData.get("name") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const email = formData.get("email") as string
  const github = formData.get("github") as string
  const linkedin = formData.get("linkedin") as string
  const twitter = formData.get("twitter") as string
  const icon = formData.get("icon") as string
  const backgroundImage = formData.get("backgroundImage") as string
  const backgroundOpacity = Number.parseInt(formData.get("backgroundOpacity") as string)
  const primaryColor = formData.get("primaryColor") as string
  const secondaryColor = formData.get("secondaryColor") as string
  const backgroundColor = formData.get("backgroundColor") as string
  const textColor = formData.get("textColor") as string
  const siteUrl = formData.get("siteUrl") as string
  const linkedinProfileUrl = formData.get("linkedinProfileUrl") as string

  const siteInfo = await updateSiteInfo({
    name,
    title,
    description,
    email,
    github,
    linkedin,
    twitter,
    icon,
    backgroundImage,
    backgroundOpacity,
    theme: {
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
    },
    siteUrl,
    linkedinProfileUrl,
  })

  revalidatePath("/")
  revalidatePath("/admin/dashboard")
  return { success: true, siteInfo }
}

// Digital Badge actions
export async function createDigitalBadge(formData: FormData) {
  const name = formData.get("name") as string
  const issuer = formData.get("issuer") as string
  const date = formData.get("date") as string
  const description = formData.get("description") as string
  const badgeUrl = formData.get("badgeUrl") as string
  const verificationUrl = formData.get("verificationUrl") as string
  const platform = formData.get("platform") as "linkedin" | "canvas" | "credly" | "other"
  const skills = formData.get("skills") ? (formData.get("skills") as string).split(",").map((s) => s.trim()) : []

  const badge = await addDigitalBadge({
    name,
    issuer,
    date,
    description,
    badgeUrl,
    verificationUrl,
    platform,
    skills,
    image: badgeUrl,
  })

  revalidatePath("/")
  revalidatePath("/admin/dashboard")
  return { success: true, badge }
}

export async function editDigitalBadge(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const issuer = formData.get("issuer") as string
  const date = formData.get("date") as string
  const description = formData.get("description") as string
  const badgeUrl = formData.get("badgeUrl") as string
  const verificationUrl = formData.get("verificationUrl") as string
  const platform = formData.get("platform") as "linkedin" | "canvas" | "credly" | "other"
  const skills = formData.get("skills") ? (formData.get("skills") as string).split(",").map((s) => s.trim()) : []

  const badge = await updateDigitalBadge(id, {
    name,
    issuer,
    date,
    description,
    badgeUrl,
    verificationUrl,
    platform,
    skills,
    image: badgeUrl,
  })

  revalidatePath("/")
  revalidatePath("/admin/dashboard")
  return { success: true, badge }
}

export async function removeDigitalBadge(id: string) {
  const success = await deleteDigitalBadge(id)
  revalidatePath("/")
  revalidatePath("/admin/dashboard")
  return { success }
}

// Import actions
export async function updateImportSettings(formData: FormData) {
  // Get current site info first
  const currentSiteInfo = await import("@/lib/data").then((module) => module.getSiteInfo())

  // Update with new settings
  const linkedinEnabled = formData.get("linkedinEnabled") === "on"
  const importFrequency = (formData.get("importFrequency") as string) || "daily"
  const linkedinProfileUrl = formData.get("linkedinProfileUrl") as string

  const updatedSiteInfo = await updateSiteInfo({
    ...currentSiteInfo,
    linkedinProfileUrl: linkedinProfileUrl || currentSiteInfo.linkedinProfileUrl,
    autoImportSettings: {
      linkedinEnabled,
      badgesEnabled: true, // Always enable badges if we're updating settings
      importFrequency: importFrequency as "daily" | "weekly" | "manual",
      lastImport: currentSiteInfo.autoImportSettings?.lastImport,
    },
  })

  // Return the settings in the format expected by the component
  const settings: ImportSettings = {
    linkedinProfileUrl: updatedSiteInfo.linkedinProfileUrl,
    autoImportEnabled: updatedSiteInfo.autoImportSettings?.linkedinEnabled || false,
    importFrequency: updatedSiteInfo.autoImportSettings?.importFrequency || "daily",
    lastImport: updatedSiteInfo.autoImportSettings?.lastImport,
  }

  revalidatePath("/admin/dashboard")
  return { success: true, settings }
}

export async function triggerManualImport() {
  let importedCount = 0

  try {
    // Get site info to check settings
    const siteInfo = await import("@/lib/data").then((module) => module.getSiteInfo())

    // Import LinkedIn data if enabled
    if (siteInfo.autoImportSettings?.linkedinEnabled && siteInfo.linkedinProfileUrl) {
      const linkedinIntegration = new LinkedInIntegration(siteInfo.linkedinProfileUrl)

      // Import projects
      const projects = await linkedinIntegration.extractProjects()
      for (const project of projects) {
        await addProject(project)
        importedCount++
      }

      // Import skills
      const skills = await linkedinIntegration.extractSkills()
      for (const skill of skills) {
        await addSkill(skill)
        importedCount++
      }
    }

    // Import badges if enabled
    if (siteInfo.autoImportSettings?.badgesEnabled) {
      const badgeIntegration = new BadgeIntegration()

      // Import from Credly using OAuth
      const credlyBadges = await badgeIntegration.importCredlyBadges()
      for (const badge of credlyBadges) {
        await addDigitalBadge(badge)
        importedCount++
      }

      // Import from Canvas using OAuth
      const canvasBadges = await badgeIntegration.importCanvasBadges()
      for (const badge of canvasBadges) {
        await addDigitalBadge(badge)
        importedCount++
      }
    }

    // Update last import timestamp
    await updateSiteInfo({
      autoImportSettings: {
        ...siteInfo.autoImportSettings,
        lastImport: new Date().toISOString(),
      },
    })

    revalidatePath("/")
    revalidatePath("/projects")
    revalidatePath("/skills")
    revalidatePath("/admin/dashboard")

    return { success: true, imported: importedCount }
  } catch (error) {
    console.error("Error during manual import:", error)
    return { success: false, error: "Import failed" }
  }
}

export async function triggerBadgeImport() {
  let importedCount = 0

  try {
    const badgeIntegration = new BadgeIntegration()

    // Import badges from Credly using OAuth
    const credlyBadges = await badgeIntegration.importCredlyBadges()
    for (const badge of credlyBadges) {
      await addDigitalBadge(badge)
      importedCount++
    }

    // Import badges from Canvas using OAuth
    const canvasBadges = await badgeIntegration.importCanvasBadges()
    for (const badge of canvasBadges) {
      await addDigitalBadge(badge)
      importedCount++
    }

    revalidatePath("/")
    revalidatePath("/admin/dashboard")

    return { success: true, count: importedCount }
  } catch (error) {
    console.error("Error importing badges:", error)
    return { success: false, error: "Badge import failed" }
  }
}

// Logout action
export async function logout() {
  await logoutUser()
  redirect("/admin")
}
