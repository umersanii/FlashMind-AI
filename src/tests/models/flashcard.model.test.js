// Mock Firebase but test the actual flashcard.model.js code
const mockAddDoc = jest.fn().mockResolvedValue({ id: "mock-doc-id" })
const mockGetDocs = jest.fn().mockResolvedValue({
  docs: [
    {
      id: "mock-doc-1",
      data: () => ({ front: "Test Question", back: "Test Answer", deckId: "deck-123" }),
    },
    {
      id: "mock-doc-2",
      data: () => ({ front: "Question 2", back: "Answer 2", deckId: "deck-123" }),
    },
  ],
})
const mockUpdateDoc = jest.fn().mockResolvedValue({})
const mockDeleteDoc = jest.fn().mockResolvedValue({})

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => "collection-ref"),
  addDoc: mockAddDoc,
  getDocs: mockGetDocs,
  query: jest.fn(() => "query-ref"),
  where: jest.fn(() => "where-ref"),
  doc: jest.fn(() => "doc-ref"),
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
}))

jest.mock("../../utils/firebase", () => ({
  db: {},
}))

// Import the actual module (not mocked)
const { createFlashcard, getFlashcards, updateFlashcard, deleteFlashcard } = require("../../models/flashcard.model")

describe("Flashcard Model", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  // Test case for creating a flashcard - valid input (ECP)
  test("createFlashcard should add a new flashcard to the database", async () => {
    // Arrange
    const flashcardData = {
      front: "What is React?",
      back: "A JavaScript library for building user interfaces",
      deckId: "deck-123",
    }

    // Act
    const result = await createFlashcard(flashcardData)

    // Assert
    expect(mockAddDoc).toHaveBeenCalled()
    expect(result).toHaveProperty("id", "mock-doc-id")
  })

  // Test case for retrieving flashcards - valid input (ECP)
  test("getFlashcards should retrieve flashcards for a specific deck", async () => {
    // Arrange
    const deckId = "deck-123"

    // Act
    const flashcards = await getFlashcards(deckId)

    // Assert
    expect(mockGetDocs).toHaveBeenCalled()
    expect(Array.isArray(flashcards)).toBe(true)
    expect(flashcards.length).toBe(2)
    expect(flashcards[0]).toHaveProperty("id", "mock-doc-1")
  })

  // Test case for updating a flashcard - valid input (ECP)
  test("updateFlashcard should update an existing flashcard", async () => {
    // Arrange
    const flashcardId = "card-1"
    const updatedData = {
      front: "Updated Question",
      back: "Updated Answer",
    }

    // Act
    const result = await updateFlashcard(flashcardId, updatedData)

    // Assert
    expect(mockUpdateDoc).toHaveBeenCalled()
    expect(result).toHaveProperty("success", true)
  })

  // Test case for deleting a flashcard - valid input (ECP)
  test("deleteFlashcard should remove a flashcard from the database", async () => {
    // Arrange
    const flashcardId = "card-1"

    // Act
    const result = await deleteFlashcard(flashcardId)

    // Assert
    expect(mockDeleteDoc).toHaveBeenCalled()
    expect(result).toHaveProperty("success", true)
  })

  // Test case for error handling in createFlashcard
  test("createFlashcard should handle errors", async () => {
    // Arrange
    const flashcardData = {
      front: "What is React?",
      back: "A JavaScript library for building user interfaces",
      deckId: "deck-123",
    }

    // Mock addDoc to throw an error for this test
    mockAddDoc.mockRejectedValueOnce(new Error("Database error"))

    // Act & Assert
    await expect(createFlashcard(flashcardData)).rejects.toThrow()
  })
})
