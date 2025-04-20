"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "../../utils/firebase"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
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
} from "@mui/material"
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpIcon as ArrowBack,
  RefreshCwIcon as Refresh,
  Check,
  X,
  Edit,
} from "lucide-react"
import Navbar from "../../components/ui/navbar"
import ChatBot from "../../components/chat-bot"
import User from "../../models/user.model"

export default function Quiz() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [quizQuestions, setQuizQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [collectionName, setCollectionName] = useState("")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get("id")

  const myUser = isPreviewMode ? { generateQuiz: mockGenerateQuiz } : new User(user || {})

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsPreviewMode(true)
        setCollectionName("Sample Quiz")
        setLoading(false)
        setQuizQuestions([
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
        ])
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLoaded])

  useEffect(() => {
    async function getQuiz() {
      if (!search || !user || isPreviewMode) return

      setLoading(true)
      try {
        const colRef = collection(doc(collection(db, "users"), user.id), search)
        const docs = await getDocs(colRef)
        const flashcardsData = []
        docs.forEach((doc) => {
          flashcardsData.push({ id: doc.id, ...doc.data() })
        })

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

    if (isLoaded && isSignedIn && !isPreviewMode) {
      getQuiz()
    }
  }, [search, user, isLoaded, isSignedIn, isPreviewMode])

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answerIndex,
    })
  }

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

      if (!isPreviewMode) {
        // Update in Firebase - this would need to convert back to flashcard format
        const userDocRef = doc(collection(db, "users"), user.id)
        const colRef = collection(userDocRef, collectionName)
        const cardDocRef = doc(colRef, quizQuestions[editingQuestion.index].id)

        // Convert quiz question back to flashcard format
        const question = editingQuestion.data
        const flashcardData = {
          front: question.question,
          back: `Answer: ${question.options[question.correctAnswer]}\n\nOptions:\n${question.options.join("\n")}`,
        }

        await updateDoc(cardDocRef, flashcardData)
      }

      setQuizQuestions(updatedQuestions)
      setEditDialogOpen(false)
      setEditingQuestion(null)
    } catch (error) {
      console.error("Error updating quiz question:", error)
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

  // Mock function for preview mode
  async function mockGenerateQuiz() {
    return {
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
      ],
    }
  }

  return (
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
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push("/flashcards")}>
                  Back to Collections
                </Button>
                <Button variant="outlined" startIcon={<Refresh />} onClick={resetQuiz}>
                  Reset Quiz
                </Button>
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
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Container>

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
    </Box>
  )
}
