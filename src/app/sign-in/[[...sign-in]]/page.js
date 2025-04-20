"use client";

import { SignIn } from "@clerk/clerk-react";
import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

export default function SignInPage() {
  return (
    <>
      <AppBar
        position="static"
        sx={{ borderRadius: 2, boxShadow: "none" }}
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
          <Button color="inherit" href="/sign-in" sx={{ borderRadius: 8 }}>
            Sign In
          </Button>
          <Button color="inherit" href="/sign-up" sx={{ borderRadius: 8 }}>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="100vw">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mt: 4, borderRadius: 4 }} // Rounded Box
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Sign In
          </Typography>
          <SignIn />
        </Box>
      </Container>
    </>
  );
}
