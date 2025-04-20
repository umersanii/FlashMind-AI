"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
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
  Avatar,
  colors,
} from "@mui/material"
import {
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Devices as DevicesIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import Navbar from "../components/ui/navbar"

const MotionBox = motion(Box)
const MotionTypography = motion(Typography)
const MotionPaper = motion(Paper)

export default function Home() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/generate-cards")
    } else {
      router.push("/sign-in")
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Navbar />

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
          <Grid container spacing={4} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={6}>
              <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <MotionTypography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    mb: 3,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    background: "linear-gradient(45deg, #FFD700, #FFA500)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Supercharge Your Learning with AI
                </MotionTypography>

                <MotionTypography
                  variant="h6"
                  sx={{ color: "text.secondary", mb: 4, maxWidth: "600px", lineHeight: 1.6 }}
                >
                  Transform any text into intelligent flashcards. Study smarter, not harder with our AI-powered learning
                  platform.
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
                sx={{ position: "relative", height: { xs: 300, md: 400 },width: "300px" }}
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
                  <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center", color: "#fff" }}>
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
                    alignItems: "center",
                    justifyContent: "center",
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

      {/* Features Section */}
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
            Why FlashMind?
          </MotionTypography>

          <Grid container spacing={4} alignItems="center" justifyContent={isMobile ? "center" : "space-between"}>
            {[
              {
                icon: <LightbulbIcon sx={{ fontSize: 40, color: "primary.main"}} />,
                title: "AI-Powered Generation",
                description:
                  "Our advanced AI analyzes your content and creates perfect question-answer pairs tailored to your learning needs.",
              },
              {
                icon: <PsychologyIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
                title: "Optimized for Retention",
                description:
                  "Scientifically designed to maximize knowledge retention using spaced repetition and active recall techniques.",
              },
              {
                icon: <SpeedIcon sx={{ fontSize: 40, color: "success.main" }} />,
                title: "Learn Faster",
                description:
                  "Save hours of manual flashcard creation. Focus on studying, not preparing study materials.",
              },
              {
                icon: <DevicesIcon sx={{ fontSize: 40, color: "warning.main" }} />,
                title: "Study Anywhere",
                description:
                  "Access your flashcards on any device. Perfect for on-the-go learning during commutes or breaks.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ width: "48%",color: "text.primary" }}>
                <MotionPaper
                  initial={{ opacity: 20, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    bgcolor: "background.light",
                    borderRadius: 4,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.2)",
                    },
                    
                  }}
                  
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {feature.description}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
          
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10, bgcolor: "background.default" }}>
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
            How It Works
          </MotionTypography>

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
                title: "AI Generates Flashcards",
                description: "Our AI analyzes your content and automatically creates optimized question-answer pairs.",
                color: "secondary.main",
              },
              {
                step: "03",
                title: "Review & Study",
                description:
                  "Study your flashcards with our interactive learning system designed for maximum retention.",
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

      {/* Testimonials Section */}
      <Box sx={{ py: 10, bgcolor: "background.paper" }}>
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
                    bgcolor: "background.default",
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
      <Box sx={{ py: 10, bgcolor: "background.default" }}>
        <Container maxWidth="md">
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              bgcolor: "background.paper",
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
              <Typography variant="h6" sx={{ color: "white" , mb: 4, maxWidth: "600px", mx: "auto" }}>
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

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: "background.paper", borderTop: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LightbulbIcon sx={{ color: "primary.main", mr: 1, fontSize: 24 }} />
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
