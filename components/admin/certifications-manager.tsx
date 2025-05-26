"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Pencil, Trash2, Award } from "lucide-react"
import type { Certification } from "@/lib/types"
import { createCertification, editCertification, removeCertification } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export function CertificationsManager() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCertifications() {
      try {
        const response = await fetch("/api/certifications")
        const data = await response.json()
        setCertifications(data)
      } catch (error) {
        console.error("Error fetching certifications:", error)
        toast({
          title: "Error",
          description: "Failed to load certifications",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCertifications()
  }, [toast])

  async function handleAddCertification(formData: FormData) {
    try {
      const result = await createCertification(formData)

      if (result.success) {
        setCertifications([...certifications, result.certification])
        setIsAddDialogOpen(false)
        toast({
          title: "Success",
          description: "Certification added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding certification:", error)
      toast({
        title: "Error",
        description: "Failed to add certification",
        variant: "destructive",
      })
    }
  }

  async function handleEditCertification(formData: FormData) {
    if (!selectedCertification) return

    try {
      const result = await editCertification(selectedCertification.id, formData)

      if (result.success) {
        setCertifications(certifications.map((c) => (c.id === selectedCertification.id ? result.certification : c)))
        setIsEditDialogOpen(false)
        setSelectedCertification(null)
        toast({
          title: "Success",
          description: "Certification updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating certification:", error)
      toast({
        title: "Error",
        description: "Failed to update certification",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteCertification() {
    if (!selectedCertification) return

    try {
      const result = await removeCertification(selectedCertification.id)

      if (result.success) {
        setCertifications(certifications.filter((c) => c.id !== selectedCertification.id))
        setIsDeleteDialogOpen(false)
        setSelectedCertification(null)
        toast({
          title: "Success",
          description: "Certification deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting certification:", error)
      toast({
        title: "Error",
        description: "Failed to delete certification",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading certifications...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Certifications</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Certification</DialogTitle>
              <DialogDescription>Add a new certification to showcase in your portfolio</DialogDescription>
            </DialogHeader>
            <form action={handleAddCertification} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Certification Name</Label>
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
                  <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                  <Input id="expiryDate" name="expiryDate" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input id="logo" name="logo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credentialUrl">Credential URL</Label>
                  <Input id="credentialUrl" name="credentialUrl" />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Add Certification</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No certifications found. Add your first certification to get started.
          </div>
        ) : (
          certifications.map((cert) => (
            <Card key={cert.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                {cert.logo ? (
                  <Image
                    src={cert.logo || "/placeholder.svg"}
                    alt={cert.name}
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                ) : (
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg">{cert.name}</CardTitle>
                  <CardDescription>{cert.issuer}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Issued: {cert.date}</span>
                    {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{cert.description}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Dialog
                  open={isEditDialogOpen && selectedCertification?.id === cert.id}
                  onOpenChange={(open) => {
                    setIsEditDialogOpen(open)
                    if (!open) setSelectedCertification(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedCertification(cert)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Certification</DialogTitle>
                      <DialogDescription>Update the details of your certification</DialogDescription>
                    </DialogHeader>
                    <form action={handleEditCertification} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Certification Name</Label>
                          <Input id="edit-name" name="name" defaultValue={selectedCertification?.name} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-issuer">Issuing Organization</Label>
                          <Input id="edit-issuer" name="issuer" defaultValue={selectedCertification?.issuer} required />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-date">Issue Date</Label>
                          <Input
                            id="edit-date"
                            name="date"
                            type="date"
                            defaultValue={selectedCertification?.date}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-expiryDate">Expiry Date (if applicable)</Label>
                          <Input
                            id="edit-expiryDate"
                            name="expiryDate"
                            type="date"
                            defaultValue={selectedCertification?.expiryDate}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          name="description"
                          rows={3}
                          defaultValue={selectedCertification?.description}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-logo">Logo URL</Label>
                          <Input id="edit-logo" name="logo" defaultValue={selectedCertification?.logo} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-credentialUrl">Credential URL</Label>
                          <Input
                            id="edit-credentialUrl"
                            name="credentialUrl"
                            defaultValue={selectedCertification?.credentialUrl}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="submit">Update Certification</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <AlertDialog
                  open={isDeleteDialogOpen && selectedCertification?.id === cert.id}
                  onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open)
                    if (!open) setSelectedCertification(null)
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setSelectedCertification(cert)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Certification</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this certification? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteCertification}>Delete</AlertDialogAction>
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
