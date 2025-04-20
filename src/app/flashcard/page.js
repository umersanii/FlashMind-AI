"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "../../utils/firebase"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  CircularProgress,
  Pagination,
  Paper,
  Fade,
  Zoom,
} from "@mui/material"
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  ViewModule as ViewModuleIcon,
  ViewCarousel as ViewCarouselIcon,
} from "@mui/icons-material"

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid") // 'grid' or 'carousel'
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [collectionName, setCollectionName] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get("id")

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return

      setLoading(true)
      try {
        const colRef = collection(doc(collection(db, "users"), user.id), search)
        const docs = await getDocs(colRef)
        const flashcardsData = []
        docs.forEach((doc) => {
          flashcardsData.push({ id: doc.id, ...doc.data() })
        })
        setFlashcards(flashcardsData)
        setCollectionName(search)
      } catch (error) {
        console.error("Error fetching flashcards:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && isSignedIn) {
      getFlashcard()
    }
  }, [search, user, isLoaded, isSignedIn])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    }
  }

  const handlePageChange = (event, page) => {
    setCurrentCardIndex(page - 1)
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "carousel" : "grid")
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          borderRadius: 0,
          background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SchoolIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              <Button variant="text" color="inherit" href="/" sx={{ fontWeight: 600 }}>
                Flashcard SaaS
              </Button>
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" href="/flashcards" startIcon={<HomeIcon />} sx={{ mr: 2 }}>
            My Collections
          </Button>
          <IconButton color="inherit" onClick={toggleViewMode} sx={{ mr: 2 }}>
            {viewMode === "grid" ? <ViewCarouselIcon /> : <ViewModuleIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress />
          </Box>
        ) : flashcards.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              my: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              border: "1px solid #e0f2fe",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              No flashcards found
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              This collection doesn't have any flashcards yet.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/flashcards"
              sx={{
                borderRadius: 2,
                background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
              }}
            >
              Back to Collections
            </Button>
          </Paper>
        ) : (
          <Fade in={true} timeout={500}>
            <Box>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "#1e293b" }}>
                  {collectionName}
                </Typography>
                <Typography variant="body1" sx={{ color: "#64748b", mt: 1 }}>
                  {flashcards.length} flashcards in this collection
                </Typography>
              </Box>

              {viewMode === "carousel" ? (
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 4 }}>
                    <IconButton
                      onClick={handlePrevCard}
                      disabled={currentCardIndex === 0}
                      sx={{
                        mr: 2,
                        bgcolor: currentCardIndex === 0 ? "transparent" : "rgba(59, 130, 246, 0.1)",
                        "&:hover": {
                          bgcolor: "rgba(59, 130, 246, 0.2)",
                        },
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>

                    <Zoom in={true} timeout={300}>
                      <Card
                        onClick={() => handleCardClick(flashcards[currentCardIndex]?.id)}
                        sx={{
                          width: { xs: "100%", sm: 400 },
                          height: 300,
                          borderRadius: 4,
                          perspective: "1000px",
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            transition: "transform 0.8s",
                            transformStyle: "preserve-3d",
                            transform: flipped[flashcards[currentCardIndex]?.id] ? "rotateY(180deg)" : "rotateY(0deg)",
                          }}
                        >
                          <CardContent
                            sx={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backfaceVisibility: "hidden",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              p: 4,
                              borderRadius: 4,
                              backgroundColor: "#3b82f6",
                              color: "white",
                              boxShadow:
                                "0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.2)",
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                textAlign: "center",
                                fontWeight: 500,
                              }}
                            >
                              {flashcards[currentCardIndex]?.front || ""}
                            </Typography>
                            <Typography variant="caption" sx={{ position: "absolute", bottom: 16, opacity: 0.7 }}>
                              Click to flip
                            </Typography>
                          </CardContent>
                          <CardContent
                            sx={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backfaceVisibility: "hidden",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              p: 4,
                              borderRadius: 4,
                              backgroundColor: "white",
                              color: "#1e293b",
                              transform: "rotateY(180deg)",
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              {flashcards[currentCardIndex]?.back || ""}
                            </Typography>
                            <Typography variant="caption" sx={{ position: "absolute", bottom: 16, opacity: 0.7 }}>
                              Click to flip back
                            </Typography>
                          </CardContent>
                        </Box>
                      </Card>
                    </Zoom>

                    <IconButton
                      onClick={handleNextCard}
                      disabled={currentCardIndex === flashcards.length - 1}
                      sx={{
                        ml: 2,
                        bgcolor: currentCardIndex === flashcards.length - 1 ? "transparent" : "rgba(59, 130, 246, 0.1)",
                        "&:hover": {
                          bgcolor: "rgba(59, 130, 246, 0.2)",
                        },
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                    <Typography variant="body2" sx={{ mr: 2, color: "#64748b" }}>
                      Card {currentCardIndex + 1} of {flashcards.length}
                    </Typography>
                    <Pagination
                      count={flashcards.length}
                      page={currentCardIndex + 1}
                      onChange={handlePageChange}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {flashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                      <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                        <Card
                          sx={{
                            height: 200,
                            borderRadius: 3,
                            perspective: "1000px",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            cursor: "pointer",
                            position: "relative",
                          }}
                        >
                          <CardActionArea onClick={() => handleCardClick(flashcard.id)} sx={{ height: "100%" }}>
                            <Box
                              sx={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                transition: "transform 0.6s",
                                transformStyle: "preserve-3d",
                                transform: flipped[flashcard.id] ? "rotateY(180deg)" : "rotateY(0deg)",
                              }}
                            >
                              <CardContent
                                sx={{
                                  position: "absolute",
                                  width: "100%",
                                  height: "100%",
                                  backfaceVisibility: "hidden",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  p: 3,
                                  borderRadius: 3,
                                  backgroundColor: "#3b82f6",
                                  color: "white",
                                  boxShadow:
                                    "0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2)",
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    textAlign: "center",
                                    fontWeight: 500,
                                  }}
                                >
                                  {flashcard.front}
                                </Typography>
                              </CardContent>
                              <CardContent
                                sx={{
                                  position: "absolute",
                                  width: "100%",
                                  height: "100%",
                                  backfaceVisibility: "hidden",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  p: 3,
                                  borderRadius: 3,
                                  backgroundColor: "white",
                                  color: "#1e293b",
                                  transform: "rotateY(180deg)",
                                  border: "1px solid #e2e8f0",
                                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textAlign: "center",
                                  }}
                                >
                                  {flashcard.back}
                                </Typography>
                              </CardContent>
                            </Box>
                          </CardActionArea>
                        </Card>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  )
}
