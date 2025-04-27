"use client"

import { useState, useContext } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip,
  Container,
} from "@mui/material"
import {
  Lightbulb as LightbulbIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  ViewModule as ViewModuleIcon,
  Psychology as PsychologyIcon,
  Quiz as QuizIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Translate as TranslateIcon,
  Timer as TimerIcon,
} from "@mui/icons-material"
import { UserButton } from "@clerk/nextjs"
import { ColorModeContext } from "../../app/theme"

export default function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const theme = useTheme()
  const colorMode = useContext(ColorModeContext)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [language, setLanguage] = useState("en") // Default language is English
  const [anchorEl, setAnchorEl] = useState(null)

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleNavigation = (path) => {
    router.push(path)
    if (drawerOpen) setDrawerOpen(false)
  }

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ur" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("preferredLanguage", newLanguage)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const drawer = (
    <Box sx={{ width: 250, bgcolor: "background.paper", height: "100%" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <LightbulbIcon sx={{ color: "primary.main", mr: 1 }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #FFD700, #FFA500)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          FlashMind
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: "divider" }} />
      <List>
        <ListItem button onClick={() => handleNavigation("/")} selected={router.pathname === "/"}>
          <ListItemIcon>
            <HomeIcon sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        {isLoaded && isSignedIn && (
          <>
            <ListItem
              button
              onClick={() => handleNavigation("/flashcards")}
              selected={router.pathname === "/flashcards"}
            >
              <ListItemIcon>
                <ViewModuleIcon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText primary="My Library" />
            </ListItem>
            <ListItem
              button
              onClick={() => handleNavigation("/generate-cards")}
              selected={router.pathname === "/generate-cards"}
            >
              <ListItemIcon>
                <PsychologyIcon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText primary="Create Cards" />
            </ListItem>
            <ListItem
              button
              onClick={() => handleNavigation("/generate-quiz")}
              selected={router.pathname === "/generate-quiz"}
            >
              <ListItemIcon>
                <QuizIcon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText primary="Create Quiz" />
            </ListItem>
          </>
        )}
      </List>
      <Divider sx={{ bgcolor: "divider" }} />
      <List>
        <ListItem button onClick={colorMode.toggleColorMode}>
          <ListItemIcon>
            {theme.palette.mode === "dark" ? (
              <LightModeIcon sx={{ color: "primary.main" }} />
            ) : (
              <DarkModeIcon sx={{ color: "primary.main" }} />
            )}
          </ListItemIcon>
          <ListItemText primary={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"} />
        </ListItem>
        <ListItem button onClick={toggleLanguage}>
          <ListItemIcon>
            <TranslateIcon sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <ListItemText primary={language === "en" ? "Switch to Urdu" : "Switch to English"} />
        </ListItem>
      </List>
      {!isSignedIn && (
        <>
          <Divider sx={{ bgcolor: "divider" }} />
          <List>
            <ListItem button onClick={() => handleNavigation("/sign-in")}>
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/sign-up")}>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </List>
        </>
      )}
    </Box>
  )

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: theme.palette.mode === "dark" ? "rgba(18, 18, 18, 0.8)" : "rgba(255, 255, 255, 0.8)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => handleNavigation("/")}
            >
              <LightbulbIcon sx={{ color: "primary.main", mr: 1, fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #FFD700, #FFA500)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                FlashMind
              </Typography>
            </Box>

            {!isMobile && isLoaded && isSignedIn && (
              <Box sx={{ ml: 4, display: "flex", gap: 1 }}>
                <Button
                  color="inherit"
                  startIcon={<ViewModuleIcon />}
                  onClick={() => handleNavigation("/flashcards")}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    bgcolor: router.pathname === "/flashcards" ? "action.selected" : "transparent",
                  }}
                >
                  My Library
                </Button>
                <Button
                  color="inherit"
                  startIcon={<PsychologyIcon />}
                  onClick={() => handleNavigation("/generate-cards")}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    bgcolor: router.pathname === "/generate-cards" ? "action.selected" : "transparent",
                  }}
                >
                  Create Cards
                </Button>
                <Button
                  color="inherit"
                  startIcon={<QuizIcon />}
                  onClick={() => handleNavigation("/generate-quiz")}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    bgcolor: router.pathname === "/generate-quiz" ? "action.selected" : "transparent",
                  }}
                >
                  Create Quiz
                </Button>
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            {/* Theme Toggle Button */}
            <Tooltip title={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}>
              <IconButton
                onClick={colorMode.toggleColorMode}
                sx={{
                  color: "text.primary",
                  bgcolor: "action.hover",
                  mr: 1,
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Language Toggle Button */}
            <Tooltip title={language === "en" ? "Switch to Urdu" : "Switch to English"}>
              <IconButton
                onClick={toggleLanguage}
                sx={{
                  color: "text.primary",
                  bgcolor: "action.hover",
                  mr: 1,
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                <TranslateIcon />
              </IconButton>
            </Tooltip>

            {isLoaded && isSignedIn ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Pomodoro Timer">
                  <IconButton
                    onClick={() => handleNavigation("/timer")}
                    sx={{
                      color: "text.primary",
                      bgcolor: "action.hover",
                      mr: 2,
                      "&:hover": { bgcolor: "action.selected" },
                    }}
                  >
                    <TimerIcon />
                  </IconButton>
                </Tooltip>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: {
                        width: 36,
                        height: 36,
                      },
                    },
                  }}
                />
              </Box>
            ) : (
              !isMobile && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="outlined" onClick={() => handleNavigation("/sign-in")} sx={{ borderRadius: 2 }}>
                    Sign In
                  </Button>
                  <Button variant="contained" onClick={() => handleNavigation("/sign-up")} sx={{ borderRadius: 2 }}>
                    Sign Up
                  </Button>
                </Box>
              )
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        {drawer}
      </Drawer>
      <Toolbar /> {/* Empty toolbar to push content below the AppBar */}
    </>
  )
}
