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
  updateUnderConstructionSettings,
} from "@/lib/data"
import { BadgeIntegration } from "@/lib/badge-integration"
import { LinkedInIntegration } from "@/lib/linkedin-integration"
import type { ImportSettings } from "@/lib/types"
import { cookies } from "next/headers"

// Authentication check for server components
export async function checkAuth() {
  const authCookie = cookies().get("admin-auth")

  if (!authCookie || authCookie.value !== "authenticated") {
    redirect("/admin")
  }
}

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
  const updateType = formData.get("updateType") as string | null

  // Handle different update types
  if (updateType === "theme") {
    const primaryColor = formData.get("primaryColor") as string
    const secondaryColor = formData.get("secondaryColor") as string
    const backgroundColor = formData.get("backgroundColor") as string
    const textColor = formData.get("textColor") as string

    const siteInfo = await updateSiteInfo({
      theme: {
        primaryColor,
        secondaryColor,
        backgroundColor,
        textColor,
      },
    })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true, info: siteInfo }
  } else if (updateType === "backgroundOpacity") {
    const backgroundOpacity = Number.parseInt(formData.get("backgroundOpacity") as string)

    const siteInfo = await updateSiteInfo({
      backgroundOpacity,
    })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true, info: siteInfo }
  } else {
    // Regular update with all fields
    const name = formData.get("name") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const email = formData.get("email") as string
    const github = formData.get("github") as string
    const linkedin = formData.get("linkedin") as string
    const twitter = formData.get("twitter") as string

    const siteInfo = await updateSiteInfo({
      name,
      title,
      description,
      email,
      github,
      linkedin,
      twitter,
    })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true, info: siteInfo }
  }
}

// Upload icon action
export async function uploadIcon(formData: FormData) {
  try {
    const icon = formData.get("icon") as File

    if (!icon) {
      throw new Error("No icon file provided")
    }

    // In a real implementation, you would upload the file to a storage service
    // For now, we'll just use a placeholder URL
    const iconUrl = "/images/avatar-photo.jpg" // Use the existing avatar as a placeholder

    // Update site info with the new icon URL
    const siteInfo = await updateSiteInfo({
      icon: iconUrl,
    })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true, iconUrl }
  } catch (error) {
    console.error("Error uploading icon:", error)
    return { success: false, error: "Failed to upload icon" }
  }
}

// Upload background image action
export async function uploadBackgroundImage(formData: FormData) {
  try {
    const backgroundImage = formData.get("backgroundImage") as File
    const backgroundOpacity = Number.parseInt((formData.get("backgroundOpacity") as string) || "100")

    if (!backgroundImage) {
      throw new Error("No background image file provided")
    }

    // In a real implementation, you would upload the file to a storage service
    // For now, we'll just use a placeholder URL
    const backgroundImageUrl = "/images/background.jpeg" // Use the existing background as a placeholder

    // Update site info with the new background image URL and opacity
    const siteInfo = await updateSiteInfo({
      backgroundImage: backgroundImageUrl,
      backgroundOpacity,
    })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true, backgroundImageUrl }
  } catch (error) {
    console.error("Error uploading background image:", error)
    return { success: false, error: "Failed to upload background image" }
  }
}

// Upload resume action
export async function uploadResume(formData: FormData) {
  try {
    const resume = formData.get("resume") as File

    if (!resume) {
      throw new Error("No resume file provided")
    }

    // In a real implementation, you would upload the file to a storage service
    // For now, we'll just use a placeholder URL
    const resumeUrl = "/documents/resume.pdf" // Use a placeholder path

    // Update site info with the new resume URL
    const siteInfo = await updateSiteInfo({
      resume: resumeUrl,
    })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true, resumeUrl }
  } catch (error) {
    console.error("Error uploading resume:", error)
    return { success: false, error: "Failed to upload resume" }
  }
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

// Bug Bounty Finding actions
export async function saveBugBountyFinding(formData: FormData) {
  const title = formData.get("title") as string
  const platform = formData.get("platform") as "hackerone" | "bugcrowd" | "intigriti" | "other"
  const severity = formData.get("severity") as "critical" | "high" | "medium" | "low" | "info"
  const status = formData.get("status") as "resolved" | "triaged" | "duplicate" | "not-applicable"
  const bounty = Number(formData.get("bounty") as string) || 0
  const date = formData.get("date") as string
  const description = formData.get("description") as string
  const cve = formData.get("cve") as string
  const reportUrl = formData.get("reportUrl") as string
  const company = formData.get("company") as string

  const finding = {
    id: Date.now().toString(),
    title,
    platform,
    severity,
    status,
    bounty,
    date,
    description,
    cve,
    reportUrl,
    company,
  }

  // Save to bug bounty findings
  const { addBugBountyFinding } = await import("@/lib/data")
  const savedFinding = await addBugBountyFinding(finding)

  revalidatePath("/")
  revalidatePath("/admin/dashboard")
  return { success: true, finding: savedFinding }
}

export async function createBugBountyFinding(formData: FormData) {
  return saveBugBountyFinding(formData)
}

export async function editBugBountyFinding(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const platform = formData.get("platform") as "hackerone" | "bugcrowd" | "intigriti" | "other"
  const severity = formData.get("severity") as "critical" | "high" | "medium" | "low" | "info"
  const status = formData.get("status") as "resolved" | "triaged" | "duplicate" | "not-applicable"
  const bounty = Number(formData.get("bounty") as string) || 0
  const date = formData.get("date") as string
  const description = formData.get("description") as string
  const cve = formData.get("cve") as string
  const reportUrl = formData.get("reportUrl") as string
  const company = formData.get("company") as string

  const { updateBugBountyFinding } = await import("@/lib/data")
  const finding = await updateBugBountyFinding(id, {
    title,
    platform,
    severity,
    status,
    bounty,
    date,
    description,
    cve,
    reportUrl,
    company,
  })

  revalidatePath("/")
  revalidatePath("/admin/dashboard")
  return { success: true, finding }
}

export async function removeBugBountyFinding(id: string) {
  const { deleteBugBountyFinding } = await import("@/lib/data")
  const success = await deleteBugBountyFinding(id)

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

// Advanced settings action
export async function updateAdvancedSettings(formData: FormData) {
  // Implementation would go here
  return { success: true }
}

// Export data action
export async function exportData() {
  // Implementation would go here
  return { success: true, data: {} }
}

// Security scan function
export async function runSecurityScan() {
  // Implementation would go here
  return { success: true, vulnerabilities: [] }
}

// Under Construction actions
export async function updateUnderConstructionMode(formData: FormData) {
  const enabled = formData.get("enabled") === "true"
  const message = formData.get("message") as string
  const estimatedCompletion = formData.get("estimatedCompletion") as string
  const progressPercentage = Number.parseInt(formData.get("progressPercentage") as string)
  const allowAdminAccess = formData.get("allowAdminAccess") === "true"

  const settings = await updateUnderConstructionSettings({
    enabled,
    message,
    estimatedCompletion,
    progressPercentage,
    allowAdminAccess,
  })

  revalidatePath("/")
  revalidatePath("/admin/dashboard")
  return { success: true, settings }
}
