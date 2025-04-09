"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Header } from "@/components/header"
import { ArrowLeft, Upload, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useLogoSettings } from "@/contexts/logo-settings-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LogoSettings() {
  const { settings, isLoading, error, saveSettings, resetToDefaults } = useLogoSettings()

  const [logoSrc, setLogoSrc] = useState<string>(settings.logoSrc)
  const [logoAlt, setLogoAlt] = useState<string>(settings.logoAlt)
  const [logoWidth, setLogoWidth] = useState<number>(settings.logoWidth)
  const [logoHeight, setLogoHeight] = useState<number>(settings.logoHeight)
  const [showText, setShowText] = useState<boolean>(settings.showText)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Update local state when settings from context change
  useEffect(() => {
    if (!isLoading) {
      setLogoSrc(settings.logoSrc)
      setLogoAlt(settings.logoAlt)
      setLogoWidth(settings.logoWidth)
      setLogoHeight(settings.logoHeight)
      setShowText(settings.showText)
      setHasChanges(false)
    }
  }, [settings, isLoading])

  // Check for changes
  useEffect(() => {
    const changed =
      logoSrc !== settings.logoSrc ||
      logoAlt !== settings.logoAlt ||
      logoWidth !== settings.logoWidth ||
      logoHeight !== settings.logoHeight ||
      showText !== settings.showText

    setHasChanges(changed)
  }, [logoSrc, logoAlt, logoWidth, logoHeight, showText, settings])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string
          setLogoPreview(result)
          setLogoSrc(result) // Also update the actual source
          setHasChanges(true)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveConfiguration = async () => {
    setIsSaving(true)
    try {
      await saveSettings({
        logoSrc: logoPreview || logoSrc,
        logoAlt,
        logoWidth,
        logoHeight,
        showText,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetDefaults = () => {
    resetToDefaults()
    setLogoPreview(null)
  }

  return (
    <>
      <Header logoSrc={logoPreview || logoSrc} logoAlt={logoAlt} logoWidth={logoWidth} logoHeight={logoHeight} />
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Encryption App
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">Logo Settings</h1>

          {isLoading ? (
            <div className="text-center py-8">Loading settings...</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="bg-gray-950 border-gray-800">
                <CardHeader>
                  <CardTitle>Logo Configuration</CardTitle>
                  <CardDescription>Customize how your logo appears in the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="logo-upload">Upload Logo</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("logo-upload")?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Recommended size: 40x40px. Supports PNG, JPG, SVG.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo-alt">Alt Text</Label>
                    <Input
                      id="logo-alt"
                      value={logoAlt}
                      onChange={(e) => {
                        setLogoAlt(e.target.value)
                        setHasChanges(true)
                      }}
                      className="bg-gray-900 border-gray-800"
                    />
                    <p className="text-xs text-gray-500">Descriptive text for screen readers and accessibility.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="logo-width" className="mb-2 block">
                        Logo Width: {logoWidth}px
                      </Label>
                      <Slider
                        id="logo-width"
                        min={20}
                        max={100}
                        step={1}
                        value={[logoWidth]}
                        onValueChange={(value) => {
                          setLogoWidth(value[0])
                          setHasChanges(true)
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="logo-height" className="mb-2 block">
                        Logo Height: {logoHeight}px
                      </Label>
                      <Slider
                        id="logo-height"
                        min={20}
                        max={100}
                        step={1}
                        value={[logoHeight]}
                        onValueChange={(value) => {
                          setLogoHeight(value[0])
                          setHasChanges(true)
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-text"
                      checked={showText}
                      onCheckedChange={(checked) => {
                        setShowText(checked)
                        setHasChanges(true)
                      }}
                    />
                    <Label htmlFor="show-text">Show Brand Text</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-800 pt-6">
                  <Button variant="outline" onClick={handleResetDefaults} disabled={isSaving}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset to Defaults
                  </Button>
                  <Button onClick={handleSaveConfiguration} disabled={isSaving || !hasChanges}>
                    {isSaving ? "Saving..." : "Save Configuration"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-gray-950 border-gray-800">
                <CardHeader>
                  <CardTitle>Logo Preview</CardTitle>
                  <CardDescription>See how your logo will appear in the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border border-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Header Preview</h3>
                    <div className="h-16 bg-gray-950 border border-gray-800 rounded-md flex items-center px-4">
                      <Logo
                        src={logoPreview || logoSrc}
                        alt={logoAlt}
                        width={logoWidth}
                        height={logoHeight}
                        showText={showText}
                      />
                    </div>
                  </div>

                  <div className="p-4 border border-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Light Background</h3>
                    <div className="h-16 bg-white rounded-md flex items-center px-4">
                      <Logo
                        src={logoPreview || logoSrc}
                        alt={logoAlt}
                        width={logoWidth}
                        height={logoHeight}
                        showText={showText}
                        variant="dark"
                        textClassName="text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="p-4 border border-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Dark Background</h3>
                    <div className="h-16 bg-gray-900 rounded-md flex items-center px-4">
                      <Logo
                        src={logoPreview || logoSrc}
                        alt={logoAlt}
                        width={logoWidth}
                        height={logoHeight}
                        showText={showText}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
