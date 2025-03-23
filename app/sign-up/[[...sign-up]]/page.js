"use client";

import { SignUp } from "@clerk/clerk-react";
import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

export default function SignUpPage() {
  return (
    <>
      <AppBar
        position="static"
        sx={{ borderRadius: 2, boxShadow: "none" }} // Rounded AppBar, No Shadow
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
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
            Sign Up
          </Typography>
          <SignUp />
        </Box>
      </Container>
    </>
  );
}
