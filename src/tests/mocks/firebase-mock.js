// Mock implementation for Firebase
const mockFirestore = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  addDoc: jest.fn().mockResolvedValue({ id: "mock-doc-id" }),
  getDocs: jest.fn().mockResolvedValue({
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
  }),
  updateDoc: jest.fn().mockResolvedValue({}),
  deleteDoc: jest.fn().mockResolvedValue({}),
  query: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
}

// Export the mock
export { mockFirestore }

// Mock the Firebase modules
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => mockFirestore),
  addDoc: jest.fn(() => Promise.resolve({ id: "mock-doc-id" })),
  getDocs: jest.fn(() =>
    Promise.resolve({
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
    }),
  ),
  updateDoc: jest.fn(() => Promise.resolve({})),
  deleteDoc: jest.fn(() => Promise.resolve({})),
  query: jest.fn(() => mockFirestore),
  where: jest.fn(() => mockFirestore),
  doc: jest.fn(() => mockFirestore),
}))

jest.mock("../../utils/firebase", () => ({
  db: {},
}))
