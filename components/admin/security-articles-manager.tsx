"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, ExternalLink, FileText, Eye, Heart } from "lucide-react"
import type { SecurityArticle } from "@/lib/types"

export function SecurityArticlesManager() {
  const [articles, setArticles] = useState<SecurityArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newArticle, setNewArticle] = useState<Partial<SecurityArticle>>({
    title: "",
    platform: "",
    url: "",
    publishedDate: new Date().toISOString().split("T")[0],
    summary: "",
    tags: [],
    views: 0,
    likes: 0,
    readTime: 5,
  })

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/security-articles")
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addArticle = async () => {
    if (!newArticle.title || !newArticle.platform || !newArticle.url) return

    try {
      const response = await fetch("/api/security-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newArticle,
          id: Date.now().toString(),
          tags:
            typeof newArticle.tags === "string" ? newArticle.tags.split(",").map((tag) => tag.trim()) : newArticle.tags,
        }),
      })

      if (response.ok) {
        await fetchArticles()
        setNewArticle({
          title: "",
          platform: "",
          url: "",
          publishedDate: new Date().toISOString().split("T")[0],
          summary: "",
          tags: [],
          views: 0,
          likes: 0,
          readTime: 5,
        })
      }
    } catch (error) {
      console.error("Error adding article:", error)
    }
  }

  const deleteArticle = async (id: string) => {
    try {
      const response = await fetch("/api/security-articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        await fetchArticles()
      }
    } catch (error) {
      console.error("Error deleting article:", error)
    }
  }

  if (isLoading) {
    return <div>Loading security articles...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add New Security Article
          </CardTitle>
          <CardDescription>Track your cybersecurity publications and blog posts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                placeholder="e.g., Advanced SQL Injection Techniques"
              />
            </div>
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                value={newArticle.platform}
                onChange={(e) => setNewArticle({ ...newArticle, platform: e.target.value })}
                placeholder="e.g., Medium, Dev.to, Personal Blog"
              />
            </div>
            <div>
              <Label htmlFor="url">Article URL</Label>
              <Input
                id="url"
                value={newArticle.url}
                onChange={(e) => setNewArticle({ ...newArticle, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="publishedDate">Published Date</Label>
              <Input
                id="publishedDate"
                type="date"
                value={newArticle.publishedDate}
                onChange={(e) => setNewArticle({ ...newArticle, publishedDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="readTime">Read Time (minutes)</Label>
              <Input
                id="readTime"
                type="number"
                value={newArticle.readTime}
                onChange={(e) => setNewArticle({ ...newArticle, readTime: Number(e.target.value) })}
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={Array.isArray(newArticle.tags) ? newArticle.tags.join(", ") : newArticle.tags}
                onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                placeholder="cybersecurity, penetration testing, OWASP"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={newArticle.summary}
              onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
              placeholder="Brief summary of the article content..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="views">Views</Label>
              <Input
                id="views"
                type="number"
                value={newArticle.views}
                onChange={(e) => setNewArticle({ ...newArticle, views: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="likes">Likes/Claps</Label>
              <Input
                id="likes"
                type="number"
                value={newArticle.likes}
                onChange={(e) => setNewArticle({ ...newArticle, likes: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>
          <Button onClick={addArticle} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {article.title}
                    <Badge variant="outline">{article.platform}</Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                    <span>{article.readTime} min read</span>
                    {article.views > 0 && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {article.views}
                      </span>
                    )}
                    {article.likes > 0 && (
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {article.likes}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteArticle(article.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {article.summary && <p className="text-sm text-muted-foreground mb-3">{article.summary}</p>}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {articles.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No security articles yet. Add your first publication!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
