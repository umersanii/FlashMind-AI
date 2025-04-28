// Mock OpenAI but test the actual llm_api.js code
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify([
                  { front: "What is JavaScript?", back: "A programming language for the web" },
                  { front: "What is HTML?", back: "HyperText Markup Language" },
                ]),
              },
            },
          ],
        }),
      },
    },
  }))
})

// Import the actual module (not mocked)
const { generateFlashcards } = require("../../api/llm_api")

describe("LLM API", () => {
  beforeEach(() => {
    // Set environment variable for testing
    process.env.OPENAI_API_KEY = "test-api-key"
  })

  afterEach(() => {
    // Clean up
    delete process.env.OPENAI_API_KEY
  })

  // Test case for generating flashcards - valid input (ECP)
  test("generateFlashcards should return formatted flashcards from API response", async () => {
    // Arrange
    const topic = "JavaScript Basics"
    const count = 2

    // Act
    const result = await generateFlashcards(topic, count)

    // Assert
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
    expect(result[0]).toHaveProperty("front")
    expect(result[0]).toHaveProperty("back")
  })

  // Test case for generating flashcards - boundary value (minimum count)
  test("generateFlashcards should work with default count when not specified", async () => {
    // Arrange
    const topic = "JavaScript Basics"

    // Act
    const result = await generateFlashcards(topic)

    // Assert
    expect(Array.isArray(result)).toBe(true)
  })

  // Test case for error handling
  test("generateFlashcards should handle API errors", async () => {
    // Arrange
    const topic = "JavaScript Basics"
    const count = 5

    // Override the OpenAI mock to throw an error for this test
    const OpenAI = require("openai")
    const mockOpenAIInstance = {
      chat: {
        completions: {
          create: jest.fn().mockRejectedValue(new Error("API Error")),
        },
      },
    }

    OpenAI.mockImplementationOnce(() => mockOpenAIInstance)

    // Act & Assert
    await expect(generateFlashcards(topic, count)).rejects.toThrow()
  })
})
