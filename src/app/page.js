"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  Divider,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  Avatar,
  Skeleton,
  CardContent,
=======
=======
>>>>>>> Stashed changes
  Card,
  CardContent,
  Chip,
  styled,
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
} from "@mui/material"
import {
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Devices as DevicesIcon,
  ArrowForward as ArrowForwardIcon,
  Quiz as QuizIcon,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  LocalFireDepartment as FireIcon,
  EmojiEvents as TrophyIcon,
  CalendarMonth as CalendarIcon,
  CenterFocusStrong,
=======
  Mic as MicIcon,
  Group as GroupIcon,
  Insights as InsightsIcon,
>>>>>>> Stashed changes
=======
  Mic as MicIcon,
  Group as GroupIcon,
  Insights as InsightsIcon,
>>>>>>> Stashed changes
} from "@mui/icons-material"
import { motion } from "framer-motion"
import Navbar from "../components/ui/navbar"
import RecommendedTopics from "../components/recommended-topics"
import User from "../models/user.model"

// Styled components using Material UI
const GradientTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: "linear-gradient(45deg, #FFD700, #FFA500)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}))

// Styled components using Material UI
const GradientTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: "linear-gradient(45deg, #FFD700, #FFA500)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}))

const MotionBox = motion(Box)
const MotionTypography = motion(Typography)
const MotionPaper = motion(Paper)
<<<<<<< Updated upstream
<<<<<<< Updated upstream
const MotionCard = motion(Paper)

export default function Home() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const [userModel, setUserModel] = useState(null)
  const [streakData, setStreakData] = useState(null)
  const [loading, setLoading] = useState(true)
=======
const MotionCard = motion(Card)

=======
const MotionCard = motion(Card)

>>>>>>> Stashed changes
export default function Home({ darkMode, toggleDarkMode }) {
  const { isLoaded, isSignedIn } = useUser()
>>>>>>> Stashed changes
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    const initializeUser = async () => {
      if (isLoaded && isSignedIn && clerkUser) {
        const user = new User(clerkUser)
        setUserModel(user)

        try {
          const streak = await user.loadStreakData()
          setStreakData(streak)
        } catch (error) {
          console.error("Error loading streak data:", error)
        } finally {
          setLoading(false)
        }
      } else if (isLoaded) {
        setLoading(false)
      }
    }

    initializeUser()
  }, [isLoaded, isSignedIn, clerkUser])

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/generate-cards")
    } else {
      router.push("/sign-in")
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Hero Section */}
      <Box
        sx={{
          pt: 15,
          pb: 10,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center" justifyContent={isMobile ? "center" : "space-between"} padding={{ xs: 2, md: 16 }}>
            <Grid item xs={12} md={6} width={isMobile ? "100%" : "60%"} >
              <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <GradientTypography
                  variant="h2"
                  component="h1"
                  sx={{
                    mb: 3,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                  }}
                >
                  Supercharge Your Learning with AI
                </GradientTypography>

                <MotionTypography
                  variant="h6"
                  sx={{ color: "text.secondary", mb: 4, maxWidth: "600px", lineHeight: 1.6 }}
                >
                  Transform any text into intelligent flashcards and quizzes. Study smarter, not harder with our
                  AI-powered learning platform.
                </MotionTypography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                  }}
                >
                  Get Started
                </Button>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                sx={{ position: "relative", height: { xs: 300, md: 400 }, width: "300px" }}
=======
                sx={{ position: "relative", height: { xs: 300, md: 400 }, width: "100%" }}
>>>>>>> Stashed changes
=======
                sx={{ position: "relative", height: { xs: 300, md: 400 }, width: "100%" }}
