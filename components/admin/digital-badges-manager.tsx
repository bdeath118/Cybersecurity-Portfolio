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
import { Plus, Pencil, Trash2, Award, ExternalLink, Download } from "lucide-react"
import type { DigitalBadge } from "@/lib/types"
import { createDigitalBadge, editDigitalBadge, removeDigitalBadge, triggerBadgeImport } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export function DigitalBadgesManager() {
  const [badges, setBadges] = useState<DigitalBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBadge, setSelectedBadge] = useState<DigitalBadge | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchBadges() {
      try {
        const response = await fetch("/api/digital-badges")
        const data = await response.json()
        setBadges(data)
      } catch (error) {
        console.error("Error fetching badges:", error)
        toast({
          title: "Error",
          description: "Failed to load digital badges",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBadges()
  }, [toast])

  async function handleImportBadges() {
    setIsImporting(true)
    try {
      const result = await triggerBadgeImport()
      if (result.success) {
        // Refresh badges list
        const response = await fetch("/api/digital-badges")
        const data = await response.json()
        setBadges(data)

        toast({
          title: "Success",
          description: `Imported ${result.count} new badges`,
        })
      }
    } catch (error) {
      console.error("Error importing badges:", error)
      toast({
        title: "Error",
        description: "Failed to import badges",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  async function handleAddBadge(formData: FormData) {
    try {
      const result = await createDigitalBadge(formData)

      if (result.success) {
        setBadges([...badges, result.badge])
        setIsAddDialogOpen(false)
        toast({
          title: "Success",
          description: "Digital badge added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding badge:", error)
      toast({
        title: "Error",
        description: "Failed to add digital badge",
        variant: "destructive",
      })
    }
  }

  async function handleEditBadge(formData: FormData) {
    if (!selectedBadge) return

    try {
      const result = await editDigitalBadge(selectedBadge.id, formData)

      if (result.success) {
        setBadges(badges.map((b) => (b.id === selectedBadge.id ? result.badge : b)))
        setIsEditDialogOpen(false)
        setSelectedBadge(null)
        toast({
          title: "Success",
          description: "Digital badge updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating badge:", error)
      toast({
        title: "Error",
        description: "Failed to update digital badge",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteBadge() {
    if (!selectedBadge) return

    try {
      const result = await removeDigitalBadge(selectedBadge.id)

      if (result.success) {
        setBadges(badges.filter((b) => b.id !== selectedBadge.id))
        setIsDeleteDialogOpen(false)
        setSelectedBadge(null)
        toast({
          title: "Success",
          description: "Digital badge deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting badge:", error)
      toast({
        title: "Error",
        description: "Failed to delete digital badge",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading digital badges...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Digital Badges</h2>
          <p className="text-muted-foreground">Manage your earned digital credentials and micro-certifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportBadges} disabled={isImporting}>
            <Download className="h-4 w-4 mr-2" />
            {isImporting ? "Importing..." : "Import Badges"}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Badge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Digital Badge</DialogTitle>
                <DialogDescription>Add a new digital badge to showcase in your portfolio</DialogDescription>
              </DialogHeader>
              <form action={handleAddBadge} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Badge Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuer">Issuing Organization</Label>
                    <Input id="issuer" name="issuer" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Issue Date</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select name="platform" defaultValue="other">
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="credly">Credly</SelectItem>
                        <SelectItem value="canvas">Canvas</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" rows={3} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="badgeUrl">Badge Image URL</Label>
                    <Input id="badgeUrl" name="badgeUrl" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="verificationUrl">Verification URL</Label>
                    <Input id="verificationUrl" name="verificationUrl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Related Skills (comma-separated)</Label>
                  <Input id="skills" name="skills" />
                </div>

                <DialogFooter>
                  <Button type="submit">Add Badge</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No digital badges found. Add your first badge or import from external platforms.
          </div>
        ) : (
          badges.map((badge) => (
            <Card key={badge.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="relative w-16 h-16">
                  {badge.image ? (
                    <Image
                      src={badge.image || "/placeholder.svg"}
                      alt={badge.name}
                      fill
                      className="object-contain rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 rounded-md flex items-center justify-center">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{badge.name}</CardTitle>
                  <CardDescription>{badge.issuer}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{badge.platform}</Badge>
                    <span className="text-sm text-muted-foreground">{badge.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{badge.description}</p>
                  {badge.skills && badge.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {badge.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {badge.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{badge.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <div className="flex gap-2">
                  {badge.verificationUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={badge.verificationUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Verify
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Dialog
                    open={isEditDialogOpen && selectedBadge?.id === badge.id}
                    onOpenChange={(open) => {
                      setIsEditDialogOpen(open)
                      if (!open) setSelectedBadge(null)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedBadge(badge)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Digital Badge</DialogTitle>
                        <DialogDescription>Update the details of your digital badge</DialogDescription>
                      </DialogHeader>
                      <form action={handleEditBadge} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Badge Name</Label>
                            <Input id="edit-name" name="name" defaultValue={selectedBadge?.name} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-issuer">Issuing Organization</Label>
                            <Input id="edit-issuer" name="issuer" defaultValue={selectedBadge?.issuer} required />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-date">Issue Date</Label>
                            <Input id="edit-date" name="date" type="date" defaultValue={selectedBadge?.date} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-platform">Platform</Label>
                            <Select name="platform" defaultValue={selectedBadge?.platform}>
                              <SelectTrigger id="edit-platform">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="credly">Credly</SelectItem>
                                <SelectItem value="canvas">Canvas</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Textarea
                            id="edit-description"
                            name="description"
                            rows={3}
                            defaultValue={selectedBadge?.description}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-badgeUrl">Badge Image URL</Label>
                            <Input id="edit-badgeUrl" name="badgeUrl" defaultValue={selectedBadge?.badgeUrl} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-verificationUrl">Verification URL</Label>
                            <Input
                              id="edit-verificationUrl"
                              name="verificationUrl"
                              defaultValue={selectedBadge?.verificationUrl}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-skills">Related Skills (comma-separated)</Label>
                          <Input id="edit-skills" name="skills" defaultValue={selectedBadge?.skills?.join(", ")} />
                        </div>

                        <DialogFooter>
                          <Button type="submit">Update Badge</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog
                    open={isDeleteDialogOpen && selectedBadge?.id === badge.id}
                    onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open)
                      if (!open) setSelectedBadge(null)
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => setSelectedBadge(badge)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Digital Badge</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this digital badge? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteBadge}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
