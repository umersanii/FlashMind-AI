import { POST } from "../api/llm_api.js"

class AImodel {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  async genrateFlashcardSet(text, difficulty = 2, numQuestions = 10, language = "en") {
    const difficultyLevel = ["easy", "medium", "hard"][difficulty - 1] || "medium"
    const languagePrompt = language === "ur" ? "in Urdu language" : "in English language"
=======
  async genrateFlashcardSet(text, difficulty = 2, numQuestions = 10) {
    const difficultyLevel = ["easy", "medium", "hard"][difficulty - 1] || "medium"
=======
  async genrateFlashcardSet(text, difficulty = 2, numQuestions = 10) {
    const difficultyLevel = ["easy", "medium", "hard"][difficulty - 1] || "medium"

    const systemPrompt = `
    You are an intelligent flashcard generator for a SaaS platform called FlashMind AI. Your task is to create concise, informative, and effective flashcards based on user input. Each flashcard should include a question or term on the front and a clear, detailed answer or explanation on the back.

    Create ${numQuestions} flashcards with a ${difficultyLevel} difficulty level.
    
    For easy difficulty: Focus on basic concepts and definitions.
    For medium difficulty: Include more detailed explanations and some application of concepts.
    For hard difficulty: Include complex concepts, relationships between ideas, and challenging applications.

    Ensure that the content is accurate, educational, and appropriate for the target audience, which may vary from students to professionals. Format your responses in a way that is easy to read and understand, and strive to make each flashcard as useful as possible for learning and retention.
>>>>>>> Stashed changes

    const systemPrompt = `
    You are an intelligent flashcard generator for a SaaS platform called FlashMind AI. Your task is to create concise, informative, and effective flashcards based on user input. Each flashcard should include a question or term on the front and a clear, detailed answer or explanation on the back.

    Create ${numQuestions} flashcards with a ${difficultyLevel} difficulty level.
    
    For easy difficulty: Focus on basic concepts and definitions.
    For medium difficulty: Include more detailed explanations and some application of concepts.
    For hard difficulty: Include complex concepts, relationships between ideas, and challenging applications.

    Ensure that the content is accurate, educational, and appropriate for the target audience, which may vary from students to professionals. Format your responses in a way that is easy to read and understand, and strive to make each flashcard as useful as possible for learning and retention.
>>>>>>> Stashed changes

    const systemPrompt = `
    You are an intelligent flashcard generator for a SaaS platform. Your task is to create concise, informative, and effective flashcards based on user input ${languagePrompt}.
    
    Create exactly ${numQuestions} flashcards with a difficulty level of ${difficultyLevel}.
    
    For difficulty levels:
    - easy: Create basic recall questions focusing on fundamental concepts and definitions
    - medium: Create questions that require understanding relationships between concepts
    - hard: Create questions that require application of knowledge, analysis, or evaluation
    
    Each flashcard should include a question or term on the front and a clear, detailed answer or explanation on the back. Ensure that the content is accurate, educational, and appropriate for the target audience, which may vary from students to professionals.
    
    ${language === "ur" ? "Make sure all content is written in Urdu language using proper Urdu script." : ""}
    
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

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  async generateQuiz(text, difficulty = 2, numQuestions = 5, language = "en") {
    const difficultyLevel = ["easy", "medium", "hard"][difficulty - 1] || "medium"
    const languagePrompt = language === "ur" ? "in Urdu language" : "in English language"

    const systemPrompt = `
    You are an intelligent quiz generator for a SaaS platform. Your task is to create concise, informative, and effective multiple-choice quiz questions based on user input ${languagePrompt}.
    
    Create exactly ${numQuestions} quiz questions with a difficulty level of ${difficultyLevel}.
    
    For difficulty levels:
    - easy: Create basic recall questions focusing on fundamental concepts and definitions
    - medium: Create questions that require understanding relationships between concepts
    - hard: Create questions that require application of knowledge, analysis, or evaluation
    
    Each quiz question should include:
    1. A clear question
    2. Four possible answer options
    3. The index of the correct answer (0-3)
    
    ${language === "ur" ? "Make sure all content is written in Urdu language using proper Urdu script." : ""}
    
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
=======
=======
>>>>>>> Stashed changes
  async generateQuiz(flashcards, numQuestions = 5) {
    // Select a subset of flashcards to create a quiz
    const selectedCards = this.selectFlashcardsForQuiz(flashcards, numQuestions)

    const quizQuestions = selectedCards.map((card, index) => {
      // For simplicity, we're creating multiple-choice questions
      // In a real implementation, this would use the LLM to generate distractors
      return {
        id: `q-${index}`,
        question: card.front,
        correctAnswer: card.back,
        options: this.generateQuizOptions(card.back, flashcards),
        explanation: `The correct answer is: ${card.back}`,
      }
    })

    return {
      id: `quiz-${Date.now()}`,
      title: "Custom Quiz",
      questions: quizQuestions,
      totalQuestions: quizQuestions.length,
    }
  }

  selectFlashcardsForQuiz(flashcards, numQuestions) {
    // If we have fewer flashcards than requested questions, use all of them
    if (flashcards.length <= numQuestions) {
      return [...flashcards]
    }

    // Otherwise, randomly select the requested number of flashcards
    const shuffled = [...flashcards].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numQuestions)
  }

  generateQuizOptions(correctAnswer, flashcards) {
    // Create an array with the correct answer
    const options = [correctAnswer]

    // Add 3 distractors from other flashcards if available
    const otherAnswers = flashcards.map((card) => card.back).filter((answer) => answer !== correctAnswer)

    // Shuffle the other answers
    const shuffledAnswers = otherAnswers.sort(() => 0.5 - Math.random())

    // Take up to 3 distractors
    const distractors = shuffledAnswers.slice(0, 3)

    // If we don't have enough distractors, generate some placeholder options
    while (distractors.length < 3) {
      distractors.push(`Option ${distractors.length + 2}`)
    }

    // Combine correct answer with distractors and shuffle
    return [...options, ...distractors].sort(() => 0.5 - Math.random())
  }

  async analyzeStudyPerformance(studyHistory) {
    // This would use the LLM to analyze study patterns and provide recommendations
    // For now, we'll return a simple analysis
    const totalCards = studyHistory.length
    const correctAnswers = studyHistory.filter((item) => item.isCorrect).length
    const accuracy = totalCards > 0 ? (correctAnswers / totalCards) * 100 : 0

    let recommendation = ""
    if (accuracy < 60) {
      recommendation = "Consider reviewing the material more thoroughly before testing yourself."
    } else if (accuracy < 80) {
      recommendation = "You're making good progress. Focus on the cards you got wrong."
    } else {
      recommendation = "Excellent work! Consider increasing the difficulty or moving to new material."
    }

    return {
      accuracy,
      totalReviewed: totalCards,
      correctAnswers,
      recommendation,
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    }
  }
}

export default AImodel
