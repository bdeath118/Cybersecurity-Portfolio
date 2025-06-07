"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface FallbackManagerProps {
  title: string
  description: string
}

export function FallbackManager({ title, description }: FallbackManagerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">This feature is currently under development.</p>
          <p className="text-sm text-muted-foreground mt-2">
            The {title.toLowerCase()} management interface will be available soon.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
