"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Edit, Save, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { OSINTCapability } from "@/lib/types"
import { addOSINTCapability, updateOSINTCapability, deleteOSINTCapability } from "@/lib/data" // Assuming these are Server Actions or API calls

interface OSINTCapabilitiesManagerProps {
  initialOSINTCapabilities: OSINTCapability[]
}

export function OSINTCapabilitiesManager({ initialOSINTCapabilities }: OSINTCapabilitiesManagerProps) {
  const [capabilities, setCapabilities] = useState<OSINTCapability[]>(initialOSINTCapabilities)
  const [editingCapability, setEditingCapability] = useState<OSINTCapability | null>(null)
  const [newCapability, setNewCapability] = useState<Omit<OSINTCapability, "id"> | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setCapabilities(initialOSINTCapabilities)
  }, [initialOSINTCapabilities])

  const handleAddCapability = async () => {
    if (newCapability) {
      try {
        const addedCapability = await addOSINTCapability(newCapability)
        setCapabilities((prev) => [...prev, addedCapability])
        setNewCapability(null)
        toast({ title: "Success", description: "OSINT Capability added successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to add capability: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdateCapability = async () => {
    if (editingCapability) {
      try {
        const updatedCapability = await updateOSINTCapability(editingCapability.id, editingCapability)
        setCapabilities((prev) => prev.map((c) => (c.id === updatedCapability.id ? updatedCapability : c)))
        setEditingCapability(null)
        toast({ title: "Success", description: "OSINT Capability updated successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to update capability: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteCapability = async (id: string) => {
    try {
      await deleteOSINTCapability(id)
      setCapabilities((prev) => prev.filter((c) => c.id !== id))
      toast({ title: "Success", description: "OSINT Capability deleted successfully." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete capability: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const renderCapabilityForm = (capability: Omit<OSINTCapability, "id"> | OSINTCapability, isNew: boolean) => (
    <div className="grid gap-4">
      <div>
        <Label htmlFor={isNew ? "new-name" : `name-${capability.id}`}>Name</Label>
        <Input
          id={isNew ? "new-name" : `name-${capability.id}`}
          value={capability.name}
          onChange={(e) =>
            isNew
              ? setNewCapability({ ...newCapability!, name: e.target.value })
              : setEditingCapability({ ...editingCapability!, name: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-description" : `description-${capability.id}`}>Description</Label>
        <Textarea
          id={isNew ? "new-description" : `description-${capability.id}`}
          value={capability.description}
          onChange={(e) =>
            isNew
              ? setNewCapability({ ...newCapability!, description: e.target.value })
              : setEditingCapability({ ...editingCapability!, description: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-tools" : `tools-${capability.id}`}>Tools (comma-separated)</Label>
        <Input
          id={isNew ? "new-tools" : `tools-${capability.id}`}
          value={capability.tools.join(", ")}
          onChange={(e) =>
            isNew
              ? setNewCapability({ ...newCapability!, tools: e.target.value.split(",").map((t) => t.trim()) })
              : setEditingCapability({ ...editingCapability!, tools: e.target.value.split(",").map((t) => t.trim()) })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-use-cases" : `use-cases-${capability.id}`}>Use Cases (comma-separated)</Label>
        <Input
          id={isNew ? "new-use-cases" : `use-cases-${capability.id}`}
          value={capability.use_cases.join(", ")}
          onChange={(e) =>
            isNew
              ? setNewCapability({ ...newCapability!, use_cases: e.target.value.split(",").map((t) => t.trim()) })
              : setEditingCapability({
                  ...editingCapability!,
                  use_cases: e.target.value.split(",").map((t) => t.trim()),
                })
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => (isNew ? setNewCapability(null) : setEditingCapability(null))}>
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={isNew ? handleAddCapability : handleUpdateCapability}>
          <Save className="mr-2 h-4 w-4" /> {isNew ? "Add Capability" : "Save Changes"}
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage OSINT Capabilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newCapability ? (
            <Card className="p-4 border-dashed">
              <CardTitle className="mb-4">Add New OSINT Capability</CardTitle>
              {renderCapabilityForm(newCapability, true)}
            </Card>
          ) : (
            <Button
              onClick={() =>
                setNewCapability({
                  name: "",
                  description: "",
                  tools: [],
                  use_cases: [],
                })
              }
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Capability
            </Button>
          )}

          <div className="grid gap-4">
            {capabilities.map((capability) => (
              <Card key={capability.id} className="p-4">
                {editingCapability?.id === capability.id ? (
                  renderCapabilityForm(editingCapability, false)
                ) : (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{capability.name}</h3>
                    <p className="text-sm text-gray-500">{capability.description}</p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingCapability({ ...capability })}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCapability(capability.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
