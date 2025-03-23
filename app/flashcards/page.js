"use client";

import { UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";
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
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const getRandomMutedColor = () => {
  const colors = [
    "#D3D3D3",
    "#DCDCDC",
    "#C0C0C0",
    "#F0E68C",
    "#E6E6FA",
    "#FFFACD",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [newFlashcard, setNewFlashcard] = useState({ front: "", back: "" });
  const [editFlashcard, setEditFlashcard] = useState({ front: "", back: "" });
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editCollectionName, setEditCollectionName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openAddFlashcardDialog, setOpenAddFlashcardDialog] = useState(false);
  const [openAddCollectionDialog, setOpenAddCollectionDialog] = useState(false);
  const [openEditFlashcardDialog, setOpenEditFlashcardDialog] = useState(false);
  const [openEditCollectionDialog, setOpenEditCollectionDialog] =
    useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedSetIndex, setSelectedSetIndex] = useState(null);
  const [selectedFlashcardIndex, setSelectedFlashcardIndex] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionType, setActionType] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchFlashcards = async () => {
        try {
          const userDocRef = doc(collection(db, "users"), user.id);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const flashcardSets = docSnap.data().flashcardSets || [];
            setFlashcardSets(flashcardSets);
          } else {
            await setDoc(userDocRef, { flashcardSets: [] });
            setFlashcardSets([]);
          }
        } catch (error) {
          console.error("Error fetching flashcards:", error);
          setError("Failed to load flashcards.");
        }
      };

      fetchFlashcards();
    }
  }, [user]);

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const handleFlip = (index) => {
    setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleOpenAddFlashcardDialog = (setIndex) => {
    setSelectedSetIndex(setIndex);
    setOpenAddFlashcardDialog(true);
  };

  const handleCloseAddFlashcardDialog = () => {
    setOpenAddFlashcardDialog(false);
    setNewFlashcard({ front: "", back: "" });
  };

  const handleAddFlashcard = async () => {
    if (!newFlashcard.front || !newFlashcard.back) {
      setError("Please fill in both fields.");
      return;
    }
    try {
      const setRef = doc(db, "users", user.id);
      const docSnap = await getDoc(setRef);
      const flashcardSets = docSnap.data().flashcardSets || [];
      flashcardSets[selectedSetIndex].flashcards.push(newFlashcard);
      await updateDoc(setRef, { flashcardSets });
      setFlashcardSets(flashcardSets);
      setSuccess("Flashcard added successfully.");
      handleCloseAddFlashcardDialog();
    } catch (error) {
      console.error("Error adding flashcard:", error);
      setError("Failed to add flashcard.");
    }
  };

  const handleOpenAddCollectionDialog = () => {
    setOpenAddCollectionDialog(true);
  };

  const handleCloseAddCollectionDialog = () => {
    setOpenAddCollectionDialog(false);
    setNewCollectionName("");
  };

  const handleAddCollection = async () => {
    if (!newCollectionName) {
      setError("Please enter a collection name.");
      return;
    }
    try {
      const setRef = doc(db, "users", user.id);
      const docSnap = await getDoc(setRef);
      const flashcardSets = docSnap.data().flashcardSets || [];
      flashcardSets.push({ name: newCollectionName, flashcards: [] });
      await updateDoc(setRef, { flashcardSets });
      setFlashcardSets(flashcardSets);
      setSuccess("Collection added successfully.");
      handleCloseAddCollectionDialog();
    } catch (error) {
      console.error("Error adding collection:", error);
      setError("Failed to add collection.");
    }
  };

  const handleOpenEditFlashcardDialog = (setIndex, flashcardIndex) => {
    setSelectedSetIndex(setIndex);
    setSelectedFlashcardIndex(flashcardIndex);
    setEditFlashcard(flashcardSets[setIndex].flashcards[flashcardIndex]);
    setOpenEditFlashcardDialog(true);
  };

  const handleCloseEditFlashcardDialog = () => {
    setOpenEditFlashcardDialog(false);
    setEditFlashcard({ front: "", back: "" });
  };

  const handleEditFlashcard = async () => {
    try {
      const setRef = doc(db, "users", user.id);
      const docSnap = await getDoc(setRef);
      const flashcardSets = docSnap.data().flashcardSets || [];
      flashcardSets[selectedSetIndex].flashcards[selectedFlashcardIndex] =
        editFlashcard;
      await updateDoc(setRef, { flashcardSets });
      setFlashcardSets(flashcardSets);
      setSuccess("Flashcard updated successfully.");
      handleCloseEditFlashcardDialog();
    } catch (error) {
      console.error("Error updating flashcard:", error);
      setError("Failed to update flashcard.");
    }
  };

  const handleOpenEditCollectionDialog = (setIndex) => {
    setSelectedSetIndex(setIndex);
    setEditCollectionName(flashcardSets[setIndex].name);
    setOpenEditCollectionDialog(true);
  };

  const handleCloseEditCollectionDialog = () => {
    setOpenEditCollectionDialog(false);
    setEditCollectionName("");
  };

  const handleEditCollection = async () => {
    try {
      const setRef = doc(db, "users", user.id);
      const docSnap = await getDoc(setRef);
      const flashcardSets = docSnap.data().flashcardSets || [];
      flashcardSets[selectedSetIndex].name = editCollectionName;
      await updateDoc(setRef, { flashcardSets });
      setFlashcardSets(flashcardSets);
      setSuccess("Collection updated successfully.");
      handleCloseEditCollectionDialog();
    } catch (error) {
      console.error("Error updating collection:", error);
      setError("Failed to update collection.");
    }
  };

  const handleDeleteFlashcard = async () => {
    try {
      const setRef = doc(db, "users", user.id);
      const docSnap = await getDoc(setRef);
      const flashcardSets = docSnap.data().flashcardSets || [];
      flashcardSets[selectedSetIndex].flashcards.splice(
        selectedFlashcardIndex,
        1
      );
      await updateDoc(setRef, { flashcardSets });
      setFlashcardSets(flashcardSets);
      setSuccess("Flashcard deleted successfully.");
      handleCloseConfirmationDialog();
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      setError("Failed to delete flashcard.");
    }
  };

  const handleDeleteCollection = async () => {
    try {
      const setRef = doc(db, "users", user.id);
      const docSnap = await getDoc(setRef);
      const flashcardSets = docSnap.data().flashcardSets || [];
      flashcardSets.splice(selectedSetIndex, 1);
      await updateDoc(setRef, { flashcardSets });
      setFlashcardSets(flashcardSets);
      setSuccess("Collection deleted successfully.");
      handleCloseConfirmationDialog();
    } catch (error) {
      console.error("Error deleting collection:", error);
      setError("Failed to delete collection.");
    }
  };

  const handleOpenConfirmationDialog = (type, setIndex, flashcardIndex) => {
    setActionType(type);
    setSelectedSetIndex(setIndex);
    setSelectedFlashcardIndex(flashcardIndex);
    setOpenConfirmationDialog(true);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGeneratePageClick = () => {
    router.push("/generate");
  };

  const filteredFlashcardSets = flashcardSets.filter(
    (set) =>
      set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      set.flashcards.some(
        (flashcard) =>
          flashcard.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flashcard.back.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <>
      <AppBar
        position="static"
        color="primary"
        elevation={0}
        sx={{ borderRadius: 2, padding: 2, height: 80 }} // Added padding and borderRadius
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Button
              variant="contained"
              color="primary"
              href="/"
              sx={{ borderRadius: 8 }} // Rounded buttons
            >
              Flashcard SaaS
            </Button>
          </Typography>

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
      <Container maxWidth="100vw" sx={{ padding: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: { xs: "center", sm: "space-between" },
            mt: 4,
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            sx={{
              borderRadius: 8,
              height: 40, // Set height for consistency
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
              },
              flex: 1, // Allow the TextField to take available space
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddCollectionDialog}
            sx={{
              borderRadius: 8,
              height: 56,
              minWidth: { xs: "100%", sm: 200 }, // Full width on small screens, fixed width on larger
              typography: "button",
              textTransform: "none",
              mt: { xs: 2, sm: 0 }, // Margin top on small screens
            }}
          >
            Add Collection
          </Button>
          <Button
            variant="contained"
            endIcon={<NavigateNextIcon />}
            onClick={handleGeneratePageClick}
            sx={{
              borderRadius: 8,
              height: 56,
              minWidth: { xs: "100%", sm: 200 }, // Full width on small screens, fixed width on larger
              typography: "button",
              textTransform: "none",
              mt: { xs: 2, sm: 0 }, // Margin top on small screens
            }}
          >
            AI Generate
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mt: 4, px: { xs: 1, sm: 2, md: 4 } }}>
          {filteredFlashcardSets.length > 0 ? (
            filteredFlashcardSets.map((set, setIndex) => (
              <Grid item xs={12} key={setIndex}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: { xs: 1, sm: 2 },
                    justifyContent: "center",
                    flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
                    gap: { xs: 1, sm: 2 }, // Adjust gap between elements
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      flexGrow: 1,
                      textAlign: { xs: "center", sm: "left" },
                    }}
                  >
                    {set.name || `Set ${setIndex + 1}`}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      onClick={() => handleOpenEditCollectionDialog(setIndex)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleOpenConfirmationDialog(
                          "deleteCollection",
                          setIndex
                        )
                      }
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Grid container spacing={3} justifyContent="center">
                  {set.flashcards.map((flashcard, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        p: { xs: 1, sm: 2 },
                      }}
                    >
                      <Card
                        onClick={() => handleFlip(`${setIndex}-${index}`)}
                        sx={{
                          width: { xs: "100%", sm: 250, md: 300 }, // Responsive width
                          height: { xs: 200, sm: 250, md: 300 }, // Responsive height
                          borderRadius: 8,
                          color: "text.primary",
                          backgroundColor: getRandomMutedColor(), // Apply muted random color
                          transition: "transform 0.6s",
                          transform: flipped[`${setIndex}-${index}`]
                            ? "rotateY(180deg)"
                            : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          perspective: "1000px",
                          cursor: "pointer",
                          mb: 2,
                          p: 2, // Padding inside the Card
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 8,
                            backgroundColor: "background.paper",
                            p: 2, // Padding inside the Box
                          }}
                        >
                          <CardContent>
                            <Typography
                              sx={{
                                textAlign: "center",
                                transform: flipped[`${setIndex}-${index}`]
                                  ? "scaleX(-1)"
                                  : "none",
                              }}
                            >
                              {flipped[`${setIndex}-${index}`]
                                ? flashcard.back
                                : flashcard.front}
                            </Typography>
                          </CardContent>
                        </Box>
                        <IconButton
                          onClick={() =>
                            handleOpenEditFlashcardDialog(setIndex, index)
                          }
                          color="primary"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleOpenConfirmationDialog(
                              "deleteFlashcard",
                              setIndex,
                              index
                            )
                          }
                          color="error"
                          sx={{ position: "absolute", top: 8, right: 48 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))
          ) : (
            <Typography
              variant="h6"
              component="div"
              sx={{ textAlign: "center", width: "100%", py: 4 }}
            >
              No flashcards available
            </Typography>
          )}
        </Grid>
      </Container>
      <Dialog
        open={openAddFlashcardDialog}
        onClose={handleCloseAddFlashcardDialog}
      >
        <DialogTitle>Add Flashcard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question"
            fullWidth
            variant="outlined"
            value={newFlashcard.front}
            onChange={(e) =>
              setNewFlashcard({ ...newFlashcard, front: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Answer"
            fullWidth
            variant="outlined"
            value={newFlashcard.back}
            onChange={(e) =>
              setNewFlashcard({ ...newFlashcard, back: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddFlashcardDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddFlashcard} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEditFlashcardDialog}
        onClose={handleCloseEditFlashcardDialog}
      >
        <DialogTitle>Edit Flashcard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question"
            fullWidth
            variant="outlined"
            value={editFlashcard.front}
            onChange={(e) =>
              setEditFlashcard({ ...editFlashcard, front: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Answer"
            fullWidth
            variant="outlined"
            value={editFlashcard.back}
            onChange={(e) =>
              setEditFlashcard({ ...editFlashcard, back: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditFlashcardDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditFlashcard} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAddCollectionDialog}
        onClose={handleCloseAddCollectionDialog}
      >
        <DialogTitle>Add Collection</DialogTitle>
        <DialogContent>
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
        <DialogActions>
          <Button onClick={handleCloseAddCollectionDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCollection} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEditCollectionDialog}
        onClose={handleCloseEditCollectionDialog}
      >
        <DialogTitle>Edit Collection</DialogTitle>
        <DialogContent>
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
        <DialogActions>
          <Button onClick={handleCloseEditCollectionDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditCollection} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openConfirmationDialog}
        onClose={handleCloseConfirmationDialog}
      >
        <DialogTitle>
          {actionType === "deleteFlashcard"
            ? "Delete Flashcard"
            : "Delete Collection"}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to{" "}
          {actionType === "deleteFlashcard"
            ? "delete this flashcard?"
            : "delete this collection?"}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={
              actionType === "deleteFlashcard"
                ? handleDeleteFlashcard
                : handleDeleteCollection
            }
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={Boolean(success)}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
      >
        <Alert onClose={() => setSuccess("")} severity="success">
          {success}
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert onClose={() => setError("")} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
