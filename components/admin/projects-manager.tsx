"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Edit, Save, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/lib/types"
import { addProject, updateProject, deleteProject } from "@/lib/data" // Assuming these are Server Actions or API calls

interface ProjectsManagerProps {
  initialProjects: Project[]
}

export function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState<Omit<Project, "id"> | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects])

  const handleAddProject = async () => {
    if (newProject) {
      try {
        const addedProject = await addProject(newProject)
        setProjects((prev) => [...prev, addedProject])
        setNewProject(null)
        toast({ title: "Success", description: "Project added successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to add project: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdateProject = async () => {
    if (editingProject) {
      try {
        const updatedProject = await updateProject(editingProject.id, editingProject)
        setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
        setEditingProject(null)
        toast({ title: "Success", description: "Project updated successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to update project: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      toast({ title: "Success", description: "Project deleted successfully." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete project: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const renderProjectForm = (project: Omit<Project, "id"> | Project, isNew: boolean) => (
    <div className="grid gap-4">
      <div>
        <Label htmlFor={isNew ? "new-title" : `title-${project.id}`}>Title</Label>
        <Input
          id={isNew ? "new-title" : `title-${project.id}`}
          value={project.title}
          onChange={(e) =>
            isNew
              ? setNewProject({ ...newProject!, title: e.target.value })
              : setEditingProject({ ...editingProject!, title: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-description" : `description-${project.id}`}>Description</Label>
        <Textarea
          id={isNew ? "new-description" : `description-${project.id}`}
          value={project.description}
          onChange={(e) =>
            isNew
              ? setNewProject({ ...newProject!, description: e.target.value })
              : setEditingProject({ ...editingProject!, description: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-technologies" : `technologies-${project.id}`}>
          Technologies (comma-separated)
        </Label>
        <Input
          id={isNew ? "new-technologies" : `technologies-${project.id}`}
          value={project.technologies.join(", ")}
          onChange={(e) =>
            isNew
              ? setNewProject({ ...newProject!, technologies: e.target.value.split(",").map((t) => t.trim()) })
              : setEditingProject({ ...editingProject!, technologies: e.target.value.split(",").map((t) => t.trim()) })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-github-url" : `github-url-${project.id}`}>GitHub URL</Label>
        <Input
          id={isNew ? "new-github-url" : `github-url-${project.id}`}
          value={project.github_url || ""}
          onChange={(e) =>
            isNew
              ? setNewProject({ ...newProject!, github_url: e.target.value })
              : setEditingProject({ ...editingProject!, github_url: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-live-url" : `live-url-${project.id}`}>Live URL</Label>
        <Input
          id={isNew ? "new-live-url" : `live-url-${project.id}`}
          value={project.live_url || ""}
          onChange={(e) =>
            isNew
              ? setNewProject({ ...newProject!, live_url: e.target.value })
              : setEditingProject({ ...editingProject!, live_url: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-image-url" : `image-url-${project.id}`}>Image URL</Label>
        <Input
          id={isNew ? "new-image-url" : `image-url-${project.id}`}
          value={project.image_url || ""}
          onChange={(e) =>
            isNew
              ? setNewProject({ ...newProject!, image_url: e.target.value })
              : setEditingProject({ ...editingProject!, image_url: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-category" : `category-${project.id}`}>Category</Label>
        <Input
          id={isNew ? "new-category" : `category-${project.id}`}
          value={project.category || ""}
          onChange={(e) =>
            isNew
              ? setNewProject({ ...newProject!, category: e.target.value })
              : setEditingProject({ ...editingProject!, category: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-date" : `date-${project.id}`}>Date (YYYY-MM-DD)</Label>
        <Input
          id={isNew ? "new-date" : `date-${project.id}`}
          type="date"
          value={project.date || ""}
          onChange={(e) =>
            isNew
              ? setNewProject({ ...newProject!, date: e.target.value })
              : setEditingProject({ ...editingProject!, date: e.target.value })
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => (isNew ? setNewProject(null) : setEditingProject(null))}>
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={isNew ? handleAddProject : handleUpdateProject}>
          <Save className="mr-2 h-4 w-4" /> {isNew ? "Add Project" : "Save Changes"}
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newProject ? (
            <Card className="p-4 border-dashed">
              <CardTitle className="mb-4">Add New Project</CardTitle>
              {renderProjectForm(newProject, true)}
            </Card>
          ) : (
            <Button
              onClick={() =>
                setNewProject({
                  title: "",
                  description: "",
                  technologies: [],
                  github_url: "",
                  live_url: "",
                  image_url: "",
                  category: "",
                  date: "",
                })
              }
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
            </Button>
          )}

          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="p-4">
                {editingProject?.id === project.id ? (
                  renderProjectForm(editingProject, false)
                ) : (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingProject({ ...project })}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id)}>
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
