"use client"

import { CardDescription } from "@/components/ui/card"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import type { SiteInfo } from "@/lib/types"
import { updateSiteInformation, uploadIcon, uploadBackgroundImage, uploadResume } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface SiteInfoManagerProps {
  initialSiteInfo: SiteInfo
}

export function SiteInfoManager({ initialSiteInfo }: SiteInfoManagerProps) {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(initialSiteInfo)
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
    setSiteInfo(initialSiteInfo)
    setLoading(false)
  }, [initialSiteInfo])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await updateSiteInformation(siteInfo)
      toast({ title: "Success", description: "Site information updated successfully." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update site information: ${error.message || "Unknown error"}`,
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
        setSiteInfo((prev) => ({ ...prev, icon: result.iconUrl }))
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
        setSiteInfo((prev) => ({
          ...prev,
          backgroundImage: result.backgroundImageUrl,
          backgroundOpacity: bgOpacity,
        }))
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
    if (!siteInfo.backgroundImage) return

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
        setSiteInfo((prev) => ({ ...prev, resume: result.resumeUrl }))
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
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={siteInfo.site_name}
                    onChange={(e) => setSiteInfo({ ...siteInfo, site_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="site-title">Site Title</Label>
                  <Input
                    id="site-title"
                    value={siteInfo.title}
                    onChange={(e) => setSiteInfo({ ...siteInfo, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea
                    id="site-description"
                    value={siteInfo.description}
                    onChange={(e) => setSiteInfo({ ...siteInfo, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="seo-title">SEO Title</Label>
                  <Input
                    id="seo-title"
                    value={siteInfo.seo_title}
                    onChange={(e) => setSiteInfo({ ...siteInfo, seo_title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="seo-description">SEO Description</Label>
                  <Textarea
                    id="seo-description"
                    value={siteInfo.seo_description}
                    onChange={(e) => setSiteInfo({ ...siteInfo, seo_description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    value={siteInfo.keywords.join(", ")}
                    onChange={(e) =>
                      setSiteInfo({
                        ...siteInfo,
                        keywords: e.target.value.split(",").map((k) => k.trim()),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="site-url">Site URL</Label>
                  <Input
                    id="site-url"
                    value={siteInfo.site_url}
                    onChange={(e) => setSiteInfo({ ...siteInfo, site_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="social-image-url">Social Share Image URL</Label>
                  <Input
                    id="social-image-url"
                    value={siteInfo.social_image_url}
                    onChange={(e) => setSiteInfo({ ...siteInfo, social_image_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="avatar-url">Avatar URL</Label>
                  <Input
                    id="avatar-url"
                    value={siteInfo.avatar_url}
                    onChange={(e) => setSiteInfo({ ...siteInfo, avatar_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="theme-color">Theme Color (Hex)</Label>
                  <Input
                    id="theme-color"
                    type="color"
                    value={siteInfo.theme_color}
                    onChange={(e) => setSiteInfo({ ...siteInfo, theme_color: e.target.value })}
                  />
                </div>
                <Button onClick={handleSave} className="w-full" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Site Info"}
                </Button>
              </div>
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
                <form action={handleSave} className="space-y-6">
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
