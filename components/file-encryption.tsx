"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { encryptFile, decryptFile, hashFile, generateKey } from "@/lib/crypto-utils"
import { KeyIcon, LockIcon, UnlockIcon, UploadIcon, DownloadIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FileEncryption() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [algorithm, setAlgorithm] = useState("AES-256")
  const [key, setKey] = useState("")
  const [mode, setMode] = useState("encrypt")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processedFile, setProcessedFile] = useState<{
    data: Blob
    name: string
  } | null>(null)
  const [showKey, setShowKey] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setProcessedFile(null)
      setError(null)
    }
  }

  const handleGenerateKey = async () => {
    try {
      const newKey = await generateKey(algorithm)
      setKey(newKey)
      toast({
        title: "Key Generated",
        description: "A new encryption key has been generated.",
      })
    } catch (err) {
      console.error("Key generation error:", err)
      setError("Failed to generate key. Please try again.")
    }
  }

  const updateProgress = (percent: number) => {
    setProgress(percent)
  }

  const handleProcess = async () => {
    if (!selectedFile) {
      setError("Please select a file to process")
      return
    }

    if (algorithm !== "SHA-256" && !key) {
      setError("Please enter or generate a key")
      return
    }

    setError(null)
    setLoading(true)
    setProgress(0)

    try {
      let result: Blob
      let fileName: string

      if (algorithm === "SHA-256") {
        // For SHA-256, we only hash (one-way)
        const hashResult = await hashFile(selectedFile, updateProgress)
        // Create a text blob with the hash
        result = new Blob([hashResult], { type: "text/plain" })
        fileName = `${selectedFile.name}.sha256`
      } else if (mode === "encrypt") {
        result = await encryptFile(selectedFile, key, algorithm, updateProgress)
        fileName = `${selectedFile.name}.encrypted`
      } else {
        result = await decryptFile(selectedFile, key, algorithm, updateProgress)
        // Remove .encrypted extension if present
        fileName = selectedFile.name.endsWith(".encrypted")
          ? selectedFile.name.slice(0, -10)
          : `decrypted-${selectedFile.name}`
      }

      setProcessedFile({ data: result, name: fileName })
      toast({
        title: "Processing Complete",
        description: `File has been ${algorithm === "SHA-256" ? "hashed" : mode === "encrypt" ? "encrypted" : "decrypted"} successfully.`,
      })
    } catch (err: any) {
      console.error("File processing error:", err)
      setError(err.message || "An error occurred during processing")
    } finally {
      setLoading(false)
      setProgress(100)
    }
  }

  const downloadFile = () => {
    if (processedFile) {
      const url = URL.createObjectURL(processedFile.data)
      const a = document.createElement("a")
      a.href = url
      a.download = processedFile.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
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

      {algorithm !== "SHA-256" && (
        <Tabs defaultValue="encrypt" value={mode} onValueChange={setMode}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="space-y-2">
        <Label htmlFor="file">Select File</Label>
        <div className="grid grid-cols-1 gap-2">
          <Input ref={fileInputRef} id="file" type="file" onChange={handleFileChange} className="hidden" />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-24 border-dashed border-2 border-gray-700 bg-gray-900"
          >
            <div className="flex flex-col items-center justify-center text-gray-400">
              <UploadIcon className="h-8 w-8 mb-2" />
              {selectedFile ? (
                <span className="text-sm">{selectedFile.name}</span>
              ) : (
                <span>Click to select a file</span>
              )}
            </div>
          </Button>
        </div>
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

      <Button onClick={handleProcess} disabled={loading || !selectedFile} className="w-full">
        {loading ? (
          "Processing..."
        ) : (
          <>
            {algorithm === "SHA-256" ? (
              <>Hash File</>
            ) : mode === "encrypt" ? (
              <>
                <LockIcon className="mr-2 h-4 w-4" /> Encrypt File
              </>
            ) : (
              <>
                <UnlockIcon className="mr-2 h-4 w-4" /> Decrypt File
              </>
            )}
          </>
        )}
      </Button>

      {loading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Processing file...</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {processedFile && (
        <Button onClick={downloadFile} variant="default" className="w-full">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Download {algorithm === "SHA-256" ? "Hash" : mode === "encrypt" ? "Encrypted" : "Decrypted"} File
        </Button>
      )}
    </div>
  )
}
