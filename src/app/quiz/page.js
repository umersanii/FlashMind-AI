"use client"

<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { useEffect, useState } from "react"
=======
import { useState, useEffect } from "react"
>>>>>>> Stashed changes
=======
import { useState, useEffect } from "react"
>>>>>>> Stashed changes
import { useUser } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  Pagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material"
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpIcon as ArrowBack,
  RefreshCwIcon as Refresh,
  Check,
  X,
  Edit,
  TimerIcon,
} from "lucide-react"
import Navbar from "../../components/ui/navbar"
import ChatBot from "../../components/chat-bot"
import User from "../../models/user.model"
import DownloadFlashcards from "../../components/download-flashcards"
import PomodoroTimer from "../../components/pomodoro-timer"

export default function Quiz() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [quizQuestions, setQuizQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [collectionName, setCollectionName] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [language, setLanguage] = useState("en") // Default language
  const [showTimer, setShowTimer] = useState(true)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get("id")

  const myUser = new User(user)

  useEffect(() => {
    async function getQuiz() {
      if (!search) return

      setLoading(true)
      try {
        // If user is not loaded yet, return early
        if (!user || !user.id) return
        const flashcardsData = await myUser.getFlashcards(search)

        // Convert flashcards to quiz questions format
        const questions = flashcardsData.map((card) => {
          // Parse the back of the card to extract options and correct answer
          const backText = card.back || ""
          let options = []
          let correctAnswer = 0

          if (backText.includes("Options:")) {
            // Extract answer
            const answerMatch = backText.match(/Answer: (.*?)(?:\n|$)/)
            const answer = answerMatch ? answerMatch[1] : ""

            // Extract options
            const optionsMatch = backText.match(/Options:\n([\s\S]*)/)
            if (optionsMatch) {
              options = optionsMatch[1].split("\n").filter((opt) => opt.trim())
              // Find the correct answer index
              correctAnswer = options.findIndex((opt) => opt === answer)
              if (correctAnswer === -1) correctAnswer = 0
            }
          } else {
            // Fallback: create a simple true/false question
            options = ["True", "False"]
            correctAnswer = 0
          }

          return {
            id: card.id,
            question: card.front,
            options: options.length > 0 ? options : ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: correctAnswer >= 0 ? correctAnswer : 0,
          }
        })

        setQuizQuestions(questions)
        setCollectionName(search)
      } catch (error) {
        console.error("Error fetching quiz:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && isSignedIn) {
      getQuiz()
    }
  }, [search, isLoaded, isSignedIn, user?.id]) // Remove myUser from dependencies

  useEffect(() => {
    const updateUserStreak = async () => {
      if (isLoaded && isSignedIn && user && quizQuestions.length > 0) {
        try {
          const userModel = new User(user)
          await userModel.updateStreak()
        } catch (error) {
          console.error("Error updating streak:", error)
        }
      }
    }

    // Update streak when quiz questions are loaded
    if (quizQuestions.length > 0 && !loading) {
      updateUserStreak()
    }
  }, [quizQuestions, isLoaded, isSignedIn, user, loading])

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answerIndex,
=======
=======
>>>>>>> Stashed changes
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip,
  LinearProgress,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  useTheme,
} from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Timer as TimerIcon,
  EmojiEvents as EmojiEventsIcon,
} from "@mui/icons-material"
import { collection, doc, getDoc } from "firebase/firestore"
import { db } from "../../utils/firebase"
import Navbar from "../../components/ui/navbar"
import User from "../../models/user.model"

export default function QuizPage({ darkMode, toggleDarkMode }) {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const deckId = searchParams.get("id")

  const [collections, setCollections] = useState([])
  const [selectedCollection, setSelectedCollection] = useState("")
  const [numQuestions, setNumQuestions] = useState(5)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const theme = useTheme()

  // Sample quiz data for preview mode
  const sampleQuiz = {
    id: "sample-quiz",
    title: "Sample Quiz",
    questions: [
      {
        id: "q1",
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Paris",
        explanation: "Paris is the capital and most populous city of France.",
      },
      {
        id: "q2",
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
        explanation: "Mars is called the Red Planet because of its reddish appearance.",
      },
      {
        id: "q3",
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: "Au",
        explanation: "The chemical symbol for gold is Au, from the Latin word 'aurum'.",
      },
      {
        id: "q4",
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctAnswer: "William Shakespeare",
        explanation: "Romeo and Juliet is a tragedy written by William Shakespeare.",
      },
      {
        id: "q5",
        question: "What is the largest organ in the human body?",
        options: ["Heart", "Liver", "Skin", "Brain"],
        correctAnswer: "Skin",
        explanation: "The skin is the largest organ of the human body.",
      },
    ],
    totalQuestions: 5,
  }

  // Check if we're in preview mode
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsPreviewMode(true)
        setLoading(false)
        setCollections([
          { id: "sample-biology", name: "Biology" },
          { id: "sample-history", name: "History" },
          { id: "sample-math", name: "Mathematics" },
        ])
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLoaded])

  // Fetch collections when user is loaded
  useEffect(() => {
    if (isLoaded && isSignedIn && !isPreviewMode) {
      fetchCollections()
    }
  }, [isLoaded, isSignedIn, isPreviewMode])

  // If deck ID is provided, load that specific deck
  useEffect(() => {
    if (deckId && isLoaded && isSignedIn) {
      setSelectedCollection(deckId)
      handleGenerateQuiz()
    }
  }, [deckId, isLoaded, isSignedIn])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const userDocRef = doc(collection(db, "users"), user.id)
      const docSnap = await getDoc(userDocRef)

      if (docSnap.exists()) {
        const flashcardSets = docSnap.data().flashcardSets || []
        setCollections(flashcardSets.map((set) => ({ id: set.name, name: set.name })))
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching collections:", error)
      setLoading(false)
    }
  }

  const handleGenerateQuiz = async () => {
    if (!selectedCollection) {
      alert("Please select a collection")
      return
    }

    try {
      setGenerating(true)

      if (isPreviewMode) {
        // Use sample quiz in preview mode
        setTimeout(() => {
          setQuiz(sampleQuiz)
          setGenerating(false)
          resetQuiz()
        }, 1500)
        return
      }

      // Generate quiz using the user's model
      const myUser = new User(user)
      const generatedQuiz = await myUser.generateQuiz(selectedCollection, numQuestions)

      setQuiz(generatedQuiz)
      resetQuiz()
      setGenerating(false)
    } catch (error) {
      console.error("Error generating quiz:", error)
      setGenerating(false)
      alert("Failed to generate quiz. Please try again.")
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizStarted(false)
    setScore(0)
    setTimeRemaining(numQuestions * 30) // 30 seconds per question
  }

  const startQuiz = () => {
    setQuizStarted(true)
    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (!showResults) {
            handleFinishQuiz()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Cleanup timer on component unmount
    return () => clearInterval(timer)
  }

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer,
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    })
  }

  const handleNextQuestion = () => {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
=======
=======
>>>>>>> Stashed changes
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleFinishQuiz()
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const handlePageChange = (event, page) => {
    setCurrentQuestionIndex(page - 1)
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

  const resetQuiz = () => {
    setUserAnswers({})
    setShowResults(false)
    setCurrentQuestionIndex(0)
  }

  const handleEditQuestion = (index) => {
    setEditingQuestion({
      index,
      data: { ...quizQuestions[index] },
    })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingQuestion) return

    try {
      const updatedQuestions = [...quizQuestions]
      updatedQuestions[editingQuestion.index] = editingQuestion.data

      setQuizQuestions(updatedQuestions)
      setEditDialogOpen(false)
      setEditingQuestion(null)
    } catch (error) {
      console.error("Error updating quiz question:", error)
    }
  }

  const toggleTimer = () => {
    setShowTimer(!showTimer)
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
=======
=======
>>>>>>> Stashed changes
  const handleFinishQuiz = () => {
    // Calculate score
    let correctCount = 0
    quiz.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const getScoreColor = () => {
    const percentage = (score / quiz.questions.length) * 100
    if (percentage >= 80) return "success.main"
    if (percentage >= 60) return "warning.main"
    return "error.main"
  }

  if (!isLoaded || (!isSignedIn && !isPreviewMode)) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      </Box>
    )
  }

  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{
          pt: 10,
          pb: 8,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress sx={{ color: "primary.main" }} />
          </Box>
        ) : quizQuestions.length === 0 ? (
          <Paper
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
              No quiz questions found
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
              This collection doesn't have any quiz questions yet.
            </Typography>
            <Button variant="contained" onClick={() => router.push("/flashcards")}>
              Back to Collections
            </Button>
          </Paper>
        ) : (
          <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  {collectionName}
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
                  {quizQuestions.length} questions
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title={showTimer ? "Hide Timer" : "Show Timer"}>
                  <IconButton onClick={toggleTimer} sx={{ color: "text.secondary" }}>
                    <TimerIcon />
                  </IconButton>
                </Tooltip>
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push("/flashcards")}>
                  Back to Collections
                </Button>
                <Button variant="outlined" startIcon={<Refresh />} onClick={resetQuiz}>
                  Reset Quiz
                </Button>
                <DownloadFlashcards
                  flashcards={quizQuestions.map((q) => ({
                    id: Math.random().toString(),
                    front: q.question,
                    back: `Answer: ${q.options[q.correctAnswer]}\n\nOptions:\n${q.options.join("\n")}`,
                  }))}
                  collectionName={collectionName}
                />
              </Box>
            </Box>

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

                <Button variant="contained" onClick={resetQuiz} sx={{ mb: 4 }}>
                  Retake Quiz
                </Button>

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
            ) : (
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

                  <Paper
                    elevation={0}
                    sx={{
                      width: { xs: "100%", sm: 500 },
                      borderRadius: 4,
                      border: "1px solid",
                      borderColor: "divider",
                      position: "relative",
                      ...(language === "ur" ? { direction: "rtl" } : {}),
                    }}
                  >
                    <IconButton
                      onClick={() => handleEditQuestion(currentQuestionIndex)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "text.secondary",
                        bgcolor: "background.paper",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <Edit size={16} />
                    </IconButton>

                    <Box sx={{ p: 4 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1, color: "text.secondary" }}>
                        Question {currentQuestionIndex + 1} of {quizQuestions.length}
                      </Typography>
                      <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>
                        {quizQuestions[currentQuestionIndex]?.question}
                      </Typography>

                      <RadioGroup
                        value={userAnswers[currentQuestionIndex] !== undefined ? userAnswers[currentQuestionIndex] : ""}
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
                    </Box>
                  </Paper>

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

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 4 }}>
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
=======
=======
>>>>>>> Stashed changes
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, display: "flex", alignItems: "center" }}>
            <QuestionAnswerIcon sx={{ mr: 2, color: "primary.main" }} />
            Quiz Mode
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
            Test your knowledge with AI-generated quizzes based on your flashcards
          </Typography>
        </Box>

        {!quiz ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Generate a New Quiz
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Select Collection</InputLabel>
                      <Select
                        value={selectedCollection}
                        onChange={(e) => setSelectedCollection(e.target.value)}
                        label="Select Collection"
                      >
                        <MenuItem value="">
                          <em>Select a collection</em>
                        </MenuItem>
                        {collections.map((collection) => (
                          <MenuItem key={collection.id} value={collection.id}>
                            {collection.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Number of Questions</InputLabel>
                      <Select
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(e.target.value)}
                        label="Number of Questions"
                      >
                        <MenuItem value={5}>5 questions</MenuItem>
                        <MenuItem value={10}>10 questions</MenuItem>
                        <MenuItem value={15}>15 questions</MenuItem>
                        <MenuItem value={20}>20 questions</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGenerateQuiz}
                    disabled={generating || !selectedCollection}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {generating ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1, color: "inherit" }} />
                        Generating Quiz...
                      </>
                    ) : (
                      "Generate Quiz"
                    )}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                  </Button>
                </Box>
              </Box>
            )}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          </Box>
        )}
      </Container>

      {/* Pomodoro Timer */}
      {showTimer && <PomodoroTimer position="floating" />}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Edit Question
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {editingQuestion && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Question"
                fullWidth
                variant="outlined"
                value={editingQuestion.data.question}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    data: { ...editingQuestion.data, question: e.target.value },
                  })
                }
                sx={{ mb: 3 }}
              />

              {editingQuestion.data.options.map((option, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Radio
                    checked={editingQuestion.data.correctAnswer === index}
                    onChange={() =>
                      setEditingQuestion({
                        ...editingQuestion,
                        data: { ...editingQuestion.data, correctAnswer: index },
                      })
                    }
                  />
                  <TextField
                    margin="dense"
                    label={`Option ${index + 1}${editingQuestion.data.correctAnswer === index ? " (Correct)" : ""}`}
                    fullWidth
                    variant="outlined"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...editingQuestion.data.options]
                      newOptions[index] = e.target.value
                      setEditingQuestion({
                        ...editingQuestion,
                        data: { ...editingQuestion.data, options: newOptions },
                      })
                    }}
                  />
                </Box>
              ))}
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

      {/* Study Assistant Chat Bot */}
      <ChatBot context={{ collectionName }} user={myUser} />
