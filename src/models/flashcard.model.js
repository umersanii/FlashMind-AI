import { db } from "../utils/firebase"
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore"

export async function createFlashcard(flashcardData) {
  try {
    const docRef = await addDoc(collection(db, "flashcards"), flashcardData)
    return { id: docRef.id }
  } catch (error) {
    console.error("Error creating flashcard:", error)
    throw error
  }
}

export async function getFlashcards(deckId) {
  try {
    const q = query(collection(db, "flashcards"), where("deckId", "==", deckId))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting flashcards:", error)
    throw error
  }
}

export async function updateFlashcard(flashcardId, updatedData) {
  try {
    const flashcardRef = doc(db, "flashcards", flashcardId)
    await updateDoc(flashcardRef, updatedData)
    return { success: true }
  } catch (error) {
    console.error("Error updating flashcard:", error)
    throw error
  }
}

export async function deleteFlashcard(flashcardId) {
  try {
    const flashcardRef = doc(db, "flashcards", flashcardId)
    await deleteDoc(flashcardRef)
    return { success: true }
  } catch (error) {
    console.error("Error deleting flashcard:", error)
    throw error
  }
}
