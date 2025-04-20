import { POST } from "../api/llm_api.js"

class AImodel {
  async genrateFlashcardSet(text, difficulty = 2, numQuestions = 10) {
    const difficultyLevel = ["easy", "medium", "hard"][difficulty - 1] || "medium"

    const systemPrompt = `
    You are an intelligent flashcard generator for a SaaS platform. Your task is to create concise, informative, and effective flashcards based on user input. 
    
    Create exactly ${numQuestions} flashcards with a difficulty level of ${difficultyLevel}.
    
    For difficulty levels:
    - easy: Create basic recall questions focusing on fundamental concepts and definitions
    - medium: Create questions that require understanding relationships between concepts
    - hard: Create questions that require application of knowledge, analysis, or evaluation
    
    Each flashcard should include a question or term on the front and a clear, detailed answer or explanation on the back. Ensure that the content is accurate, educational, and appropriate for the target audience, which may vary from students to professionals.
    
    return in the following JSON format 
    {
      "flashcards":[
      {
        "front": "Front of the card",
        "back": "Back of the card"
      }
      ]
    }
    just return the JSON do not return any thing extra
    `

    const myAPIKey = process.env.NEXT_PUBLIC_LLAMA8B_API_KEY

    const response = await POST(text, systemPrompt, myAPIKey)
    const flashcards = JSON.parse(response)

    return flashcards
  }

  async generateQuiz(text, difficulty = 2, numQuestions = 5) {
    const difficultyLevel = ["easy", "medium", "hard"][difficulty - 1] || "medium"

    const systemPrompt = `
    You are an intelligent quiz generator for a SaaS platform. Your task is to create concise, informative, and effective multiple-choice quiz questions based on user input. 
    
    Create exactly ${numQuestions} quiz questions with a difficulty level of ${difficultyLevel}.
    
    For difficulty levels:
    - easy: Create basic recall questions focusing on fundamental concepts and definitions
    - medium: Create questions that require understanding relationships between concepts
    - hard: Create questions that require application of knowledge, analysis, or evaluation
    
    Each quiz question should include:
    1. A clear question
    2. Four possible answer options
    3. The index of the correct answer (0-3)
    
    Ensure that the content is accurate, educational, and appropriate for the target audience, which may vary from students to professionals.
    
    Return in the following JSON format:
    {
      "questions":[
        {
          "question": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 2
        }
      ]
    }
    Just return the JSON, do not return anything extra.
    `

    const myAPIKey = process.env.NEXT_PUBLIC_LLAMA8B_API_KEY

    const response = await POST(text, systemPrompt, myAPIKey)
    const quiz = JSON.parse(response)

    return quiz
  }

  async chatbotResponse(input, context = "", apiKey = null) {
    try {
      const systemPrompt = `
        You are a helpful study assistant for a flashcard application. 
        Your goal is to help the user understand the content they're studying.
        ${context ? `The user is currently studying flashcards about: ${context}` : ""}
        
        Keep your answers concise, helpful, and focused on helping the user learn.
        If you don't know something, it's okay to say so.
      `

      console.log("Sending message to server:", input)
      console.log("System prompt:", systemPrompt)

      const myAPIKey = apiKey || process.env.NEXT_PUBLIC_LLAMA8B_API_KEY
      const response = await POST(input, systemPrompt, myAPIKey)

      return response
    } catch (error) {
      console.error("Error getting response from AI:", error)
      throw error
    }
  }
}

export default AImodel
