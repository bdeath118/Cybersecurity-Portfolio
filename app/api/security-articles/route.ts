import { type NextRequest, NextResponse } from "next/server"
import { readData, writeData } from "@/lib/data"
import type { SecurityArticle } from "@/lib/types"

export async function GET() {
  try {
    const articles = await readData<SecurityArticle[]>("security-articles.json", [])
    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching security articles:", error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newArticle: SecurityArticle = await request.json()
    const articles = await readData<SecurityArticle[]>("security-articles.json", [])

    articles.push(newArticle)
    await writeData("security-articles.json", articles)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding security article:", error)
    return NextResponse.json({ error: "Failed to add article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const articles = await readData<SecurityArticle[]>("security-articles.json", [])

    const updatedArticles = articles.filter((article) => article.id !== id)
    await writeData("security-articles.json", updatedArticles)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting security article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
