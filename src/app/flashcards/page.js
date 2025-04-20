"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { collection, doc, setDoc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "../../utils/firebase"
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
} from "@mui/material"
import {
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AutoAwesome as AutoAwesomeIcon,
  Collections as CollectionsIcon,
} from "@mui/icons-material"
import Navbar from "../../components/ui/navbar"

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

// Sample data for preview mode

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
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const router = useRouter()
  const theme = useTheme()

  // Check if we're in preview mode
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsPreviewMode(true)
        setLoading(false)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLoaded])

  useEffect(() => {
    if (isLoaded && !isSignedIn && !isPreviewMode) {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, router, isPreviewMode])

  useEffect(() => {
    if (user && !isPreviewMode) {
      const fetchFlashcards = async () => {
        try {
          setLoading(true)
          const userDocRef = doc(collection(db, "users"), user.id)
          const docSnap = await getDoc(userDocRef)

          if (docSnap.exists()) {
            const flashcardSets = docSnap.data().flashcardSets || []
            setFlashcardSets(flashcardSets)
          } else {
            await setDoc(userDocRef, { flashcardSets: [] })
            setFlashcardSets([])
          }
        } catch (error) {
          console.error("Error fetching flashcards:", error)
          setError("Failed to load flashcards.")
        } finally {
          setLoading(false)
        }
      }

      fetchFlashcards()
    }
  }, [user, isPreviewMode])

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
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
    if (isPreviewMode) {
      const updatedSets = [...flashcardSets]
      updatedSets[selectedSetIndex].flashcards.push({
        id: Date.now().toString(),
        ...newFlashcard,
      })
      setFlashcardSets(updatedSets)
      setSuccess("Flashcard added successfully (Preview Mode).")
      handleCloseAddFlashcardDialog()
      return
    }

    if (!newFlashcard.front || !newFlashcard.back) {
      setError("Please fill in both fields.")
      return
    }
    try {
      const setRef = doc(db, "users", user.id)
      const docSnap = await getDoc(setRef)
      const flashcardSets = docSnap.data().flashcardSets || []
      flashcardSets[selectedSetIndex].flashcards.push(newFlashcard)
      await updateDoc(setRef, { flashcardSets })
      setFlashcardSets(flashcardSets)
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
      const setRef = doc(db, "users", user.id)
      const docSnap = await getDoc(setRef)
      const flashcardSets = docSnap.data().flashcardSets || []
      flashcardSets.push({ name: newCollectionName, flashcards: [] })
      await updateDoc(setRef, { flashcardSets })
      setFlashcardSets(flashcardSets)
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
      if (isPreviewMode) {
        const updatedSets = [...flashcardSets]
        updatedSets[selectedSetIndex].flashcards[selectedFlashcardIndex] = editFlashcard
        setFlashcardSets(updatedSets)
        setSuccess("Flashcard updated successfully (Preview Mode).")
        handleCloseEditFlashcardDialog()
        return
      }

      const setRef = doc(db, "users", user.id)
      const docSnap = await getDoc(setRef)
      const flashcardSets = docSnap.data().flashcardSets || []
      flashcardSets[selectedSetIndex].flashcards[selectedFlashcardIndex] = editFlashcard
      await updateDoc(setRef, { flashcardSets })
      setFlashcardSets(flashcardSets)
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
      const setRef = doc(db, "users", user.id)
      const docSnap = await getDoc(setRef)
      const flashcardSets = docSnap.data().flashcardSets || []
      flashcardSets[selectedSetIndex].name = editCollectionName
      await updateDoc(setRef, { flashcardSets })
      setFlashcardSets(flashcardSets)
      setSuccess("Collection updated successfully.")
      handleCloseEditCollectionDialog()
    } catch (error) {
      console.error("Error updating collection:", error)
      setError("Failed to update collection.")
    }
  }

  const handleDeleteFlashcard = async () => {
    try {
      const setRef = doc(db, "users", user.id)
      const docSnap = await getDoc(setRef)
      const flashcardSets = docSnap.data().flashcardSets || []
      flashcardSets[selectedSetIndex].flashcards.splice(selectedFlashcardIndex, 1)
      await updateDoc(setRef, { flashcardSets })
      setFlashcardSets(flashcardSets)
      setSuccess("Flashcard deleted successfully.")
      handleCloseConfirmationDialog()
    } catch (error) {
      console.error("Error deleting flashcard:", error)
      setError("Failed to delete flashcard.")
    }
  }

  const handleDeleteCollection = async () => {
    try {
      const setRef = doc(db, "users", user.id)
      const docSnap = await getDoc(setRef)
      const flashcardSets = docSnap.data().flashcardSets || []
      flashcardSets.splice(selectedSetIndex, 1)
      await updateDoc(setRef, { flashcardSets })
      setFlashcardSets(flashcardSets)
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

  const filteredFlashcardSets = flashcardSets.filter(
    (set) =>
      set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      set.flashcards.some(
        (flashcard) =>
          flashcard.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flashcard.back.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

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
              My Flashcard Collections
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Manage your flashcard collections or create new ones
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
                  minWidth: { xs: "100%", sm: "auto" },
                  flex: { xs: 1, sm: "none" },
                  whiteSpace: "nowrap",
                }}
              >
                New Collection
              </Button>
              <Button
                variant="contained"
                startIcon={<AutoAwesomeIcon />}
                onClick={handleGeneratePageClick}
                sx={{
                  height: 48,
                  minWidth: { xs: "100%", sm: "auto" },
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
            {filteredFlashcardSets.map((set, setIndex) => (
              <Paper
                key={setIndex}
                elevation={0}
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    background: getRandomGradient(),
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {set.name || `Set ${setIndex + 1}`}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                      {set.flashcards.length} {set.flashcards.length === 1 ? "card" : "cards"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      onClick={() => handleOpenEditCollectionDialog(setIndex)}
                      sx={{ color: "white", bgcolor: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={(e) => handleOpenConfirmationDialog("deleteCollection", setIndex, null, e)}
                      sx={{ color: "white", bgcolor: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {set.flashcards.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
                      This collection is empty
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenAddFlashcardDialog(setIndex)}
                    >
                      Add Flashcard
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Button
                        variant="text"
                        onClick={() => handleCardClick(set.name)}
                        endIcon={<NavigateNextIcon />}
                        sx={{ color: "primary.main" }}
                      >
                        Study All Cards
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenAddFlashcardDialog(setIndex)}
                      >
                        Add Card
                      </Button>
                    </Box>

                    <Grid container spacing={2}>
                      {set.flashcards.slice(0, 3).map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card
                            onClick={() => handleFlip(`${setIndex}-${index}`)}
                            sx={{
                              height: 160,
                              borderRadius: 2,
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
                                transition: "transform 0.6s",
                                transformStyle: "preserve-3d",
                                transform: flipped[`${setIndex}-${index}`] ? "rotateY(180deg)" : "rotateY(0deg)",
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
                                  p: 2,
                                  borderRadius: 2,
                                  backgroundColor: "background.default",
                                  border: "1px solid",
                                  borderColor: "divider",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textAlign: "center",
                                    fontWeight: 500,
                                    overflow: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: "vertical",
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
                                  p: 2,
                                  borderRadius: 2,
                                  backgroundColor: "background.paper",
                                  color: "text.primary",
                                  transform: "rotateY(180deg)",
                                  border: "1px solid",
                                  borderColor: "divider",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textAlign: "center",
                                    overflow: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {flashcard.back}
                                </Typography>
                              </CardContent>
                            </Box>
                            <Box
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                zIndex: 10,
                                display: "flex",
                                gap: 0.5,
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={(e) => handleOpenEditFlashcardDialog(setIndex, index, e)}
                                sx={{ bgcolor: "background.paper" }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={(e) => handleOpenConfirmationDialog("deleteFlashcard", setIndex, index, e)}
                                sx={{ bgcolor: "background.paper" }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {set.flashcards.length > 3 && (
                      <Box sx={{ mt: 2, textAlign: "center" }}>
                        <Button
                          variant="text"
                          onClick={() => handleCardClick(set.name)}
                          endIcon={<NavigateNextIcon />}
                          sx={{ color: "text.secondary" }}
                        >
                          View all {set.flashcards.length} cards
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>
            ))}
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
