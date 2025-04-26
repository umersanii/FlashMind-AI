"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Paper, Chip, Skeleton, Button, Grid, Card, CardContent, CardActionArea } from "@mui/material"
import {
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"

const RecommendedTopics = ({ user }) => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true)
  
        const topics = await user.getRecommendedTopics()
  
        console.log("Recommended topics:", topics)
  
        setRecommendations(topics)
      } catch (error) {
        console.error("Error loading recommendations:", error)
      } finally {
        setLoading(false)
      }
    }
  
    if (user) {
      loadRecommendations()
    } else {
      setLoading(false)
    }
  }, [user])
  

  const handleTopicClick = (topic) => {
    // Navigate to generate cards with pre-filled topic
    router.push(`/generate-cards?topic=${encodeURIComponent(topic)}`)
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <TrendingUpIcon sx={{ color: "primary.main", mr: 1.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Recommended Topics for You
        </Typography>
      </Box>

      {loading ? (
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : recommendations.length > 0 ? (
        <Grid container spacing={2}>
          {recommendations.map((rec) => (
            <Grid item xs={12} sm={6} md={3} key={rec.id} alignItems={"center"}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  height: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardActionArea onClick={() => handleTopicClick(rec.subtopic)} sx={{ height: "100%", p: 1 }}>
                  <CardContent>
                    <Chip
                      label={rec.topic}
                      size="small"
                      sx={{
                        mb: 1,
                        bgcolor: "primary.light",
                        color: "primary.dark",
                        fontWeight: 500,
                      }}
                    />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {rec.subtopic}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <SchoolIcon sx={{ fontSize: 16, color: "success.main", mr: 0.5 }} />
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {Math.round(rec.confidence * 100)}% match for your learning
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            Start studying to get personalized topic recommendations!
          </Typography>
          <Button variant="outlined" onClick={() => router.push("/generate-cards")} endIcon={<ArrowForwardIcon />}>
            Create Your First Flashcards
          </Button>
        </Box>
      )}
    </Paper>
  )
}

export default RecommendedTopics
