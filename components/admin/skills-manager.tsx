"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Edit, Save, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as LucideIcons from "lucide-react"
import type { Skill } from "@/lib/types"
import { addSkill, updateSkill, deleteSkill } from "@/lib/data" // Assuming these are Server Actions or API calls

interface SkillsManagerProps {
  initialSkills: Skill[]
}

const allLucideIcons = Object.keys(LucideIcons).filter(
  (name) => name.endsWith("Icon") || name.match(/^[A-Z][a-zA-Z]*$/),
)

export function SkillsManager({ initialSkills }: SkillsManagerProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [newSkill, setNewSkill] = useState<Omit<Skill, "id"> | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setSkills(initialSkills)
  }, [initialSkills])

  const handleAddSkill = async () => {
    if (newSkill) {
      try {
        const addedSkill = await addSkill(newSkill)
        setSkills((prev) => [...prev, addedSkill])
        setNewSkill(null)
        toast({ title: "Success", description: "Skill added successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to add skill: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdateSkill = async () => {
    if (editingSkill) {
      try {
        const updatedSkill = await updateSkill(editingSkill.id, editingSkill)
        setSkills((prev) => prev.map((s) => (s.id === updatedSkill.id ? updatedSkill : s)))
        setEditingSkill(null)
        toast({ title: "Success", description: "Skill updated successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to update skill: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteSkill = async (id: string) => {
    try {
      await deleteSkill(id)
      setSkills((prev) => prev.filter((s) => s.id !== id))
      toast({ title: "Success", description: "Skill deleted successfully." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete skill: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const renderSkillForm = (skill: Omit<Skill, "id"> | Skill, isNew: boolean) => (
    <div className="grid gap-4">
      <div>
        <Label htmlFor={isNew ? "new-name" : `name-${skill.id}`}>Name</Label>
        <Input
          id={isNew ? "new-name" : `name-${skill.id}`}
          value={skill.name}
          onChange={(e) =>
            isNew
              ? setNewSkill({ ...newSkill!, name: e.target.value })
              : setEditingSkill({ ...editingSkill!, name: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-category" : `category-${skill.id}`}>Category</Label>
        <Input
          id={isNew ? "new-category" : `category-${skill.id}`}
          value={skill.category}
          onChange={(e) =>
            isNew
              ? setNewSkill({ ...newSkill!, category: e.target.value })
              : setEditingSkill({ ...editingSkill!, category: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-proficiency" : `proficiency-${skill.id}`}>Proficiency: {skill.proficiency}%</Label>
        <Slider
          id={isNew ? "new-proficiency" : `proficiency-${skill.id}`}
          min={0}
          max={100}
          step={1}
          value={[skill.proficiency]}
          onValueChange={(value) =>
            isNew
              ? setNewSkill({ ...newSkill!, proficiency: value[0] })
              : setEditingSkill({ ...editingSkill!, proficiency: value[0] })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-icon" : `icon-${skill.id}`}>Icon (Lucide Icon Name)</Label>
        <Select
          value={skill.icon || ""}
          onValueChange={(value) =>
            isNew ? setNewSkill({ ...newSkill!, icon: value }) : setEditingSkill({ ...editingSkill!, icon: value })
          }
        >
          <SelectTrigger id={isNew ? "new-icon" : `icon-${skill.id}`}>
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            {allLucideIcons.map((iconName) => {
              const Icon = (LucideIcons as any)[iconName]
              return (
                <SelectItem key={iconName} value={iconName}>
                  <div className="flex items-center">
                    {Icon && <Icon className="mr-2 h-4 w-4" />} {iconName}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => (isNew ? setNewSkill(null) : setEditingSkill(null))}>
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={isNew ? handleAddSkill : handleUpdateSkill}>
          <Save className="mr-2 h-4 w-4" /> {isNew ? "Add Skill" : "Save Changes"}
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newSkill ? (
            <Card className="p-4 border-dashed">
              <CardTitle className="mb-4">Add New Skill</CardTitle>
              {renderSkillForm(newSkill, true)}
            </Card>
          ) : (
            <Button
              onClick={() =>
                setNewSkill({
                  name: "",
                  category: "",
                  proficiency: 50,
                  icon: "",
                })
              }
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Skill
            </Button>
          )}

          <div className="grid gap-4">
            {skills.map((skill) => (
              <Card key={skill.id} className="p-4">
                {editingSkill?.id === skill.id ? (
                  renderSkillForm(editingSkill, false)
                ) : (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{skill.name}</h3>
                    <p className="text-sm text-gray-500">{skill.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {skill.icon &&
                          React.createElement((LucideIcons as any)[skill.icon], { className: "mr-2 h-4 w-4" })}
                        <span className="font-medium">Proficiency:</span>
                      </div>
                      <span className="text-sm text-gray-500">{skill.proficiency}%</span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingSkill({ ...skill })}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteSkill(skill.id)}>
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
