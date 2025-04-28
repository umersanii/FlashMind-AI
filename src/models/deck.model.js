import { db } from "../utils/firebase"
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore"

export async function createDeck(deckData) {
  try {
    const docRef = await addDoc(collection(db, "decks"), deckData)
    return { id: docRef.id }
  } catch (error) {
    console.error("Error creating deck:", error)
    throw error
  }
}

export async function getDecks(userId) {
  try {
    const q = query(collection(db, "decks"), where("userId", "==", userId))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting decks:", error)
    throw error
  }
}

export async function updateDeck(deckId, updatedData) {
  try {
    const deckRef = doc(db, "decks", deckId)
    await updateDoc(deckRef, updatedData)
    return { success: true }
  } catch (error) {
    console.error("Error updating deck:", error)
    throw error
  }
}

export async function deleteDeck(deckId) {
  try {
    const deckRef = doc(db, "decks", deckId)
    await deleteDoc(deckRef)
    return { success: true }
  } catch (error) {
    console.error("Error deleting deck:", error)
    throw error
  }
}
