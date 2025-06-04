"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import type { SiteInfo } from "@/lib/types"
import { updateSiteInformation, uploadIcon, uploadBackgroundImage, uploadResume } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { FileText } from "lucide-react"

export function SiteInfoManager() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingBg, setIsUploadingBg] = useState(false)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [bgPreview, setBgPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedBgFile, setSelectedBgFile] = useState<File | null>(null)
  const [bgOpacity, setBgOpacity] = useState<number>(100)
  const { toast } = useToast()

  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [resumePreview, setResumePreview] = useState<string | null>(null)
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null)

  useEffect(() => {
    async function fetchSiteInfo() {
      try {
        const response = await fetch("/api/site-info")
        const data = await response.json()
        setSiteInfo(data)
        setBgOpacity(data.backgroundOpacity || 100)
      } catch (error) {
        console.error("Error fetching site info:", error)
        toast({
          title: "Error",
          description: "Failed to load site information",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSiteInfo()
  }, [toast])

  async function handleUpdateSiteInfo(formData: FormData) {
    setIsSaving(true)

    try {
      const result = await updateSiteInformation(formData)

      if (result.success) {
        setSiteInfo(result.info)
        toast({
          title: "Success",
          description: "Site information updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating site info:", error)
      toast({
        title: "Error",
        description: "Failed to update site information",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleIconUpload(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("icon", selectedFile)

      const result = await uploadIcon(formData)

      if (result.success) {
        setSiteInfo((prev) => (prev ? { ...prev, icon: result.iconUrl } : null))
        setIconPreview(null)
        setSelectedFile(null)
        toast({
          title: "Success",
          description: "Icon uploaded successfully",
        })
      }
    } catch (error) {
      console.error("Error uploading icon:", error)
      toast({
        title: "Error",
        description: "Failed to upload icon",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  async function handleBackgroundUpload(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedBgFile) {
      toast({
        title: "Error",
        description: "Please select a background image to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploadingBg(true)

    try {
      const formData = new FormData()
      formData.append("backgroundImage", selectedBgFile)
      formData.append("backgroundOpacity", bgOpacity.toString())

      const result = await uploadBackgroundImage(formData)

      if (result.success) {
        setSiteInfo((prev) =>
          prev
            ? {
                ...prev,
                backgroundImage: result.backgroundImageUrl,
                backgroundOpacity: bgOpacity,
              }
            : null,
        )
        setBgPreview(null)
        setSelectedBgFile(null)
        toast({
          title: "Success",
          description: "Background image uploaded successfully",
        })
      }
    } catch (error) {
      console.error("Error uploading background image:", error)
      toast({
        title: "Error",
        description: "Failed to upload background image",
        variant: "destructive",
      })
    } finally {
      setIsUploadingBg(false)
    }
  }

  async function handleOpacityChange() {
    if (!siteInfo?.backgroundImage) return

    setIsSaving(true)

    try {
      const formData = new FormData()
      formData.append("updateType", "backgroundOpacity")
      formData.append("backgroundOpacity", bgOpacity.toString())

      const result = await updateSiteInformation(formData)

      if (result.success) {
        setSiteInfo(result.info)
        toast({
          title: "Success",
          description: "Background opacity updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating background opacity:", error)
      toast({
        title: "Error",
        description: "Failed to update background opacity",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setIconPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function handleBgFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedBgFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setBgPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleResumeUpload(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedResumeFile) {
      toast({
        title: "Error",
        description: "Please select a resume file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploadingResume(true)

    try {
      const formData = new FormData()
      formData.append("resume", selectedResumeFile)

      const result = await uploadResume(formData)

      if (result.success) {
        setSiteInfo((prev) => (prev ? { ...prev, resume: result.resumeUrl } : null))
        setResumePreview(null)
        setSelectedResumeFile(null)
        toast({
          title: "Success",
          description: "Resume uploaded successfully",
        })
      }
    } catch (error) {
      console.error("Error uploading resume:", error)
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive",
      })
    } finally {
      setIsUploadingResume(false)
    }
  }

  function handleResumeFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedResumeFile(file)
      setResumePreview(file.name)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading site information...</div>
  }

  if (!siteInfo) {
    return <div className="text-center py-8 text-muted-foreground">Site information not found.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Site Information</h2>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="appearance">Site Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal information and contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleUpdateSiteInfo} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" defaultValue={siteInfo.name} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" name="title" defaultValue={siteInfo.title} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Bio/Description</Label>
                  <Textarea id="description" name="description" rows={4} defaultValue={siteInfo.description} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" defaultValue={siteInfo.email} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input id="github" name="github" defaultValue={siteInfo.github} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input id="linkedin" name="linkedin" defaultValue={siteInfo.linkedin} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Resume/CV</Label>
                  <div className="space-y-4">
                    {siteInfo.resume && (
                      <div className="flex items-center gap-2 p-3 border rounded-md">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Current resume uploaded</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(siteInfo.resume, "_blank")}
                        >
                          View
                        </Button>
                      </div>
                    )}

                    <form onSubmit={handleResumeUpload} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          id="resume"
                          name="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeFileChange}
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload your resume in PDF, DOC, or DOCX format (max 5MB)
                        </p>
                        {resumePreview && <p className="text-sm text-muted-foreground">Selected: {resumePreview}</p>}
                      </div>

                      <Button type="submit" disabled={isUploadingResume || !selectedResumeFile}>
                        {isUploadingResume ? "Uploading..." : "Upload Resume"}
                      </Button>
                    </form>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Theme Colors</CardTitle>
                <CardDescription>Customize the colors of your portfolio website</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={handleUpdateSiteInfo} className="space-y-6">
                  <input type="hidden" name="updateType" value="theme" />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          name="primaryColor"
                          defaultValue={siteInfo.theme?.primaryColor || "#0f172a"}
                        />
                        <input
                          type="color"
                          id="primaryColorPicker"
                          className="w-12 h-10 rounded-md cursor-pointer"
                          defaultValue={siteInfo.theme?.primaryColor || "#0f172a"}
                          onChange={(e) => {
                            const input = document.getElementById("primaryColor") as HTMLInputElement
                            if (input) input.value = e.target.value
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          name="secondaryColor"
                          defaultValue={siteInfo.theme?.secondaryColor || "#6366f1"}
                        />
                        <input
                          type="color"
                          id="secondaryColorPicker"
                          className="w-12 h-10 rounded-md cursor-pointer"
                          defaultValue={siteInfo.theme?.secondaryColor || "#6366f1"}
                          onChange={(e) => {
                            const input = document.getElementById("secondaryColor") as HTMLInputElement
                            if (input) input.value = e.target.value
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="backgroundColor"
                          name="backgroundColor"
                          defaultValue={siteInfo.theme?.backgroundColor || "#ffffff"}
                        />
                        <input
                          type="color"
                          id="backgroundColorPicker"
                          className="w-12 h-10 rounded-md cursor-pointer"
                          defaultValue={siteInfo.theme?.backgroundColor || "#ffffff"}
                          onChange={(e) => {
                            const input = document.getElementById("backgroundColor") as HTMLInputElement
                            if (input) input.value = e.target.value
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex gap-2">
                        <Input id="textColor" name="textColor" defaultValue={siteInfo.theme?.textColor || "#0f172a"} />
                        <input
                          type="color"
                          id="textColorPicker"
                          className="w-12 h-10 rounded-md cursor-pointer"
                          defaultValue={siteInfo.theme?.textColor || "#0f172a"}
                          onChange={(e) => {
                            const input = document.getElementById("textColor") as HTMLInputElement
                            if (input) input.value = e.target.value
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Theme"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site Icon</CardTitle>
                <CardDescription>Upload a custom icon for your portfolio website</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleIconUpload} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="relative w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden">
                        {iconPreview || siteInfo.icon ? (
                          <Image
                            src={iconPreview || siteInfo.icon || "/placeholder.svg"}
                            alt="Site Icon"
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm text-center p-2">No icon uploaded</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="icon">Upload Icon (SVG, PNG, or JPG)</Label>
                      <Input
                        id="icon"
                        name="icon"
                        type="file"
                        accept=".svg,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />
                      <p className="text-xs text-muted-foreground">Recommended size: 512x512 pixels</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={isUploading || !selectedFile}>
                      {isUploading ? "Uploading..." : "Upload Icon"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Background Image</CardTitle>
                <CardDescription>Upload a background image and control its opacity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <div>
                    <form onSubmit={handleBackgroundUpload} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="relative w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden">
                            {bgPreview || siteInfo.backgroundImage ? (
                              <Image
                                src={bgPreview || siteInfo.backgroundImage || "/placeholder.svg"}
                                alt="Background Image"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-muted-foreground text-sm text-center p-2">
                                No background image uploaded
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="backgroundImage">Upload Background Image (JPG, PNG)</Label>
                          <Input
                            id="backgroundImage"
                            name="backgroundImage"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleBgFileChange}
                          />
                          <p className="text-xs text-muted-foreground">Recommended size: 1920x1080 pixels or larger</p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button type="submit" className="w-full" disabled={isUploadingBg || !selectedBgFile}>
                          {isUploadingBg ? "Uploading..." : "Upload Background"}
                        </Button>
                      </div>
                    </form>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label htmlFor="backgroundOpacity">Background Opacity</Label>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Transparent</span>
                          <span className="text-sm text-muted-foreground">Solid</span>
                        </div>
                        <Slider
                          id="backgroundOpacity"
                          min={10}
                          max={100}
                          step={5}
                          value={[bgOpacity]}
                          onValueChange={(value) => setBgOpacity(value[0])}
                          disabled={!siteInfo.backgroundImage}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm">{bgOpacity}%</span>
                        </div>
                      </div>

                      <div className="relative h-32 w-full rounded-md overflow-hidden">
                        {siteInfo.backgroundImage ? (
                          <>
                            <div
                              className="absolute inset-0 bg-checkerboard"
                              style={{
                                backgroundImage:
                                  "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
                                backgroundSize: "20px 20px",
                                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                              }}
                            />
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${siteInfo.backgroundImage})`,
                                opacity: bgOpacity / 100,
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <p className="text-sm font-medium bg-background/80 px-2 py-1 rounded">Preview</p>
                            </div>
                          </>
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-muted">
                            <p className="text-sm text-muted-foreground">No background image</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleOpacityChange}
                      className="w-full"
                      disabled={isSaving || !siteInfo.backgroundImage}
                    >
                      {isSaving ? "Saving..." : "Update Opacity"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
