import { type NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const snippetId = params.id

    if (!snippetId) {
      return NextResponse.json({ error: "Snippet ID is required" }, { status: 400 })
    }

    // Retrieve the encrypted text from Redis
    const snippet = await redis.get(`snippet:${snippetId}`)

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found or expired" }, { status: 404 })
    }

    return NextResponse.json({ success: true, snippet })
  } catch (error) {
    console.error("Error retrieving snippet:", error)
    return NextResponse.json({ error: "Failed to retrieve encrypted text" }, { status: 500 })
  }
}
