"use client"

import { createTheme } from "@mui/material/styles"

// Create a theme instance for light mode
export const lightTheme = createTheme({
  palette: {
    mode: "light",
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
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
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
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
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
          borderColor: "#e5e7eb",
          "&:hover": {
            borderColor: "#FFD700",
            backgroundColor: "rgba(255, 215, 0, 0.08)",
          },
        },
        text: {
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: "1px solid #f3f4f6",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          borderBottom: "1px solid #f3f4f6",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            "& fieldset": {
              borderColor: "#e5e7eb",
            },
            "&:hover fieldset": {
              borderColor: "#d1d5db",
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
          backgroundColor: "#FFFFFF",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#f3f4f6",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#4b5563",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
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
})

// Create a theme instance for dark mode
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
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
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
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
          borderColor: "#333333",
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
          backgroundColor: "#1A1A1A",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          border: "1px solid #333333",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1A1A1A",
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(18, 18, 18, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          borderBottom: "1px solid #333333",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            "& fieldset": {
              borderColor: "#333333",
            },
            "&:hover fieldset": {
              borderColor: "#555555",
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
          backgroundColor: "#1A1A1A",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#333333",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#AAAAAA",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
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
})

export default function getTheme(mode) {
  return mode === "dark" ? darkTheme : lightTheme
}
