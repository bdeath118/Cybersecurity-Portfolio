"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, ExternalLink, Search, Target } from "lucide-react"
import type { OSINTCapability } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export function OSINTCapabilitiesManager() {
  const [capabilities, setCapabilities] = useState<OSINTCapability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newCapability, setNewCapability] = useState<Partial<OSINTCapability>>({
    name: "",
    category: "reconnaissance",
    proficiency: "intermediate",
    tools: [],
    description: "",
    exampleUrl: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCapabilities()
  }, [])

  const fetchCapabilities = async () => {
    try {
      const response = await fetch("/api/osint-capabilities")
      if (response.ok) {
        const data = await response.json()
        setCapabilities(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load OSINT capabilities",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching OSINT capabilities:", error)
      toast({
        title: "Error",
        description: "Failed to load OSINT capabilities",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addCapability = async () => {
    if (!newCapability.name || !newCapability.category) return

    try {
      const response = await fetch("/api/osint-capabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCapability,
          id: Date.now().toString(),
          tools:
            typeof newCapability.tools === "string"
              ? newCapability.tools.split(",").map((tool) => tool.trim())
              : newCapability.tools,
        }),
      })

      if (response.ok) {
        await fetchCapabilities()
        setNewCapability({
          name: "",
          category: "reconnaissance",
          proficiency: "intermediate",
          tools: [],
          description: "",
          exampleUrl: "",
        })
        toast({
          title: "Success",
          description: "OSINT capability added successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add OSINT capability",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding capability:", error)
      toast({
        title: "Error",
        description: "Failed to add OSINT capability",
        variant: "destructive",
      })
    }
  }

  const deleteCapability = async (id: string) => {
    try {
      const response = await fetch("/api/osint-capabilities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        await fetchCapabilities()
        toast({
          title: "Success",
          description: "OSINT capability deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete OSINT capability",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting capability:", error)
      toast({
        title: "Error",
        description: "Failed to delete OSINT capability",
        variant: "destructive",
      })
    }
  }

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "expert":
        return "bg-green-500"
      case "advanced":
        return "bg-blue-500"
      case "intermediate":
        return "bg-yellow-500"
      case "beginner":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return <div>Loading OSINT capabilities...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Add New OSINT Capability
          </CardTitle>
          <CardDescription>Showcase your open-source intelligence gathering skills and tools</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Capability Name</Label>
              <Input
                id="name"
                value={newCapability.name}
                onChange={(e) => setNewCapability({ ...newCapability, name: e.target.value })}
                placeholder="e.g., Social Media Intelligence"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newCapability.category}
                onValueChange={(value) => setNewCapability({ ...newCapability, category: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reconnaissance">Reconnaissance</SelectItem>
                  <SelectItem value="social-media">Social Media Intelligence</SelectItem>
                  <SelectItem value="network-analysis">Network Analysis</SelectItem>
                  <SelectItem value="geolocation">Geolocation</SelectItem>
                  <SelectItem value="data-mining">Data Mining</SelectItem>
                  <SelectItem value="threat-intelligence">Threat Intelligence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="proficiency">Proficiency Level</Label>
              <Select
                value={newCapability.proficiency}
                onValueChange={(value) => setNewCapability({ ...newCapability, proficiency: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tools">Tools (comma-separated)</Label>
              <Input
                id="tools"
                value={Array.isArray(newCapability.tools) ? newCapability.tools.join(", ") : newCapability.tools}
                onChange={(e) => setNewCapability({ ...newCapability, tools: e.target.value })}
                placeholder="Shodan, Maltego, theHarvester"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newCapability.description}
              onChange={(e) => setNewCapability({ ...newCapability, description: e.target.value })}
              placeholder="Describe your capability and experience..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="exampleUrl">Example/Portfolio URL (optional)</Label>
            <Input
              id="exampleUrl"
              value={newCapability.exampleUrl}
              onChange={(e) => setNewCapability({ ...newCapability, exampleUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <Button onClick={addCapability} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Capability
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {capabilities.map((capability) => (
          <Card key={capability.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {capability.name}
                    <Badge className={getProficiencyColor(capability.proficiency)}>{capability.proficiency}</Badge>
                    <Badge variant="outline">{capability.category}</Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">{capability.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {capability.exampleUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={capability.exampleUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => deleteCapability(capability.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {capability.tools && capability.tools.length > 0 && (
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                  {capability.tools.map((tool, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {capabilities.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No OSINT capabilities yet. Add your first intelligence gathering skill!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