>>>>>>> Stashed changes
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: "80%",
                    height: "80%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(-5deg)",
                    bgcolor: "primary.light",
                    borderRadius: 4,
                    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                    color: "text.primary",
                    zIndex: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center", color: "primary.dark" }}>
                    What is the capital of France?
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    width: "80%",
                    height: "80%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(3deg) translateY(-10px)",
                    bgcolor: "secondary.light",
                    borderRadius: 4,
                    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 3,
                    color: "text.primary",
                    zIndex: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center", color: "text.secondary" }}>
                    What is photosynthesis?
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    width: "80%",
                    height: "80%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(-2deg) translateY(-20px)",
                    bgcolor: "success.light",
                    borderRadius: 4,
                    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                    color: "#fff",
                    zIndex: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center" }}>
                    Who wrote "Romeo and Juliet"?
                  </Typography>
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>

        {/* Background Elements */}
        <Box
          sx={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0) 70%)",
            top: "-100px",
            right: "-100px",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0) 70%)",
            bottom: "-50px",
            left: "10%",
            zIndex: 0,
          }}
        />
      </Box>

      {/* User Dashboard Section (only for signed in users) */}
      {isLoaded && isSignedIn && (
        <Box sx={{ py: 6, bgcolor: "background.default" }}>
          <Container maxWidth="xl" sx={{ textAlign: "center" }}>
            <MotionTypography
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 4,
                background: "linear-gradient(45deg, #FFD700, #FFA500)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Your Learning Dashboard
            </MotionTypography>

            <Grid container spacing={4} justifyContent="center">
              {/* Streak Stats */}
              <Grid item xs={12} md={4}>
                <MotionPaper
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    height: "100%",
                    textAlign: "left",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <FireIcon sx={{ color: "primary.main", mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Your Learning Streak
                    </Typography>
                  </Box>

                  {loading ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2 }} />
                      <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2 }} />
                    </Box>
                  ) : (
                    <>
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              textAlign: "center",
                              borderRadius: 2,
                              bgcolor: "rgba(255, 215, 0, 0.1)",
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                              {streakData?.currentStreak || 0}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              Current Streak
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              textAlign: "center",
                              borderRadius: 2,
                              bgcolor: "rgba(255, 215, 0, 0.1)",
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                              {streakData?.longestStreak || 0}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              Longest Streak
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <CalendarIcon sx={{ color: "primary.main", mr: 1, fontSize: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          Total Study Days: {streakData?.studyDates?.length || 0}
                        </Typography>
                      </Box>

                      {streakData?.lastStudyDate && (
                        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                          Last studied: {new Date(streakData.lastStudyDate).toLocaleDateString()}
                        </Typography>
                      )}

                      <Button variant="outlined" onClick={() => router.push("/generate-cards")} sx={{ mt: 1 }}>
                        Study Today
                      </Button>
                    </>
                  )}
                </MotionPaper>
              </Grid>

              {/* Recommended Topics */}
              <Grid item xs={12} >
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 3}} />
                  ) : (
                    <RecommendedTopics user={userModel} />
                  )}
                </MotionBox>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}


      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: "background.paper" }}>
        <Container maxWidth="xl">
          <GradientTypography
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            variant="h3"
            align="center"
            sx={{ mb: 8 }}
          >
            Why FlashMind?
          </GradientTypography>

          <Grid container spacing={4} alignItems="center" justifyContent={isMobile ? "center" : "space-between"} >
          {[
              {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                icon: <LightbulbIcon sx={{ fontSize: 40, color: "#fff" }}/>,
=======
                icon: <LightbulbIcon sx={{ fontSize: 40, color: "primary.main" }} />,
>>>>>>> Stashed changes
=======
                icon: <LightbulbIcon sx={{ fontSize: 40, color: "primary.main" }} />,
>>>>>>> Stashed changes
                title: "AI-Powered Generation",
                description:
                  "Our advanced AI analyzes your content and creates perfect question-answer pairs tailored to your learning needs.",
                color: "linear-gradient(135deg, #FF9800, #FF5722)",
              },
              {
                icon: <PsychologyIcon sx={{ fontSize: 40, color: "#fff" }} />,
                title: "Optimized for Retention",
                description:
                  "Scientifically designed to maximize knowledge retention using spaced repetition and active recall techniques.",
                color: "linear-gradient(135deg, #2196F3, #3F51B5)",
              },
              {
                icon: <SpeedIcon sx={{ fontSize: 40, color: "#fff" }} />,
                title: "Learn Faster",
                description:
                  "Save hours of manual flashcard creation. Focus on studying, not preparing study materials.",
                color: "linear-gradient(135deg, #4CAF50, #009688)",
              },
              {
                icon: <DevicesIcon sx={{ fontSize: 40, color: "#fff" }} />,
                title: "Study Anywhere",
                description:
                  "Access your flashcards on any device. Perfect for on-the-go learning during commutes or breaks.",
                color: "linear-gradient(135deg, #9C27B0, #673AB7)",
              },
              {
                icon: <FireIcon sx={{ fontSize: 40, color: "#fff" }} />,
                title: "Daily Streaks",
                description: "Stay motivated with daily streaks and track your learning progress over time.",
                color: "linear-gradient(135deg, #FF5722, #F44336)",
              },
              {
                icon: <TrophyIcon sx={{ fontSize: 40, color: "#fff" }} />,
                title: "Personalized Recommendations",
                description: "Get smart topic recommendations based on your learning history and interests.",
                color: "linear-gradient(135deg, #FFC107, #FF9800)",
              },
            ].map((feature, index) => (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ width: isMobile ? "100%" : "48%", color: "text.primary" }}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
=======
=======
>>>>>>> Stashed changes
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ width: "48%", color: "text.primary" }}>
                <MotionPaper
                  initial={{ opacity: 20, y: 20 }}
