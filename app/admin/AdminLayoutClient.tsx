"use client"

import type React from "react"

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <style jsx global>{`
        /* Remove any background images on admin pages */
        body::before {
          display: none !important;
        }
        
        /* Ensure clean admin background */
        body {
          background: #f9fafb !important;
        }
        
        .dark body {
          background: #111827 !important;
        }
      `}</style>
      {children}
    </div>
  )
}
