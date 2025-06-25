"use client"

import { Toast } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => dismiss(toast.id)} />
      ))}
    </>
  )
}
