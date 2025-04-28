"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Chip,
  Button,
  useTheme,
} from "@mui/material"
import {
  TrendingUp as TrendingUpIcon,
  EmojiEvents as EmojiEventsIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  Schedule as ScheduleIcon,
  Insights as InsightsIcon,
} from "@mui/icons-material"
import Navbar from "../../components/ui/navbar"
import User from "../../models/user.model"

export default function StatsPage({ darkMode, toggleDarkMode }) {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const theme = useTheme()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Sample stats for preview mode
  const sampleStats = {
    totalDecks: 5,
    totalCards: 127,
    streakDays: 7,
    achievements: ["week-streak", "100-cards"],
    lastStudyDate: new Date().toISOString(),
    accuracy: 78,
    cardsReviewed: 342,
    cardsCreated: 127,
    studyTime: 840, // minutes
    mostStudiedDeck: "Biology",
    weakestDeck: "Physics",
    strongestDeck: "History",
    upcomingReviews: 23,
    monthlyProgress: [65, 70, 75, 78, 80, 82, 78, 85, 87, 90, 88, 92],
    weeklyStudyTime: [30, 45, 60, 20, 40, 50, 35], // minutes per day
  }

  // Check if we're in preview mode
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsPreviewMode(true)
        setLoading(false)
        setStats(sampleStats)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLoaded])

  // Fetch stats when user is loaded
  useEffect(() => {
    if (isLoaded && isSignedIn && !isPreviewMode) {
      fetchStats()
    }
  }, [isLoaded, isSignedIn, isPreviewMode])

  const fetchStats = async () => {
    try {
      setLoading(true)

      // In a real implementation, you would fetch this data from your database
      // For now, we'll use the sample data
      const myUser = new User(user)
      const userStats = myUser.getStudyStats()

      // Combine with additional mock data for the UI
      const enhancedStats = {
        ...userStats,
        accuracy: 78,
        cardsReviewed: 342,
        cardsCreated: 127,
        studyTime: 840, // minutes
        mostStudiedDeck: "Biology",
        weakestDeck: "Physics",
        strongestDeck: "History",
        upcomingReviews: 23,
        monthlyProgress: [65, 70, 75, 78, 80, 82, 78, 85, 87, 90, 88, 92],
        weeklyStudyTime: [30, 45, 60, 20, 40, 50, 35], // minutes per day
      }

      setStats(enhancedStats)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setLoading(false)
    }
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getAchievementInfo = (achievementId) => {
    const achievements = {
      "week-streak": {
        title: "7-Day Streak",
        description: "Studied for 7 consecutive days",
        icon: <LocalFireDepartmentIcon sx={{ color: "#FFA500" }} />,
      },
      "month-streak": {
        title: "30-Day Streak",
        description: "Studied for 30 consecutive days",
        icon: <LocalFireDepartmentIcon sx={{ color: "#FF4500" }} />,
      },
      "100-cards": {
        title: "Century Club",
        description: "Created 100+ flashcards",
        icon: <CheckCircleIcon sx={{ color: "#4CAF50" }} />,
      },
      "master-quiz": {
        title: "Quiz Master",
        description: "Scored 100% on 5 quizzes",
        icon: <EmojiEventsIcon sx={{ color: "#FFD700" }} />,
      },
    }

    return (
      achievements[achievementId] || {
        title: "Achievement",
        description: "You earned an achievement",
        icon: <EmojiEventsIcon sx={{ color: "#FFD700" }} />,
      }
    )
  }

  if (!isLoaded || (!isSignedIn && !isPreviewMode)) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, display: "flex", alignItems: "center" }}>
            <InsightsIcon sx={{ mr: 2, color: "primary.main" }} />
            Learning Statistics
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
            Track your progress and see insights about your learning journey
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LocalFireDepartmentIcon sx={{ color: "primary.main", mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Current Streak
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.streakDays}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      consecutive days
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <TrendingUpIcon sx={{ color: "success.main", mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Accuracy
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.accuracy}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      correct answers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CheckCircleIcon sx={{ color: "info.main", mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Cards Reviewed
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.cardsReviewed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      total reviews
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <TimelineIcon sx={{ color: "secondary.main", mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Study Time
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {formatTime(stats.studyTime)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      total time spent
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Achievements */}
            <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: "flex", alignItems: "center" }}>
                <EmojiEventsIcon sx={{ mr: 1, color: "primary.main" }} />
                Achievements
              </Typography>

              <Grid container spacing={2}>
                {stats.achievements && stats.achievements.length > 0 ? (
                  stats.achievements.map((achievement) => {
                    const { title, description, icon } = getAchievementInfo(achievement)
                    return (
                      <Grid item xs={12} sm={6} md={4} key={achievement}>
                        <Card
                          sx={{
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <CardContent sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                mr: 2,
                                p: 1.5,
                                borderRadius: "50%",
                                bgcolor: "background.default",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {icon}
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {description}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  })
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No achievements yet. Keep studying to earn badges!
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Study Progress */}
            <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: "flex", alignItems: "center" }}>
                <TrendingUpIcon sx={{ mr: 1, color: "primary.main" }} />
                Study Progress
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Monthly Accuracy
                  </Typography>
                  <Box sx={{ height: 200, position: "relative" }}>
                    {/* This would be a chart in a real implementation */}
                    <Box sx={{ display: "flex", height: "100%", alignItems: "flex-end" }}>
                      {stats.monthlyProgress.map((value, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: `${100 / stats.monthlyProgress.length}%`,
                            height: `${value}%`,
                            bgcolor: "primary.main",
                            mx: 0.5,
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                            position: "relative",
                            "&:hover": {
                              bgcolor: "primary.dark",
                            },
                            "&:hover::after": {
                              content: `"${value}%"`,
                              position: "absolute",
                              top: -25,
                              left: "50%",
                              transform: "translateX(-50%)",
                              bgcolor: "background.paper",
                              color: "text.primary",
                              p: 0.5,
                              borderRadius: 1,
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                              boxShadow: theme.shadows[2],
                            },
                          }}
                        />
                      ))}
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -25,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "space-between",
                        px: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Jan
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Dec
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Weekly Study Time
                  </Typography>
                  <Box sx={{ height: 200, position: "relative" }}>
                    {/* This would be a chart in a real implementation */}
                    <Box sx={{ display: "flex", height: "100%", alignItems: "flex-end" }}>
                      {stats.weeklyStudyTime.map((value, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: `${100 / stats.weeklyStudyTime.length}%`,
                            height: `${(value / Math.max(...stats.weeklyStudyTime)) * 100}%`,
                            bgcolor: "secondary.main",
                            mx: 0.5,
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                            position: "relative",
                            "&:hover": {
                              bgcolor: "secondary.dark",
                            },
                            "&:hover::after": {
                              content: `"${value} min"`,
                              position: "absolute",
                              top: -25,
                              left: "50%",
                              transform: "translateX(-50%)",
                              bgcolor: "background.paper",
                              color: "text.primary",
                              p: 0.5,
                              borderRadius: 1,
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                              boxShadow: theme.shadows[2],
                            },
                          }}
                        />
                      ))}
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -25,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "space-between",
                        px: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Mon
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Sun
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Deck Performance */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: "flex", alignItems: "center" }}>
                <InsightsIcon sx={{ mr: 1, color: "primary.main" }} />
                Deck Performance
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Most Studied Deck
                      </Typography>
                      <Chip label="Strong" color="success" size="small" />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {stats.mostStudiedDeck}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={90}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "background.paper",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "success.main",
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Weakest Deck
                      </Typography>
                      <Chip label="Needs Work" color="error" size="small" />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {stats.weakestDeck}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={45}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "background.paper",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "error.main",
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "background.paper",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <ScheduleIcon sx={{ color: "warning.main", mr: 2, fontSize: 40 }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Upcoming Reviews
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          You have {stats.upcomingReviews} cards due for review
                        </Typography>
                      </Box>
                    </Box>

                    <Button variant="contained" color="primary" fullWidth onClick={() => router.push("/flashcards")}>
                      Start Reviewing
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  )
}
