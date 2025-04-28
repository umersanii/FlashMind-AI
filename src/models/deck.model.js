<<<<<<< Updated upstream
<<<<<<< Updated upstream
class Deck {
  constructor(id, name, description) {
    this.id = id
    this.name = name
    this.description = description
    this.flashcards = []
  }

  addFlashcard(flashcard) {
    this.flashcards.push(flashcard)
  }

  removeFlashcard(flashcardId) {
    this.flashcards = this.flashcards.filter((flashcard) => flashcard.id !== flashcardId)
  }

  getFlashcards() {
    return this.flashcards
  }

  getDeckInfo() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      flashcards: this.flashcards,
    }
  }

  updateDeckInfo(name, description) {
    this.name = name
    this.description = description
  }
  getFlashcardById(flashcardId) {
    return this.flashcards.find((flashcard) => flashcard.id === flashcardId)
  }
  getFlashcardByFront(front) {
    return this.flashcards.find((flashcard) => flashcard.front === front)
  }
  getFlashcardByBack(back) {
    return this.flashcards.find((flashcard) => flashcard.back === back)
  }
  getFlashcardByIndex(index) {
    return this.flashcards[index]
  }
  getFlashcardCount() {
    return this.flashcards.length
  }
  getDeckName() {
    return this.name
  }
  getDeckDescription() {
    return this.description
  }
  getDeckId() {
    return this.id
  }
  getDeckFlashcards() {
    return this.flashcards
  }
  getDeckFlashcardCount() {
    return this.flashcards.length
  }
  getDeckFlashcardById(flashcardId) {
    return this.flashcards.find((flashcard) => flashcard.id === flashcardId)
  }
  getDeckFlashcardByFront(front) {
    return this.flashcards.find((flashcard) => flashcard.front === front)
  }
  getDeckFlashcardByBack(back) {
    return this.flashcards.find((flashcard) => flashcard.back === back)
  }
  getDeckFlashcardByIndex(index) {
    return this.flashcards[index]
  }
  getDeckFlashcardCount() {
    return this.flashcards.length
  }
  getDeckFlashcardById(flashcardId) {
    return this.flashcards.find((flashcard) => flashcard.id === flashcardId)
  }
  getDeckFlashcardByFront(front) {
    return this.flashcards.find((flashcard) => flashcard.front === front)
  }
  getDeckFlashcardByBack(back) {
    return this.flashcards.find((flashcard) => flashcard.back === back)
  }
}

export default Deck
=======
import firebase from "../utils/firebase"

export async function createDeck(deckData) {
  try {
    const docRef = await firebase.collection(firebase, "decks").add(deckData)
    return { id: docRef.id }
  } catch (error) {
    console.error("Error creating deck:", error)
    throw error
  }
=======
import firebase from "../utils/firebase"

export async function createDeck(deckData) {
  try {
    const docRef = await firebase.collection(firebase, "decks").add(deckData)
    return { id: docRef.id }
  } catch (error) {
    console.error("Error creating deck:", error)
    throw error
  }
>>>>>>> Stashed changes
}

export async function getDecks(userId) {
  try {
    const snapshot = await firebase.collection(firebase, "decks").where("userId", "==", userId).get()

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting decks:", error)
    throw error
  }
}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
