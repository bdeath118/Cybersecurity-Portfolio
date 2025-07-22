"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import * as LucideIcons from "lucide-react"
import type { Skill } from "@/lib/types"

interface SkillsSectionProps {
  skills: Skill[]
}

const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName]
  return Icon ? <Icon className="mr-2 h-5 w-5" /> : null
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const categories = Array.from(new Set(skills.map((skill) => skill.category)))

  return (
    <section id="skills" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">My Expertise</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              A comprehensive overview of my technical skills and proficiencies in various cybersecurity domains.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{category}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 grid gap-4">
                {skills
                  .filter((skill) => skill.category === category)
                  .sort((a, b) => b.proficiency - a.proficiency)
                  .map((skill) => (
                    <div key={skill.id} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {skill.icon && getIconComponent(skill.icon)}
                          <span className="font-medium">{skill.name}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.proficiency}%</span>
                      </div>
                      <Progress value={skill.proficiency} className="w-full" />
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
