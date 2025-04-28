// Mock Firebase but test the actual deck.model.js code
const mockAddDoc = jest.fn().mockResolvedValue({ id: "mock-doc-id" })
const mockGetDocs = jest.fn().mockResolvedValue({
  docs: [
    {
      id: "deck-1",
      data: () => ({ name: "JavaScript", description: "JS basics", userId: "user-123" }),
    },
    {
      id: "deck-2",
      data: () => ({ name: "React", description: "React fundamentals", userId: "user-123" }),
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
const { createDeck, getDecks, updateDeck, deleteDeck } = require("../../models/deck.model")

describe("Deck Model", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  // Test case for creating a deck - valid input (ECP)
  test("createDeck should add a new deck to the database", async () => {
    // Arrange
    const deckData = {
      name: "JavaScript",
      description: "JS basics",
      userId: "user-123",
    }

    // Act
    const result = await createDeck(deckData)

    // Assert
    expect(mockAddDoc).toHaveBeenCalled()
    expect(result).toHaveProperty("id", "mock-doc-id")
  })

  // Test case for retrieving decks - valid input (ECP)
  test("getDecks should retrieve decks for a specific user", async () => {
    // Arrange
    const userId = "user-123"

    // Act
    const decks = await getDecks(userId)

    // Assert
    expect(mockGetDocs).toHaveBeenCalled()
    expect(Array.isArray(decks)).toBe(true)
    expect(decks.length).toBe(2)
    expect(decks[0]).toHaveProperty("id", "deck-1")
  })

  // Test case for updating a deck - valid input (ECP)
  test("updateDeck should update an existing deck", async () => {
    // Arrange
    const deckId = "deck-1"
    const updatedData = {
      name: "Updated JavaScript",
      description: "Updated JS basics",
    }

    // Act
    const result = await updateDeck(deckId, updatedData)

    // Assert
    expect(mockUpdateDoc).toHaveBeenCalled()
    expect(result).toHaveProperty("success", true)
  })

  // Test case for deleting a deck - valid input (ECP)
  test("deleteDeck should remove a deck from the database", async () => {
    // Arrange
    const deckId = "deck-1"

    // Act
    const result = await deleteDeck(deckId)

    // Assert
    expect(mockDeleteDoc).toHaveBeenCalled()
    expect(result).toHaveProperty("success", true)
  })

  // Test case for error handling in createDeck
  test("createDeck should handle errors", async () => {
    // Arrange
    const deckData = {
      name: "JavaScript",
      description: "JS basics",
      userId: "user-123",
    }

    // Mock addDoc to throw an error for this test
    mockAddDoc.mockRejectedValueOnce(new Error("Database error"))

    // Act & Assert
    await expect(createDeck(deckData)).rejects.toThrow()
  })
})
