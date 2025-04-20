"use client"

import { useEffect, useState, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "../../utils/firebase"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Paper,
  Grid,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Fab,
  Zoom,
  Tooltip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material"
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Lightbulb as LightbulbIcon,
  Home as HomeIcon,
  ViewModule as ViewModuleIcon,
  ViewCarousel as ViewCarouselIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Shuffle as ShuffleIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Edit as EditIcon,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "../../components/ui/navbar"
import ChatBot from "../../components/chat-bot"

import User from "../../models/user.model"

const MotionBox = motion(Box)
const MotionPaper = motion(Paper)


export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("carousel")
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [collectionName, setCollectionName] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [bookmarkedCards, setBookmarkedCards] = useState({})
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [filteredCards, setFilteredCards] = useState([])
  const [progress, setProgress] = useState(0)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const cardContainerRef = useRef(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get("id")

  const myUser = isPreviewMode ? { generateFlashcardSet: mockGenerateFlashcards } : new User(user || {})
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsPreviewMode(true)
        setCollectionName("Sample Collection")
        setLoading(false)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLoaded])

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user || isPreviewMode) return

      setLoading(true)
      try {
        const colRef = collection(doc(collection(db, "users"), user.id), search)
        const docs = await getDocs(colRef)
        const flashcardsData = []
        docs.forEach((doc) => {
          flashcardsData.push({ id: doc.id, ...doc.data() })
        })
        setFlashcards(flashcardsData)
        setFilteredCards(flashcardsData)
        setCollectionName(search)

        setProgress(0)
      } catch (error) {
        console.error("Error fetching flashcards:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && isSignedIn && !isPreviewMode) {
      getFlashcard()
    }
  }, [search, user, isLoaded, isSignedIn, isPreviewMode])

  useEffect(() => {
    if (showBookmarkedOnly) {
      const bookmarked = flashcards.filter((card) => bookmarkedCards[card.id])
      setFilteredCards(bookmarked)
      if (bookmarked.length > 0 && currentCardIndex >= bookmarked.length) {
        setCurrentCardIndex(0)
      }
    } else {
      setFilteredCards(flashcards)
    }
  }, [bookmarkedCards, showBookmarkedOnly, flashcards, currentCardIndex])

  useEffect(() => {
    if (filteredCards.length > 0) {
      const flippedCount = Object.values(flipped).filter(Boolean).length
      setProgress(Math.round((flippedCount / filteredCards.length) * 100))
    }
  }, [flipped, filteredCards])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleNextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    }
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "carousel" : "grid")
  }

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return
    }
    setDrawerOpen(open)
  }

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

  const toggleBookmark = (id, e) => {
    if (e) e.stopPropagation()
    setBookmarkedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleShowBookmarkedOnly = () => {
    setShowBookmarkedOnly(!showBookmarkedOnly)
    setCurrentCardIndex(0)
  }

  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5)
    setFilteredCards(shuffled)
    setCurrentCardIndex(0)
  }

  const resetProgress = () => {
    setFlipped({})
    setCurrentCardIndex(0)
  }

  const handleEditCard = (index) => {
    setEditingCard({
      index,
      data: { ...filteredCards[index] },
    })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingCard) return

    try {
      const updatedCards = [...filteredCards]
      updatedCards[editingCard.index] = editingCard.data

      if (!isPreviewMode) {
        const userDocRef = doc(collection(db, "users"), user.id)
        const colRef = collection(userDocRef, collectionName)
        const cardDocRef = doc(colRef, filteredCards[editingCard.index].id)
        await updateDoc(cardDocRef, editingCard.data)
      }

      setFilteredCards(updatedCards)
      setFlashcards(updatedCards)
      setEditDialogOpen(false)
      setEditingCard(null)
    } catch (error) {
      console.error("Error updating flashcard:", error)
    }
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress sx={{ color: "primary.main" }} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        ...(fullscreen && {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
          overflow: "auto",
        }),
      }}
    >
      {!fullscreen && <Navbar />}

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            bgcolor: "background.paper",
            color: "text.primary",
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", borderBottom: "1px solid", borderColor: "divider" }}>
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
        <List>
          <ListItem button onClick={() => router.push("/")}>
            <ListItemIcon sx={{ color: "primary.main" }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => router.push("/flashcards")}>
            <ListItemIcon sx={{ color: "primary.main" }}>
              <ViewModuleIcon />
            </ListItemIcon>
            <ListItemText primary="My Library" />
          </ListItem>
          <ListItem button onClick={() => router.push("/generate-cards")}>
            <ListItemIcon sx={{ color: "primary.main" }}>
              <LightbulbIcon />
            </ListItemIcon>
            <ListItemText primary="Create Cards" />
          </ListItem>
        </List>
        <Divider sx={{ bgcolor: "divider" }} />
        <List>
          <ListItem button onClick={toggleViewMode}>
            <ListItemIcon sx={{ color: "primary.main" }}>
              {viewMode === "grid" ? <ViewCarouselIcon /> : <ViewModuleIcon />}
            </ListItemIcon>
            <ListItemText primary={viewMode === "grid" ? "Card View" : "Grid View"} />
          </ListItem>
          <ListItem button onClick={toggleShowBookmarkedOnly}>
            <ListItemIcon sx={{ color: "primary.main" }}>
              {showBookmarkedOnly ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </ListItemIcon>
            <ListItemText primary={showBookmarkedOnly ? "Show All Cards" : "Bookmarked Only"} />
          </ListItem>
          <ListItem button onClick={shuffleCards}>
            <ListItemIcon sx={{ color: "primary.main" }}>
              <ShuffleIcon />
            </ListItemIcon>
            <ListItemText primary="Shuffle Cards" />
          </ListItem>
          <ListItem button onClick={resetProgress}>
            <ListItemIcon sx={{ color: "primary.main" }}>
              <RefreshIcon />
            </ListItemIcon>
            <ListItemText primary="Reset Progress" />
          </ListItem>
        </List>
      </Drawer>

      <Container
        maxWidth={fullscreen ? false : "lg"}
        sx={{
          pt: fullscreen ? 2 : 10,
          pb: 8,
          px: fullscreen ? 2 : undefined,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress sx={{ color: "primary.main" }} />
          </Box>
        ) : filteredCards.length === 0 ? (
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={0}
            sx={{
              p: 4,
              my: 4,
              borderRadius: 4,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              {showBookmarkedOnly ? "No bookmarked flashcards" : "No flashcards found"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
              {showBookmarkedOnly
                ? "You haven't bookmarked any flashcards in this collection yet."
                : "This collection doesn't have any flashcards yet."}
            </Typography>
            {showBookmarkedOnly ? (
              <Button variant="contained" onClick={toggleShowBookmarkedOnly}>
                Show All Cards
              </Button>
            ) : (
              <Button variant="contained" onClick={() => router.push("/flashcards")}>
                Back to Collections
              </Button>
            )}
          </MotionPaper>
        ) : (
          <Box>
            {!fullscreen && (
              <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                    {collectionName}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Typography variant="body1" sx={{ color: "text.secondary", mr: 2 }}>
                      {filteredCards.length} flashcards
                      {showBookmarkedOnly && ` (bookmarked)`}
                    </Typography>
                    <Box
                      sx={{
                        width: 100,
                        height: 6,
                        bgcolor: "divider",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${progress}%`,
                          height: "100%",
                          bgcolor: "primary.main",
                          transition: "width 0.3s ease-in-out",
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: "text.secondary", ml: 1 }}>
                      {progress}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title={showBookmarkedOnly ? "Show All Cards" : "Show Bookmarked Only"}>
                    <IconButton
                      onClick={toggleShowBookmarkedOnly}
                      sx={{
                        color: showBookmarkedOnly ? "primary.main" : "text.secondary",
                        bgcolor: showBookmarkedOnly ? "rgba(255, 215, 0, 0.1)" : "transparent",
                        "&:hover": { bgcolor: "rgba(255, 215, 0, 0.1)" },
                      }}
                    >
                      {showBookmarkedOnly ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Shuffle Cards">
                    <IconButton
                      onClick={shuffleCards}
                      sx={{
                        color: "text.secondary",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <ShuffleIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reset Progress">
                    <IconButton
                      onClick={resetProgress}
                      sx={{
                        color: "text.secondary",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}

            {viewMode === "carousel" ? (
              <Box sx={{ position: "relative" }}>
                {fullscreen && (
                  <Box sx={{ position: "absolute", top: 0, left: 0, zIndex: 10, p: 2 }}>
                    <IconButton
                      onClick={() => router.push("/flashcards")}
                      sx={{
                        color: "text.primary",
                        bgcolor: "rgba(0, 0, 0, 0.3)",
                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.5)" },
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </Box>
                )}

                <Box
                  ref={cardContainerRef}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: fullscreen ? "calc(100vh - 200px)" : 400,
                    position: "relative",
                  }}
                >
                  <IconButton
                    onClick={handlePrevCard}
                    disabled={currentCardIndex === 0}
                    sx={{
                      position: "absolute",
                      left: { xs: 0, md: -30 },
                      zIndex: 10,
                      color: currentCardIndex === 0 ? "text.disabled" : "primary.main",
                      bgcolor: currentCardIndex === 0 ? "transparent" : "rgba(255, 215, 0, 0.1)",
                      "&:hover": {
                        bgcolor: currentCardIndex === 0 ? "transparent" : "rgba(255, 215, 0, 0.2)",
                      },
                    }}
                  >
                    <ChevronLeftIcon fontSize="large" />
                  </IconButton>

                  <AnimatePresence mode="wait">
                    <MotionBox
                      key={`card-${currentCardIndex}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      onClick={() =>
                        filteredCards[currentCardIndex] && handleCardClick(filteredCards[currentCardIndex].id)
                      }
                      sx={{
                        width: { xs: "100%", sm: fullscreen ? "60%" : 400 },
                        height: fullscreen ? "100%" : 350,
                        perspective: "1000px",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      {filteredCards[currentCardIndex] && (
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            transition: "transform 0.8s",
                            transformStyle: "preserve-3d",
                            transform: flipped[filteredCards[currentCardIndex].id]
                              ? "rotateY(180deg)"
                              : "rotateY(0deg)",
                          }}
                        >
                          <Paper
                            elevation={0}
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
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              boxShadow: theme.shadows[10],
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                textAlign: "center",
                                fontWeight: 600,
                                fontSize: fullscreen ? "1.5rem" : undefined,
                              }}
                            >
                              {filteredCards[currentCardIndex].front}
                            </Typography>
                            <Typography variant="caption" sx={{ position: "absolute", bottom: 16, opacity: 0.7 }}>
                              Click to flip
                            </Typography>
                            <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 1 }}>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditCard(currentCardIndex)
                                }}
                                sx={{
                                  color: "primary.contrastText",
                                  bgcolor: "rgba(0, 0, 0, 0.2)",
                                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.3)" },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                onClick={(e) => toggleBookmark(filteredCards[currentCardIndex].id, e)}
                                sx={{
                                  color: bookmarkedCards[filteredCards[currentCardIndex].id]
                                    ? "primary.contrastText"
                                    : "rgba(0, 0, 0, 0.5)",
                                }}
                              >
                                {bookmarkedCards[filteredCards[currentCardIndex].id] ? (
                                  <BookmarkIcon />
                                ) : (
                                  <BookmarkBorderIcon />
                                )}
                              </IconButton>
                            </Box>
                          </Paper>
                          <Paper
                            elevation={0}
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
                              bgcolor: "background.paper",
                              color: "text.primary",
                              transform: "rotateY(180deg)",
                              border: "1px solid",
                              borderColor: "divider",
                              boxShadow: theme.shadows[10],
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                textAlign: "center",
                                fontSize: fullscreen ? "1.2rem" : undefined,
                              }}
                            >
                              {filteredCards[currentCardIndex].back}
                            </Typography>
                            <Typography variant="caption" sx={{ position: "absolute", bottom: 16, opacity: 0.7 }}>
                              Click to flip back
                            </Typography>
                            <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 1 }}>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditCard(currentCardIndex)
                                }}
                                sx={{
                                  color: "text.secondary",
                                  "&:hover": { bgcolor: "action.hover" },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                onClick={(e) => toggleBookmark(filteredCards[currentCardIndex].id, e)}
                                sx={{
                                  color: bookmarkedCards[filteredCards[currentCardIndex].id]
                                    ? "primary.main"
                                    : "text.secondary",
                                }}
                              >
                                {bookmarkedCards[filteredCards[currentCardIndex].id] ? (
                                  <BookmarkIcon />
                                ) : (
                                  <BookmarkBorderIcon />
                                )}
                              </IconButton>
                            </Box>
                          </Paper>
                        </Box>
                      )}
                    </MotionBox>
                  </AnimatePresence>

                  <IconButton
                    onClick={handleNextCard}
                    disabled={currentCardIndex === filteredCards.length - 1}
                    sx={{
                      position: "absolute",
                      right: { xs: 0, md: -30 },
                      zIndex: 10,
                      color: currentCardIndex === filteredCards.length - 1 ? "text.disabled" : "primary.main",
                      bgcolor: currentCardIndex === filteredCards.length - 1 ? "transparent" : "rgba(255, 215, 0, 0.1)",
                      "&:hover": {
                        bgcolor:
                          currentCardIndex === filteredCards.length - 1 ? "transparent" : "rgba(255, 215, 0, 0.2)",
                      },
                    }}
                  >
                    <ChevronRightIcon fontSize="large" />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Card {currentCardIndex + 1} of {filteredCards.length}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredCards.map((flashcard, index) => (
                  <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                    <MotionPaper
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      elevation={0}
                      onClick={() => handleCardClick(flashcard.id)}
                      sx={{
                        height: 200,
                        borderRadius: 3,
                        perspective: "1000px",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        position: "relative",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
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
                        <Paper
                          elevation={0}
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
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            boxShadow: theme.shadows[5],
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              textAlign: "center",
                              fontWeight: 600,
                              fontSize: "0.95rem",
                            }}
                          >
                            {flashcard.front}
                          </Typography>
                          <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditCard(index)
                              }}
                              sx={{
                                color: "primary.contrastText",
                                bgcolor: "rgba(0, 0, 0, 0.2)",
                                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.3)" },
                                width: 24,
                                height: 24,
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={(e) => toggleBookmark(flashcard.id, e)}
                              sx={{
                                color: bookmarkedCards[flashcard.id] ? "primary.contrastText" : "rgba(0, 0, 0, 0.5)",
                                width: 24,
                                height: 24,
                              }}
                            >
                              {bookmarkedCards[flashcard.id] ? (
                                <BookmarkIcon fontSize="small" />
                              ) : (
                                <BookmarkBorderIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Box>
                        </Paper>
                        <Paper
                          elevation={0}
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
                            bgcolor: "background.paper",
                            color: "text.primary",
                            transform: "rotateY(180deg)",
                            border: "1px solid",
                            borderColor: "divider",
                            boxShadow: theme.shadows[5],
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
                          <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditCard(index)
                              }}
                              sx={{
                                color: "text.secondary",
                                width: 24,
                                height: 24,
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={(e) => toggleBookmark(flashcard.id, e)}
                              sx={{
                                color: bookmarkedCards[flashcard.id] ? "primary.main" : "text.secondary",
                                width: 24,
                                height: 24,
                              }}
                            >
                              {bookmarkedCards[flashcard.id] ? (
                                <BookmarkIcon fontSize="small" />
                              ) : (
                                <BookmarkBorderIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Box>
                        </Paper>
                      </Box>
                    </MotionPaper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Container>

      {/* Floating Action Buttons */}
      <Zoom in={!loading && filteredCards.length > 0}>
        <Fab
          color="primary"
          aria-label="fullscreen"
          onClick={toggleFullscreen}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </Fab>
      </Zoom>

      {/* Study Assistant Chat Bot */}
      <ChatBot context={{ collectionName }} user={myUser}/>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Edit Flashcard
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {editingCard && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Front (Question)"
                fullWidth
                variant="outlined"
                value={editingCard.data.front}
                onChange={(e) =>
                  setEditingCard({
                    ...editingCard,
                    data: { ...editingCard.data, front: e.target.value },
                  })
                }
                sx={{ mb: 3 }}
              />
              <TextField
                margin="dense"
                label="Back (Answer)"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={editingCard.data.back}
                onChange={(e) =>
                  setEditingCard({
                    ...editingCard,
                    data: { ...editingCard.data, back: e.target.value },
                  })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
