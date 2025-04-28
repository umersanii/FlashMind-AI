"use client"

import React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { useState, useEffect } from "react"
import { lightTheme, darkTheme } from "../utils/theme"
import "./globals.css"

// Your Clerk API key (replace with your actual key)
const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API

export default function ClientLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // After mounting, we have access to the client's preferences
  useEffect(() => {
    setMounted(true)
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode !== null) {
      setDarkMode(savedMode === "true")
    } else {
      // Check user's system preference
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      setDarkMode(prefersDarkMode)
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("darkMode", String(newMode))
  }

  // Use the appropriate theme based on dark mode setting
  const theme = darkMode ? darkTheme : lightTheme

  // Avoid rendering with the wrong theme
  if (!mounted) {
    return null
  }

  return (
    <ClerkProvider frontendApi={clerkFrontendApi}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {React.cloneElement(children, { darkMode, toggleDarkMode })}
      </ThemeProvider>
    </ClerkProvider>
  )
}
