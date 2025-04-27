"use client"

import type React from "react"

import { ThemeProvider, CssBaseline } from "@mui/material"
import { ColorModeContext, useMode } from "../app/theme"

export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [theme, colorMode] = useMode()

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
