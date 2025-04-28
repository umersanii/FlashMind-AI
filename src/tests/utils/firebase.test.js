// We don't need to test the actual Firebase connection
// Just verify that the module exports the expected objects
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
}))

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
}))

describe("Firebase Utility", () => {
  test("should export db object", () => {
    // Import the module after mocking
    const firebase = require("../../utils/firebase")

    // Assert
    expect(firebase).toHaveProperty("db")
  })
})
