import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSkills } from "@/lib/data"

export async function generateMetadata() {
  return {
    title: "Skills | Cyber Security Portfolio",
    description: "Explore my cybersecurity and technical skills",
  }
}

export default async function SkillsPage() {
  const skills = await getSkills()

  // Group skills by category
  const categories = [...new Set(skills.map((skill) => skill.category))]
  const skillsByCategory = categories.reduce(
    (acc, category) => {
      acc[category] = skills.filter((skill) => skill.category === category)
      return acc
    },
    {} as Record<string, typeof skills>,
  )

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Technical Skills</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Specialized cybersecurity and technical competencies
          </p>
        </div>
      </div>

      <Tabs defaultValue={categories[0]} className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-8">
            <div className="grid gap-6">
              {skillsByCategory[category].map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{skill.name}</h3>
                    <span>{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
