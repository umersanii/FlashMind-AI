import AImodel from "../models/ai.model"
import Deck from "../models/deck.model"
import FlashCard from "../models/flashcard.model"

class User {
  constructor(clerkUser) {
    this.id = clerkUser.id
    this.firstName = clerkUser.firstName
    this.lastName = clerkUser.lastName
    this.emailAddresses = clerkUser.emailAddresses
    this.primaryEmailAddress = clerkUser.primaryEmailAddress
    this.profileImageUrl = clerkUser.profileImageUrl
    this.publicMetadata = clerkUser.publicMetadata || {}
    this.privateMetadata = clerkUser.privateMetadata || {}
    this.flashcardSets = []
  }

  async generateFlashcardSet(text, difficulty = 2, numQuestions = 10) {
    console.log("Generating flashcard set for text with difficulty:", difficulty, "and questions:", numQuestions)
    const model = new AImodel()
    const response = await model.genrateFlashcardSet(text, difficulty, numQuestions)
    console.log("AI response:", response)
    const flashcardsData = response.flashcards || []

    const flashcards = flashcardsData.map((card) => new FlashCard(card.front, card.back))

    const deckName = this.firstName ? `${this.firstName}'s Deck` : "Default Deck"
    const deckDescription = "Generated Flashcards"
    const deckId = `deck-${Date.now()}`

    const deck = new Deck(deckId, deckName, deckDescription)

    flashcards.forEach((flashcard) => deck.addFlashcard(flashcard))

    this.flashcardSets.push(deck)

    return deck
  }

  async getChatbotResponse(input, context = "") {
    console.log("Getting chatbot response for input:", input)
    const model = new AImodel()

    console.log("Context:", context)
    const response = await model.chatbotResponse(input, context)
    return response
  }
}

export default User
