"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Edit, Save, XCircle, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { BugBountyProgram } from "@/lib/types"
import { addBugBountyProgram, updateBugBountyProgram, deleteBugBountyProgram } from "@/lib/data" // Assuming these are Server Actions or API calls

interface EnhancedBugBountyManagerProps {
  initialBugBountyPrograms: BugBountyProgram[]
}

export function EnhancedBugBountyManager({ initialBugBountyPrograms }: EnhancedBugBountyManagerProps) {
  const [programs, setPrograms] = useState<BugBountyProgram[]>(initialBugBountyPrograms)
  const [editingProgram, setEditingProgram] = useState<BugBountyProgram | null>(null)
  const [newProgram, setNewProgram] = useState<Omit<BugBountyProgram, "id"> | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setPrograms(initialBugBountyPrograms)
  }, [initialBugBountyPrograms])

  const handleAddProgram = async () => {
    if (newProgram) {
      try {
        const addedProgram = await addBugBountyProgram(newProgram)
        setPrograms((prev) => [...prev, addedProgram])
        setNewProgram(null)
        toast({ title: "Success", description: "Bug Bounty Program added successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to add program: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdateProgram = async () => {
    if (editingProgram) {
      try {
        const updatedProgram = await updateBugBountyProgram(editingProgram.id, editingProgram)
        setPrograms((prev) => prev.map((p) => (p.id === updatedProgram.id ? updatedProgram : p)))
        setEditingProgram(null)
        toast({ title: "Success", description: "Bug Bounty Program updated successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to update program: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteProgram = async (id: string) => {
    try {
      await deleteBugBountyProgram(id)
      setPrograms((prev) => prev.filter((p) => p.id !== id))
      toast({ title: "Success", description: "Bug Bounty Program deleted successfully." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete program: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const renderProgramForm = (program: Omit<BugBountyProgram, "id"> | BugBountyProgram, isNew: boolean) => (
    <div className="grid gap-4">
      <div>
        <Label htmlFor={isNew ? "new-name" : `name-${program.id}`}>Program Name</Label>
        <Input
          id={isNew ? "new-name" : `name-${program.id}`}
          value={program.name}
          onChange={(e) =>
            isNew
              ? setNewProgram({ ...newProgram!, name: e.target.value })
              : setEditingProgram({ ...editingProgram!, name: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-platform" : `platform-${program.id}`}>Platform</Label>
        <Input
          id={isNew ? "new-platform" : `platform-${program.id}`}
          value={program.platform}
          onChange={(e) =>
            isNew
              ? setNewProgram({ ...newProgram!, platform: e.target.value })
              : setEditingProgram({ ...editingProgram!, platform: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-rewards" : `rewards-${program.id}`}>Rewards</Label>
        <Input
          id={isNew ? "new-rewards" : `rewards-${program.id}`}
          value={program.rewards || ""}
          onChange={(e) =>
            isNew
              ? setNewProgram({ ...newProgram!, rewards: e.target.value })
              : setEditingProgram({ ...editingProgram!, rewards: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-scope" : `scope-${program.id}`}>Scope</Label>
        <Textarea
          id={isNew ? "new-scope" : `scope-${program.id}`}
          value={program.scope || ""}
          onChange={(e) =>
            isNew
              ? setNewProgram({ ...newProgram!, scope: e.target.value })
              : setEditingProgram({ ...editingProgram!, scope: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-url" : `url-${program.id}`}>URL</Label>
        <Input
          id={isNew ? "new-url" : `url-${program.id}`}
          value={program.url || ""}
          onChange={(e) =>
            isNew
              ? setNewProgram({ ...newProgram!, url: e.target.value })
              : setEditingProgram({ ...editingProgram!, url: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-status" : `status-${program.id}`}>Status</Label>
        <Input
          id={isNew ? "new-status" : `status-${program.id}`}
          value={program.status || ""}
          onChange={(e) =>
            isNew
              ? setNewProgram({ ...newProgram!, status: e.target.value as "active" | "inactive" | "paused" })
              : setEditingProgram({ ...editingProgram!, status: e.target.value as "active" | "inactive" | "paused" })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-last-updated" : `last-updated-${program.id}`}>Last Updated (YYYY-MM-DD)</Label>
        <Input
          id={isNew ? "new-last-updated" : `last-updated-${program.id}`}
          type="date"
          value={program.last_updated || ""}
          onChange={(e) =>
            isNew
              ? setNewProgram({ ...newProgram!, last_updated: e.target.value })
              : setEditingProgram({ ...editingProgram!, last_updated: e.target.value })
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => (isNew ? setNewProgram(null) : setEditingProgram(null))}>
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={isNew ? handleAddProgram : handleUpdateProgram}>
          <Save className="mr-2 h-4 w-4" /> {isNew ? "Add Program" : "Save Changes"}
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Enhanced Bug Bounty Programs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newProgram ? (
            <Card className="p-4 border-dashed">
              <CardTitle className="mb-4">Add New Bug Bounty Program</CardTitle>
              {renderProgramForm(newProgram, true)}
            </Card>
          ) : (
            <Button
              onClick={() =>
                setNewProgram({
                  name: "",
                  platform: "",
                  rewards: "",
                  scope: "",
                  url: "",
                  status: "active",
                  last_updated: "",
                })
              }
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Program
            </Button>
          )}

          <div className="grid gap-4">
            {programs.map((program) => (
              <Card key={program.id} className="p-4">
                {editingProgram?.id === program.id ? (
                  renderProgramForm(editingProgram, false)
                ) : (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{program.name}</h3>
                    <p className="text-sm text-gray-500">Platform: {program.platform}</p>
                    <p className="text-sm text-gray-500">Rewards: {program.rewards}</p>
                    <p className="text-sm text-gray-500">Status: {program.status}</p>
                    {program.url && (
                      <a
                        href={program.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        View Program <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingProgram({ ...program })}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProgram(program.id)}>
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
