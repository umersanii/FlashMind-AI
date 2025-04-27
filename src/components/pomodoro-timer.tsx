"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Tooltip,
  Menu,
  MenuItem,
  Fade,
  Divider,
  Slider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { Play, Pause, RotateCcw, Settings, Coffee, Volume2, VolumeX } from "lucide-react"

interface PomodoroTimerProps {
  variant?: "compact" | "full"
  position?: "top-right" | "bottom-right" | "floating"
}

export default function PomodoroTimer({ variant = "full", position = "floating" }: PomodoroTimerProps) {
  // Timer states
  const [workTime, setWorkTime] = useState(25 * 60) // 25 minutes in seconds
  const [breakTime, setBreakTime] = useState(5 * 60) // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(workTime)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [cycles, setCycles] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Settings menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [tempWorkTime, setTempWorkTime] = useState(25)
  const [tempBreakTime, setTempBreakTime] = useState(5)

  // Audio refs
  const timerEndSound = useRef<HTMLAudioElement | null>(null)
  const timerStartSound = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    timerEndSound.current = new Audio("/sounds/timer-end.mp3")
    timerStartSound.current = new Audio("/sounds/timer-start.mp3")

    return () => {
      timerEndSound.current = null
      timerStartSound.current = null
    }
  }, [])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (isRunning && timeLeft === 0) {
      // Timer ended
      if (soundEnabled && timerEndSound.current) {
        timerEndSound.current.play().catch((err) => console.error("Error playing sound:", err))
      }

      if (isBreak) {
        // Break ended, start work time
        setIsBreak(false)
        setTimeLeft(workTime)
        setCycles((c) => c + 1)
      } else {
        // Work ended, start break time
        setIsBreak(true)
        setTimeLeft(breakTime)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, isBreak, workTime, breakTime, soundEnabled])

  const toggleTimer = () => {
    if (!isRunning && soundEnabled && timerStartSound.current) {
      timerStartSound.current.play().catch((err) => console.error("Error playing sound:", err))
    }
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(workTime)
  }

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleSettingsClose = () => {
    setAnchorEl(null)
  }

  const openSettingsDialog = () => {
    setTempWorkTime(Math.floor(workTime / 60))
    setTempBreakTime(Math.floor(breakTime / 60))
    setSettingsOpen(true)
    handleSettingsClose()
  }

  const saveSettings = () => {
    const newWorkTime = tempWorkTime * 60
    const newBreakTime = tempBreakTime * 60

    setWorkTime(newWorkTime)
    setBreakTime(newBreakTime)

    if (!isBreak) {
      setTimeLeft(newWorkTime)
    } else {
      setTimeLeft(newBreakTime)
    }

    setSettingsOpen(false)
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const calculateProgress = () => {
    const total = isBreak ? breakTime : workTime
    return ((total - timeLeft) / total) * 100
  }

  // Get color based on mode
  const getColor = () => {
    return isBreak ? "success.main" : "primary.main"
  }

  // Position styles
  const getPositionStyles = () => {
    switch (position) {
      case "top-right":
        return {
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
        }
      case "bottom-right":
        return {
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 10,
        }
      case "floating":
        return {
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }
      default:
        return {}
    }
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: variant === "compact" ? 1 : 2,
          borderRadius: 3,
          width: variant === "compact" ? "auto" : 220,
          ...getPositionStyles(),
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
          <CircularProgress
            variant="determinate"
            value={calculateProgress()}
            size={variant === "compact" ? 60 : 80}
            thickness={4}
            sx={{ color: getColor(), position: "absolute" }}
          />
          <CircularProgress
            variant="determinate"
            value={100}
            size={variant === "compact" ? 60 : 80}
            thickness={4}
            sx={{ color: "divider", position: "absolute" }}
          />
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant={variant === "compact" ? "body2" : "body1"} sx={{ fontWeight: 600 }}>
              {formatTime(timeLeft)}
            </Typography>
            {variant !== "compact" && (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {isBreak ? "Break" : "Focus"}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Tooltip title={isRunning ? "Pause" : "Start"}>
            <IconButton
              onClick={toggleTimer}
              size="small"
              sx={{
                bgcolor: getColor(),
                color: "white",
                "&:hover": { bgcolor: isBreak ? "success.dark" : "primary.dark" },
              }}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Reset">
            <IconButton onClick={resetTimer} size="small" sx={{ color: "text.secondary" }}>
              <RotateCcw size={16} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton onClick={handleSettingsClick} size="small" sx={{ color: "text.secondary" }}>
              <Settings size={16} />
            </IconButton>
          </Tooltip>

          <Tooltip title={soundEnabled ? "Sound On" : "Sound Off"}>
            <IconButton onClick={() => setSoundEnabled(!soundEnabled)} size="small" sx={{ color: "text.secondary" }}>
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </IconButton>
          </Tooltip>
        </Box>

        {variant !== "compact" && (
          <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
            <Coffee size={14} />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Cycles: {cycles}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Settings Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSettingsClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={openSettingsDialog}>
          <Settings size={16} style={{ marginRight: 8 }} />
          Timer Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setSoundEnabled(!soundEnabled)}>
          {soundEnabled ? (
            <Volume2 size={16} style={{ marginRight: 8 }} />
          ) : (
            <VolumeX size={16} style={{ marginRight: 8 }} />
          )}
          {soundEnabled ? "Disable Sound" : "Enable Sound"}
        </MenuItem>
        <MenuItem onClick={resetTimer}>
          <RotateCcw size={16} style={{ marginRight: 8 }} />
          Reset Timer
        </MenuItem>
      </Menu>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Pomodoro Timer Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ width: 300, mt: 2 }}>
            <Typography gutterBottom>Work Duration (minutes)</Typography>
            <Slider
              value={tempWorkTime}
              onChange={(_, value) => setTempWorkTime(value as number)}
              min={1}
              max={60}
              step={1}
              marks={[
                { value: 15, label: "15" },
                { value: 25, label: "25" },
                { value: 45, label: "45" },
              ]}
              valueLabelDisplay="auto"
            />

            <Typography gutterBottom sx={{ mt: 3 }}>
              Break Duration (minutes)
            </Typography>
            <Slider
              value={tempBreakTime}
              onChange={(_, value) => setTempBreakTime(value as number)}
              min={1}
              max={30}
              step={1}
              marks={[
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 15, label: "15" },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button onClick={saveSettings} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
