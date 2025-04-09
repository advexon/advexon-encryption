"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { encryptText, decryptText, hashText, generateKey } from "@/lib/crypto-utils"
import { CopyIcon, KeyIcon, LockIcon, UnlockIcon, EyeIcon, EyeOffIcon, Share2Icon, LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TextEncryptionProps {
  sharedParams?: {
    mode?: string
    algorithm?: string
    text?: string
  } | null
}

export default function TextEncryption({ sharedParams }: TextEncryptionProps) {
  const { toast } = useToast()
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [algorithm, setAlgorithm] = useState("AES-256")
  const [key, setKey] = useState("")
  const [mode, setMode] = useState("encrypt")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const [retrieveDialogOpen, setRetrieveDialogOpen] = useState(false)
  const [snippetId, setSnippetId] = useState("")
  const [retrieveLoading, setRetrieveLoading] = useState(false)

  useEffect(() => {
    if (sharedParams?.text && sharedParams?.algorithm && sharedParams?.mode) {
      setInputText(sharedParams.text)
      setAlgorithm(sharedParams.algorithm)
      setMode(sharedParams.mode)

      toast({
        title: "Shared Content Loaded",
        description: "Enter the encryption key to decrypt this shared content.",
      })
    }
  }, [sharedParams])

  const handleGenerateKey = async () => {
    try {
      const newKey = await generateKey(algorithm)
      setKey(newKey)
      toast({
        title: "Key Generated",
        description: "A new encryption key has been generated.",
      })
    } catch (err) {
      setError("Failed to generate key. Please try again.")
      console.error("Key generation error:", err)
    }
  }

  const handleProcess = async () => {
    if (!inputText) {
      setError("Please enter text to process")
      return
    }

    if (algorithm !== "SHA-256" && !key) {
      setError("Please enter or generate a key")
      return
    }

    setError(null)
    setLoading(true)

    try {
      let result = ""

      if (algorithm === "SHA-256") {
        // For SHA-256, we only hash (one-way)
        result = await hashText(inputText)
      } else if (mode === "encrypt") {
        result = await encryptText(inputText, key, algorithm)
      } else {
        result = await decryptText(inputText, key, algorithm)
      }

      setOutputText(result)
    } catch (err: any) {
      console.error("Processing error:", err)
      setError(err.message || "An error occurred during processing")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    })
  }

  const handleShareEncrypted = async () => {
    if (!outputText || mode !== "encrypt") {
      toast({
        title: "Cannot share",
        description: "Please encrypt some text first.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encryptedText: outputText,
          algorithm,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Create a shareable link
        const baseUrl = window.location.origin
        const link = `${baseUrl}/share/${data.snippetId}`
        setShareLink(link)
        setShareDialogOpen(true)
      } else {
        throw new Error(data.error || "Failed to share encrypted text")
      }
    } catch (err: any) {
      console.error("Sharing error:", err)
      toast({
        title: "Sharing failed",
        description: err.message || "An error occurred while sharing.",
        variant: "destructive",
      })
    }
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink)
    setShareLinkCopied(true)
    setTimeout(() => setShareLinkCopied(false), 2000)
  }

  const handleRetrieveSnippet = async () => {
    if (!snippetId) {
      toast({
        title: "ID Required",
        description: "Please enter a snippet ID.",
        variant: "destructive",
      })
      return
    }

    setRetrieveLoading(true)
    try {
      const response = await fetch(`/api/snippets/${snippetId}`)
      const data = await response.json()

      if (data.success && data.snippet) {
        setInputText(data.snippet.encryptedText)
        setAlgorithm(data.snippet.algorithm)
        setMode("decrypt")
        setRetrieveDialogOpen(false)
        toast({
          title: "Snippet Retrieved",
          description: "The encrypted text has been loaded. Enter the key to decrypt it.",
        })
      } else {
        throw new Error(data.error || "Snippet not found or expired")
      }
    } catch (err: any) {
      console.error("Retrieval error:", err)
      toast({
        title: "Retrieval failed",
        description: err.message || "An error occurred while retrieving the snippet.",
        variant: "destructive",
      })
    } finally {
      setRetrieveLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Label htmlFor="algorithm">Encryption Algorithm</Label>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger>
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AES-256">AES-256 (Symmetric)</SelectItem>
              <SelectItem value="RSA">RSA (Asymmetric)</SelectItem>
              <SelectItem value="SHA-256">SHA-256 (Hash only)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setRetrieveDialogOpen(true)} className="text-xs">
            <LinkIcon className="mr-1 h-3 w-3" /> Retrieve Shared
          </Button>
        </div>
      </div>

      {algorithm !== "SHA-256" && (
        <Tabs defaultValue="encrypt" value={mode} onValueChange={setMode}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="space-y-2">
        <Label htmlFor="inputText">
          {algorithm === "SHA-256" ? "Text to Hash" : mode === "encrypt" ? "Text to Encrypt" : "Text to Decrypt"}
        </Label>
        <Textarea
          id="inputText"
          placeholder={`Enter text to ${algorithm === "SHA-256" ? "hash" : mode}`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[120px] bg-gray-900 border-gray-800"
        />
      </div>

      {algorithm !== "SHA-256" && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="key">Encryption Key</Label>
            <Button variant="outline" size="sm" onClick={handleGenerateKey} className="text-xs">
              <KeyIcon className="mr-1 h-3 w-3" /> Generate Key
            </Button>
          </div>
          <div className="relative">
            <Input
              id="key"
              type={showKey ? "text" : "password"}
              placeholder="Enter or generate an encryption key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="bg-gray-900 border-gray-800 pr-10"
              aria-describedby="key-visibility-toggle"
            />
            {key && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? "Hide encryption key" : "Show encryption key"}
                id="key-visibility-toggle"
              >
                {showKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </Button>
            )}
          </div>
          {key && (
            <p className="text-xs text-gray-500 mt-1">
              {showKey
                ? "Key is visible. Click the eye icon to hide it."
                : "Key is hidden. Click the eye icon to view it."}
            </p>
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleProcess} disabled={loading} className="w-full">
        {loading ? (
          "Processing..."
        ) : (
          <>
            {algorithm === "SHA-256" ? (
              <>Hash Text</>
            ) : mode === "encrypt" ? (
              <>
                <LockIcon className="mr-2 h-4 w-4" /> Encrypt Text
              </>
            ) : (
              <>
                <UnlockIcon className="mr-2 h-4 w-4" /> Decrypt Text
              </>
            )}
          </>
        )}
      </Button>

      {outputText && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="outputText">Result</Label>
            <div className="flex gap-2">
              {mode === "encrypt" && algorithm !== "SHA-256" && (
                <Button variant="outline" size="sm" onClick={handleShareEncrypted} className="text-xs">
                  <Share2Icon className="mr-1 h-3 w-3" /> Share
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-xs">
                <CopyIcon className="mr-1 h-3 w-3" /> Copy
              </Button>
            </div>
          </div>
          <Textarea id="outputText" value={outputText} readOnly className="min-h-[120px] bg-gray-900 border-gray-800" />
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-gray-950 border-gray-800">
          <DialogHeader>
            <DialogTitle>Share Encrypted Text</DialogTitle>
            <DialogDescription>
              Anyone with this link can access your encrypted text, but they'll need the encryption key to decrypt it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={shareLink} readOnly className="bg-gray-900 border-gray-800" />
            <Button size="sm" onClick={copyShareLink}>
              {shareLinkCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            The link will expire after 7 days. Make sure to share the encryption key separately through a secure
            channel.
          </p>
          <DialogFooter>
            <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Retrieve Dialog */}
      <Dialog open={retrieveDialogOpen} onOpenChange={setRetrieveDialogOpen}>
        <DialogContent className="bg-gray-950 border-gray-800">
          <DialogHeader>
            <DialogTitle>Retrieve Shared Text</DialogTitle>
            <DialogDescription>
              Enter the snippet ID or paste the full URL to retrieve the encrypted text.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="snippetId">Snippet ID or URL</Label>
              <Input
                id="snippetId"
                placeholder="Enter ID or paste full URL"
                value={snippetId}
                onChange={(e) => {
                  // Extract ID if full URL is pasted
                  const input = e.target.value
                  if (input.includes("/share/")) {
                    const id = input.split("/share/")[1]
                    setSnippetId(id)
                  } else {
                    setSnippetId(input)
                  }
                }}
                className="bg-gray-900 border-gray-800"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRetrieveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRetrieveSnippet} disabled={retrieveLoading}>
              {retrieveLoading ? "Retrieving..." : "Retrieve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
