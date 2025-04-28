import * as flashcardModel from "../../models/flashcard.model" // Import the entire module
import firebase from "../../utils/firebase" // Assuming this is your firebase mock
import { describe, beforeEach, test, expect, jest } from "@jest/globals"

jest.mock("../../utils/firebase", () => ({
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  add: jest.fn().mockResolvedValue({ id: "mock-flashcard-id" }),
  where: jest.fn().mockReturnThis(),
  get: jest.fn().mockResolvedValue({
    docs: [
      {
        id: "card-1",
        data: () => ({
          question: "Test Question 1",
          answer: "Test Answer 1",
          deckId: "deck-123",
        }),
      },
      {
        id: "card-2",
        data: () => ({
          question: "Test Question 2",
          answer: "Test Answer 2",
          deckId: "deck-123",
        }),
      },
    ],
  }),
}))

describe("Flashcard Model", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("createFlashcard should add a new flashcard to the database", async () => {
    // Arrange
    const mockFlashcard = {
      question: "Test Question",
      answer: "Test Answer",
      deckId: "deck-123",
      createdAt: new Date(),
    }

    // Act
    const result = await flashcardModel.createFlashcard(mockFlashcard)

    // Assert
    expect(firebase.collection).toHaveBeenCalledWith(expect.anything(), "flashcards")
    expect(firebase.add).toHaveBeenCalledWith(mockFlashcard)
    expect(result).toEqual({ id: "mock-flashcard-id" })
  })

  test("getFlashcards should retrieve flashcards for a specific deck", async () => {
    // Arrange
    const mockDeckId = "deck-123"

    // Act
    const result = await flashcardModel.getFlashcards(mockDeckId)

    // Assert
    expect(firebase.collection).toHaveBeenCalledWith(expect.anything(), "flashcards")
    expect(firebase.where).toHaveBeenCalledWith("deckId", "==", mockDeckId)
    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty("id", "card-1")
    expect(result[1]).toHaveProperty("id", "card-2")
  })
})
