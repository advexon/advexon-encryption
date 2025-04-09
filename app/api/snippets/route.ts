import { type NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { redis, SNIPPET_TTL } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const { encryptedText, algorithm } = await request.json()

    if (!encryptedText) {
      return NextResponse.json({ error: "Encrypted text is required" }, { status: 400 })
    }

    // Generate a unique ID for the snippet
    const snippetId = nanoid(10)

    // Store the encrypted text in Redis with TTL
    await redis.set(
      `snippet:${snippetId}`,
      {
        encryptedText,
        algorithm,
        createdAt: new Date().toISOString(),
      },
      { ex: SNIPPET_TTL },
    )

    return NextResponse.json({
      success: true,
      snippetId,
      expiresIn: SNIPPET_TTL,
    })
  } catch (error) {
    console.error("Error saving snippet:", error)
    return NextResponse.json({ error: "Failed to save encrypted text" }, { status: 500 })
  }
}
