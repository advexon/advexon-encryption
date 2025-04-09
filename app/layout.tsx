import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LogoSettingsProvider } from "@/contexts/logo-settings-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fardo Encryption - Secure File & Text Encryption",
  description: "Encrypt and decrypt your files and text securely in your browser",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LogoSettingsProvider>{children}</LogoSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'