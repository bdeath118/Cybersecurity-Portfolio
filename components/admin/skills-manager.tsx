"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
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
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Skill } from "@/lib/types"
import { createSkill, editSkill, removeSkill } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [skillLevel, setSkillLevel] = useState(75)
  const [editSkillLevel, setEditSkillLevel] = useState(75)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch("/api/skills")
        const data = await response.json()
        setSkills(data)
      } catch (error) {
        console.error("Error fetching skills:", error)
        toast({
          title: "Error",
          description: "Failed to load skills",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [toast])

  useEffect(() => {
    if (selectedSkill) {
      setEditSkillLevel(selectedSkill.level)
    }
  }, [selectedSkill])

  async function handleAddSkill(formData: FormData) {
    // Update the form data with the current slider value
    formData.set("level", skillLevel.toString())

    try {
      const result = await createSkill(formData)

      if (result.success) {
        setSkills([...skills, result.skill])
        setIsAddDialogOpen(false)
        setSkillLevel(75) // Reset to default
        toast({
          title: "Success",
          description: "Skill added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding skill:", error)
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      })
    }
  }

  async function handleEditSkill(formData: FormData) {
    if (!selectedSkill) return

    // Update the form data with the current slider value
    formData.set("level", editSkillLevel.toString())

    try {
      const result = await editSkill(selectedSkill.id, formData)

      if (result.success) {
        setSkills(skills.map((s) => (s.id === selectedSkill.id ? result.skill : s)))
        setIsEditDialogOpen(false)
        setSelectedSkill(null)
        toast({
          title: "Success",
          description: "Skill updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating skill:", error)
      toast({
        title: "Error",
        description: "Failed to update skill",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteSkill() {
    if (!selectedSkill) return

    try {
      const result = await removeSkill(selectedSkill.id)

      if (result.success) {
        setSkills(skills.filter((s) => s.id !== selectedSkill.id))
        setIsDeleteDialogOpen(false)
        setSelectedSkill(null)
        toast({
          title: "Success",
          description: "Skill deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting skill:", error)
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading skills...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skills</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
              <DialogDescription>Add a new skill to showcase in your portfolio</DialogDescription>
            </DialogHeader>
            <form action={handleAddSkill} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Skill Name</Label>
                <Input id="name" name="name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" required />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="level">Proficiency Level</Label>
                  <span>{skillLevel}%</span>
                </div>
                <Slider
                  id="level"
                  min={0}
                  max={100}
                  step={5}
                  value={[skillLevel]}
                  onValueChange={(value) => setSkillLevel(value[0])}
                />
              </div>

              <DialogFooter>
                <Button type="submit">Add Skill</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No skills found. Add your first skill to get started.
          </div>
        ) : (
          skills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader>
                <CardTitle>{skill.name}</CardTitle>
                <CardDescription>{skill.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Proficiency</span>
                    <span className="text-sm font-medium">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Dialog
                  open={isEditDialogOpen && selectedSkill?.id === skill.id}
                  onOpenChange={(open) => {
                    setIsEditDialogOpen(open)
                    if (!open) setSelectedSkill(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedSkill(skill)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Skill</DialogTitle>
                      <DialogDescription>Update the details of your skill</DialogDescription>
                    </DialogHeader>
                    <form action={handleEditSkill} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Skill Name</Label>
                        <Input id="edit-name" name="name" defaultValue={selectedSkill?.name} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Input id="edit-category" name="category" defaultValue={selectedSkill?.category} required />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="edit-level">Proficiency Level</Label>
                          <span>{editSkillLevel}%</span>
                        </div>
                        <Slider
                          id="edit-level"
                          min={0}
                          max={100}
                          step={5}
                          value={[editSkillLevel]}
                          onValueChange={(value) => setEditSkillLevel(value[0])}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="submit">Update Skill</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <AlertDialog
                  open={isDeleteDialogOpen && selectedSkill?.id === skill.id}
                  onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open)
                    if (!open) setSelectedSkill(null)
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setSelectedSkill(skill)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this skill? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSkill}>Delete</AlertDialogAction>
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
