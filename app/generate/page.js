"use client";

import { UserButton, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../firebase";
import { writeBatch, getDoc, collection, doc } from "firebase/firestore";
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
} from "@mui/material";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

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
    if (!name) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);

    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      let flashcardSets = docSnap.data().flashcardSets || [];
      if (flashcardSets.find((set) => set.name === name)) {
        alert("A flashcard set with that name already exists.");
        return;
      } else {
        flashcardSets.push({ name, flashcards });
        batch.set(userDocRef, { flashcardSets }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcardSets: [{ name, flashcards }] });
    }

    const colRef = collection(userDocRef, name);

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
            Flashcard SaaS
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
              Please enter a name for your flashcard set.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Set Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ borderRadius: 2 }}
            />
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
