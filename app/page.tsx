"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import EncryptionApp from "@/components/encryption-app"
import { Header } from "@/components/header"

export default function Home() {
  const searchParams = useSearchParams()
  const [sharedParams, setSharedParams] = useState<{
    mode?: string
    algorithm?: string
    text?: string
  } | null>(null)

  useEffect(() => {
    // Check if we have parameters from a shared snippet
    const mode = searchParams.get("mode")
    const algorithm = searchParams.get("algorithm")
    const text = searchParams.get("text")

    if (mode && algorithm && text) {
      setSharedParams({
        mode,
        algorithm,
        text: decodeURIComponent(text),
      })
    }
  }, [searchParams])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-2">Fardo Encryption</h1>
          <p className="text-center text-gray-400 mb-8">Secure file & text encryption in your browser</p>
          <EncryptionApp sharedParams={sharedParams} />
        </div>
      </main>
    </>
  )
}
