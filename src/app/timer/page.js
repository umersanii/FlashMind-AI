"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Button,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Slider,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  useTheme,
  Alert,
} from "@mui/material";
import {
  PlayCircle,
  PauseCircle,
  RestartAlt,
  Settings,
  Save,
  Coffee,
  Timer as TimerIcon,
  BarChart,
  Bookmark,
  VolumeUp,
  VolumeOff,
  EmojiEvents,
  Bolt,
  AccessTime,
} from "@mui/icons-material";
import Navbar from "../../components/ui/navbar";
import User from "../../models/user.model";

const TIMER_PRESETS = [
  {
    name: "Classic Pomodoro",
    workTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
    description: "The traditional 25-5 Pomodoro technique",
    color: "#ff5252", // Red
  },
  {
    name: "Short Sessions",
    workTime: 15,
    breakTime: 3,
    longBreakTime: 10,
    longBreakInterval: 4,
    description: "Shorter sessions for better focus",
    color: "#4caf50", // Green
  },
  {
    name: "Extended Focus",
    workTime: 45,
    breakTime: 10,
    longBreakTime: 20,
    longBreakInterval: 3,
    description: "Longer focus periods with generous breaks",
    color: "#2196f3", // Blue
  },
  {
    name: "90-30 Method",
    workTime: 90,
    breakTime: 30,
    longBreakTime: 30,
    longBreakInterval: 2,
    description: "Based on natural ultradian rhythms",
    color: "#9c27b0", // Purple
  },
];

