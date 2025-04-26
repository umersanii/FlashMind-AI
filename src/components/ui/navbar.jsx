"use client"

import { useState } from "react"
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
} from "@mui/material"
import {
  Lightbulb as LightbulbIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  ViewModule as ViewModuleIcon,
  Psychology as PsychologyIcon,
  Quiz as QuizIcon,
} from "@mui/icons-material"
import { UserButton } from "@clerk/nextjs"

export default function Navbar() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleNavigation = (path) => {
    router.push(path)
    if (drawerOpen) setDrawerOpen(false)
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
        <ListItem button onClick={() => handleNavigation("/")}>
          <ListItemIcon>
            <HomeIcon sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        {isLoaded && isSignedIn && (
          <>
            <ListItem button onClick={() => handleNavigation("/flashcards")}>
              <ListItemIcon>
                <ViewModuleIcon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText primary="My Library" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/generate-cards")}>
              <ListItemIcon>
                <PsychologyIcon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText primary="Create Cards" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/generate-quiz")}>
              <ListItemIcon>
                <QuizIcon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText primary="Create Quiz" />
            </ListItem>
          </>
        )}
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
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
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
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => handleNavigation("/")}>
            <LightbulbIcon sx={{ color: "background-default", mr: 1, fontSize: 28 }} />
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
            <Box sx={{ ml: 4, display: "flex", gap: 2 }}>
              <Button color="inherit" startIcon={<ViewModuleIcon />} onClick={() => handleNavigation("/flashcards")}>
                My Library
              </Button>
              <Button
                color="inherit"
                startIcon={<PsychologyIcon />}
                onClick={() => handleNavigation("/generate-cards")}
              >
                Create Cards
              </Button>
              <Button color="inherit" startIcon={<QuizIcon />} onClick={() => handleNavigation("/generate-quiz")}>
                Create Quiz
              </Button>
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {isLoaded && isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            !isMobile && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button color="inherit" onClick={() => handleNavigation("/sign-in")}>
                  Sign In
                </Button>
                <Button variant="contained" onClick={() => handleNavigation("/sign-up")}>
                  Sign Up
                </Button>
              </Box>
            )
          )}
        </Toolbar>
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
