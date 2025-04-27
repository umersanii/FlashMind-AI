import AImodel from "../models/ai.model"
import Deck from "../models/deck.model"
import FlashCard from "../models/flashcard.model"
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  writeBatch,
  addDoc,
  query,
  where,
  orderBy,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  limit,
} from "firebase/firestore"
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
    this.timerSettings = {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      autoStartBreaks: true,
      autoStartPomodoros: false,
      soundEnabled: true,
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

      console.log("Last study date:", lastStudyDate)
      console.log("Yesterday's date:", yesterday)
      console.log("Today's date:", today)
      console.log("Current streak:", this.streak.currentStreak)
      console.log("Longest streak:", this.streak.longestStreak)
      console.log("Study dates:", this.streak.studyDates)
      console.log("Today string:", todayStr)
      console.log("Last study date string:", this.streak.lastStudyDate)
      console.log("Yesterday string:", yesterday.toISOString().split("T")[0])
      console.log("Streak data before update:", this.streak)
      
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
      docs.forEach((doc) => {
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
      console.error("Invalid user ID")
      return false
    }

    console.log("Adding flashcard for user:", this.id, "to collection:", collectionName)

    if (!collectionName || typeof collectionName !== "string" || collectionName.trim() === "") {
      console.error("Invalid collection name")
      return false
    }

    if (!flashcard) {
      console.error("Flashcard data is missing")
      return false
    }

    try {
      const userDocRef = doc(collection(db, "users"), this.id)
      const colRef = collection(userDocRef, collectionName.trim())
      const docRef = await addDoc(colRef, flashcard)
      console.log("Flashcard added successfully with ID:", docRef.id)

      const docSnap = await getDoc(userDocRef)
      const flashcardSets = docSnap.data().flashcardSets || []
      const setIndex = flashcardSets.findIndex((set) => set.name === collectionName)

      if (setIndex === -1) {
        throw new Error("Flashcard set not found")
      }

      flashcardSets[setIndex].flashcards.push(flashcard)
      await updateDoc(userDocRef, { flashcardSets })

      return true
    } catch (error) {
      console.error("Error adding flashcard:", error)
      return false
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

      const userDocSnap = await getDoc(userDocRef)
      const flashcardSets = userDocSnap.exists() ? userDocSnap.data().flashcardSets || [] : []

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
  ///////////////////////////////////////////////////////
  // =====   TIMER-RELATED FIREBASE OPERATIONS   ===== //
  ///////////////////////////////////////////////////////

  async loadTimerSettings() {
    if (!this.id) return this.timerSettings

    try {
      const timerSettingsRef = doc(collection(db, "users"), this.id, "userData", "timerSettings")
      const docSnap = await getDoc(timerSettingsRef)

      if (docSnap.exists()) {
        this.timerSettings = docSnap.data()
        return this.timerSettings
      } else {
        await setDoc(timerSettingsRef, this.timerSettings)
        return this.timerSettings
      }
    } catch (error) {
      console.error("Error loading timer settings:", error)
      return this.timerSettings
    }
  }

  async saveTimerSettings(settings) {
    if (!this.id) throw new Error("User ID is required")

    try {
      const timerSettingsRef = doc(collection(db, "users"), this.id, "userData", "timerSettings")

      this.timerSettings = { ...this.timerSettings, ...settings }

      await setDoc(timerSettingsRef, this.timerSettings)
      return this.timerSettings
    } catch (error) {
      console.error("Error saving timer settings:", error)
      throw error
    }
  }

  async recordTimerSession(sessionData) {
    if (!this.id) throw new Error("User ID is required")

    try {
      const sessionsRef = collection(db, "users", this.id, "timerSessions")

      // Add timestamp if not provided
      if (!sessionData.timestamp) {
        sessionData.timestamp = serverTimestamp()
      }

      // Add session to Firestore
      const docRef = await addDoc(sessionsRef, sessionData)

      // Update streak data
      await this.updateStreak()

      return { id: docRef.id, ...sessionData }
    } catch (error) {
      console.error("Error recording timer session:", error)
      throw error
    }
  }

  async getTimerSessions(limitCount = 50) {
    if (!this.id) return []
  
    try {
      const sessionsRef = collection(db, "users", this.id, "timerSessions")
      const q = query(
        sessionsRef,
        orderBy("timestamp", "desc"),
        limit(limitCount)
      )
      const querySnapshot = await getDocs(q)
  
      const sessions = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.timestamp && data.timestamp instanceof Timestamp) {
          data.timestamp = data.timestamp.toDate()
        }
        sessions.push({ id: doc.id, ...data })
      })
  
      return sessions
    } catch (error) {
      console.error("Error fetching timer sessions:", error)
      return []
    }
  }
  
  async getTimerStatistics() {
    if (!this.id) return null

    try {
      // Get all sessions
      const sessions = await this.getTimerSessions(1000) // Get a large number to calculate stats

      if (sessions.length === 0) {
        return {
          totalSessions: 0,
          totalFocusTime: 0,
          totalBreakTime: 0,
          averageSessionLength: 0,
          sessionsToday: 0,
          focusTimeToday: 0,
          sessionsThisWeek: 0,
          focusTimeThisWeek: 0,
        }
      }

      // Calculate today and this week
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const oneWeekAgo = new Date(today)
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      // Calculate statistics
      let totalFocusTime = 0
      let totalBreakTime = 0
      let sessionsToday = 0
      let focusTimeToday = 0
      let sessionsThisWeek = 0
      let focusTimeThisWeek = 0

      sessions.forEach((session) => {
        const sessionDate = session.timestamp instanceof Date ? session.timestamp : new Date(session.timestamp)

        // Total stats
        totalFocusTime += session.focusTime || 0
        totalBreakTime += session.breakTime || 0

        // Today stats
        if (sessionDate >= today) {
          sessionsToday++
          focusTimeToday += session.focusTime || 0
        }

        // Week stats
        if (sessionDate >= oneWeekAgo) {
          sessionsThisWeek++
          focusTimeThisWeek += session.focusTime || 0
        }
      })

      return {
        totalSessions: sessions.length,
        totalFocusTime,
        totalBreakTime,
        averageSessionLength: totalFocusTime / sessions.length,
        sessionsToday,
        focusTimeToday,
        sessionsThisWeek,
        focusTimeThisWeek,
      }
    } catch (error) {
      console.error("Error calculating timer statistics:", error)
      return null
    }
  }

  async saveTimerPreset(preset) {
    if (!this.id) throw new Error("User ID is required")
    if (!preset.name) throw new Error("Preset name is required")

    try {
      const presetsRef = collection(db, "users", this.id, "timerPresets")

      // Check if preset with same name exists
      const q = query(presetsRef, where("name", "==", preset.name))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        // Update existing preset
        const existingPresetDoc = querySnapshot.docs[0]
        await updateDoc(doc(presetsRef, existingPresetDoc.id), preset)
        return { id: existingPresetDoc.id, ...preset }
      } else {
        // Create new preset
        const docRef = await addDoc(presetsRef, preset)
        return { id: docRef.id, ...preset }
      }
    } catch (error) {
      console.error("Error saving timer preset:", error)
      throw error
    }
  }

  async getTimerPresets() {
    if (!this.id) return []

    try {
      const presetsRef = collection(db, "users", this.id, "timerPresets")
      const querySnapshot = await getDocs(presetsRef)

      const presets = []
      querySnapshot.forEach((doc) => {
        presets.push({ id: doc.id, ...doc.data() })
      })

      return presets
    } catch (error) {
      console.error("Error fetching timer presets:", error)
      return []
    }
  }

  async deleteTimerPreset(presetId) {
    if (!this.id) throw new Error("User ID is required")
    if (!presetId) throw new Error("Preset ID is required")

    try {
      const presetRef = doc(db, "users", this.id, "timerPresets", presetId)
      await deleteDoc(presetRef)
      return { success: true }
    } catch (error) {
      console.error("Error deleting timer preset:", error)
      throw error
    }
  }

  async getStudyAnalytics(days = 30) {
    if (!this.id) return null

    try {
      // Get timer sessions
      const sessionsRef = collection(db, "users", this.id, "timerSessions")
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const q = query(sessionsRef, where("timestamp", ">=", startDate), orderBy("timestamp", "asc"))

      const querySnapshot = await getDocs(q)

      // Prepare data structure for daily analytics
      const dailyData = {}

      // Initialize all days in the range
      for (let i = 0; i <= days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]
        dailyData[dateStr] = {
          date: dateStr,
          focusTime: 0,
          sessions: 0,
          flashcardsReviewed: 0,
          quizzesTaken: 0,
        }
      }

      // Process timer sessions
      querySnapshot.forEach((doc) => {
        const session = doc.data()
        if (session.timestamp) {
          const sessionDate =
            session.timestamp instanceof Timestamp ? session.timestamp.toDate() : new Date(session.timestamp)

          const dateStr = sessionDate.toISOString().split("T")[0]

          if (dailyData[dateStr]) {
            dailyData[dateStr].focusTime += session.focusTime || 0
            dailyData[dateStr].sessions += 1
          }
        }
      })

      // Get flashcard activity
      const flashcardActivity = await this.getFlashcardActivity(days)

      // Merge flashcard data
      for (const activity of flashcardActivity) {
        const dateStr = activity.date
        if (dailyData[dateStr]) {
          dailyData[dateStr].flashcardsReviewed += activity.cardsReviewed || 0
          dailyData[dateStr].quizzesTaken += activity.quizzesTaken || 0
        }
      }

      // Convert to array and sort by date
      const analyticsArray = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date))

      return analyticsArray
    } catch (error) {
      console.error("Error getting study analytics:", error)
      return null
    }
  }

  async getFlashcardActivity(days = 30) {
    if (!this.id) return []

    try {
      const activityRef = collection(db, "users", this.id, "flashcardActivity")
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const q = query(activityRef, where("date", ">=", startDate.toISOString().split("T")[0]), orderBy("date", "asc"))

      const querySnapshot = await getDocs(q)

      const activity = []
      querySnapshot.forEach((doc) => {
        activity.push({ id: doc.id, ...doc.data() })
      })

      return activity
    } catch (error) {
      console.error("Error fetching flashcard activity:", error)
      return []
    }
  }

  async recordFlashcardActivity(activityData) {
    if (!this.id) throw new Error("User ID is required")

    try {
      // Ensure we have a date
      const today = new Date().toISOString().split("T")[0]
      activityData.date = activityData.date || today

      // Check if we already have an entry for today
      const activityRef = collection(db, "users", this.id, "flashcardActivity")
      const q = query(activityRef, where("date", "==", activityData.date))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        // Update existing entry
        const existingDoc = querySnapshot.docs[0]
        const existingData = existingDoc.data()

        const updatedData = {
          cardsReviewed: (existingData.cardsReviewed || 0) + (activityData.cardsReviewed || 0),
          correctAnswers: (existingData.correctAnswers || 0) + (activityData.correctAnswers || 0),
          quizzesTaken: (existingData.quizzesTaken || 0) + (activityData.quizzesTaken || 0),
          date: activityData.date,
        }

        await updateDoc(doc(activityRef, existingDoc.id), updatedData)
        return { id: existingDoc.id, ...updatedData }
      } else {
        // Create new entry
        const docRef = await addDoc(activityRef, activityData)
        return { id: docRef.id, ...activityData }
      }
    } catch (error) {
      console.error("Error recording flashcard activity:", error)
      throw error
    }
  }

  async getStudyAchievements() {
    if (!this.id) return []

    try {
      const achievementsRef = doc(collection(db, "users"), this.id, "userData", "achievements")
      const userAchievementsSnap = await getDoc(achievementsRef)

      if (userAchievementsSnap.exists()) {
        return userAchievementsSnap.data().achievements || []
      } else {
        // Initialize with empty achievements if none exist
        const initialAchievements = []
        await setDoc(achievementsRef, { achievements: initialAchievements })
        return initialAchievements
      }
    } catch (error) {
      console.error("Error fetching study achievements:", error)
      return []
    }
  }

  async unlockAchievement(achievement) {
    if (!this.id) throw new Error("User ID is required")
    if (!achievement || !achievement.id) throw new Error("Achievement ID is required")

    try {
      const achievementsRef = doc(collection(db, "users"), this.id, "userData", "achievements")
      const docSnap = await getDoc(achievementsRef)

      let achievements = []
      if (docSnap.exists()) {
        achievements = docSnap.data().achievements || []
      }

      // Check if achievement already exists
      const existingIndex = achievements.findIndex((a) => a.id === achievement.id)

      if (existingIndex === -1) {
        // Add new achievement with timestamp
        achievement.unlockedAt = new Date().toISOString()
        achievements.push(achievement)

        await setDoc(achievementsRef, { achievements })
        return achievement
      } else {
        // Achievement already unlocked
        return achievements[existingIndex]
      }
    } catch (error) {
      console.error("Error unlocking achievement:", error)
      throw error
    }
  }

  async checkAndUpdateAchievements() {
    if (!this.id) return []

    try {
      // Get current statistics
      const timerStats = await this.getTimerStatistics()
      const streakData = await this.loadStreakData()

      console.log("Timer Stats:", timerStats)

      const newAchievements = []

      // Check for timer-related achievements
      if (timerStats) {
        // First timer session
        if (timerStats.totalSessions === 1) {
          const achievement = {
            id: "first_timer_session",
            name: "Time Keeper",
            description: "Completed your first Pomodoro session",
            icon: "⏱️",
          }
          await this.unlockAchievement(achievement)
          newAchievements.push(achievement)
        }

        // 10 timer sessions
        if (timerStats.totalSessions >= 10) {
          const achievement = {
            id: "ten_timer_sessions",
            name: "Focus Master",
            description: "Completed 10 Pomodoro sessions",
            icon: "🧠",
          }
          await this.unlockAchievement(achievement)
          newAchievements.push(achievement)
        }

        // 50 timer sessions
        if (timerStats.totalSessions >= 50) {
          const achievement = {
            id: "fifty_timer_sessions",
            name: "Productivity Guru",
            description: "Completed 50 Pomodoro sessions",
            icon: "🏆",
          }
          await this.unlockAchievement(achievement)
          newAchievements.push(achievement)
        }

        // 15 minutes of focus time
        if (timerStats.totalFocusTime >= (15*60)) {
          // 15 minutes = 900 seconds
          const achievement = {
            id: "fifteen_minutes_focus",
            name: "Focus Starter",
            description: "Accumulated 15 minutes of focus time",
            icon: "🕑",
          }
          await this.unlockAchievement(achievement)
          newAchievements.push(achievement)
        }

        // 1 hour of focus time
        if (timerStats.totalFocusTime >= (60*60)) {
          // 60 minutes = 1 hour
          const achievement = {
            id: "one_hour_focus",
            name: "Focus Beginner",
            description: "Accumulated 1 hour of focus time",
            icon: "⏳",
          }
          await this.unlockAchievement(achievement)
          newAchievements.push(achievement)
        }

        // 3 hours of focus time
        if (timerStats.totalFocusTime >= (180*60)) {
          // 180 minutes = 3 hours
          const achievement = {
            id: "three_hours_focus",
            name: "Focus Enthusiast",
            description: "Accumulated 3 hours of focus time",
            icon: "🕒",
          }
          await this.unlockAchievement(achievement)
          newAchievements.push(achievement)
        }

        // 5 hours of focus time
        if (timerStats.totalFocusTime >= (300*60)) {
          // 300 minutes = 5 hours
          const achievement = {
            id: "five_hours_focus",
            name: "Deep Worker",
            description: "Accumulated 5 hours of focus time",
            icon: "⌛",
          }
          await this.unlockAchievement(achievement)
          newAchievements.push(achievement)
        }

        
      }

      // Check for streak-related achievements
      if (streakData) {
        // 3-day streak
        if (streakData.currentStreak >= 3) {
          const achievement = {
            id: "three_day_streak",
            name: "Consistency Starter",
            description: "Maintained a 3-day study streak",
            icon: "🔥",
          }
          await this.unlockAchievement(achievement)
          newAchievements.push(achievement)
        }

        // 7-day streak
        if (streakData.currentStreak >= 7) {
          const achievement = {
            id: "seven_day_streak",
            name: "Week Warrior",
            description: "Maintained a 7-day study streak",
            icon: "📅",
          }
          await this.unlockAchievement(achievement)
          newAchievements.push(achievement)
        }

        // 30-day streak
        if (streakData.currentStreak >= 30) {
          const achievement = {
            id: "thirty_day_streak",
            name: "Monthly Master",
            description: "Maintained a 30-day study streak",
            icon: "🏅",
          }
          await this.unlockAchievement(achievement)
          newAchievements.push(achievement)
        }
      }

      return newAchievements
    } catch (error) {
      console.error("Error checking achievements:", error)
      return []
    }
  }
}

export default User
