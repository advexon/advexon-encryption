"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export interface LogoSettings {
  logoSrc: string
  logoAlt: string
  logoWidth: number
  logoHeight: number
  showText: boolean
  updatedAt: string
}

interface LogoSettingsContextType {
  settings: LogoSettings
  isLoading: boolean
  error: string | null
  saveSettings: (settings: Omit<LogoSettings, "updatedAt">) => Promise<void>
  resetToDefaults: () => void
}

const defaultSettings: LogoSettings = {
  logoSrc: "/logo.png",
  logoAlt: "Fardo Encryption",
  logoWidth: 40,
  logoHeight: 40,
  showText: true,
  updatedAt: new Date().toISOString(),
}

const LogoSettingsContext = createContext<LogoSettingsContextType | undefined>(undefined)

export function LogoSettingsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [settings, setSettings] = useState<LogoSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch settings on initial load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/settings/logo")
        const data = await response.json()

        if (data.success && data.settings) {
          setSettings(data.settings)
        } else {
          throw new Error(data.error || "Failed to load logo settings")
        }
      } catch (err: any) {
        console.error("Error loading logo settings:", err)
        setError(err.message || "An error occurred while loading settings")
        // Use default settings on error
        setSettings(defaultSettings)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const saveSettings = async (newSettings: Omit<LogoSettings, "updatedAt">) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/settings/logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      })

      const data = await response.json()

      if (data.success && data.settings) {
        setSettings(data.settings)
        toast({
          title: "Settings Saved",
          description: "Logo configuration has been updated successfully.",
        })
      } else {
        throw new Error(data.error || "Failed to save logo settings")
      }
    } catch (err: any) {
      console.error("Error saving logo settings:", err)
      setError(err.message || "An error occurred while saving settings")
      toast({
        title: "Save Failed",
        description: err.message || "An error occurred while saving settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetToDefaults = () => {
    setSettings(defaultSettings)
  }

  return (
    <LogoSettingsContext.Provider value={{ settings, isLoading, error, saveSettings, resetToDefaults }}>
      {children}
    </LogoSettingsContext.Provider>
  )
}

export function useLogoSettings() {
  const context = useContext(LogoSettingsContext)
  if (context === undefined) {
    throw new Error("useLogoSettings must be used within a LogoSettingsProvider")
  }
  return context
}
