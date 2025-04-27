"use client"

import { createTheme } from "@mui/material/styles"
import { createContext, useState, useMemo, useEffect } from "react"

// color design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          main: "#FFD700", // Gold
          light: "#FFF59D",
          dark: "#FFC000",
          contrastText: "#000000",
        },
        secondary: {
          main: "#3b82f6", // Blue
          light: "#60a5fa",
          dark: "#2563eb",
          contrastText: "#FFFFFF",
        },
        background: {
          default: "#121212",
          paper: "#1A1A1A",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#AAAAAA",
        },
        error: {
          main: "#ef4444",
        },
        warning: {
          main: "#f59e0b",
        },
        info: {
          main: "#3b82f6",
        },
        success: {
          main: "#10b981",
        },
        divider: "#333333",
      }
    : {
        primary: {
          main: "#FFD700", // Gold
          light: "#FFF59D",
          dark: "#FFC000",
          contrastText: "#000000",
        },
        secondary: {
          main: "#3b82f6", // Blue
          light: "#60a5fa",
          dark: "#2563eb",
          contrastText: "#FFFFFF",
        },
        background: {
          default: "#f9fafb",
          paper: "#FFFFFF",
        },
        text: {
          primary: "#111827",
          secondary: "#4b5563",
        },
        error: {
          main: "#ef4444",
        },
        warning: {
          main: "#f59e0b",
        },
        info: {
          main: "#3b82f6",
        },
        success: {
          main: "#10b981",
        },
        divider: "#e5e7eb",
      }),
})

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode)
  return {
    palette: {
      mode: mode,
      ...colors,
    },
    typography: {
      fontFamily: "var(--font-geist-sans)",
      h1: {
        fontWeight: 800,
        fontSize: "3.5rem",
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: "3rem",
        lineHeight: 1.2,
      },
      h3: {
        fontWeight: 700,
        fontSize: "2.5rem",
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 700,
        fontSize: "2rem",
        lineHeight: 1.3,
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: "1.25rem",
        lineHeight: 1.4,
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: "1rem",
      },
      subtitle2: {
        fontWeight: 500,
        fontSize: "0.875rem",
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 28,
            padding: "8px 20px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            },
          },
          contained: {
            background: "linear-gradient(90deg, #FFD700 0%, #FFA500 100%)",
            color: "#000000",
            "&:hover": {
              background: "linear-gradient(90deg, #FFC000 0%, #FF9000 100%)",
            },
          },
          outlined: {
            borderColor: mode === "dark" ? "#333333" : "#e5e7eb",
            "&:hover": {
              borderColor: "#FFD700",
              backgroundColor: "rgba(255, 215, 0, 0.08)",
            },
          },
          text: {
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#1A1A1A" : "#FFFFFF",
            borderRadius: 16,
            boxShadow: mode === "dark" ? "0 4px 20px rgba(0, 0, 0, 0.15)" : "0 4px 20px rgba(0, 0, 0, 0.05)",
            border: `1px solid ${mode === "dark" ? "#333333" : "#e5e7eb"}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#1A1A1A" : "#FFFFFF",
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "rgba(18, 18, 18, 0.8)" : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            boxShadow: "none",
            borderBottom: `1px solid ${mode === "dark" ? "#333333" : "#e5e7eb"}`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              "& fieldset": {
                borderColor: mode === "dark" ? "#333333" : "#e5e7eb",
              },
              "&:hover fieldset": {
                borderColor: mode === "dark" ? "#555555" : "#d1d5db",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#FFD700",
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            backgroundColor: mode === "dark" ? "#1A1A1A" : "#FFFFFF",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#333333" : "#e5e7eb",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#AAAAAA" : "#4b5563",
            "&:hover": {
              backgroundColor: mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  }
}

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
})

export const useMode = () => {
  const [mode, setMode] = useState("light")

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode")
    if (savedMode) {
      setMode(savedMode)
    }
  }, [])

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const newMode = prev === "light" ? "dark" : "light"
          localStorage.setItem("themeMode", newMode)
          return newMode
        })
      },
    }),
    [],
  )

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  return [theme, colorMode]
}

export default useMode