export default function TimerPage() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const router = useRouter();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [userModel, setUserModel] = useState(null);

  // Timer states
  const [workTime, setWorkTime] = useState(25 * 60); // 25 minutes in seconds
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes in seconds
  const [longBreakTime, setLongBreakTime] = useState(15 * 60); // 15 minutes in seconds
  const [longBreakInterval, setLongBreakInterval] = useState(4); // Every 4 work sessions
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoStartBreaks, setAutoStartBreaks] = useState(true);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customPresetName, setCustomPresetName] = useState("");
  const [userPresets, setUserPresets] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [timerStats, setTimerStats] = useState({
    today: { focus: 0, sessions: 0 },
    week: { focus: 0, sessions: 0 },
    total: { focus: 0, sessions: 0 },
  });
  const [achievements, setAchievements] = useState([]);

  // Audio refs
  const timerEndSound = useRef(null);
  const timerStartSound = useRef(null);
  const breakEndSound = useRef(null);

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      timerEndSound.current = new Audio("/sounds/timer-end.mp3");
      timerStartSound.current = new Audio("/sounds/timer-start.mp3");
      breakEndSound.current = new Audio("/sounds/break-end.mp3");
    }

    return () => {
      timerEndSound.current = null;
      timerStartSound.current = null;
      breakEndSound.current = null;
    };
  }, []);

  // Initialize user model
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      const user = new User(clerkUser);
      setUserModel(user);
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  // Load user data
  useEffect(() => {
    if (userModel) {
      loadUserSettings();
      loadSessionHistory();
      loadTimerStatistics();
      loadAchievements();
    }
  }, [userModel]);

  // Timer logic
  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        if (!isBreak) {
          setTotalFocusTime((prev) => prev + 1);
        }
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer ended
      if (soundEnabled && timerEndSound.current) {
        timerEndSound.current
          .play()
          .catch((err) => console.error("Error playing sound:", err));
      }

      if (isBreak) {
        // Break ended, start work time
        setIsBreak(false);
        setIsLongBreak(false);
        setTimeLeft(workTime);

        // Auto start next pomodoro if enabled
        if (!autoStartPomodoros) {
          setIsRunning(false);
        }

        // Save session data
        if (userModel) {
          saveSession({
            type: isLongBreak ? "longBreak" : "break",
            duration: isLongBreak ? longBreakTime : breakTime,
            breakTime: isLongBreak ? longBreakTime : breakTime,
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        // Work ended, start break time
        const completedCycles = cycles + 1;
        setCycles(completedCycles);

        // Check if it's time for a long break
        const shouldTakeLongBreak = completedCycles % longBreakInterval === 0;

        if (shouldTakeLongBreak) {
          setIsLongBreak(true);
          setTimeLeft(longBreakTime);
        } else {
          setIsLongBreak(false);
          setTimeLeft(breakTime);
        }

        setIsBreak(true);

        // Auto start break if enabled
        if (!autoStartBreaks) {
          setIsRunning(false);
        }

        // Save session data
        if (userModel) {
          saveSession({
            type: "work",
            duration: workTime,
            focusTime: workTime,
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isRunning,
    timeLeft,
    isBreak,
    workTime,
    breakTime,
    longBreakTime,
    cycles,
    longBreakInterval,
    autoStartBreaks,
    autoStartPomodoros,
    soundEnabled,
    userModel,
    isLongBreak,
  ]);

  const loadUserSettings = async () => {
    try {
      const settings = await userModel.loadTimerSettings();

      // Load timer settings
      setWorkTime(settings.workDuration * 60 || 25 * 60);
      setBreakTime(settings.shortBreakDuration * 60 || 5 * 60);
      setLongBreakTime(settings.longBreakDuration * 60 || 15 * 60);
      setLongBreakInterval(settings.longBreakInterval || 4);
      setSoundEnabled(
        settings.soundEnabled !== undefined ? settings.soundEnabled : true
      );
      setAutoStartBreaks(
        settings.autoStartBreaks !== undefined ? settings.autoStartBreaks : true
      );
      setAutoStartPomodoros(
        settings.autoStartPomodoros !== undefined
          ? settings.autoStartPomodoros
          : false
      );

      // Reset timer with loaded work time
      if (!isRunning) {
        setTimeLeft(settings.workDuration * 60 || 25 * 60);
      }

      // Load user presets
      const presets = await userModel.getTimerPresets();
      if (presets && Array.isArray(presets)) {
        setUserPresets(presets);
      }
    } catch (error) {
      console.error("Error loading user settings:", error);
    }
  };

  const loadSessionHistory = async () => {
    try {
      const sessions = await userModel.getTimerSessions(50);
      setSessionHistory(sessions);
    } catch (error) {
      console.error("Error loading session history:", error);
    }
  };

  const loadTimerStatistics = async () => {
    try {
      const stats = await userModel.getTimerStatistics();
      if (stats) {
        setTimerStats({
          today: {
            focus: stats.focusTimeToday || 0,
            sessions: stats.sessionsToday || 0,
          },
          week: {
            focus: stats.focusTimeThisWeek || 0,
            sessions: stats.sessionsThisWeek || 0,
          },
          total: {
            focus: stats.totalFocusTime || 0,
            sessions: stats.totalSessions || 0,
          },
        });
      }
    } catch (error) {
      console.error("Error loading timer statistics:", error);
    }
  };

  const loadAchievements = async () => {
    try {
      const userAchievements = await userModel.getStudyAchievements();
      setAchievements(userAchievements);
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
  };

  const saveUserSettings = async () => {
    if (!userModel) return;

    try {
      await userModel.saveTimerSettings({
        workDuration: Math.floor(workTime / 60),
        shortBreakDuration: Math.floor(breakTime / 60),
        longBreakDuration: Math.floor(longBreakTime / 60),
        longBreakInterval,
        soundEnabled,
        autoStartBreaks,
        autoStartPomodoros,
      });

      showAlertMessage("Settings saved successfully", "success");
    } catch (error) {
      console.error("Error saving user settings:", error);
      showAlertMessage("Failed to save settings", "error");
    }
  };

  const saveSession = async (sessionData) => {
    if (!userModel) return;

    try {
      await userModel.recordTimerSession(sessionData);

      // Check for new achievements
      const newAchievements = await userModel.checkAndUpdateAchievements();
      if (newAchievements.length > 0) {
        showAlertMessage(
          `Achievement unlocked: ${newAchievements[0].name}`,
          "success"
        );
        loadAchievements();
      }

      // Refresh session history and stats
      loadSessionHistory();
      loadTimerStatistics();
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const saveCustomPreset = async () => {
    if (!customPresetName.trim()) {
      showAlertMessage("Please enter a preset name", "warning");
      return;
    }

    if (!userModel) return;

    try {
      const newPreset = {
        name: customPresetName,
        workTime: Math.floor(workTime / 60),
        breakTime: Math.floor(breakTime / 60),
        longBreakTime: Math.floor(longBreakTime / 60),
        longBreakInterval,
        description: "Custom user preset",
        color: getRandomColor(),
      };

      await userModel.saveTimerPreset(newPreset);
      setCustomPresetName("");

      // Refresh presets
      const presets = await userModel.getTimerPresets();
      setUserPresets(presets);

      showAlertMessage("Preset saved successfully", "success");
    } catch (error) {
      console.error("Error saving preset:", error);
      showAlertMessage("Failed to save preset", "error");
    }
  };

  const applyPreset = (index, isCustom = false) => {
    const preset = isCustom ? userPresets[index] : TIMER_PRESETS[index];

    if (preset) {
      setWorkTime(preset.workTime * 60);
      setBreakTime(preset.breakTime * 60);
      setLongBreakTime(preset.longBreakTime * 60);
      setLongBreakInterval(preset.longBreakInterval);

      // Reset timer with new work time
      if (!isRunning) {
        setTimeLeft(preset.workTime * 60);
      }

      setSelectedPreset(index);
      showAlertMessage(`Applied preset: ${preset.name}`, "success");
    }
  };

  const toggleTimer = () => {
    if (!isRunning && soundEnabled && timerStartSound.current) {
      timerStartSound.current
        .play()
        .catch((err) => console.error("Error playing sound:", err));
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setIsLongBreak(false);
    setTimeLeft(workTime);
  };

  const showAlertMessage = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);

    // Auto hide after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Format time for display (larger format)
  const formatTimeDisplay = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: mins.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const total = isBreak
      ? isLongBreak
        ? longBreakTime
        : breakTime
      : workTime;
    return ((total - timeLeft) / total) * 100;
  };

  // Format total focus time
  const formatTotalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Get color based on mode
  const getTimerColor = () => {
    if (isBreak) {
      return isLongBreak ? "#4caf50" : "#2196f3"; // Green for long break, blue for short break
    } else {
      return "#ff5252"; // Red for focus time
    }
  };

  // Get timer status text
  const getTimerStatus = () => {
    if (isBreak) {
      return isLongBreak ? "Long Break" : "Short Break";
    } else {
      return "Focus Time";
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Generate random color for custom presets
  const getRandomColor = () => {
    const colors = [
      "#ff5252",
      "#4caf50",
      "#2196f3",
      "#9c27b0",
      "#ff9800",
      "#009688",
      "#673ab7",
      "#795548",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // If not loaded yet, show loading
  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not signed in, redirect to sign in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const { minutes, seconds } = formatTimeDisplay(timeLeft);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        {/* Alert for notifications */}
        {showAlert && (
          <Alert
            severity={alertSeverity}
            sx={{
              position: "fixed",
              top: 80,
              right: 16,
              zIndex: 1000,
              boxShadow: 3,
              borderRadius: 2,
            }}
            onClose={() => setShowAlert(false)}
          >
            {alertMessage}
          </Alert>
        )}

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700, color: "#ff5252" }}
        >
          Pomodoro Timer
        </Typography>

        {/* Stats Summary Row - Always visible */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            background:
              "linear-gradient(135deg, rgba(255,82,82,0.1) 0%, rgba(33,150,243,0.1) 100%)",
          }}
          alignItems="center"

        >
          <Grid container spacing={3} alignItems={"center"}>
            <Grid sx={{ width: { xs: "100%", sm: "48%",md: "32%" } }} >
              <Card
                sx={{
                  bgcolor: "rgba(255,82,82,0.1)",
                  borderLeft: "4px solid #ff5252",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Today's Focus
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <AccessTime sx={{ color: "#ff5252", mr: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {formatTotalTime(timerStats.today.focus)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({timerStats.today.sessions} sessions)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid sx={{ width: { xs: "100%", sm: "48%",md: "31%" } }}>
              <Card
                sx={{
                  bgcolor: "rgba(33,150,243,0.1)",
                  borderLeft: "4px solid #2196f3",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    This Week
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Bolt sx={{ color: "#2196f3", mr: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {formatTotalTime(timerStats.week.focus)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({timerStats.week.sessions} sessions)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid sx={{ width: { xs: "100%", sm: "48%",md: "31%" } }}>
              <Card
                sx={{
                  bgcolor: "rgba(76,175,80,0.1)",
                  borderLeft: "4px solid #4caf50",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    All Time
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <EmojiEvents sx={{ color: "#4caf50", mr: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {formatTotalTime(timerStats.total.focus)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({timerStats.total.sessions} sessions)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          {/* Main Timer Section */}
          <Grid item xs={12} md={8}width={{ xs: "100%", sm: "100%", md: "40%" }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                pt: 20,
                borderRadius: 4,
                background: `linear-gradient(145deg, ${theme.palette.background.paper}, rgba(250, 250, 250, 0.8))`,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(10px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: 500,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 4,
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={calculateProgress()}
                  size={240}
                  thickness={4}
                  sx={{ color: getTimerColor(), position: "absolute" }}
                />
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={240}
                  thickness={4}
                  sx={{ color: "rgba(0,0,0,0.1)", position: "absolute" }}
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
                  <Box sx={{ display: "flex", alignItems: "baseline" }}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1,
                        color: getTimerColor(),
                      }}
                    >
                      {minutes}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{ mx: 1, color: "text.secondary" }}
                    >
                      :
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1,
                        color: getTimerColor(),
                      }}
                    >
                      {seconds}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ color: getTimerColor(), mt: 1, fontWeight: 600 }}
                  >
                    {getTimerStatus()}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 , pt: 8}}
              >
                <IconButton
                  onClick={toggleTimer}
                  size="large"
                  sx={{
                    bgcolor: getTimerColor(),
                    color: "white",
                    p: 2,
                    "&:hover": {
                      bgcolor: `${getTimerColor()}CC`,
                    },
                  }}
                >
                  {isRunning ? (
                    <PauseCircle fontSize="large" />
                  ) : (
                    <PlayCircle fontSize="large" />
                  )}
                </IconButton>

                <IconButton
                  onClick={resetTimer}
                  size="medium"
                  sx={{
                    bgcolor: "rgba(0,0,0,0.1)",
                    color: "text.primary",
                    p: 1.5,
                  }}
                >
                  <RestartAlt />
                </IconButton>

                <IconButton
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  size="medium"
                  sx={{
                    bgcolor: "rgba(0,0,0,0.1)",
                    color: "text.primary",
                    p: 1.5,
                  }}
                >
                  {soundEnabled ? <VolumeUp /> : <VolumeOff />}
                </IconButton>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 4 }}
              >
                <Coffee sx={{ color: "#ff9800" }} />
                <Typography variant="body1">
                  Completed Cycles: <strong>{cycles}</strong>
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                <TimerIcon sx={{ color: "#2196f3" }} />
                <Typography variant="body1">
                  Current Focus Time:{" "}
                  <strong>{formatTotalTime(totalFocusTime)}</strong>
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Stats and Settings Section */}
          <Grid item xs={12} md={4} width={{ xs: "100%", sm: "100%", md: "56%" }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                height: "100%",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.9) 100%)",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTab-root": {
                    color: "text.secondary",
                    "&.Mui-selected": {
                      color: "#ff5252",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#ff5252",
                  },
                }}
              >
                <Tab icon={<BarChart />} label="Stats" />
                <Tab icon={<Settings />} label="Settings" />
                <Tab icon={<Bookmark />} label="Presets" />
              </Tabs>

              {/* Stats Tab */}
              {tabValue === 0 && (
                <Box
                  sx={{ p: 3, height: "calc(100% - 49px)", overflow: "auto" }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#ff5252", fontWeight: 600 }}
                  >
                    Recent Sessions
                  </Typography>

                  {sessionHistory.length > 0 ? (
                    sessionHistory.slice(0, 5).map((session, index) => (
                      <Card
                        key={index}
                        variant="outlined"
                        sx={{
                          mb: 2,
                          borderLeft: `4px solid ${
                            session.type === "work" ? "#ff5252" : "#4caf50"
                          }`,
                          bgcolor:
                            session.type === "work"
                              ? "rgba(255,82,82,0.05)"
                              : "rgba(76,175,80,0.05)",
                        }}
                      >
                        <CardContent sx={{ py: 1.5 }}>
                          <Typography variant="subtitle2">
                            {session.type === "work"
                              ? "Focus Session"
                              : session.type === "longBreak"
                              ? "Long Break"
                              : "Short Break"}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {new Date(session.timestamp).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {formatTotalTime(
                                session.focusTime || session.breakTime || 0
                              )}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 3,
                        textAlign: "center",
                        color: "text.secondary",
                      }}
                    >
                      No session history yet. Complete a focus session to see
                      your stats.
                    </Typography>
                  )}

                  {achievements.length > 0 && (
                    <>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ mt: 4, color: "#ff9800", fontWeight: 600 }}
                      >
                        Achievements
                      </Typography>
                      <Grid container spacing={2}>
                        {achievements.slice(0, 3).map((achievement, index) => (
                          <Grid item xs={12} key={index} width={{ xs: "100%", sm: "100%", md: "48%" }}>
                            <Card
                              variant="outlined"
                              sx={{
                                borderLeft: "4px solid #ff9800",
                                bgcolor: "rgba(255,152,0,0.05)",
                              }}
                            >
                              <CardContent sx={{ py: 1.5 }}>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Typography sx={{ fontSize: 24, mr: 1 }}>
                                    {achievement.icon}
                                  </Typography>
                                  <Box>
                                    <Typography variant="subtitle2">
                                      {achievement.name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {achievement.description}
                                    </Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </Box>
              )}

              {/* Settings Tab */}
              {tabValue === 1 && (
                <Box
                  sx={{ p: 3, height: "calc(100% - 49px)", overflow: "auto" }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#2196f3", fontWeight: 600 }}
                  >
                    Timer Settings
                  </Typography>

                  <Typography
                    gutterBottom
                    sx={{ color: "#ff5252", fontWeight: 500 }}
                  >
                    Work Duration (minutes)
                  </Typography>
                  <Slider
                    value={Math.floor(workTime / 60)}
                    onChange={(_, value) => {
                      setWorkTime(value * 60);
                      if (!isRunning && !isBreak) {
                        setTimeLeft(value * 60);
                      }
                    }}
                    min={1}
                    max={60}
                    step={1}
                    marks={[
                      { value: 15, label: "15" },
                      { value: 25, label: "25" },
                      { value: 45, label: "45" },
                    ]}
                    valueLabelDisplay="auto"
                    sx={{ color: "#ff5252" }}
                  />

                  <Typography
                    gutterBottom
                    sx={{ mt: 3, color: "#2196f3", fontWeight: 500 }}
                  >
                    Short Break Duration (minutes)
                  </Typography>
                  <Slider
                    value={Math.floor(breakTime / 60)}
                    onChange={(_, value) => {
                      setBreakTime(value * 60);
                      if (!isRunning && isBreak && !isLongBreak) {
                        setTimeLeft(value * 60);
                      }
                    }}
                    min={1}
                    max={30}
                    step={1}
                    marks={[
                      { value: 5, label: "5" },
                      { value: 10, label: "10" },
                      { value: 15, label: "15" },
                    ]}
                    valueLabelDisplay="auto"
                    sx={{ color: "#2196f3" }}
                  />

                  <Typography
                    gutterBottom
                    sx={{ mt: 3, color: "#4caf50", fontWeight: 500 }}
                  >
                    Long Break Duration (minutes)
                  </Typography>
                  <Slider
                    value={Math.floor(longBreakTime / 60)}
                    onChange={(_, value) => {
                      setLongBreakTime(value * 60);
                      if (!isRunning && isBreak && isLongBreak) {
                        setTimeLeft(value * 60);
                      }
                    }}
                    min={5}
                    max={45}
                    step={1}
                    marks={[
                      { value: 15, label: "15" },
                      { value: 30, label: "30" },
                    ]}
                    valueLabelDisplay="auto"
                    sx={{ color: "#4caf50" }}
                  />

                  <Typography
                    gutterBottom
                    sx={{ mt: 3, color: "#9c27b0", fontWeight: 500 }}
                  >
                    Long Break Interval (sessions)
                  </Typography>
                  <Slider
                    value={longBreakInterval}
                    onChange={(_, value) => setLongBreakInterval(value)}
                    min={2}
                    max={8}
                    step={1}
                    marks={[
                      { value: 2, label: "2" },
                      { value: 4, label: "4" },
                      { value: 6, label: "6" },
                      { value: 8, label: "8" },
                    ]}
                    valueLabelDisplay="auto"
                    sx={{ color: "#9c27b0" }}
                  />

                  <Box sx={{ mt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={autoStartBreaks}
                          onChange={(e) => setAutoStartBreaks(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Auto-start breaks"
                    />
                  </Box>

                  <Box sx={{ mt: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={autoStartPomodoros}
                          onChange={(e) =>
                            setAutoStartPomodoros(e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label="Auto-start pomodoros"
                    />
                  </Box>

                  <Box sx={{ mt: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={soundEnabled}
                          onChange={(e) => setSoundEnabled(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Sound notifications"
                    />
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={saveUserSettings}
                    sx={{
                      mt: 3,
                      width: "100%",
                      bgcolor: "#2196f3",
                      "&:hover": {
                        bgcolor: "#1976d2",
                      },
                    }}
                  >
                    Save Settings
                  </Button>
                </Box>
              )}

              {/* Presets Tab */}
              {tabValue === 2 && (
                <Box
                  sx={{ p: 3, height: "calc(100% - 49px)", overflow: "auto" }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#9c27b0", fontWeight: 600 }}
                  >
                    Timer Presets
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 2, color: "#673ab7" }}
                  >
                    Default Presets
                  </Typography>
                  <Grid container spacing={2} >
                    {TIMER_PRESETS.map((preset, index) => (
                      <Grid item xs={12} key={index} width={{ xs: "100%", sm: "100%", md: "48%" }}>
                        <Card
                          variant="outlined"
                          sx={{
                            height: "180px",
                            cursor: "pointer",
                            borderLeft: `4px solid ${preset.color}`,
                            borderColor:
                              selectedPreset === index
                                ? preset.color
                                : "divider",
                            borderWidth: selectedPreset === index ? 2 : 1,
                            bgcolor:
                              selectedPreset === index
                                ? `${preset.color}10`
                                : "transparent",
                            "&:hover": {
                              borderColor: preset.color,
                              bgcolor: `${preset.color}10`,
                            },
                          }}
                          onClick={() => applyPreset(index)}
                        >
                          <CardContent>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, color: preset.color }}
                            >
                              {preset.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {preset.description}
                            </Typography>
                            <Box
                              sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: "#ff5252",
                                }}
                              >
                                <TimerIcon fontSize="small" sx={{ mr: 0.5 }} />
                                Work: {preset.workTime}m
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: "#2196f3",
                                }}
                              >
                                <Coffee fontSize="small" sx={{ mr: 0.5 }} />
                                Break: {preset.breakTime}m
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "#4caf50" }}
                              >
                                Long Break: {preset.longBreakTime}m
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {userPresets.length > 0 && (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{ mt: 4, mb: 2, color: "#ff9800" }}
                      >
                        Your Presets
                      </Typography>
                      <Grid container spacing={2}>
                        {userPresets.map((preset, index) => (
                          <Grid item xs={12} key={index} width={{ xs: "100%", sm: "100%", md: "48%" }}>
                            <Card
                              variant="outlined"
                              sx={{
                                cursor: "pointer",
                                borderLeft: `4px solid ${
                                  preset.color || "#ff9800"
                                }`,
                                borderColor:
                                  selectedPreset === index && tabValue === 2
                                    ? preset.color || "#ff9800"
                                    : "divider",
                                bgcolor:
                                  selectedPreset === index && tabValue === 2
                                    ? `${preset.color || "#ff9800"}10`
                                    : "transparent",
                                "&:hover": {
                                  borderColor: preset.color || "#ff9800",
                                  bgcolor: `${preset.color || "#ff9800"}10`,
                                },
                              }}
                              onClick={() => applyPreset(index, true)}
                            >
                              <CardContent>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 600,
                                    color: preset.color || "#ff9800",
                                  }}
                                >
                                  {preset.name}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 2,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      color: "#ff5252",
                                    }}
                                  >
                                    <TimerIcon
                                      fontSize="small"
                                      sx={{ mr: 0.5 }}
                                    />
                                    Work: {preset.workTime}m
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      color: "#2196f3",
                                    }}
                                  >
                                    <Coffee fontSize="small" sx={{ mr: 0.5 }} />
                                    Break: {preset.breakTime}m
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "#4caf50" }}
                                  >
                                    Long Break: {preset.longBreakTime}m
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}

                  <Typography
                    variant="subtitle2"
                    sx={{ mt: 4, mb: 2, color: "#ff5252" }}
                  >
                    Save Current Settings as Preset
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      label="Preset Name"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={customPresetName}
                      onChange={(e) => setCustomPresetName(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: "#ff5252",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#ff5252",
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={saveCustomPreset}
                      sx={{
                        bgcolor: "#ff5252",
                        "&:hover": {
                          bgcolor: "#e53935",
                        },
                      }}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
