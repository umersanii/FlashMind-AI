"use client"

import { useState } from "react"
import { IconButton, Tooltip } from "@mui/material"
import { FileDown } from "lucide-react"

interface Flashcard {
  id: string
  front: string
  back: string
}

interface DownloadFlashcardsProps {
  flashcards: Flashcard[]
  collectionName: string
  buttonSize?: "small" | "medium" | "large"
}

export default function DownloadFlashcards({
  flashcards,
  collectionName,
  buttonSize = "medium",
}: DownloadFlashcardsProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    if (downloading || !flashcards || flashcards.length === 0) return

    setDownloading(true)

    try {
      // Format the flashcards as text
      let content = `# ${collectionName}\n\n`

      flashcards.forEach((card, index) => {
        content += `## Card ${index + 1}\n`
        content += `Q: ${card.front}\n`
        content += `A: ${card.back}\n\n`
      })

      // Create a blob and download link
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = url
      link.download = `${collectionName.replace(/\s+/g, "_")}_flashcards.txt`
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading flashcards:", error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Tooltip title="Download as Text File">
      <IconButton
        onClick={handleDownload}
        disabled={downloading || flashcards.length === 0}
        size={buttonSize}
        sx={{
          p: buttonSize === "small" ? 0.5 : undefined,
        }}
      >
        <FileDown size={buttonSize === "small" ? 18 : 24} />
      </IconButton>
    </Tooltip>
  )
}