=======
=======
>>>>>>> Stashed changes
          </Paper>
        ) : !quizStarted ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                {quiz.title || "Quiz Ready"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
                This quiz contains {quiz.questions.length} questions. You'll have {formatTime(timeRemaining)} to
                complete it.
              </Typography>
              <Button variant="contained" size="large" onClick={startQuiz} sx={{ px: 4, py: 1.5 }}>
                Start Quiz
              </Button>
            </Box>
          </Paper>
        ) : showResults ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ textAlign: "center", py: 3 }}>
              <EmojiEventsIcon sx={{ fontSize: 60, color: getScoreColor(), mb: 2 }} />
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                Quiz Completed!
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, color: getScoreColor() }}>
                Your Score: {score}/{quiz.questions.length} ({Math.round((score / quiz.questions.length) * 100)}%)
              </Typography>

              <Box sx={{ mb: 4 }}>
                <LinearProgress
                  variant="determinate"
                  value={(score / quiz.questions.length) * 100}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: "background.paper",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: getScoreColor(),
                    },
                  }}
                />
              </Box>

              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Review Your Answers
              </Typography>

              {quiz.questions.map((question, index) => (
                <Card
                  key={question.id}
                  sx={{
                    mb: 3,
                    borderLeft: 5,
                    borderColor:
                      selectedAnswers[question.id] === question.correctAnswer ? "success.main" : "error.main",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                      Question {index + 1}: {question.question}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Your answer:
                      </Typography>
                      <Chip
                        label={selectedAnswers[question.id] || "Not answered"}
                        color={selectedAnswers[question.id] === question.correctAnswer ? "success" : "error"}
                        icon={selectedAnswers[question.id] === question.correctAnswer ? <CheckIcon /> : <CloseIcon />}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Correct answer:
                      </Typography>
                      <Chip label={question.correctAnswer} color="success" size="small" />
                    </Box>
                    {question.explanation && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Explanation:</strong> {question.explanation}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
                <Button variant="outlined" onClick={resetQuiz} startIcon={<RefreshIcon />}>
                  Retake Quiz
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setQuiz(null)
                    setSelectedCollection("")
                  }}
                >
                  Create New Quiz
                </Button>
              </Box>
            </Box>
          </Paper>
        ) : (
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="body1">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TimerIcon sx={{ mr: 1, color: timeRemaining < 30 ? "error.main" : "text.secondary" }} />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    color: timeRemaining < 30 ? "error.main" : "text.primary",
                  }}
                >
                  {formatTime(timeRemaining)}
                </Typography>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  {quiz.questions[currentQuestionIndex].question}
                </Typography>

                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <RadioGroup
                    value={selectedAnswers[quiz.questions[currentQuestionIndex].id] || ""}
                    onChange={(e) => handleAnswerSelect(quiz.questions[currentQuestionIndex].id, e.target.value)}
                  >
                    {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={option}
                        sx={{
                          p: 1.5,
                          mb: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          width: "100%",
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                          ...(selectedAnswers[quiz.questions[currentQuestionIndex].id] === option && {
                            bgcolor: "primary.light",
                            borderColor: "primary.main",
                          }),
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  startIcon={<ArrowBackIcon />}
                >
                  Previous
                </Button>

                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <Button variant="contained" onClick={handleFinishQuiz} color="primary">
                    Finish Quiz
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleNextQuestion} endIcon={<ArrowForwardIcon />}>
                    Next
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
        )}
      </Container>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    </Box>
  )
}
