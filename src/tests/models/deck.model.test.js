import * as deckModel from "../../models/deck.model" // Import the entire module
import firebase from "../../utils/firebase" // Assuming this is your firebase mock

jest.mock("../../utils/firebase", () => ({
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  add: jest.fn().mockResolvedValue({ id: "mock-deck-id" }),
  where: jest.fn().mockReturnThis(),
  get: jest.fn().mockResolvedValue({
    docs: [
      {
        id: "deck-1",
        data: () => ({ name: "Test Deck 1", userId: "user-123" }),
      },
      {
        id: "deck-2",
        data: () => ({ name: "Test Deck 2", userId: "user-123" }),
      },
    ],
  }),
}))

describe("Deck Model", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("createDeck should add a new deck to the database", async () => {
    // Arrange
    const mockDeck = {
      name: "Test Deck",
      userId: "user-123",
      createdAt: new Date(),
    }

    // Act
    const result = await deckModel.createDeck(mockDeck)

    // Assert
    expect(firebase.collection).toHaveBeenCalledWith(expect.anything(), "decks")
    expect(firebase.add).toHaveBeenCalledWith(mockDeck)
    expect(result).toEqual({ id: "mock-deck-id" })
  })

  test("getDecks should retrieve all decks for a user", async () => {
    // Arrange
    const mockUserId = "user-123"

    // Act
    const result = await deckModel.getDecks(mockUserId)

    // Assert
    expect(firebase.collection).toHaveBeenCalledWith(expect.anything(), "decks")
    expect(firebase.where).toHaveBeenCalledWith("userId", "==", mockUserId)
    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty("id", "deck-1")
    expect(result[1]).toHaveProperty("id", "deck-2")
  })
})
