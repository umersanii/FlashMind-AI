// Mock Firebase Auth but test the actual auth.model.js code
const mockSignInWithEmailAndPassword = jest.fn().mockResolvedValue({
  user: { uid: "user-123", email: "test@example.com" },
})
const mockCreateUserWithEmailAndPassword = jest.fn().mockResolvedValue({
  user: { uid: "user-123", email: "test@example.com" },
})
const mockSignOut = jest.fn().mockResolvedValue(undefined)
const mockGetAuth = jest.fn(() => ({}))

jest.mock("firebase/auth", () => ({
  getAuth: mockGetAuth,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signOut: mockSignOut,
}))

// Import the actual module (not mocked)
const { signIn, signUp, logout } = require("../../models/auth.model")

describe("Auth Model", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  // Test case for signing in - valid input (ECP)
  test("signIn should authenticate a user with valid credentials", async () => {
    // Arrange
    const email = "test@example.com"
    const password = "Password123"

    // Act
    const user = await signIn(email, password)

    // Assert
    expect(mockGetAuth).toHaveBeenCalled()
    expect(mockSignInWithEmailAndPassword).toHaveBeenCalled()
    expect(user).toHaveProperty("uid", "user-123")
    expect(user).toHaveProperty("email", email)
  })

  // Test case for signing up - valid input (ECP)
  test("signUp should create a new user with valid credentials", async () => {
    // Arrange
    const email = "newuser@example.com"
    const password = "Password123"

    // Act
    const user = await signUp(email, password)

    // Assert
    expect(mockGetAuth).toHaveBeenCalled()
    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalled()
    expect(user).toHaveProperty("uid", "user-123")
  })

  // Test case for logging out - valid state (ECP)
  test("logout should sign out the current user", async () => {
    // Act
    const result = await logout()

    // Assert
    expect(mockGetAuth).toHaveBeenCalled()
    expect(mockSignOut).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  // Test case for error handling in signIn
  test("signIn should handle authentication errors", async () => {
    // Arrange
    const email = "test@example.com"
    const password = "WrongPassword"

    // Mock signInWithEmailAndPassword to throw an error for this test
    mockSignInWithEmailAndPassword.mockRejectedValueOnce(new Error("Auth error"))

    // Act & Assert
    await expect(signIn(email, password)).rejects.toThrow()
  })
})
