"use client"

import { useState, useEffect, useRef } from "react"
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material"
import { Mic, MicOff, Delete, Info } from 'lucide-react'

const AudioRecorder = ({ onTextExtracted }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.")
      return
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = "en-US"

    recognitionRef.current.onstart = () => {
      setIsListening(true)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
      if (isRecording) {
        // Restart if we're still supposed to be recording
        recognitionRef.current.start()
      }
    }

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " "
        } else {
          interimTranscript += transcript
        }
      }

      // Update the transcript
      setTranscript((prev) => {
        const newTranscript = prev + finalTranscript
        // Send the updated transcript to the parent component
        if (finalTranscript) {
          onTextExtracted(newTranscript)
        }
        return newTranscript
      })
    }

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error)
      if (event.error === "not-allowed") {
        setPermissionDenied(true)
        setIsRecording(false)
      } else {
        setError(`Error: ${event.error}`)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTextExtracted, isRecording])

  const toggleRecording = async () => {
    if (error || permissionDenied) return

    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsRecording(false)
    } else {
      // Start recording
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true })
        
        setIsRecording(true)
        setTranscript("")
        if (recognitionRef.current) {
          recognitionRef.current.start()
        }
      } catch (err) {
        console.error("Microphone permission denied:", err)
        setPermissionDenied(true)
      }
    }
  }

  const clearTranscript = () => {
    setTranscript("")
    onTextExtracted("")
  }

  const handleOpenInfoDialog = () => {
    setInfoDialogOpen(true)
  }

  const handleCloseInfoDialog = () => {
    setInfoDialogOpen(false)
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          background: isRecording ? "rgba(255, 0, 0, 0.05)" : "transparent",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={toggleRecording}
            color={isRecording ? "error" : "primary"}
            sx={{
              mr: 2,
              bgcolor: isRecording ? "rgba(255, 0, 0, 0.1)" : "rgba(25, 118, 210, 0.1)",
              "&:hover": {
                bgcolor: isRecording ? "rgba(255, 0, 0, 0.2)" : "rgba(25, 118, 210, 0.2)",
              },
            }}
            disabled={error !== null || permissionDenied}
          >
            {isRecording ? <MicOff /> : <Mic />}
          </IconButton>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {isRecording ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                Recording
                <CircularProgress size={16} sx={{ ml: 1 }} color="error" />
              </Box>
            ) : (
              "Record Audio"
            )}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {transcript && (
            <Tooltip title="Clear transcript">
              <IconButton onClick={clearTranscript} size="small" sx={{ mr: 1 }}>
                <Delete size={18} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="How to use">
            <IconButton onClick={handleOpenInfoDialog} size="small">
              <Info size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {permissionDenied && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          Microphone access was denied. Please enable microphone access in your browser settings and reload the page.
        </Typography>
      )}

      <Dialog open={infoDialogOpen} onClose={handleCloseInfoDialog}>
        <DialogTitle>How to Use Voice Recording</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography paragraph>
              <strong>Recording Instructions:</strong>
            </Typography>
            <Typography component="ol" sx={{ pl: 2 }}>
              <li>Click the microphone button to start recording.</li>
              <li>Speak clearly into your microphone.</li>
              <li>Your speech will be transcribed in real-time and added to the text field.</li>
              <li>Click the microphone button again to stop recording.</li>
              <li>Use the clear button (trash icon) to remove all transcribed text.</li>
            </Typography>
            <Typography paragraph sx={{ mt: 2 }}>
              <strong>Tips for Better Results:</strong>
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>Use a good quality microphone in a quiet environment.</li>
              <li>Speak clearly and at a moderate pace.</li>
              <li>The transcription works best with English language.</li>
              <li>You may need to edit the text afterward for perfect accuracy.</li>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AudioRecorder
