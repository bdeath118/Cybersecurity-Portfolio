"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Project } from "@/lib/types"
import { createProject, editProject, removeProject } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects")
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [toast])

  async function handleAddProject(formData: FormData) {
    try {
      const result = await createProject(formData)

      if (result.success) {
        setProjects([...projects, result.project])
        setIsAddDialogOpen(false)
        toast({
          title: "Success",
          description: "Project added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding project:", error)
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      })
    }
  }

  async function handleEditProject(formData: FormData) {
    if (!selectedProject) return

    try {
      const result = await editProject(selectedProject.id, formData)

      if (result.success) {
        setProjects(projects.map((p) => (p.id === selectedProject.id ? result.project : p)))
        setIsEditDialogOpen(false)
        setSelectedProject(null)
        toast({
          title: "Success",
          description: "Project updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteProject() {
    if (!selectedProject) return

    try {
      const result = await removeProject(selectedProject.id)

      if (result.success) {
        setProjects(projects.filter((p) => p.id !== selectedProject.id))
        setIsDeleteDialogOpen(false)
        setSelectedProject(null)
        toast({
          title: "Success",
          description: "Project deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>Create a new project to showcase in your portfolio</DialogDescription>
            </DialogHeader>
            <form action={handleAddProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Input id="summary" name="summary" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input id="technologies" name="technologies" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" name="image" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <Input id="demoUrl" name="demoUrl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input id="githubUrl" name="githubUrl" />
              </div>

              <DialogFooter>
                <Button type="submit">Add Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No projects found. Add your first project to get started.
          </div>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                <CardDescription>{project.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="outline">+{project.technologies.length - 3}</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Dialog
                  open={isEditDialogOpen && selectedProject?.id === project.id}
                  onOpenChange={(open) => {
                    setIsEditDialogOpen(open)
                    if (!open) setSelectedProject(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Project</DialogTitle>
                      <DialogDescription>Update the details of your project</DialogDescription>
                    </DialogHeader>
                    <form action={handleEditProject} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Title</Label>
                          <Input id="edit-title" name="title" defaultValue={selectedProject?.title} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-date">Date</Label>
                          <Input id="edit-date" name="date" type="date" defaultValue={selectedProject?.date} required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-summary">Summary</Label>
                        <Input id="edit-summary" name="summary" defaultValue={selectedProject?.summary} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          name="description"
                          rows={4}
                          defaultValue={selectedProject?.description}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-technologies">Technologies (comma-separated)</Label>
                        <Input
                          id="edit-technologies"
                          name="technologies"
                          defaultValue={selectedProject?.technologies.join(", ")}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-image">Image URL</Label>
                          <Input id="edit-image" name="image" defaultValue={selectedProject?.image} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-demoUrl">Demo URL</Label>
                          <Input id="edit-demoUrl" name="demoUrl" defaultValue={selectedProject?.demoUrl} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-githubUrl">GitHub URL</Label>
                        <Input id="edit-githubUrl" name="githubUrl" defaultValue={selectedProject?.githubUrl} />
                      </div>

                      <DialogFooter>
                        <Button type="submit">Update Project</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <AlertDialog
                  open={isDeleteDialogOpen && selectedProject?.id === project.id}
                  onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open)
                    if (!open) setSelectedProject(null)
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setSelectedProject(project)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Project</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this project? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
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

