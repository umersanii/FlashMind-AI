"use client";

import { UserButton, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../firebase";
import { writeBatch, getDoc, collection, doc, query, getDocs } from "firebase/firestore";
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
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [existingCollections, setExistingCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCollections = async () => {
      const userDocRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const flashcardSets = docSnap.data().flashcardSets || [];
        setExistingCollections(flashcardSets.map((set) => set.name));
      }
    };

    if (isLoaded && isSignedIn) {
      fetchCollections();
    }
  }, [isLoaded, isSignedIn, user]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });
      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data);
      setFlipped(new Array(data.length).fill(false));
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  const handleCardClick = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name && !selectedCollection) {
      alert("Please enter a name for your flashcard set or select an existing collection.");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);

    const docSnap = await getDoc(userDocRef);
    let flashcardSets = docSnap.exists() ? docSnap.data().flashcardSets || [] : [];

    if (name) {
      if (flashcardSets.find((set) => set.name === name)) {
        alert("A flashcard set with that name already exists.");
        return;
      } else {
        flashcardSets.push({ name, flashcards });
        batch.set(userDocRef, { flashcardSets }, { merge: true });
      }
    } else {
      if (selectedCollection && !flashcardSets.find((set) => set.name === selectedCollection)) {
        alert("Selected collection does not exist.");
        return;
      }
    }

    const colRef = selectedCollection
      ? collection(userDocRef, selectedCollection)
      : collection(userDocRef, name);

    flashcards.forEach((card) => {
      if (!card.id) {
        console.error("Card ID is missing:", card);
        return;
      }

      const cardDocRef = doc(colRef, card.id);
      batch.set(cardDocRef, card);
    });

    try {
      await batch.commit();
      console.log("Batch committed successfully");
    } catch (error) {
      console.error("Error committing batch:", error);
    }

    handleCloseDialog();
    router.push("/flashcards");
  };

  return (
    <>
      <AppBar
        position="static"
        color="primary"
        elevation={2}
        sx={{ borderRadius: 2, mb: 2 }}
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
      <Container maxWidth="md">
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          sx={{ borderRadius: 2 }}
        >
          <DialogTitle>Save Flashcard Set</DialogTitle>
          <DialogContent>
            <DialogContentText>
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
                sx={{ borderRadius: 2, mb: 2 }}
              />
            )}
            {existingCollections.length > 0 && (
              <FormControl fullWidth sx={{ mb: 2 }}>
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
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ borderRadius: 8 }}>
              Cancel
            </Button>
            <Button
              onClick={saveFlashcards}
              color="primary"
              sx={{ borderRadius: 8 }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Generate Flashcards
          </Typography>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2, borderRadius: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ borderRadius: 8, py: 1.5 }}
          >
            Generate Flashcards
          </Button>
        </Box>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Generated Flashcards
            </Typography>
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    onClick={() => handleCardClick(index)}
                    sx={{
                      width: 300,
                      height: 300,
                      borderRadius: 4,
                      color: "text.primary",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      backgroundColor: flipped[index]
                        ? "primary.light"
                        : "background.paper",
                      transition: "transform 0.5s",
                      transform: flipped[index] ? "rotateY(180deg)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CardContent>
                      <Typography
                        sx={{
                          textAlign: "center",
                          transform: flipped[index]
                            ? "scaleX(-1)"
                            : "none",
                        }}
                      >
                        {flipped[index] ? flashcard.back : flashcard.front}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
              sx={{ borderRadius: 8, py: 1.5 }}
            >
              Save Flashcards
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}
