"use client"

import type React from "react"
import { useEffect } from "react"

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Add admin-specific styles to override background
    const style = document.createElement("style")
    style.textContent = `
      body::before {
        display: none !important;
      }
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        min-height: 100vh;
      }
      .admin-container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="min-h-screen p-4">
      <div className="admin-container max-w-6xl mx-auto p-6">{children}</div>
    </div>
  )
}
