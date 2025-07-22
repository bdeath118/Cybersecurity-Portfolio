"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ShieldCheck, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormInputs = z.infer<typeof loginSchema>

export default function AdminLoginPageClient() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormInputs) => {
    setError(null)
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: "Redirecting to admin dashboard...",
        })
        router.push("/admin/dashboard")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Login failed. Please check your credentials.")
        toast({
          title: "Login Failed",
          description: errorData.message || "Invalid username or password.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAutofill = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/debug-auth")
      const data = await response.json()
      if (data.adminUsername && data.adminPassword) {
        setValue("username", data.adminUsername)
        setValue("password", data.adminPassword)
        toast({
          title: "Autofill Successful",
          description: "Admin credentials loaded.",
        })
      } else {
        toast({
          title: "Autofill Failed",
          description: "Admin credentials not available in debug mode.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Autofill error:", err)
      toast({
        title: "Error",
        description: "Failed to autofill credentials.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <Card className="w-full max-w-md bg-card/90 backdrop-blur-sm border-primary/50 shadow-2xl">
        <CardHeader className="text-center">
          <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-primary-foreground">Admin Login</CardTitle>
          <CardDescription className="text-muted-foreground">
            Access the Digital Shield Protection Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Login Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="admin" {...register("username")} disabled={isSubmitting} />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register("password")}
                disabled={isSubmitting}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 text-center">
              <Button variant="link" onClick={handleAutofill} disabled={isSubmitting}>
                Autofill Dev Credentials
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
