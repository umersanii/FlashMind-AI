"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fab,
  Zoom,
  CircularProgress,
  Collapse,
  Divider,
} from "@mui/material"
import {
  Send as SendIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import User from "../models/user.model"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatBotProps {
  context?: string
  user: User
}

export default function ChatBot({ context = "", user }: ChatBotProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! I'm your study assistant. Ask me anything about the flashcards you're studying!",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, open])

  const handleToggleChat = () => {
    setOpen(!open)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      console.log("chat: Sending message to server", input)
      console.log("User id:", user)
      const response = await user.getChatbotResponse(input, context)
      console.log("chat: Received response from server", response)

      if (!response) {
        throw new Error("No response from the server")
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("chat: Error while sending message", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <Zoom in={!open}>
        <Fab
          color="primary"
          aria-label="chat"
          onClick={handleToggleChat}
          sx={{
            position: "fixed",
            bottom: 16,
            left: 16,
            zIndex: 1000,
          }}
        >
          <ChatIcon />
        </Fab>
      </Zoom>

      <Collapse in={open} timeout={300}>
        <Paper
          elevation={3}
          sx={{
            position: "fixed",
            bottom: 16,
            left: 16,
            width: { xs: "calc(100% - 32px)", sm: 350 },
            height: 450,
            zIndex: 1000,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PsychologyIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Study Assistant
              </Typography>
            </Box>
            <IconButton onClick={handleToggleChat} size="small" sx={{ color: "inherit" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Messages Container */}
          <Box
            sx={{
              p: 2,
              flexGrow: 1,
              overflow: "auto",
              bgcolor: "background.default",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  flexDirection: message.sender === "user" ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.sender === "user" ? "primary.main" : "background.paper",
                    color: message.sender === "user" ? "primary.contrastText" : "text.primary",
                    width: 32,
                    height: 32,
                  }}
                >
                  {message.sender === "user" ? <PersonIcon fontSize="small" /> : <PsychologyIcon fontSize="small" />}
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    maxWidth: "75%",
                    borderRadius: 2,
                    bgcolor: message.sender === "user" ? "primary.main" : "background.paper",
                    color: message.sender === "user" ? "primary.contrastText" : "text.primary",
                    border: message.sender === "bot" ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 5 }}>
                <Avatar
                  sx={{
                    bgcolor: "background.paper",
                    color: "text.primary",
                    width: 32,
                    height: 32,
                  }}
                >
                  <PsychologyIcon fontSize="small" />
                </Avatar>
                <CircularProgress size={20} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              bgcolor: "background.paper",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Ask a question..."
                variant="outlined"
                size="small"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "action.disabledBackground",
                    color: "action.disabled",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Collapse>
    </>
  )
}