>>>>>>> Stashed changes
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      background: feature.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
        </Container>
      </Box>

      {/* New Features Section */}
      <Box sx={{ py: 10, bgcolor: "background.default" }}>
        <Container maxWidth="xl">
          <GradientTypography
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            variant="h3"
            align="center"
            sx={{ mb: 8 }}
          >
            New Features
          </GradientTypography>

          <Grid container spacing={4}>
            {[
              {
                icon: <QuizIcon sx={{ fontSize: 40, color: "primary.main" }} />,
                title: "AI-Powered Quizzes",
                description: "Test your knowledge with intelligent quizzes that adapt to your learning progress.",
                chip: "New",
              },
              {
                icon: <MicIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
                title: "Voice Input",
                description: "Create flashcards by speaking. Perfect for capturing ideas on the go.",
                chip: "New",
              },
              {
                icon: <GroupIcon sx={{ fontSize: 40, color: "success.main" }} />,
                title: "Collaborative Study",
                description: "Share decks and study together with friends or classmates.",
                chip: "New",
              },
              {
                icon: <InsightsIcon sx={{ fontSize: 40, color: "warning.main" }} />,
                title: "Performance Analytics",
                description: "Track your progress with detailed insights and personalized recommendations.",
                chip: "New",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.2)",
                    },
<<<<<<< Updated upstream
                    position: "relative",
                    overflow: "visible",
=======
>>>>>>> Stashed changes
                  }}
                >
                  {feature.chip && (
                    <Chip
                      label={feature.chip}
                      color="primary"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: 16,
                        fontWeight: "bold",
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box sx={{ mr: 2 }}>{feature.icon}</Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

<<<<<<< Updated upstream
      {/* How It Works Section */}
      <Box sx={{ py: 10, bgcolor: "background.paper" }}>
=======
      {/* New Features Section */}
      <Box sx={{ py: 10, bgcolor: "background.default" }}>
>>>>>>> Stashed changes
        <Container maxWidth="xl">
          <GradientTypography
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            variant="h3"
            align="center"
            sx={{ mb: 8 }}
<<<<<<< Updated upstream
=======
          >
            New Features
          </GradientTypography>

          <Grid container spacing={4}>
            {[
              {
                icon: <QuizIcon sx={{ fontSize: 40, color: "primary.main" }} />,
                title: "AI-Powered Quizzes",
                description: "Test your knowledge with intelligent quizzes that adapt to your learning progress.",
                chip: "New",
              },
              {
                icon: <MicIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
                title: "Voice Input",
                description: "Create flashcards by speaking. Perfect for capturing ideas on the go.",
                chip: "New",
              },
              {
                icon: <GroupIcon sx={{ fontSize: 40, color: "success.main" }} />,
                title: "Collaborative Study",
                description: "Share decks and study together with friends or classmates.",
                chip: "New",
              },
              {
                icon: <InsightsIcon sx={{ fontSize: 40, color: "warning.main" }} />,
                title: "Performance Analytics",
                description: "Track your progress with detailed insights and personalized recommendations.",
                chip: "New",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.2)",
                    },
                    position: "relative",
                    overflow: "visible",
                  }}
                >
                  {feature.chip && (
                    <Chip
                      label={feature.chip}
                      color="primary"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: 16,
                        fontWeight: "bold",
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box sx={{ mr: 2 }}>{feature.icon}</Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10, bgcolor: "background.paper" }}>
        <Container maxWidth="xl">
          <GradientTypography
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            variant="h3"
            align="center"
            sx={{ mb: 8 }}
>>>>>>> Stashed changes
          >
            How It Works
          </GradientTypography>

          <Grid container spacing={6} alignItems="center" justifyContent={isMobile ? "center" : "space-between"}>
            {[
              {
                step: "01",
                title: "Paste Your Content",
                description: "Simply paste your notes, textbook content, or any study material into our platform.",
                color: "primary.main",
              },
              {
                step: "02",
                title: "AI Generates Learning Materials",
                description: "Our AI analyzes your content and automatically creates optimized flashcards and quizzes.",
                color: "secondary.main",
              },
              {
                step: "03",
                title: "Review & Study",
                description:
                  "Study your flashcards and take quizzes with our interactive learning system designed for maximum retention.",
                color: "success.main",
              },
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{ textAlign: "center" }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                      opacity: 0.1,
                      fontSize: "6rem",
                      color: step.color,
                    }}
                  >
                    {step.step}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "300px", mx: "auto" }}>
                    {step.description}
                  </Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Try It Now
            </Button>
          </Box>
        </Container>
      </Box>

