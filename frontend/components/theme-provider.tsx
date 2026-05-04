"use client"

import { useEffect, useState } from "react"
import { fetchSettings } from "@/lib/api"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    applyTheme()
  }, [])

  const applyTheme = async () => {
    // Check localStorage first (instant, no flicker)
    const cached = localStorage.getItem("ticked_dark_mode")
    if (cached === "true") {
      document.documentElement.classList.add("dark")
    } else if (cached === "false") {
      document.documentElement.classList.remove("dark")
    }

    // Then verify with backend (in case settings changed elsewhere)
    const token = localStorage.getItem("ticked_token")
    if (!token) return

    try {
      const settings = await fetchSettings()
      const isDark = settings.dark_mode

      // Update localStorage cache
      localStorage.setItem("ticked_dark_mode", String(isDark))

      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } catch {
      // Not logged in or error — leave as is
    }
  }

  if (!mounted) return null
  return <>{children}</>
}