"use client"

import { useUser } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "../../utils/firebase"
import { getDoc, collection, doc } from "firebase/firestore"
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Divider,
  Pagination,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material"
import User from "../../models/user.model"
import Navbar from "../../components/ui/navbar"
import FileUpload from "../../components/file-upload"
import AudioRecorder from "../../components/audio-recorder"

export default function GenerateCards() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState("")
  const [name, setName] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [existingCollections, setExistingCollections] = useState([])
  const [selectedCollection, setSelectedCollection] = useState("")
  const router = useRouter()
  const [flashcards, setFlashcards] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [collectionsLoaded, setCollectionsLoaded] = useState(false)
  const theme = useTheme()

  const [difficulty, setDifficulty] = useState(2)
  const [numQuestions, setNumQuestions] = useState(10)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [viewMode, setViewMode] = useState(0)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))


  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  const myUser = new User(user || {})

  useEffect(() => {
    let isMounted = true
    let shouldFetchCollections = false

    if (isLoaded && isSignedIn) {
      shouldFetchCollections = true
    }

    const fetchCollections = async () => {
      try {
        const userDocRef = doc(collection(db, "users"), user.id)
        const docSnap = await getDoc(userDocRef)
        if (docSnap.exists() && isMounted) {
          const flashcardSets = docSnap.data().flashcardSets || []
          setExistingCollections(flashcardSets.map((set) => set.name))
        }
      } catch (error) {
        console.error("Error fetching collections:", error)
      } finally {
        setCollectionsLoaded(true)
      }
    }

    if (isLoaded) {
      if (isSignedIn) {
        fetchCollections()
      } else {
        setCollectionsLoaded(true)
      }
    }

    if (isLoaded && isSignedIn) {
      fetchCollections()
    } else {
      setCollectionsLoaded(true)
    }

    return () => {
      isMounted = false
    }
  }, [isLoaded, isSignedIn, user])

  const handleTextExtracted = (extractedText) => {
    setText(extractedText)
  }

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.")
      return
    }

    try {
      setIsGenerating(true)
      console.log("Generating flashcards...")

      const deck = await myUser.generateFlashcardSet(text, difficulty, numQuestions)

      if (!deck || !deck.flashcards) {
        console.error("Invalid deck format:", deck)
        alert("Invalid deck format. Please try again.")
        return
      }

      const generatedFlashcards = deck.flashcards.map((flashcard, index) => ({
        id: index.toString(),
        front: flashcard.front,
        back: flashcard.back,
      }))

      setFlipped(new Array(generatedFlashcards.length).fill(false))
      setFlashcards(generatedFlashcards)
      setCurrentCardIndex(0)

      console.log("Flashcards generated successfully:", generatedFlashcards)
    } catch (error) {
      console.error("Error generating flashcards:", error)
      alert("An error occurred while generating flashcards. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCardClick = (index) => {
    const newFlipped = [...flipped]
    newFlipped[index] = !newFlipped[index]
    setFlipped(newFlipped)
  }

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const saveFlashcards = async () => {
    if (!name && !selectedCollection) {
      alert("Please enter a name for your flashcard set or select an existing collection.")
      return
    }

    try {
      await myUser.saveFlashcardsToCollection(name, flashcards, false, selectedCollection)
      handleCloseDialog()
      router.push("/flashcards")
    } catch (error) {
      console.error("Error saving flashcards:", error)
      alert("An error occurred while saving flashcards. Please try again.")
    }
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

  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue)
  }

  const handleDifficultyChange = (event, newValue) => {
    setDifficulty(newValue)
  }

  const handleNumQuestionsChange = (event) => {
    setNumQuestions(event.target.value)
  }

  const handlePageChange = (event, page) => {
    setCurrentCardIndex(page - 1)
  }

  const getDifficultyLabel = (value) => {
    switch (value) {
      case 1:
        return "Easy"
      case 2:
        return "Medium"
      case 3:
        return "Hard"
      default:
        return "Medium"
    }
  }


  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
            <Box display="flex" alignItems="center">
              <SaveIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h5" fontWeight={600}>
                Save Flashcard Set
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <DialogContentText sx={{ mb: 3 }}>
              Please enter a name for your flashcard set or select an existing collection.
            </DialogContentText>
            {!selectedCollection && (
              <TextField
                autoFocus
                margin="dense"
                label="New Set Name"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
                variant="outlined"
              />
            )}
            {existingCollections.length > 0 && (
              <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                <InputLabel>Select Collection</InputLabel>
                <Select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  label="Select Collection"
                >
                  <MenuItem value="">None</MenuItem>
                  {existingCollections.map((collectionName) => (
                    <MenuItem key={collectionName} value={collectionName}>
                      {collectionName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 2, px: 3 }}>
              Cancel
            </Button>
            <Button
              onClick={saveFlashcards}
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            mb: 4,
            border: "1px solid",
            borderColor: "divider",
            background: "linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,165,0,0.05) 100%)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <LightbulbIcon sx={{ mr: 2, color: "primary.main" }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, m: 0 }}>
              Generate Flashcards
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
            Enter your study material below, set your preferences, and our AI will create flashcards to help you learn
            more effectively.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Input Methods
            </Typography>
            <FileUpload onTextExtracted={handleTextExtracted} />
            <AudioRecorder onTextExtracted={(transcribedText) => setText(text + " " + transcribedText)} />
          </Box>

          <Grid container spacing={4} justifyContent={isMobile ? "center" : "space-between"}>
            <Grid item xs={12} md={8} width={isMobile ? "100%" : "65%"}>
              <TextField
                value={text}
                onChange={(e) => setText(e.target.value)}
                label="Enter text to generate flashcards"
                placeholder="Paste your notes, textbook content, or any study material here..."
                fullWidth
                multiline
                rows={14}
                height="100%"
                variant="outlined"
                sx={{
                  mb: { xs: 2, md: 0 },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4} width={isMobile ? "auto" : "30%"}>
              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: 2, height: "100%", border: "1px solid", borderColor: "divider" }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  <SettingsIcon sx={{ mr: 1, fontSize: 20, verticalAlign: "text-bottom" }} />
                  Generation Settings
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Typography id="difficulty-slider" gutterBottom sx={{ color: "text.secondary", fontWeight: 500 }}>
                    Difficulty Level:{" "}
                    <Chip
                      label={getDifficultyLabel(difficulty)}
                      size="small"
                      color={difficulty === 1 ? "success" : difficulty === 2 ? "primary" : "error"}
                    />
                  </Typography>
                  <Slider
                    value={difficulty}
                    onChange={handleDifficultyChange}
                    step={1}
                    marks
                    min={1}
                    max={3}
                    aria-labelledby="difficulty-slider"
                    sx={{ color: difficulty === 1 ? "success.main" : difficulty === 2 ? "primary.main" : "error.main" }}
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography gutterBottom sx={{ color: "text.secondary", fontWeight: 500 }}>
                    Number of Questions
                  </Typography>
                  <FormControl fullWidth variant="outlined" size="small">
                    <Select value={numQuestions} onChange={handleNumQuestionsChange}>
                      <MenuItem value={5}>5 questions</MenuItem>
                      <MenuItem value={10}>10 questions</MenuItem>
                      <MenuItem value={15}>15 questions</MenuItem>
                      <MenuItem value={20}>20 questions</MenuItem>
                      <MenuItem value={30}>30 questions</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isGenerating || !text.trim()}
                  fullWidth
                  size="large"
                  startIcon={isGenerating ? null : <PsychologyIcon />}
                >
                  {isGenerating ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      Generating...
                    </Box>
                  ) : (
                    "Generate Flashcards"
                  )}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {isGenerating && (
          <Box sx={{ my: 8, textAlign: "center" }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Generating Your Flashcards
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our AI is creating personalized flashcards based on your content...
            </Typography>
          </Box>
        )}

        {!isGenerating && flashcards.length > 0 && (
          <Fade in={flashcards.length > 0} timeout={500}>
            <Box sx={{ mt: 4, mb: 8 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  Your Flashcards
                </Typography>
                <Box>
                  <Tabs value={viewMode} onChange={handleViewModeChange} aria-label="view mode tabs">
                    <Tab label="Card View" />
                    <Tab label="Grid View" />
                  </Tabs>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {viewMode === 0 && (
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 4 }}>
                    <IconButton
                      onClick={handlePrevCard}
                      disabled={currentCardIndex === 0}
                      sx={{
                        mr: 2,
                        bgcolor: currentCardIndex === 0 ? "transparent" : "rgba(255, 215, 0, 0.1)",
                        "&:hover": {
                          bgcolor: "rgba(255, 215, 0, 0.2)",
                        },
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>

                    <Zoom in={true} timeout={300}>
                      <Card
                        onClick={() => handleCardClick(currentCardIndex)}
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
                            transform: flipped[currentCardIndex] ? "rotateY(180deg)" : "rotateY(0deg)",
                            backgroundColor: "transparent",
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
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                              boxShadow: theme.shadows[10],
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
                              backgroundColor: "background.paper",
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
                        bgcolor: currentCardIndex === flashcards.length - 1 ? "transparent" : "rgba(255, 215, 0, 0.1)",
                        "&:hover": {
                          bgcolor: "rgba(255, 215, 0, 0.2)",
                        },
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                    <Typography variant="body2" sx={{ mr: 2, color: "text.secondary" }}>
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
              )}

              {viewMode === 1 && (
                <Grid container spacing={3}>
                  {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                        <Card
                          onClick={() => handleCardClick(index)}
                          sx={{
                            height: 200,
                            borderRadius: 3,
                            perspective: "100%",
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
                              transition: "transform 0.6s",
                              transformStyle: "preserve-3d",
                              transform: flipped[index] ? "rotateY(180deg)" : "rotateY(0deg)",
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
                                backgroundColor: "primary.main",
                                color: "primary.contrastText",
                                boxShadow: theme.shadows[5],
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  textAlign: "center",
                                  fontWeight: 500,
                                  fontSize: "0.95rem",
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
                                backgroundColor: "background.paper",
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
                            </CardContent>
                          </Box>
                        </Card>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              )}

              <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenDialog}
                  startIcon={<SaveIcon />}
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                  }}
                >
                  Save Flashcards
                </Button>
              </Box>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  )
}
