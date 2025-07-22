"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Edit, Save, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { SecurityArticle } from "@/lib/types"
import { addSecurityArticle, updateSecurityArticle, deleteSecurityArticle } from "@/lib/data" // Assuming these are Server Actions or API calls

interface SecurityArticlesManagerProps {
  initialSecurityArticles: SecurityArticle[]
}

export function SecurityArticlesManager({ initialSecurityArticles }: SecurityArticlesManagerProps) {
  const [articles, setArticles] = useState<SecurityArticle[]>(initialSecurityArticles)
  const [editingArticle, setEditingArticle] = useState<SecurityArticle | null>(null)
  const [newArticle, setNewArticle] = useState<Omit<SecurityArticle, "id"> | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setArticles(initialSecurityArticles)
  }, [initialSecurityArticles])

  const handleAddArticle = async () => {
    if (newArticle) {
      try {
        const addedArticle = await addSecurityArticle(newArticle)
        setArticles((prev) => [...prev, addedArticle])
        setNewArticle(null)
        toast({ title: "Success", description: "Security Article added successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to add article: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdateArticle = async () => {
    if (editingArticle) {
      try {
        const updatedArticle = await updateSecurityArticle(editingArticle.id, editingArticle)
        setArticles((prev) => prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a)))
        setEditingArticle(null)
        toast({ title: "Success", description: "Security Article updated successfully." })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to update article: ${error.message || "Unknown error"}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteSecurityArticle(id)
      setArticles((prev) => prev.filter((a) => a.id !== id))
      toast({ title: "Success", description: "Security Article deleted successfully." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete article: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const renderArticleForm = (article: Omit<SecurityArticle, "id"> | SecurityArticle, isNew: boolean) => (
    <div className="grid gap-4">
      <div>
        <Label htmlFor={isNew ? "new-title" : `title-${article.id}`}>Title</Label>
        <Input
          id={isNew ? "new-title" : `title-${article.id}`}
          value={article.title}
          onChange={(e) =>
            isNew
              ? setNewArticle({ ...newArticle!, title: e.target.value })
              : setEditingArticle({ ...editingArticle!, title: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-author" : `author-${article.id}`}>Author</Label>
        <Input
          id={isNew ? "new-author" : `author-${article.id}`}
          value={article.author}
          onChange={(e) =>
            isNew
              ? setNewArticle({ ...newArticle!, author: e.target.value })
              : setEditingArticle({ ...editingArticle!, author: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-publish-date" : `publish-date-${article.id}`}>Publish Date (YYYY-MM-DD)</Label>
        <Input
          id={isNew ? "new-publish-date" : `publish-date-${article.id}`}
          type="date"
          value={article.publish_date || ""}
          onChange={(e) =>
            isNew
              ? setNewArticle({ ...newArticle!, publish_date: e.target.value })
              : setEditingArticle({ ...editingArticle!, publish_date: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-url" : `url-${article.id}`}>URL</Label>
        <Input
          id={isNew ? "new-url" : `url-${article.id}`}
          value={article.url || ""}
          onChange={(e) =>
            isNew
              ? setNewArticle({ ...newArticle!, url: e.target.value })
              : setEditingArticle({ ...editingArticle!, url: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-summary" : `summary-${article.id}`}>Summary</Label>
        <Textarea
          id={isNew ? "new-summary" : `summary-${article.id}`}
          value={article.summary || ""}
          onChange={(e) =>
            isNew
              ? setNewArticle({ ...newArticle!, summary: e.target.value })
              : setEditingArticle({ ...editingArticle!, summary: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor={isNew ? "new-tags" : `tags-${article.id}`}>Tags (comma-separated)</Label>
        <Input
          id={isNew ? "new-tags" : `tags-${article.id}`}
          value={article.tags.join(", ")}
          onChange={(e) =>
            isNew
              ? setNewArticle({ ...newArticle!, tags: e.target.value.split(",").map((t) => t.trim()) })
              : setEditingArticle({ ...editingArticle!, tags: e.target.value.split(",").map((t) => t.trim()) })
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => (isNew ? setNewArticle(null) : setEditingArticle(null))}>
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={isNew ? handleAddArticle : handleUpdateArticle}>
          <Save className="mr-2 h-4 w-4" /> {isNew ? "Add Article" : "Save Changes"}
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Security Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newArticle ? (
            <Card className="p-4 border-dashed">
              <CardTitle className="mb-4">Add New Security Article</CardTitle>
              {renderArticleForm(newArticle, true)}
            </Card>
          ) : (
            <Button
              onClick={() =>
                setNewArticle({
                  title: "",
                  author: "",
                  publish_date: "",
                  url: "",
                  summary: "",
                  tags: [],
                })
              }
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Article
            </Button>
          )}

          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article.id} className="p-4">
                {editingArticle?.id === article.id ? (
                  renderArticleForm(editingArticle, false)
                ) : (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{article.title}</h3>
                    <p className="text-sm text-gray-500">
                      By {article.author} on {new Date(article.publish_date).toLocaleDateString()}
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingArticle({ ...article })}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteArticle(article.id)}>
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