<<<<<<< Updated upstream
<<<<<<< Updated upstream
      {/* Learning Tools Section */}
      <Box sx={{ py: 10, bgcolor: "background.paper" }}>
        <Container maxWidth="xl">
          <MotionTypography
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 8,
              background: "linear-gradient(45deg, #FFD700, #FFA500)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Learning Tools
          </MotionTypography>

          <Grid container spacing={4} alignItems="stretch" justifyContent="center">
            <Grid item xs={12} md={6} maxWidth={{ xs: "100%", md: "50%" }}>
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <LightbulbIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Flashcards
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 3, flex: 1 }}>
                  Create AI-generated flashcards from your study material. Perfect for memorization and quick review.
                  Our flashcards use active recall to help you remember information more effectively.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/generate-cards")}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Create Flashcards
                </Button>
              </MotionPaper>
            </Grid>
            <Grid item xs={12} md={6} maxWidth={{ xs: "100%", md: "50%" }}>
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <QuizIcon sx={{ fontSize: 40, color: "secondary.main", mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Quizzes
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 3, flex: 1 }}>
                  Generate multiple-choice quizzes to test your knowledge. Our AI creates challenging questions with
                  varying difficulty levels to help you assess your understanding and identify areas for improvement.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/generate-quiz")}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Create Quiz
                </Button>
              </MotionPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, bgcolor: "background.default" }}>
        <Container maxWidth="xl" sx={{ textAlign: "center" }}>
          <MotionTypography
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 8,
              background: "linear-gradient(45deg, #FFD700, #FFA500)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            What Our Users Say
          </MotionTypography>

          <Grid container spacing={4} alignItems="center" justifyContent="space-between">
            {[
              {
                name: "Sarah Johnson",
                role: "Medical Student",
                avatar: "S",
                testimonial:
                  "FlashMind has completely transformed how I study for my medical exams. I've cut my preparation time in half while improving my retention.",
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index} sx={{ width: "100%" }}>
                <MotionPaper
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    bgcolor: "background.paper",
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: "text.primary", mb: 4, flex: 1, fontStyle: "italic", lineHeight: 1.8 }}
                  >
                    "{testimonial.testimonial}"
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        bgcolor: index === 0 ? "primary.main" : index === 1 ? "secondary.main" : "success.main",
                        color: index === 0 ? "#000" : "#fff",
                        mr: 2,
                      }}
                    >
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, bgcolor: "background.paper" }}>
        <Container maxWidth="md">
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              bgcolor: "background.default",
              borderRadius: 4,
              background: "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0) 70%)",
                top: "-150px",
                right: "-150px",
                zIndex: 0,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  background: "linear-gradient(45deg, #FFD700, #FFA500)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ready to Transform Your Learning?
              </Typography>
              <Typography variant="h6" sx={{ color: "white", mb: 4, maxWidth: "600px", mx: "auto" }}>
                Join thousands of students who are studying smarter, not harder with FlashMind AI.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                }}
              >
                Get Started for Free
              </Button>
            </Box>
          </MotionPaper>
        </Container>
      </Box>

=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: "background.default", borderTop: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LightbulbIcon sx={{ color: "primary.main", mr: 1, fontSize: 24 }} />
                <GradientTypography variant="h6">FlashMind</GradientTypography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                AI-powered flashcards for smarter learning.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Product
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    Features
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    Pricing
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    FAQ
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Company
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    About
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    Blog
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    Careers
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Legal
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    Privacy
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    Terms
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Support
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    Help Center
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    Contact
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, bgcolor: "divider" }} />
          <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
            © {new Date().getFullYear()} FlashMind AI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
