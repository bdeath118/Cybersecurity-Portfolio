"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const ToastProvider = React.createContext<{
  toasts: ToastType[]
  addToast: (toast: Omit<ToastType, "id">) => void
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

type ToastType = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function ToastProviderComponent({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastType[]>([])

  const addToast = React.useCallback((toast: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return <ToastProvider.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastProvider.Provider>
}

export function Toast({ id, title, description, variant = "default", onClose }: ToastType & { onClose: () => void }) {
  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg",
        variant === "destructive"
          ? "border-destructive bg-destructive text-destructive-foreground"
          : "border bg-background text-foreground",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        <button onClick={onClose} className="rounded-sm opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function ToastViewport() {
  return <div id="toast-viewport" />
}

export type ToastActionElement = React.ReactElement
export type ToastProps = ToastType
