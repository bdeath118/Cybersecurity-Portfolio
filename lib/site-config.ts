// Site Configuration
// Toggle features and maintenance mode here

export const siteConfig = {
  // Under Construction Mode
  underConstruction: {
    enabled: false, // Set to true to enable under construction mode
    redirectPath: "/under-construction",
    allowedPaths: ["/admin", "/under-construction", "/api"], // Paths that bypass the redirect
    message: "We're working hard to bring you something amazing.",
    estimatedCompletion: "Soon",
    progressPercentage: 75,
  },

  // Feature Flags
  features: {
    digitalBadges: true,
    linkedAccounts: true,
    advancedSettings: true,
    securityFeatures: true,
    importScheduler: true,
  },

  // Maintenance Windows
  maintenance: {
    scheduled: false,
    startTime: null,
    endTime: null,
    message: "Scheduled maintenance in progress. Please check back soon.",
  },
}

export function isUnderConstruction(): boolean {
  return siteConfig.underConstruction.enabled
}

export function isFeatureEnabled(feature: keyof typeof siteConfig.features): boolean {
  return siteConfig.features[feature]
}

export function isInMaintenance(): boolean {
  if (!siteConfig.maintenance.scheduled) return false

  const now = new Date()
  const start = siteConfig.maintenance.startTime ? new Date(siteConfig.maintenance.startTime) : null
  const end = siteConfig.maintenance.endTime ? new Date(siteConfig.maintenance.endTime) : null

  if (start && end) {
    return now >= start && now <= end
  }

  return false
}
