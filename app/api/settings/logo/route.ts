import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

// Redis key for logo settings
const LOGO_SETTINGS_KEY = "settings:logo"

// Define the logo settings type
export interface LogoSettings {
  logoSrc: string
  logoAlt: string
  logoWidth: number
  logoHeight: number
  showText: boolean
  updatedAt: string
}

export async function GET() {
  try {
    // Retrieve logo settings from Redis
    const settings = await redis.get<LogoSettings>(LOGO_SETTINGS_KEY)

    // If no settings exist, return default settings
    if (!settings) {
      return NextResponse.json({
        success: true,
        settings: {
          logoSrc: "/logo.png",
          logoAlt: "Fardo Encryption",
          logoWidth: 40,
          logoHeight: 40,
          showText: true,
          updatedAt: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error("Error retrieving logo settings:", error)
    return NextResponse.json({ error: "Failed to retrieve logo settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { logoSrc, logoAlt, logoWidth, logoHeight, showText } = body

    // Validate required fields
    if (logoAlt === undefined || logoWidth === undefined || logoHeight === undefined || showText === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create settings object
    const settings: LogoSettings = {
      logoSrc: logoSrc || "/logo.png",
      logoAlt,
      logoWidth,
      logoHeight,
      showText,
      updatedAt: new Date().toISOString(),
    }

    // Save settings to Redis
    await redis.set(LOGO_SETTINGS_KEY, settings)

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error("Error saving logo settings:", error)
    return NextResponse.json({ error: "Failed to save logo settings" }, { status: 500 })
  }
}
