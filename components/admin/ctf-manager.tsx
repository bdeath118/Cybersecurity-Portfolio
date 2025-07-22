"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Edit, Save, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { CTFEvent } from "@/lib/types"
import { addCTFEvent, updateCTFEvent, deleteCTFEvent } from "@/lib/data" // Assuming these are Server Actions or API calls

interface CTFManagerProps {
  initialCTFEvents: CTFEvent[]
}

export function CTFManager({ initialCTFEvents }: CTFManagerProps) {
  const [ctfEvents, setCTFEvents] = useState<CTFEvent[]>(initialCTFEvents)
  const [editingCTFEvent, setEditingCTFEvent] = useState<CTFEvent | null>(null)
  const [newCTFEvent, setNewCTFEvent] = useState<Omit<CTFEvent, "id"> | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setCTFEvents(initialCTFEvents)
  }, [initialCTFEvents])

  const handleAddCTFEvent = async () => {
    if (newCTFEvent) {
      try {
        const addedEvent = await addCTFEvent(newCTFEvent)
        setCTFEvents((prev) => [...prev, addedEvent])
        setNewCTFEvent(null)
        toast({ title: "Success", description: "CTF Event added successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to add CTF Event: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdateCTFEvent = async () => {
    if (editingCTFEvent) {
      try {
        const updatedEvent = await updateCTFEvent(editingCTFEvent.id, editingCTFEvent)
        setCTFEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
        setEditingCTFEvent(null)
        toast({ title: "Success", description: "CTF Event updated successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to update CTF Event: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteCTFEvent = async (id: string) => {
    try {
      await deleteCTFEvent(id)
      setCTFEvents((prev) => prev.filter((e) => e.id !== id))
      toast({ title: "Success", description: "CTF Event deleted successfully." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete CTF Event: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const renderCTFEventForm = (event: Omit<CTFEvent, "id"> | CTFEvent, isNew: boolean) => (
    <div className="grid gap-4">
      <div>
        <Label htmlFor={isNew ? "new-name" : `name-${event.id}`}>Name</Label>
        <Input
          id={isNew ? "new-name" : `name-${event.id}`}
          value={event.name}
          onChange={(e) =>
            isNew
              ? setNewCTFEvent({ ...newCTFEvent!, name: e.target.value })
              : setEditingCTFEvent({ ...editingCTFEvent!, name: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-platform" : `platform-${event.id}`}>Platform</Label>
        <Input
          id={isNew ? "new-platform" : `platform-${event.id}`}
          value={event.platform}
          onChange={(e) =>
            isNew
              ? setNewCTFEvent({ ...newCTFEvent!, platform: e.target.value })
              : setEditingCTFEvent({ ...editingCTFEvent!, platform: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-date" : `date-${event.id}`}>Date</Label>
        <Input
          id={isNew ? "new-date" : `date-${event.id}`}
          type="date"
          value={event.date || ""}
          onChange={(e) =>
            isNew
              ? setNewCTFEvent({ ...newCTFEvent!, date: e.target.value })
              : setEditingCTFEvent({ ...editingCTFEvent!, date: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-rank" : `rank-${event.id}`}>Rank</Label>
        <Input
          id={isNew ? "new-rank" : `rank-${event.id}`}
          value={event.rank || ""}
          onChange={(e) =>
            isNew
              ? setNewCTFEvent({ ...newCTFEvent!, rank: e.target.value })
              : setEditingCTFEvent({ ...editingCTFEvent!, rank: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-score" : `score-${event.id}`}>Score</Label>
        <Input
          id={isNew ? "new-score" : `score-${event.id}`}
          type="number"
          value={event.score || ""}
          onChange={(e) =>
            isNew
              ? setNewCTFEvent({ ...newCTFEvent!, score: Number.parseInt(e.target.value) || 0 })
              : setEditingCTFEvent({ ...editingCTFEvent!, score: Number.parseInt(e.target.value) || 0 })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-challenges-solved" : `challenges-solved-${event.id}`}>Challenges Solved</Label>
        <Input
          id={isNew ? "new-challenges-solved" : `challenges-solved-${event.id}`}
          type="number"
          value={event.challenges_solved || ""}
          onChange={(e) =>
            isNew
              ? setNewCTFEvent({ ...newCTFEvent!, challenges_solved: Number.parseInt(e.target.value) || 0 })
              : setEditingCTFEvent({ ...editingCTFEvent!, challenges_solved: Number.parseInt(e.target.value) || 0 })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-description" : `description-${event.id}`}>Description</Label>
        <Textarea
          id={isNew ? "new-description" : `description-${event.id}`}
          value={event.description || ""}
          onChange={(e) =>
            isNew
              ? setNewCTFEvent({ ...newCTFEvent!, description: e.target.value })
              : setEditingCTFEvent({ ...editingCTFEvent!, description: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-url" : `url-${event.id}`}>URL</Label>
        <Input
          id={isNew ? "new-url" : `url-${event.id}`}
          value={event.url || ""}
          onChange={(e) =>
            isNew
              ? setNewCTFEvent({ ...newCTFEvent!, url: e.target.value })
              : setEditingCTFEvent({ ...editingCTFEvent!, url: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-image-url" : `image-url-${event.id}`}>Image URL</Label>
        <Input
          id={isNew ? "new-image-url" : `image-url-${event.id}`}
          value={event.image_url || ""}
          onChange={(e) =>
            isNew
              ? setNewCTFEvent({ ...newCTFEvent!, image_url: e.target.value })
              : setEditingCTFEvent({ ...editingCTFEvent!, image_url: e.target.value })
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => (isNew ? setNewCTFEvent(null) : setEditingCTFEvent(null))}>
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={isNew ? handleAddCTFEvent : handleUpdateCTFEvent}>
          <Save className="mr-2 h-4 w-4" /> {isNew ? "Add CTF Event" : "Save Changes"}
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage CTF Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newCTFEvent ? (
            <Card className="p-4 border-dashed">
              <CardTitle className="mb-4">Add New CTF Event</CardTitle>
              {renderCTFEventForm(newCTFEvent, true)}
            </Card>
          ) : (
            <Button
              onClick={() =>
                setNewCTFEvent({
                  name: "",
                  platform: "",
                  date: "",
                  rank: "",
                  score: 0,
                  challenges_solved: 0,
                  description: "",
                  url: "",
                  image_url: "",
                })
              }
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New CTF Event
            </Button>
          )}

          <div className="grid gap-4">
            {ctfEvents.map((event) => (
              <Card key={event.id} className="p-4">
                {editingCTFEvent?.id === event.id ? (
                  renderCTFEventForm(editingCTFEvent, false)
                ) : (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{event.name}</h3>
                    <p className="text-sm text-gray-500">{event.platform}</p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingCTFEvent({ ...event })}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCTFEvent(event.id)}>
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
