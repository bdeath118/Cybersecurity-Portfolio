"use client"

import { useEffect, useState } from "react"
import { getSupabaseClientInfo, isSupabaseConfigured } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"

export function SupabaseStatus() {
  const [status, setStatus] = useState<{
    configured: boolean
    clientInfo: any
  } | null>(null)

  useEffect(() => {
    const configured = isSupabaseConfigured()
    const clientInfo = getSupabaseClientInfo()

    setStatus({
      configured,
      clientInfo,
    })
  }, [])

  if (!status) {
    return null
  }

  if (status.configured) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">Supabase is properly configured and connected.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <strong>Supabase Configuration Missing</strong>
        <br />
        The site is running in fallback mode. To enable full functionality:
        <br />
        1. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> environment variable
        <br />
        2. Set <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> environment variable
        <br />
        3. Optionally set <code>SUPABASE_SERVICE_ROLE_KEY</code> for admin features
      </AlertDescription>
    </Alert>
  )
}
