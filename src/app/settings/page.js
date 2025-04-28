"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useTheme } from "@mui/material"

export default function SettingsPage({ darkMode, toggleDarkMode }) {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const theme = useTheme()
  
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    notifications: {
      enabled: true,
      studyReminders: true,
      dueCards: true,
      groupUpdates: true,
    },
    appearance: {
      darkMode: darkMode,
      fontSize: "medium",
      language: "en",
    },
    privacy: {
      shareActivity: false,
      publicProfile: false,
    },
    data: {
      autoSync: true,
      offlineMode: false,
    }
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  
  // Check if we're in preview mode
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsPreviewMode(true)
        setLoading(false)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLoaded])
  
  // Fetch settings when user is loaded
  useEffect(() => {
    if (isLoaded && isSignedIn && !isPreviewMode\
