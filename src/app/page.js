"use client"
import { useUser, UserButton } from "@clerk/clerk-react"
import { useRouter } from "next/navigation"
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid, Card, CardContent, Paper } from "@mui/material"
import {
  School as SchoolIcon,
  AutoAwesome as AutoAwesomeIcon,
  Collections as CollectionsIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material"

export default function Home() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/generate-cards")
    } else {
      router.push("/sign-in")
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "var(--background-default)" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SchoolIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              FlashMind AI
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {isLoaded && isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <Button color="inherit" href="/sign-in">
                Sign In
              </Button>
              <Button color="inherit" href="/sign-up">
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ my: 8, textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
            Study Smarter with AI-Generated Flashcards
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: "var(--text-secondary)", maxWidth: "800px", mx: "auto" }}>
            Transform your notes, textbooks, and study materials into effective flashcards with our AI-powered learning
            tool.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleGetStarted}
            sx={{ py: 1.5, px: 4, fontSize: "1.1rem" }}
          >
            Get Started
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <Card className="grow-in" sx={{ height: "100%" }}>
              <CardContent sx={{ p: 4 }}>
                <AutoAwesomeIcon sx={{ fontSize: 40, color: "var(--primary-main)", mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  AI-Powered Generation
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our advanced AI analyzes your content and creates perfect question-answer pairs for effective
                  learning.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="grow-in" sx={{ height: "100%" }}>
              <CardContent sx={{ p: 4 }}>
                <CollectionsIcon sx={{ fontSize: 40, color: "var(--primary-main)", mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Organize Collections
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create and manage multiple flashcard sets organized by subject, topic, or course.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="grow-in" sx={{ height: "100%" }}>
              <CardContent sx={{ p: 4 }}>
                <PsychologyIcon sx={{ fontSize: 40, color: "var(--primary-main)", mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Effective Learning
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Improve retention and understanding with our interactive flashcard system designed for better recall.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 8,
            borderRadius: 4,
            background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
            border: "1px solid #e0e7ff",
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" component="h2" gutterBottom>
                Ready to transform your study materials?
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Simply paste your notes, textbook content, or any study material, and our AI will generate flashcards to
                help you learn more effectively.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => router.push("/generate-cards")}
                startIcon={<AutoAwesomeIcon />}
              >
                Generate Flashcards
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                  height: 200,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 180,
                    height: 180,
                    borderRadius: 3,
                    backgroundColor: "var(--primary-main)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)",
                    transform: "rotate(-5deg)",
                    zIndex: 1,
                  }}
                >
                  <Typography sx={{ textAlign: "center", fontWeight: 500 }}>What is the capital of France?</Typography>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    width: 180,
                    height: 180,
                    borderRadius: 3,
                    backgroundColor: "var(--background-paper)",
                    border: "1px solid var(--primary-light)",
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    transform: "rotate(5deg) translateX(40px)",
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>Paris</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: "auto",
          backgroundColor: "var(--background-paper)",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} FlashMind AI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
