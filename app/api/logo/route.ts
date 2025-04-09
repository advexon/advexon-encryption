import { NextResponse } from "next/server"

// This is a simple API route that generates a placeholder SVG logo
// You can replace this with your actual logo file
export async function GET() {
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#6366F1"/>
      <path d="M12 20H28M20 12V28" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  })
}
