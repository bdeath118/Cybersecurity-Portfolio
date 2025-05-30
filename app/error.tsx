"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Something went wrong!</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
