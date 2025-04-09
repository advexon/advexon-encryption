"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SharePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [snippet, setSnippet] = useState<any>(null)

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const snippetId = params.id
        if (!snippetId) {
          throw new Error("Invalid snippet ID")
        }

        const response = await fetch(`/api/snippets/${snippetId}`)
        const data = await response.json()

        if (data.success && data.snippet) {
          setSnippet(data.snippet)
        } else {
          throw new Error(data.error || "Failed to retrieve snippet")
        }
      } catch (err: any) {
        console.error("Error fetching snippet:", err)
        setError(err.message || "An error occurred while retrieving the snippet")
      } finally {
        setLoading(false)
      }
    }

    fetchSnippet()
  }, [params.id])

  const handleDecrypt = () => {
    // Navigate to the main page with the encrypted text loaded
    router.push(`/?mode=decrypt&algorithm=${snippet.algorithm}&text=${encodeURIComponent(snippet.encryptedText)}`)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Encryption App
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle>Shared Encrypted Text</CardTitle>
                <CardDescription>
                  This text was encrypted and shared with you. You'll need the encryption key to decrypt it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="text-center py-8">Loading shared content...</div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Encryption Algorithm:</p>
                      <p className="font-medium">{snippet.algorithm}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Created:</p>
                      <p className="font-medium">{new Date(snippet.createdAt).toLocaleString()}</p>
                    </div>
                    <Button onClick={handleDecrypt} className="w-full">
                      Decrypt This Content
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      You'll be redirected to the decryption tool where you can enter the encryption key.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
