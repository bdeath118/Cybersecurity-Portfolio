"use client"

import { useEffect, useState } from "react"
import { supabase, getSupabaseClientInfo } from "@/lib/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

export function useSupabase() {
  const [client, setClient] = useState<SupabaseClient | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Ensure we only create one client instance
    if (!client) {
      setClient(supabase)
      setIsReady(true)

      // Log client info for debugging
      const info = getSupabaseClientInfo()
      console.log("🔗 Supabase client ready:", info)
    }
  }, [client])

  return {
    supabase: client,
    isReady,
    clientInfo: getSupabaseClientInfo(),
  }
}
