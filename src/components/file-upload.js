"use client"

import { useState } from "react"
import { Box, Button, Typography, CircularProgress, Paper } from "@mui/material"
import { Upload } from "lucide-react"

const FileUpload = ({ onTextExtracted }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState(null)

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Check if file is a text file
    if (!file.type.match("text.*") && file.type !== "application/pdf") {
      setError("Please upload a text or PDF file.")
      return
    }

    setIsUploading(true)
    setFileName(file.name)
    setError(null)

    try {
      const text = await readFileContent(file)
      onTextExtracted(text)
    } catch (err) {
      console.error("Error reading file:", err)
      setError("Error reading file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        resolve(event.target.result)
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsText(file)
    })
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        border: "1px dashed",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button component="label" variant="outlined" startIcon={<Upload />} sx={{ mr: 2 }} disabled={isUploading}>
          Upload File
          <input type="file" hidden onChange={handleFileChange} accept=".txt,.pdf,.doc,.docx" />
        </Button>
        <Typography variant="body2" color="text.secondary">
          {isUploading ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Processing {fileName}...
            </Box>
          ) : fileName ? (
            `Uploaded: ${fileName}`
          ) : (
            "Upload a text file (.txt, .pdf, .doc)"
          )}
        </Typography>
      </Box>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1, width: "100%" }}>
          {error}
        </Typography>
      )}
    </Paper>
  )
}

export default FileUpload
