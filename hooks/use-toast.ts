"use client"

import { useState, useCallback } from "react"

type ToastType = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const toast = useCallback(({ title, description, variant = "default" }: Omit<ToastType, "id">) => {
    const id = `toast-${++toastCount}`
    const newToast = { id, title, description, variant }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)

    return { id }
  }, [])

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      setToasts((prev) => prev.filter((t) => t.id !== toastId))
    } else {
      setToasts([])
    }
  }, [])

  return {
    toasts,
    toast,
    dismiss,
  }
}
