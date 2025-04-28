"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { useRouter } from "next/navigation"
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Paper,
  CircularProgress,
  useTheme,
  Tabs,
  Tab,
  Chip,
  Divider,
} from "@mui/material"
import {
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AutoAwesome as AutoAwesomeIcon,
  Collections as CollectionsIcon,
  Quiz as QuizIcon,
  School as SchoolIcon,
} from "@mui/icons-material"
import Navbar from "../../components/ui/navbar"
import User from "../../models/user.model"
import DownloadFlashcards from "../../components/download-flashcards"

const getRandomGradient = () => {
  const gradients = [
    "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}

<<<<<<< Updated upstream
=======
// Sample data for preview mode

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcardSets, setFlashcardSets] = useState([])
  const [flipped, setFlipped] = useState({})
  const [newFlashcard, setNewFlashcard] = useState({ front: "", back: "" })
  const [editFlashcard, setEditFlashcard] = useState({ front: "", back: "" })
  const [newCollectionName, setNewCollectionName] = useState("")
  const [editCollectionName, setEditCollectionName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [openAddFlashcardDialog, setOpenAddFlashcardDialog] = useState(false)
  const [openAddCollectionDialog, setOpenAddCollectionDialog] = useState(false)
  const [openEditFlashcardDialog, setOpenEditFlashcardDialog] = useState(false)
  const [openEditCollectionDialog, setOpenEditCollectionDialog] = useState(false)
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false)
  const [selectedSetIndex, setSelectedSetIndex] = useState(null)
  const [selectedFlashcardIndex, setSelectedFlashcardIndex] = useState(null)
  const [actionType, setActionType] = useState("")
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const router = useRouter()
  const theme = useTheme()
  const [collectionsLoaded, setCollectionsLoaded] = useState(false)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const isQuizSet = (set) => {
    if (set.isQuiz) return true

    return set.flashcards.some((card) => card.back && (card.back.includes("Options:") || card.back.includes("Answer:")))
  }

  const filteredFlashcardSets = (flashcardSets || []).filter(
    (set) =>
      set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      set.flashcards.some(
        (card) =>
          card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.back.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

  const quizSets = filteredFlashcardSets.filter((set) => isQuizSet(set))
  const regularSets = filteredFlashcardSets.filter((set) => !isQuizSet(set))

  const displaySets = tabValue === 0 ? filteredFlashcardSets : tabValue === 1 ? regularSets : quizSets

  const myUser = new User(user)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (user && !collectionsLoaded) {
      fetchCollections()
    }
  }, [user])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const flashcardSets = await myUser.getFlashcardSets()
      setFlashcardSets(flashcardSets)
    } catch (error) {
      console.error("Error fetching collections:", error)
      setError("Failed to load flashcards.")
    } finally {
      setCollectionsLoaded(true)
      setLoading(false)
    }
  }

  const handleCardClick = (id, isQuiz = false) => {
    if (isQuiz) {
      router.push(`/quiz?id=${id}`)
    } else {
      router.push(`/flashcard?id=${id}`)
    }
  }


  const handleFlip = (index) => {
    setFlipped((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const handleOpenAddFlashcardDialog = (setIndex) => {
    setSelectedSetIndex(setIndex)
    setOpenAddFlashcardDialog(true)
  }

  const handleCloseAddFlashcardDialog = () => {
    setOpenAddFlashcardDialog(false)
    setNewFlashcard({ front: "", back: "" })
  }

  const handleAddFlashcard = async () => {
    if (!newFlashcard.front || !newFlashcard.back) {
      setError("Please fill in both fields.")
      return
    }
    try {
      const selectedSet = flashcardSets[selectedSetIndex]

      const updatedSets = await myUser.addFlashcard(selectedSet.name, newFlashcard)
      setFlashcardSets(updatedSets)
      setSuccess("Flashcard added successfully.")
      handleCloseAddFlashcardDialog()
    } catch (error) {
      console.error("Error adding flashcard:", error)
      setError("Failed to add flashcard.")
    }
  }

  const handleOpenAddCollectionDialog = () => {
    setOpenAddCollectionDialog(true)
  }

  const handleCloseAddCollectionDialog = () => {
    setOpenAddCollectionDialog(false)
    setNewCollectionName("")
  }

  const handleAddCollection = async () => {
    if (!newCollectionName) {
      setError("Please enter a collection name.")
      return
    }
    try {
      const updatedSets = await myUser.addCollection(newCollectionName)
      setFlashcardSets(updatedSets)
      setSuccess("Collection added successfully.")
      handleCloseAddCollectionDialog()
    } catch (error) {
      console.error("Error adding collection:", error)
      setError("Failed to add collection.")
    }
  }

  const handleOpenEditFlashcardDialog = (setIndex, flashcardIndex, e) => {
    e.stopPropagation()
    setSelectedSetIndex(setIndex)
    setSelectedFlashcardIndex(flashcardIndex)
    setEditFlashcard(flashcardSets[setIndex].flashcards[flashcardIndex])
    setOpenEditFlashcardDialog(true)
  }

  const handleCloseEditFlashcardDialog = () => {
    setOpenEditFlashcardDialog(false)
    setEditFlashcard({ front: "", back: "" })
  }

  const handleEditFlashcard = async () => {
    if (!editFlashcard.front || !editFlashcard.back) {
      setError("Please fill in both fields.")
      return
    }

    try {
      const updatedSets = await myUser.updateFlashcard(selectedSetIndex, selectedFlashcardIndex, editFlashcard)
      setFlashcardSets(updatedSets)
      setSuccess("Flashcard updated successfully.")
      handleCloseEditFlashcardDialog()
    } catch (error) {
      console.error("Error updating flashcard:", error)
      setError("Failed to update flashcard.")
    }
  }

  const handleOpenEditCollectionDialog = (setIndex) => {
    setSelectedSetIndex(setIndex)
    setEditCollectionName(flashcardSets[setIndex].name)
    setOpenEditCollectionDialog(true)
  }

  const handleCloseEditCollectionDialog = () => {
    setOpenEditCollectionDialog(false)
    setEditCollectionName("")
  }

  const handleEditCollection = async () => {
    try {
      const updatedSets = await myUser.updateCollection(selectedSetIndex, editCollectionName)
      setFlashcardSets(updatedSets)
      setSuccess("Collection updated successfully.")
      handleCloseEditCollectionDialog()
    } catch (error) {
      console.error("Error updating collection:", error)
      setError("Failed to update collection.")
    }
  }

  const handleDeleteFlashcard = async () => {
    try {
      const updatedSets = await myUser.deleteFlashcard(selectedSetIndex, selectedFlashcardIndex)
      setFlashcardSets(updatedSets)
      setSuccess("Flashcard deleted successfully.")
      handleCloseConfirmationDialog()
    } catch (error) {
      console.error("Error deleting flashcard:", error)
      setError("Failed to delete flashcard.")
    }
  }

  const handleDeleteCollection = async () => {
    try {
      const updatedSets = await myUser.deleteCollection(selectedSetIndex)
      setFlashcardSets(updatedSets)
      setSuccess("Collection deleted successfully.")
      handleCloseConfirmationDialog()
    } catch (error) {
      console.error("Error deleting collection:", error)
      setError("Failed to delete collection.")
    }
  }

  const handleOpenConfirmationDialog = (type, setIndex, flashcardIndex, e) => {
    if (e) e.stopPropagation()
    setActionType(type)
    setSelectedSetIndex(setIndex)
    setSelectedFlashcardIndex(flashcardIndex)
    setOpenConfirmationDialog(true)
  }

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleGeneratePageClick = () => {
    router.push("/generate-cards")
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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <CollectionsIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              My Library
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Manage your flashcard collections and quizzes
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: { xs: "center", sm: "space-between" },
              gap: 2,
            }}
          >
            <TextField
              placeholder="Search collections and flashcards..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
              sx={{
                flex: 1,
              }}
            />
            <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, sm: 0 } }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenAddCollectionDialog}
                sx={{
                  height: 48,
                  flex: { xs: 1, sm: "none" },
                  whiteSpace: "nowrap",
                }}
              >
                New
              </Button>
              <Button
                variant="contained"
                startIcon={<AutoAwesomeIcon />}
                onClick={handleGeneratePageClick}
                sx={{
                  height: 48,
                  flex: { xs: 1, sm: "none" },
                  whiteSpace: "nowrap",
                }}
              >
                AI Generate
              </Button>
            </Box>
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress sx={{ color: "primary.main" }} />
          </Box>
        ) : filteredFlashcardSets.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              my: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,165,0,0.05) 100%)",
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              {searchTerm ? "No matching collections found" : "No flashcard collections yet"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {searchTerm
                ? "Try a different search term or create a new collection"
                : "Create your first collection to get started"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddCollectionDialog}
              sx={{
                py: 1.5,
                px: 3,
              }}
            >
              Create Collection
            </Button>
          </Paper>
        ) : (
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="flashcard categories"
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  },
                }}
              >
                <Tab
                  icon={<CollectionsIcon sx={{ mr: 1 }} />}
                  iconPosition="start"
                  label={`All (${filteredFlashcardSets.length})`}
                />
                <Tab
                  icon={<SchoolIcon sx={{ mr: 1 }} />}
                  iconPosition="start"
                  label={`Flashcards (${regularSets.length})`}
                />
                <Tab icon={<QuizIcon sx={{ mr: 1 }} />} iconPosition="start" label={`Quizzes (${quizSets.length})`} />
              </Tabs>
            </Box>

            <Grid container spacing={2}>
              {displaySets.map((set, setIndex) => {
                const isQuiz = isQuizSet(set)
                const actualIndex = flashcardSets.findIndex((s) => s.name === set.name)

                return (
                  <Grid item xs={12} sm={6} md={4} key={setIndex} sx={{ width: { xs: "100%", sm: "48%",md: "32%" } }}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          background: getRandomGradient(),
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {isQuiz ? (
                            <QuizIcon sx={{ mr: 1, fontSize: 20 }} />
                          ) : (
                            <SchoolIcon sx={{ mr: 1, fontSize: 20 }} />
                          )}
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                            {set.name || `Set ${setIndex + 1}`}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${set.flashcards.length} ${set.flashcards.length === 1 ? "card" : "cards"}`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 255, 255, 0.2)",
                            color: "white",
                            fontSize: "0.7rem",
                            height: 20,
                          }}
                        />
                      </Box>

                      <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column"}}>
                        {set.flashcards.length === 0 ? (
                          <Box
                            sx={{
                              textAlign: "center",
                              py: 2,
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                              This collection is empty
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => handleOpenAddFlashcardDialog(actualIndex)}
                            >
                              Add Card
                            </Button>
                          </Box>
                        ) : (
                          <>
                            <Box sx={{ mb: 1, flexGrow: 1 }}>
                              {set.flashcards.slice(0, 2).map((flashcard, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    p: 1.5,
                                    mb: 1,
                                    borderRadius: 1,
                                    bgcolor: "background.default",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    fontSize: "0.85rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    position: "relative",
                                  }}
                                >
                                  {flashcard.front}
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: 2,
                                      right: 2,
                                      display: "flex",
                                      opacity: 0,
                                      transition: "opacity 0.2s",
                                      ".MuiBox-root:hover &": { opacity: 1 },
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={(e) => handleOpenEditFlashcardDialog(actualIndex, index, e)}
                                      sx={{ p: 0.5 }}
                                    >
                                      <EditIcon fontSize="small" sx={{ fontSize: "0.85rem" }} />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={(e) =>
                                        handleOpenConfirmationDialog("deleteFlashcard", actualIndex, index, e)
                                      }
                                      sx={{ p: 0.5 }}
                                    >
                                      <DeleteIcon fontSize="small" sx={{ fontSize: "0.85rem" }} />
                                    </IconButton>
                                  </Box>
                                </Box>
                              ))}

                              {set.flashcards.length > 2 && (
                                <Typography
                                  variant="body2"
                                  sx={{ color: "text.secondary", textAlign: "center", fontSize: "0.8rem", mt: 1 }}
                                >
                                  +{set.flashcards.length - 2} more cards
                                </Typography>
                              )}
                            </Box>
                          </>
                        )}
                      </CardContent>

                      <Divider />

                      <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5 }}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditCollectionDialog(actualIndex)}
                            sx={{ p: 0.5 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => handleOpenConfirmationDialog("deleteCollection", actualIndex, null, e)}
                            sx={{ p: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenAddFlashcardDialog(actualIndex)}
                            sx={{ p: 0.5 }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                          <DownloadFlashcards
                            flashcards={set.flashcards}
                            collectionName={set.name}
                            buttonSize="small"
                          />
                        </Box>

                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleCardClick(set.name, isQuiz)}
                          sx={{
                            px: 2,
                            py: 0.5,
                            minWidth: 0,
                            fontSize: "0.75rem",
                            bgcolor: isQuiz ? "secondary.main" : "primary.main",
                            "&:hover": {
                              bgcolor: isQuiz ? "secondary.dark" : "primary.dark",
                            },
                          }}
                        >
                          {isQuiz ? "Take Quiz" : "Study"}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Dialogs */}
      <Dialog open={openAddFlashcardDialog} onClose={handleCloseAddFlashcardDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Add New Flashcard
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Front (Question)"
            fullWidth
            variant="outlined"
            value={newFlashcard.front}
            onChange={(e) => setNewFlashcard({ ...newFlashcard, front: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            label="Back (Answer)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newFlashcard.back}
            onChange={(e) => setNewFlashcard({ ...newFlashcard, back: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseAddFlashcardDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAddFlashcard} variant="contained">
            Add Flashcard
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditFlashcardDialog} onClose={handleCloseEditFlashcardDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Edit Flashcard
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Front (Question)"
            fullWidth
            variant="outlined"
            value={editFlashcard.front}
            onChange={(e) => setEditFlashcard({ ...editFlashcard, front: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            label="Back (Answer)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={editFlashcard.back}
            onChange={(e) => setEditFlashcard({ ...editFlashcard, back: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEditFlashcardDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleEditFlashcard} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddCollectionDialog} onClose={handleCloseAddCollectionDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Create New Collection
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            fullWidth
            variant="outlined"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseAddCollectionDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAddCollection} variant="contained">
            Create Collection
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditCollectionDialog} onClose={handleCloseEditCollectionDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Edit Collection
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            fullWidth
            variant="outlined"
            value={editCollectionName}
            onChange={(e) => setEditCollectionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEditCollectionDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleEditCollection} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmationDialog} onClose={handleCloseConfirmationDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            {actionType === "deleteFlashcard" ? "Delete Flashcard" : "Delete Collection"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1">
            Are you sure you want to{" "}
            {actionType === "deleteFlashcard"
              ? "delete this flashcard?"
              : "delete this collection and all its flashcards?"}
            <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseConfirmationDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={actionType === "deleteFlashcard" ? handleDeleteFlashcard : handleDeleteCollection}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(success)} autoHideDuration={6000} onClose={() => setSuccess("")}>
        <Alert onClose={() => setSuccess("")} severity="success" variant="filled" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert onClose={() => setError("")} severity="error" variant="filled" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}
