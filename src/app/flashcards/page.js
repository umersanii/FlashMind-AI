"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, setDoc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "../../utils/firebase"
import { useRouter } from "next/navigation"
import {
  Container,
  Grid,
  Card,
  AppBar,
  Toolbar,
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
  Fade,
  Zoom,
  CardActionArea,
} from "@mui/material"
import {
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  AutoAwesome as AutoAwesomeIcon,
  Collections as CollectionsIcon,
} from "@mui/icons-material"

const getRandomGradient = () => {
  const gradients = [
    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}

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
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (user) {
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
  }, [user])

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
  }

  const handleFlip = (index, e) => {
    e.stopPropagation()
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
    try {
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

  if (!isLoaded) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isLoaded && !isSignedIn) {
    return null // Redirect is handled in useEffect
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          borderRadius: 0,
          background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SchoolIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              <Button variant="text" color="inherit" href="/" sx={{ fontWeight: 600 }}>
                FlashMind AI
              </Button>
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" href="/generate-cards" sx={{ mr: 2 }}>
            Generate Cards
          </Button>
          <UserButton />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
            <CollectionsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            My Flashcard Collections
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", mb: 4 }}>
            Manage your flashcard collections or create new ones
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
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
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
                flex: 1,
              }}
            />
            <Box sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" } }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenAddCollectionDialog}
                sx={{
                  borderRadius: 2,
                  height: 48,
                  flex: { xs: 1, sm: "auto" },
                  whiteSpace: "nowrap",
                }}
              />
              <Button
                variant="contained"
                startIcon={<AutoAwesomeIcon />}
                onClick={handleGeneratePageClick}
                sx={{
                  borderRadius: 2,
                  height: 48,
                  flex: { xs: 1, sm: "auto" },
                  background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
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
            <CircularProgress />
          </Box>
        ) : filteredFlashcardSets.length === 0 ? (
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
                borderRadius: 2,
                py: 1.5,
                px: 3,
                background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              Create Collection
            </Button>
          </Paper>
        ) : (
          <Fade in={true} timeout={500}>
            <Box>
              {filteredFlashcardSets.map((set, setIndex) => (
                <Paper
                  key={setIndex}
                  elevation={0}
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
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
                      <Typography variant="body1" sx={{ mb: 2, color: "#64748b" }}>
                        This collection is empty
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenAddFlashcardDialog(setIndex)}
                        sx={{ borderRadius: 2 }}
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
                          sx={{ color: "#6366f1" }}
                        >
                          Study All Cards
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenAddFlashcardDialog(setIndex)}
                          sx={{ borderRadius: 2 }}
                        >
                          Add Card
                        </Button>
                      </Box>

                      <Grid container spacing={2}>
                        {set.flashcards.slice(0, 3).map((flashcard, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                              <Card
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
                                <CardActionArea onClick={() => handleCardClick(set.name)} sx={{ height: "100%" }}>
                                  <Box
                                    onClick={(e) => handleFlip(`${setIndex}-${index}`, e)}
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
                                        backgroundColor: "#f8fafc",
                                        border: "1px solid #e2e8f0",
                                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
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
                                        backgroundColor: "white",
                                        color: "#1e293b",
                                        transform: "rotateY(180deg)",
                                        border: "1px solid #e2e8f0",
                                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
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
                                </CardActionArea>
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
                                    sx={{ bgcolor: "rgba(255, 255, 255, 0.8)" }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleOpenConfirmationDialog("deleteFlashcard", setIndex, index, e)}
                                    sx={{ bgcolor: "rgba(255, 255, 255, 0.8)" }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Card>
                            </Zoom>
                          </Grid>
                        ))}
                      </Grid>

                      {set.flashcards.length > 3 && (
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                          <Button
                            variant="text"
                            onClick={() => handleCardClick(set.name)}
                            endIcon={<NavigateNextIcon />}
                            sx={{ color: "#64748b" }}
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
          </Fade>
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
          <Button onClick={handleCloseAddFlashcardDialog} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddFlashcard}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
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
          <Button onClick={handleCloseEditFlashcardDialog} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleEditFlashcard}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
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
          <Button onClick={handleCloseAddCollectionDialog} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddCollection}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
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
          <Button onClick={handleCloseEditCollectionDialog} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleEditCollection}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
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
          <Button onClick={handleCloseConfirmationDialog} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={actionType === "deleteFlashcard" ? handleDeleteFlashcard : handleDeleteCollection}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
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
