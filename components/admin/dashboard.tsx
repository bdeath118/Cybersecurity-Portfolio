"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { ProjectsManager } from "./projects-manager"
import { SkillsManager } from "./skills-manager"
import { CertificationsManager } from "./certifications-manager"
import { CTFManager } from "./ctf-manager"
import { SiteInfoManager } from "./site-info-manager"
import { logout } from "@/lib/actions"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects")

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <form action={logout}>
          <Button variant="outline" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="ctf">CTF Events</TabsTrigger>
          <TabsTrigger value="site-info">Site Info</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <ProjectsManager />
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <SkillsManager />
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <CertificationsManager />
        </TabsContent>

        <TabsContent value="ctf" className="space-y-4">
          <CTFManager />
        </TabsContent>

        <TabsContent value="site-info" className="space-y-4">
          <SiteInfoManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

