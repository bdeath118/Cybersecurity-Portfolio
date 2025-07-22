"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Edit, Save, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Certification } from "@/lib/types"
import { addCertification, updateCertification, deleteCertification } from "@/lib/data" // Assuming these are Server Actions or API calls

interface CertificationsManagerProps {
  initialCertifications: Certification[]
}

export function CertificationsManager({ initialCertifications }: CertificationsManagerProps) {
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [newCertification, setNewCertification] = useState<Omit<Certification, "id"> | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setCertifications(initialCertifications)
  }, [initialCertifications])

  const handleAddCertification = async () => {
    if (newCertification) {
      try {
        const addedCert = await addCertification(newCertification)
        setCertifications((prev) => [...prev, addedCert])
        setNewCertification(null)
        toast({ title: "Success", description: "Certification added successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to add certification: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdateCertification = async () => {
    if (editingCertification) {
      try {
        const updatedCert = await updateCertification(editingCertification.id, editingCertification)
        setCertifications((prev) => prev.map((c) => (c.id === updatedCert.id ? updatedCert : c)))
        setEditingCertification(null)
        toast({ title: "Success", description: "Certification updated successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to update certification: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteCertification = async (id: string) => {
    try {
      await deleteCertification(id)
      setCertifications((prev) => prev.filter((c) => c.id !== id))
      toast({ title: "Success", description: "Certification deleted successfully." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete certification: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const renderCertificationForm = (cert: Omit<Certification, "id"> | Certification, isNew: boolean) => (
    <div className="grid gap-4">
      <div>
        <Label htmlFor={isNew ? "new-name" : `name-${cert.id}`}>Name</Label>
        <Input
          id={isNew ? "new-name" : `name-${cert.id}`}
          value={cert.name}
          onChange={(e) =>
            isNew
              ? setNewCertification({ ...newCertification!, name: e.target.value })
              : setEditingCertification({ ...editingCertification!, name: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-issuer" : `issuer-${cert.id}`}>Issuer</Label>
        <Input
          id={isNew ? "new-issuer" : `issuer-${cert.id}`}
          value={cert.issuer}
          onChange={(e) =>
            isNew
              ? setNewCertification({ ...newCertification!, issuer: e.target.value })
              : setEditingCertification({ ...editingCertification!, issuer: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-issue-date" : `issue-date-${cert.id}`}>Issue Date</Label>
        <Input
          id={isNew ? "new-issue-date" : `issue-date-${cert.id}`}
          type="date"
          value={cert.issue_date || ""}
          onChange={(e) =>
            isNew
              ? setNewCertification({ ...newCertification!, issue_date: e.target.value })
              : setEditingCertification({ ...editingCertification!, issue_date: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-expiration-date" : `expiration-date-${cert.id}`}>Expiration Date</Label>
        <Input
          id={isNew ? "new-expiration-date" : `expiration-date-${cert.id}`}
          type="date"
          value={cert.expiration_date || ""}
          onChange={(e) =>
            isNew
              ? setNewCertification({ ...newCertification!, expiration_date: e.target.value })
              : setEditingCertification({ ...editingCertification!, expiration_date: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-credential-id" : `credential-id-${cert.id}`}>Credential ID</Label>
        <Input
          id={isNew ? "new-credential-id" : `credential-id-${cert.id}`}
          value={cert.credential_id || ""}
          onChange={(e) =>
            isNew
              ? setNewCertification({ ...newCertification!, credential_id: e.target.value })
              : setEditingCertification({ ...editingCertification!, credential_id: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-credential-url" : `credential-url-${cert.id}`}>Credential URL</Label>
        <Input
          id={isNew ? "new-credential-url" : `credential-url-${cert.id}`}
          value={cert.credential_url || ""}
          onChange={(e) =>
            isNew
              ? setNewCertification({ ...newCertification!, credential_url: e.target.value })
              : setEditingCertification({ ...editingCertification!, credential_url: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-image-url" : `image-url-${cert.id}`}>Image URL</Label>
        <Input
          id={isNew ? "new-image-url" : `image-url-${cert.id}`}
          value={cert.image_url || ""}
          onChange={(e) =>
            isNew
              ? setNewCertification({ ...newCertification!, image_url: e.target.value })
              : setEditingCertification({ ...editingCertification!, image_url: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-category" : `category-${cert.id}`}>Category</Label>
        <Input
          id={isNew ? "new-category" : `category-${cert.id}`}
          value={cert.category || ""}
          onChange={(e) =>
            isNew
              ? setNewCertification({ ...newCertification!, category: e.target.value })
              : setEditingCertification({ ...editingCertification!, category: e.target.value })
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => (isNew ? setNewCertification(null) : setEditingCertification(null))}>
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={isNew ? handleAddCertification : handleUpdateCertification}>
          <Save className="mr-2 h-4 w-4" /> {isNew ? "Add Certification" : "Save Changes"}
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newCertification ? (
            <Card className="p-4 border-dashed">
              <CardTitle className="mb-4">Add New Certification</CardTitle>
              {renderCertificationForm(newCertification, true)}
            </Card>
          ) : (
            <Button
              onClick={() =>
                setNewCertification({
                  name: "",
                  issuer: "",
                  issue_date: "",
                  expiration_date: "",
                  credential_id: "",
                  credential_url: "",
                  image_url: "",
                  category: "",
                })
              }
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Certification
            </Button>
          )}

          <div className="grid gap-4">
            {certifications.map((cert) => (
              <Card key={cert.id} className="p-4">
                {editingCertification?.id === cert.id ? (
                  renderCertificationForm(editingCertification, false)
                ) : (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{cert.name}</h3>
                    <p className="text-sm text-gray-500">{cert.issuer}</p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingCertification({ ...cert })}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCertification(cert.id)}>
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
