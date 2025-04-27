import AImodel from "../models/ai.model"
import Deck from "../models/deck.model"
import FlashCard from "../models/flashcard.model"
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, writeBatch, addDoc } from "firebase/firestore"
import { db } from "../utils/firebase"

class User {
  constructor(clerkUser) {
    this.id = clerkUser?.id
    this.firstName = clerkUser?.firstName
    this.lastName = clerkUser?.lastName
    this.emailAddresses = clerkUser?.emailAddresses
    this.primaryEmailAddress = clerkUser?.primaryEmailAddress
    this.profileImageUrl = clerkUser?.profileImageUrl
    this.publicMetadata = clerkUser?.publicMetadata || {}
    this.privateMetadata = clerkUser?.privateMetadata || {}
    this.flashcardSets = []
    this.streak = {
      currentStreak: 0,
      lastStudyDate: null,
      studyDates: [],
      longestStreak: 0,
    }
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

  async generateQuiz(text, difficulty = 2, numQuestions = 5) {
    console.log("Generating quiz for text with difficulty:", difficulty, "and questions:", numQuestions)
    const model = new AImodel()
    const response = await model.generateQuiz(text, difficulty, numQuestions)
    console.log("AI response:", response)

    return response
  }

  async getChatbotResponse(input, context = "") {
    console.log("Getting chatbot response for input:", input)
    const model = new AImodel()

    console.log("Context:", context)
    const response = await model.chatbotResponse(input, context)
    return response
  }

  async loadStreakData() {
    if (!this.id) return null

    try {
      const streakDocRef = doc(collection(db, "users"), this.id, "userData", "streak")
      const docSnap = await getDoc(streakDocRef)

      if (docSnap.exists()) {
        this.streak = docSnap.data()
        return this.streak
      } else {
        const initialStreak = {
          currentStreak: 0,
          lastStudyDate: null,
          studyDates: [],
          longestStreak: 0,
        }
        await setDoc(streakDocRef, initialStreak)
        this.streak = initialStreak
        return initialStreak
      }
    } catch (error) {
      console.error("Error loading streak data:", error)
      return null
    }
  }

  async updateStreak() {
    if (!this.id) return null

    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayStr = today.toISOString().split("T")[0]

      await this.loadStreakData()

      if (this.streak.studyDates.includes(todayStr)) {
        return this.streak
      }

      const lastStudyDate = this.streak.lastStudyDate ? new Date(this.streak.lastStudyDate) : null
      lastStudyDate?.setHours(0, 0, 0, 0)

      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastStudyDate && lastStudyDate.getTime() === yesterday.getTime()) {
        this.streak.currentStreak += 1
      } else if (!lastStudyDate || lastStudyDate.getTime() !== today.getTime()) {
        this.streak.currentStreak = 1
      }

      if (this.streak.currentStreak > this.streak.longestStreak) {
        this.streak.longestStreak = this.streak.currentStreak
      }

      if (!this.streak.studyDates.includes(todayStr)) {
        this.streak.studyDates.push(todayStr)
      }

      this.streak.lastStudyDate = todayStr

      const streakDocRef = doc(collection(db, "users"), this.id, "userData", "streak")
      await setDoc(streakDocRef, this.streak)

      return this.streak
    } catch (error) {
      console.error("Error updating streak:", error)
      return null
    }
  }

  async getRecommendedTopics() {
    if (!this.id) return []
    // console.log("Getting recommended topics for user:", this.id)

    try {
      const userDocRef = doc(collection(db, "users"), this.id)
      const docSnap = await getDoc(userDocRef)

      if (!docSnap.exists()) return []

      const flashcardSets = docSnap.data().flashcardSets || []
      if (flashcardSets.length === 0) return []

      let flashcardContent = ""

      const recentSets = flashcardSets.slice(-10)

      recentSets.forEach((set) => {
        flashcardContent += `Set: ${set.name}\n`
        const sampleCards = set.flashcards.slice(0, 5)
        sampleCards.forEach((card) => {
          flashcardContent += `Q: ${card.front}\nA: ${card.back}\n`
        })
        flashcardContent += "\n"
      })

      const model = new AImodel()
      const systemPrompt = `
          ONLY return a JSON array of 5 recommended topics.
          Each object should have a 'id', 'topic', 'subtopic', and 'confidence' field.
          NO introduction, no explanation, just the JSON array.
          
          Example:
          [
            { "id": 1, "topic": "Biology", "subtopic": "Cell Structure", "confidence": 0.95 },
            { "id": 2, "topic": "Chemistry", "subtopic": "Periodic Table", "confidence": 0.88 },
            { "id": 3, "topic": "Physics", "subtopic": "Quantum Mechanics", "confidence": 0.82 },
            { "id": 4, "topic": "Mathematics", "subtopic": "Calculus", "confidence": 0.79 }
          ]
          
          User's flashcard content:
          ${flashcardContent}
          `

      // console.log("System prompt for recommended topics:", systemPrompt)
      const response = await model.chatbotResponse(
        "Generate study topic recommendations based on my flashcards",
        systemPrompt,
      )

      console.log("AI response for recommended topics:", response)

      try {
        // Safely extract JSON part
        const jsonStartIndex = response.indexOf("[")
        const jsonEndIndex = response.lastIndexOf("]") + 1

        if (jsonStartIndex === -1 || jsonEndIndex === 0) {
          throw new Error("No JSON array found in AI response")
        }

        const jsonString = response.slice(jsonStartIndex, jsonEndIndex)
        const recommendations = JSON.parse(jsonString)

        return Array.isArray(recommendations) ? recommendations : []
      } catch (parseError) {
        console.error("Failed to parse AI recommendations:", parseError, "Full response:", response)
        return []
      }
    } catch (error) {
      console.error("Error getting recommended topics:", error)
      return []
    }
  }

  async getFlashcardSets() {
    if (!this.id) return []

    try {
      const userDocRef = doc(collection(db, "users"), this.id)
      const docSnap = await getDoc(userDocRef)

      if (docSnap.exists()) {
        return docSnap.data().flashcardSets || []
      } else {
        await setDoc(userDocRef, { flashcardSets: [] })
        return []
      }
    } catch (error) {
      console.error("Error fetching flashcard sets:", error)
      throw error
    }
  }

  async getFlashcards(collectionName) {
    if (!this.id || collectionName == null) {
      console.error("Invalid user ID or collection name is missing")
      return []
    }
  
    try {
      const userDocRef = doc(collection(db, "users"), this.id)
      console.log("Fetching flashcards for user:", this.id, "from collection:", collectionName)
      console.log("User document reference:", userDocRef)
  
      const colRef = collection(userDocRef, collectionName) // Access the subcollection by name
      const docs = await getDocs(colRef)
      console.log("Document snapshots:", docs)
  
      if (docs.empty) {
        console.error("No flashcards found in the collection:", collectionName)
        return []
      }
  
      const flashcardsData = []
      docs.forEach(doc => {
        flashcardsData.push({ id: doc.id, ...doc.data() })
      })
  
      console.log("Flashcards data:", flashcardsData)
      return flashcardsData
    } catch (error) {
      console.error("Error fetching flashcards:", error)
      return []
    }
  }
  
  async addFlashcard(collectionName, flashcard) {
    if (!this.id) {
      console.error("Invalid user ID");
      return false;
    }

    console.log("Adding flashcard for user:", this.id, "to collection:", collectionName);
  
    if (!collectionName || typeof collectionName !== "string" || collectionName.trim() === "") {
      console.error("Invalid collection name");
      return false;
    }
  
    if (!flashcard) {
      console.error("Flashcard data is missing");
      return false;
    }
  
    try {
      const userDocRef = doc(collection(db, "users"), this.id);
      const colRef = collection(userDocRef, collectionName.trim());
      const docRef = await addDoc(colRef, flashcard);
      console.log("Flashcard added successfully with ID:", docRef.id);

      const docSnap = await getDoc(userDocRef);
      const flashcardSets = docSnap.data().flashcardSets || [];
      const setIndex = flashcardSets.findIndex(set => set.name === collectionName);

      if (setIndex === -1) {
        throw new Error("Flashcard set not found");
      }

      flashcardSets[setIndex].flashcards.push(flashcard);
      await updateDoc(userDocRef, { flashcardSets });

      return true;
    } catch (error) {
      console.error("Error adding flashcard:", error);
      return false;
    }
  }
  
  async updateFlashcard(setIndex, flashcardIndex, updatedFlashcard) {
    if (!this.id) throw new Error("User ID is required")

    try {
      const userDocRef = doc(collection(db, "users"), this.id)
      const docSnap = await getDoc(userDocRef)
      const flashcardSets = docSnap.data().flashcardSets || []

      if (!flashcardSets[setIndex] || !flashcardSets[setIndex].flashcards[flashcardIndex]) {
        throw new Error("Flashcard not found")
      }

      flashcardSets[setIndex].flashcards[flashcardIndex] = updatedFlashcard
      await updateDoc(userDocRef, { flashcardSets })
      return flashcardSets
    } catch (error) {
      console.error("Error updating flashcard:", error)
      throw error
    }
  }

  async deleteFlashcard(setIndex, flashcardIndex) {
    if (!this.id) throw new Error("User ID is required")

    try {
      const userDocRef = doc(collection(db, "users"), this.id)
      const docSnap = await getDoc(userDocRef)
      const flashcardSets = docSnap.data().flashcardSets || []

      if (!flashcardSets[setIndex]) {
        throw new Error("Flashcard set not found")
      }

      flashcardSets[setIndex].flashcards.splice(flashcardIndex, 1)
      await updateDoc(userDocRef, { flashcardSets })
      return flashcardSets
    } catch (error) {
      console.error("Error deleting flashcard:", error)
      throw error
    }
  }

  async addCollection(collectionName) {
    if (!this.id) throw new Error("User ID is required")
    if (!collectionName) throw new Error("Collection name is required")

    try {
      const userDocRef = doc(collection(db, "users"), this.id)
      const docSnap = await getDoc(userDocRef)
      const flashcardSets = docSnap.data().flashcardSets || []

      if (flashcardSets.find((set) => set.name === collectionName)) {
        throw new Error("A collection with that name already exists")
      }

      flashcardSets.push({ name: collectionName, flashcards: [] })
      await updateDoc(userDocRef, { flashcardSets })
      return flashcardSets
    } catch (error) {
      console.error("Error adding collection:", error)
      throw error
    }
  }

  async updateCollection(setIndex, newName) {
    if (!this.id) throw new Error("User ID is required")

    try {
      const userDocRef = doc(collection(db, "users"), this.id)
      const docSnap = await getDoc(userDocRef)
      const flashcardSets = docSnap.data().flashcardSets || []

      if (!flashcardSets[setIndex]) {
        throw new Error("Collection not found")
      }

      flashcardSets[setIndex].name = newName
      await updateDoc(userDocRef, { flashcardSets })
      return flashcardSets
    } catch (error) {
      console.error("Error updating collection:", error)
      throw error
    }
  }

  async deleteCollection(setIndex) {
    if (!this.id) throw new Error("User ID is required")

    try {
      const userDocRef = doc(collection(db, "users"), this.id)
      const docSnap = await getDoc(userDocRef)
      const flashcardSets = docSnap.data().flashcardSets || []

      if (!flashcardSets[setIndex]) {
        throw new Error("Collection not found")
      }

      flashcardSets.splice(setIndex, 1)
      await updateDoc(userDocRef, { flashcardSets })
      return flashcardSets
    } catch (error) {
      console.error("Error deleting collection:", error)
      throw error
    }
  }

  async saveFlashcardsToCollection(name, flashcards, isQuiz = false, selectedCollection = "") {
    if (!this.id) throw new Error("User ID is required")
    if (!name && !selectedCollection) throw new Error("Collection name is required")

    try {
      const batch = writeBatch(db)
      const userDocRef = doc(collection(db, "users"), this.id)

      const docSnap = await getDoc(userDocRef)
      const flashcardSets = docSnap.exists() ? docSnap.data().flashcardSets || [] : []

      if (name) {
        if (flashcardSets.find((set) => set.name === name)) {
          throw new Error("A flashcard set with that name already exists")
        } else {
          flashcardSets.push({
            name,
            flashcards,
            ...(isQuiz && { isQuiz: true }),
          })
          batch.set(userDocRef, { flashcardSets }, { merge: true })
        }
      } else {
        if (selectedCollection && !flashcardSets.find((set) => set.name === selectedCollection)) {
          throw new Error("Selected collection does not exist")
        }
      }

      const colRef = selectedCollection ? collection(userDocRef, selectedCollection) : collection(userDocRef, name)

      flashcards.forEach((card) => {
        if (!card.id) {
          throw new Error("Card ID is missing")
        }

        const cardDocRef = doc(colRef, card.id)
        batch.set(cardDocRef, card)
      })

      await batch.commit()
      return { success: true }
    } catch (error) {
      console.error("Error saving flashcards:", error)
      throw error
    }
  }

  async updateFlashcardInCollection(collectionName, cardId, updatedData) {
    if (!this.id || !collectionName || !cardId) {
      throw new Error("Missing required parameters")
    }

    try {
      const userDocRef = doc(collection(db, "users"), this.id)
      const colRef = collection(userDocRef, collectionName)
      const cardDocRef = doc(colRef, cardId)

      await updateDoc(cardDocRef, updatedData)
      return { success: true }
    } catch (error) {
      console.error("Error updating flashcard:", error)
      throw error
    }
  }
}

export default User
