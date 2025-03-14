"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Flag, Trophy, Users } from "lucide-react"
import type { CTFEvent } from "@/lib/types"
import { createCTFEvent, editCTFEvent, removeCTFEvent } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export function CTFManager() {
  const [ctfEvents, setCTFEvents] = useState<CTFEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<CTFEvent | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCTFEvents() {
      try {
        const response = await fetch("/api/ctf-events")
        const data = await response.json()
        setCTFEvents(data)
      } catch (error) {
        console.error("Error fetching CTF events:", error)
        toast({
          title: "Error",
          description: "Failed to load CTF events",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCTFEvents()
  }, [toast])

  async function handleAddCTFEvent(formData: FormData) {
    try {
      const result = await createCTFEvent(formData)

      if (result.success) {
        setCTFEvents([...ctfEvents, result.event])
        setIsAddDialogOpen(false)
        toast({
          title: "Success",
          description: "CTF event added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding CTF event:", error)
      toast({
        title: "Error",
        description: "Failed to add CTF event",
        variant: "destructive",
      })
    }
  }

  async function handleEditCTFEvent(formData: FormData) {
    if (!selectedEvent) return

    try {
      const result = await editCTFEvent(selectedEvent.id, formData)

      if (result.success) {
        setCTFEvents(ctfEvents.map((e) => (e.id === selectedEvent.id ? result.event : e)))
        setIsEditDialogOpen(false)
        setSelectedEvent(null)
        toast({
          title: "Success",
          description: "CTF event updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating CTF event:", error)
      toast({
        title: "Error",
        description: "Failed to update CTF event",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteCTFEvent() {
    if (!selectedEvent) return

    try {
      const result = await removeCTFEvent(selectedEvent.id)

      if (result.success) {
        setCTFEvents(ctfEvents.filter((e) => e.id !== selectedEvent.id))
        setIsDeleteDialogOpen(false)
        setSelectedEvent(null)
        toast({
          title: "Success",
          description: "CTF event deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting CTF event:", error)
      toast({
        title: "Error",
        description: "Failed to delete CTF event",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading CTF events...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CTF Events</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add CTF Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New CTF Event</DialogTitle>
              <DialogDescription>Add a new Capture The Flag event to showcase in your portfolio</DialogDescription>
            </DialogHeader>
            <form action={handleAddCTFEvent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select name="difficulty" defaultValue="Medium">
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">Team Name</Label>
                  <Input id="team" name="team" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rank">Rank</Label>
                  <Input id="rank" name="rank" type="number" min="1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalTeams">Total Teams</Label>
                  <Input id="totalTeams" name="totalTeams" type="number" min="1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flagsCaptured">Flags Captured</Label>
                  <Input id="flagsCaptured" name="flagsCaptured" type="number" min="0" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>

              <DialogFooter>
                <Button type="submit">Add CTF Event</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ctfEvents.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No CTF events found. Add your first event to get started.
          </div>
        ) : (
          ctfEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{event.name}</CardTitle>
                  <Badge
                    variant={
                      event.difficulty === "Easy"
                        ? "outline"
                        : event.difficulty === "Medium"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {event.difficulty}
                  </Badge>
                </div>
                <CardDescription>{event.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Team: {event.team}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Rank: {event.rank} of {event.totalTeams}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Flags Captured: {event.flagsCaptured}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Dialog
                  open={isEditDialogOpen && selectedEvent?.id === event.id}
                  onOpenChange={(open) => {
                    setIsEditDialogOpen(open)
                    if (!open) setSelectedEvent(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit CTF Event</DialogTitle>
                      <DialogDescription>Update the details of your CTF event</DialogDescription>
                    </DialogHeader>
                    <form action={handleEditCTFEvent} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Event Name</Label>
                          <Input id="edit-name" name="name" defaultValue={selectedEvent?.name} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-date">Date</Label>
                          <Input id="edit-date" name="date" type="date" defaultValue={selectedEvent?.date} required />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-difficulty">Difficulty</Label>
                          <Select name="difficulty" defaultValue={selectedEvent?.difficulty}>
                            <SelectTrigger id="edit-difficulty">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Easy">Easy</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-team">Team Name</Label>
                          <Input id="edit-team" name="team" defaultValue={selectedEvent?.team} required />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-rank">Rank</Label>
                          <Input
                            id="edit-rank"
                            name="rank"
                            type="number"
                            min="1"
                            defaultValue={selectedEvent?.rank}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-totalTeams">Total Teams</Label>
                          <Input
                            id="edit-totalTeams"
                            name="totalTeams"
                            type="number"
                            min="1"
                            defaultValue={selectedEvent?.totalTeams}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-flagsCaptured">Flags Captured</Label>
                          <Input
                            id="edit-flagsCaptured"
                            name="flagsCaptured"
                            type="number"
                            min="0"
                            defaultValue={selectedEvent?.flagsCaptured}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          name="description"
                          rows={3}
                          defaultValue={selectedEvent?.description}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="submit">Update CTF Event</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <AlertDialog
                  open={isDeleteDialogOpen && selectedEvent?.id === event.id}
                  onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open)
                    if (!open) setSelectedEvent(null)
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setSelectedEvent(event)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete CTF Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this CTF event? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteCTFEvent}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

