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
  Switch,
  FormControlLabel,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  styled,
} from "@mui/material"
import {
  Lightbulb as LightbulbIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  ViewModule as ViewModuleIcon,
  Psychology as PsychologyIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Quiz as QuizIcon,
  Leaderboard as LeaderboardIcon,
  Group as GroupIcon,
} from "@mui/icons-material"
import { UserButton } from "@clerk/nextjs"

// Styled components
const GradientText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: "linear-gradient(45deg, #FFD700, #FFA500)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}))

export default function Navbar({ darkMode, toggleDarkMode }) {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null)
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "You have 5 flashcards due for review today", read: false },
    { id: 2, message: "You've maintained a 3-day study streak!", read: false },
    { id: 3, message: "New quiz available in your Biology deck", read: true },
  ])

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleNavigation = (path) => {
    router.push(path)
    if (drawerOpen) setDrawerOpen(false)
  }

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget)
  }

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null)
    // Mark all as read
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const handleUserMenuClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null)
  }

  const unreadNotifications = notifications.filter((notif) => !notif.read).length

  const drawer = (
    <Box sx={{ width: 250, bgcolor: "background.paper", height: "100%" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <LightbulbIcon sx={{ color: "primary.main", mr: 1 }} />
        <GradientText variant="h6">FlashMind</GradientText>
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
            <ListItem button onClick={() => handleNavigation("/quiz")}>
              <ListItemIcon>
                <QuizIcon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText primary="Quiz Mode" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/stats")}>
              <ListItemIcon>
                <LeaderboardIcon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText primary="My Stats" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/groups")}>
              <ListItemIcon>
                <GroupIcon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText primary="Study Groups" />
            </ListItem>
          </>
        )}
      </List>
      <Divider sx={{ bgcolor: "divider" }} />
      <List>
        <ListItem>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={toggleDarkMode} color="primary" />}
            label={darkMode ? "Dark Mode" : "Light Mode"}
          />
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
      <AppBar position="fixed" elevation={0} color="inherit">
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
            <LightbulbIcon sx={{ color: "primary.main", mr: 1, fontSize: 28 }} />
            <GradientText variant="h6">FlashMind</GradientText>
          </Box>

          {!isMobile && isLoaded && isSignedIn && (
            <Box sx={{ ml: 4, display: "flex", gap: 2 }}>
              <Button color="inherit" onClick={() => handleNavigation("/flashcards")}>
                My Library
              </Button>
              <Button color="inherit" onClick={() => handleNavigation("/generate-cards")}>
                Create Cards
              </Button>
              <Button color="inherit" onClick={() => handleNavigation("/quiz")}>
                Quiz Mode
              </Button>
              <Button color="inherit" onClick={() => handleNavigation("/stats")}>
                Stats
              </Button>
              <Button color="inherit" onClick={() => handleNavigation("/groups")}>
                Groups
              </Button>
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Dark Mode Toggle */}
          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton color="inherit" onClick={toggleDarkMode} sx={{ mr: 1 }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {isLoaded && isSignedIn ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={handleNotificationsClick} sx={{ mr: 1 }}>
                  <Badge badgeContent={unreadNotifications} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={notificationsAnchorEl}
                open={Boolean(notificationsAnchorEl)}
                onClose={handleNotificationsClose}
                PaperProps={{
                  sx: { width: 320, maxHeight: 400, mt: 1.5 },
                }}
              >
                <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Notifications
                  </Typography>
                </Box>
                {notifications.length === 0 ? (
                  <MenuItem>
                    <Typography variant="body2">No notifications</Typography>
                  </MenuItem>
                ) : (
                  notifications.map((notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={handleNotificationsClose}
                      sx={{
                        py: 1.5,
                        borderLeft: notification.read ? 0 : 3,
                        borderColor: "primary.main",
                        bgcolor: notification.read ? "transparent" : "action.hover",
                      }}
                    >
                      <Typography variant="body2">{notification.message}</Typography>
                    </MenuItem>
                  ))
                )}
              </Menu>

              {/* Settings */}
              <Tooltip title="Settings">
                <IconButton color="inherit" onClick={() => handleNavigation("/settings")} sx={{ mr: 2 }}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>

              {/* User Menu */}
              <UserButton afterSignOutUrl="/" />
            </Box>
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
