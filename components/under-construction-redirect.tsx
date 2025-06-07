"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface UnderConstructionRedirectProps {
  enabled?: boolean
  redirectPath?: string
  allowedPaths?: string[]
}

export function UnderConstructionRedirect({
  enabled = false,
  redirectPath = "/under-construction",
  allowedPaths = ["/admin", "/under-construction"],
}: UnderConstructionRedirectProps) {
  const router = useRouter()

  useEffect(() => {
    if (enabled && typeof window !== "undefined") {
      const currentPath = window.location.pathname

      // Don't redirect if we're already on an allowed path
      if (!allowedPaths.some((path) => currentPath.startsWith(path))) {
        router.push(redirectPath)
      }
    }
  }, [enabled, redirectPath, allowedPaths, router])

  return null
}
