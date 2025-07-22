"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Edit, Save, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { DigitalBadge } from "@/lib/types"
import { addDigitalBadge, updateDigitalBadge, deleteDigitalBadge } from "@/lib/data" // Assuming these are Server Actions or API calls

interface DigitalBadgesManagerProps {
  initialDigitalBadges: DigitalBadge[]
}

export function DigitalBadgesManager({ initialDigitalBadges }: DigitalBadgesManagerProps) {
  const [digitalBadges, setDigitalBadges] = useState<DigitalBadge[]>(initialDigitalBadges)
  const [editingBadge, setEditingBadge] = useState<DigitalBadge | null>(null)
  const [newBadge, setNewBadge] = useState<Omit<DigitalBadge, "id"> | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setDigitalBadges(initialDigitalBadges)
  }, [initialDigitalBadges])

  const handleAddBadge = async () => {
    if (newBadge) {
      try {
        const addedBadge = await addDigitalBadge(newBadge)
        setDigitalBadges((prev) => [...prev, addedBadge])
        setNewBadge(null)
        toast({ title: "Success", description: "Digital Badge added successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to add digital badge: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdateBadge = async () => {
    if (editingBadge) {
      try {
        const updatedBadge = await updateDigitalBadge(editingBadge.id, editingBadge)
        setDigitalBadges((prev) => prev.map((b) => (b.id === updatedBadge.id ? updatedBadge : b)))
        setEditingBadge(null)
        toast({ title: "Success", description: "Digital Badge updated successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to update digital badge: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteBadge = async (id: string) => {
    try {
      await deleteDigitalBadge(id)
      setDigitalBadges((prev) => prev.filter((b) => b.id !== id))
      toast({ title: "Success", description: "Digital Badge deleted successfully." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete digital badge: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const renderBadgeForm = (badge: Omit<DigitalBadge, "id"> | DigitalBadge, isNew: boolean) => (
    <div className="grid gap-4">
      <div>
        <Label htmlFor={isNew ? "new-name" : `name-${badge.id}`}>Name</Label>
        <Input
          id={isNew ? "new-name" : `name-${badge.id}`}
          value={badge.name}
          onChange={(e) =>
            isNew
              ? setNewBadge({ ...newBadge!, name: e.target.value })
              : setEditingBadge({ ...editingBadge!, name: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-issuer" : `issuer-${badge.id}`}>Issuer</Label>
        <Input
          id={isNew ? "new-issuer" : `issuer-${badge.id}`}
          value={badge.issuer}
          onChange={(e) =>
            isNew
              ? setNewBadge({ ...newBadge!, issuer: e.target.value })
              : setEditingBadge({ ...editingBadge!, issuer: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-issue-date" : `issue-date-${badge.id}`}>Issue Date</Label>
        <Input
          id={isNew ? "new-issue-date" : `issue-date-${badge.id}`}
          type="date"
          value={badge.issue_date || ""}
          onChange={(e) =>
            isNew
              ? setNewBadge({ ...newBadge!, issue_date: e.target.value })
              : setEditingBadge({ ...editingBadge!, issue_date: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-credential-url" : `credential-url-${badge.id}`}>Credential URL</Label>
        <Input
          id={isNew ? "new-credential-url" : `credential-url-${badge.id}`}
          value={badge.credential_url || ""}
          onChange={(e) =>
            isNew
              ? setNewBadge({ ...newBadge!, credential_url: e.target.value })
              : setEditingBadge({ ...editingBadge!, credential_url: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-image-url" : `image-url-${badge.id}`}>Image URL</Label>
        <Input
          id={isNew ? "new-image-url" : `image-url-${badge.id}`}
          value={badge.image_url || ""}
          onChange={(e) =>
            isNew
              ? setNewBadge({ ...newBadge!, image_url: e.target.value })
              : setEditingBadge({ ...editingBadge!, image_url: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-description" : `description-${badge.id}`}>Description</Label>
        <Textarea
          id={isNew ? "new-description" : `description-${badge.id}`}
          value={badge.description || ""}
          onChange={(e) =>
            isNew
              ? setNewBadge({ ...newBadge!, description: e.target.value })
              : setEditingBadge({ ...editingBadge!, description: e.target.value })
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => (isNew ? setNewBadge(null) : setEditingBadge(null))}>
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={isNew ? handleAddBadge : handleUpdateBadge}>
          <Save className="mr-2 h-4 w-4" /> {isNew ? "Add Digital Badge" : "Save Changes"}
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Digital Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newBadge ? (
            <Card className="p-4 border-dashed">
              <CardTitle className="mb-4">Add New Digital Badge</CardTitle>
              {renderBadgeForm(newBadge, true)}
            </Card>
          ) : (
            <Button
              onClick={() =>
                setNewBadge({
                  name: "",
                  issuer: "",
                  issue_date: "",
                  credential_url: "",
                  image_url: "",
                  description: "",
                })
              }
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Digital Badge
            </Button>
          )}

          <div className="grid gap-4">
            {digitalBadges.map((badge) => (
              <Card key={badge.id} className="p-4">
                {editingBadge?.id === badge.id ? (
                  renderBadgeForm(editingBadge, false)
                ) : (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{badge.name}</h3>
                    <p className="text-sm text-gray-500">{badge.issuer}</p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingBadge({ ...badge })}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteBadge(badge.id)}>
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
