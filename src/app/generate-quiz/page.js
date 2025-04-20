"use client"

import { useUser } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "../../utils/firebase"
import { writeBatch, getDoc, collection, doc } from "firebase/firestore"
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
  Radio,
  RadioGroup,
  FormControlLabel,
  Tabs,
  Tab,
  Chip,
  Divider,
  Pagination,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material"
import { ChevronLeft, ChevronRight, Save, Settings, BrainIcon as Psychology, Check, X } from "lucide-react"
import User from "../../models/user.model"
import Navbar from "../../components/ui/navbar"
import FileUpload from "../../components/file-upload"

export default function GenerateQuiz() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [text, setText] = useState("")
  const [name, setName] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [existingCollections, setExistingCollections] = useState([])
  const [selectedCollection, setSelectedCollection] = useState("")
  const router = useRouter()
  const [quizQuestions, setQuizQuestions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [collectionsLoaded, setCollectionsLoaded] = useState(false)
  const theme = useTheme()
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [userAnswers, setUserAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const [difficulty, setDifficulty] = useState(2)
  const [numQuestions, setNumQuestions] = useState(5)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [viewMode, setViewMode] = useState(0)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsPreviewMode(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLoaded])

  useEffect(() => {
    if (isLoaded && !isSignedIn && !isPreviewMode) {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, router, isPreviewMode])

  if (!isLoaded && !isPreviewMode) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  const myUser = isPreviewMode ? { generateQuiz: mockGenerateQuiz } : new User(user || {})

  useEffect(() => {
    let isMounted = true
    const fetchCollections = async () => {
      try {
        if (user && user.id) {
          const userDocRef = doc(collection(db, "users"), user.id)
          const docSnap = await getDoc(userDocRef)
          if (docSnap.exists() && isMounted) {
            const flashcardSets = docSnap.data().flashcardSets || []
            setExistingCollections(flashcardSets.map((set) => set.name))
          }
        }
      } catch (error) {
        console.error("Error fetching collections:", error)
      } finally {
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
      alert("Please enter some text to generate quiz questions.")
      return
    }

    try {
      setIsGenerating(true)
      console.log("Generating quiz questions...")

      // Pass difficulty and numQuestions to the API
      const quiz = await myUser.generateQuiz(text, difficulty, numQuestions)

      if (!quiz || !quiz.questions) {
        console.error("Invalid quiz format:", quiz)
        alert("Invalid quiz format. Please try again.")
        return
      }

      setQuizQuestions(quiz.questions)
      setUserAnswers({})
      setShowResults(false)
      setCurrentQuestionIndex(0) // Reset to first question

      console.log("Quiz questions generated successfully:", quiz.questions)
    } catch (error) {
      console.error("Error generating quiz questions:", error)
      alert("An error occurred while generating quiz questions. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answerIndex,
    })
  }

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const saveQuiz = async () => {
    if (!name && !selectedCollection) {
      alert("Please enter a name for your quiz set or select an existing collection.")
      return
    }

    try {
      const batch = writeBatch(db)
      const userDocRef = doc(collection(db, "users"), user.id)

      const docSnap = await getDoc(userDocRef)
      const flashcardSets = docSnap.exists() ? docSnap.data().flashcardSets || [] : []

      // Convert quiz questions to flashcards format
      const flashcards = quizQuestions.map((question, index) => ({
        id: index.toString(),
        front: question.question,
        back: `Answer: ${question.options[question.correctAnswer]}\n\nOptions:\n${question.options.join("\n")}`,
      }))

      if (name) {
        if (flashcardSets.find((set) => set.name === name)) {
          alert("A flashcard set with that name already exists.")
          return
        } else {
          // Add isQuiz property to identify this as a quiz set
          flashcardSets.push({
            name,
            flashcards,
            isQuiz: true, // Add this property
          })
          batch.set(userDocRef, { flashcardSets }, { merge: true })
        }
      } else {
        if (selectedCollection && !flashcardSets.find((set) => set.name === selectedCollection)) {
          alert("Selected collection does not exist.")
          return
        }
      }

      const colRef = selectedCollection ? collection(userDocRef, selectedCollection) : collection(userDocRef, name)

      flashcards.forEach((card) => {
        if (!card.id) {
          console.error("Card ID is missing:", card)
          return
        }

        const cardDocRef = doc(colRef, card.id)
        batch.set(cardDocRef, card)
      })

      await batch.commit()
      console.log("Batch committed successfully")
      handleCloseDialog()
      router.push("/flashcards")
    } catch (error) {
      console.error("Error saving quiz:", error)
      alert("An error occurred while saving quiz. Please try again.")
    }
  }

  const handleSubmitQuiz = () => {
    let correctAnswers = 0
    quizQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })
    setScore(correctAnswers)
    setShowResults(true)
  }

  // New handlers for the enhanced UI
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
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
    setCurrentQuestionIndex(page - 1)
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

  const resetQuiz = () => {
    setUserAnswers({})
    setShowResults(false)
    setCurrentQuestionIndex(0)
  }

  // Mock function for preview mode
  async function mockGenerateQuiz(text) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          questions: [
            {
              question: "What is the capital of France?",
              options: ["London", "Berlin", "Paris", "Madrid"],
              correctAnswer: 2,
            },
            {
              question: "Which planet is known as the Red Planet?",
              options: ["Venus", "Mars", "Jupiter", "Saturn"],
              correctAnswer: 1,
            },
            {
              question: "Who wrote 'Romeo and Juliet'?",
              options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
              correctAnswer: 1,
            },
            {
              question: "What is the chemical symbol for gold?",
              options: ["Go", "Gd", "Au", "Ag"],
              correctAnswer: 2,
            },
            {
              question: "What is the largest ocean on Earth?",
              options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
              correctAnswer: 3,
            },
          ],
        })
      }, 1500)
    })
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
              <Save sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h5" fontWeight={600}>
                Save Quiz
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <DialogContentText sx={{ mb: 3 }}>
              Please enter a name for your quiz or select an existing collection.
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
            <Button onClick={saveQuiz} variant="contained" startIcon={<Save />} sx={{ borderRadius: 2, px: 3 }}>
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
            <Psychology sx={{ mr: 2, color: "primary.main" }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, m: 0 }}>
              Generate Quiz
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
            Enter your study material below, set your preferences, and our AI will create quiz questions to test your
            knowledge.
          </Typography>

          <FileUpload onTextExtracted={handleTextExtracted} />

          <Grid container spacing={4} justifyContent={isMobile ? "center" : "space-between"}>
            <Grid item xs={12} md={8} width={isMobile ? "100%" : "65%"}>
              <TextField
                value={text}
                onChange={(e) => setText(e.target.value)}
                label="Enter text to generate quiz questions"
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
                  <Settings sx={{ mr: 1, size: 20, verticalAlign: "text-bottom" }} />
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
                  startIcon={isGenerating ? null : <Psychology />}
                >
                  {isGenerating ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      Generating...
                    </Box>
                  ) : (
                    "Generate Quiz"
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
              Generating Your Quiz
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our AI is creating personalized quiz questions based on your content...
            </Typography>
          </Box>
        )}

        {!isGenerating && quizQuestions.length > 0 && (
          <Fade in={quizQuestions.length > 0} timeout={500}>
            <Box sx={{ mt: 4, mb: 8 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  Your Quiz
                </Typography>
                <Box>
                  <Tabs value={viewMode} onChange={handleViewModeChange} aria-label="view mode tabs">
                    <Tab label="Question View" />
                    <Tab label="All Questions" />
                  </Tabs>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {showResults ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    mb: 4,
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                    Quiz Results
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4 }}>
                    You scored{" "}
                    <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>
                      {score}
                    </Box>{" "}
                    out of {quizQuestions.length}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
                    <Button variant="outlined" onClick={resetQuiz}>
                      Retake Quiz
                    </Button>
                    <Button variant="contained" onClick={handleOpenDialog}>
                      Save Quiz
                    </Button>
                  </Box>

                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, textAlign: "left" }}>
                      Review Answers:
                    </Typography>
                    {quizQuestions.map((question, qIndex) => (
                      <Paper
                        key={qIndex}
                        elevation={0}
                        sx={{
                          p: 3,
                          mb: 2,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          textAlign: "left",
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                          {qIndex + 1}. {question.question}
                        </Typography>

                        {question.options.map((option, oIndex) => (
                          <Box
                            key={oIndex}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1,
                              borderRadius: 1,
                              mb: 1,
                              bgcolor:
                                oIndex === question.correctAnswer
                                  ? "success.main"
                                  : userAnswers[qIndex] === oIndex && userAnswers[qIndex] !== question.correctAnswer
                                    ? "error.main"
                                    : "transparent",
                              color:
                                oIndex === question.correctAnswer ||
                                (userAnswers[qIndex] === oIndex && userAnswers[qIndex] !== question.correctAnswer)
                                  ? "white"
                                  : "text.primary",
                            }}
                          >
                            {oIndex === question.correctAnswer ? (
                              <Check size={16} style={{ marginRight: 8 }} />
                            ) : userAnswers[qIndex] === oIndex ? (
                              <X size={16} style={{ marginRight: 8 }} />
                            ) : (
                              <Box sx={{ width: 16, height: 16, mr: 1 }} />
                            )}
                            <Typography variant="body2">{option}</Typography>
                          </Box>
                        ))}
                      </Paper>
                    ))}
                  </Box>
                </Paper>
              ) : viewMode === 0 ? (
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 4 }}>
                    <IconButton
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      sx={{
                        mr: 2,
                        bgcolor: currentQuestionIndex === 0 ? "transparent" : "rgba(255, 215, 0, 0.1)",
                        "&:hover": {
                          bgcolor: "rgba(255, 215, 0, 0.2)",
                        },
                      }}
                    >
                      <ChevronLeft />
                    </IconButton>

                    <Zoom in={true} timeout={300}>
                      <Card
                        sx={{
                          width: { xs: "100%", sm: 500 },
                          borderRadius: 4,
                          boxShadow: "none",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, color: "text.secondary" }}>
                            Question {currentQuestionIndex + 1} of {quizQuestions.length}
                          </Typography>
                          <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>
                            {quizQuestions[currentQuestionIndex]?.question}
                          </Typography>

                          <RadioGroup
                            value={
                              userAnswers[currentQuestionIndex] !== undefined ? userAnswers[currentQuestionIndex] : ""
                            }
                            onChange={(e) => handleAnswerSelect(currentQuestionIndex, Number.parseInt(e.target.value))}
                          >
                            {quizQuestions[currentQuestionIndex]?.options.map((option, index) => (
                              <FormControlLabel
                                key={index}
                                value={index}
                                control={<Radio />}
                                label={option}
                                sx={{
                                  mb: 1,
                                  p: 1,
                                  borderRadius: 2,
                                  width: "100%",
                                  "&:hover": {
                                    bgcolor: "action.hover",
                                  },
                                }}
                              />
                            ))}
                          </RadioGroup>
                        </CardContent>
                      </Card>
                    </Zoom>

                    <IconButton
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === quizQuestions.length - 1}
                      sx={{
                        ml: 2,
                        bgcolor:
                          currentQuestionIndex === quizQuestions.length - 1 ? "transparent" : "rgba(255, 215, 0, 0.1)",
                        "&:hover": {
                          bgcolor: "rgba(255, 215, 0, 0.2)",
                        },
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                    <Pagination
                      count={quizQuestions.length}
                      page={currentQuestionIndex + 1}
                      onChange={handlePageChange}
                      color="primary"
                      size="small"
                      sx={{ mr: 2 }}
                    />

                    <Button
                      variant="contained"
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(userAnswers).length < quizQuestions.length}
                      sx={{ ml: 2 }}
                    >
                      Submit Quiz
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {quizQuestions.map((question, qIndex) => (
                    <Grid item xs={12} key={qIndex}>
                      <Zoom in={true} style={{ transitionDelay: `${qIndex * 50}ms` }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            {qIndex + 1}. {question.question}
                          </Typography>

                          <RadioGroup
                            value={userAnswers[qIndex] !== undefined ? userAnswers[qIndex] : ""}
                            onChange={(e) => handleAnswerSelect(qIndex, Number.parseInt(e.target.value))}
                          >
                            {question.options.map((option, oIndex) => (
                              <FormControlLabel
                                key={oIndex}
                                value={oIndex}
                                control={<Radio />}
                                label={option}
                                sx={{
                                  mb: 1,
                                  p: 1,
                                  borderRadius: 2,
                                  width: "100%",
                                  "&:hover": {
                                    bgcolor: "action.hover",
                                  },
                                }}
                              />
                            ))}
                          </RadioGroup>
                        </Paper>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              )}

              {!showResults && (
                <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
                  {viewMode === 1 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(userAnswers).length < quizQuestions.length}
                      startIcon={<Check />}
                      size="large"
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontWeight: 600,
                        mr: 2,
                      }}
                    >
                      Submit Quiz
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenDialog}
                    startIcon={<Save />}
                    size="large"
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontWeight: 600,
                    }}
                  >
                    Save Quiz
                  </Button>
                </Box>
              )}
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  )
}
