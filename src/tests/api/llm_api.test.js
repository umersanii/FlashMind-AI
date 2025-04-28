// Add the required import for Node.js environment
import "openai/shims/node"

import { generateFlashcards } from "../../api/llm_api"
import OpenAI from "openai"

// Mock the OpenAI module
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify([
                    { question: "What is React?", answer: "A JavaScript library for building user interfaces" },
                    {
                      question: "What is JSX?",
                      answer: "A syntax extension for JavaScript that looks similar to HTML",
                    },
                  ]),
                },
              },
            ],
          }),
        },
      },
    }
  })
})

describe("LLM API", () => {
  test("generateFlashcards should return formatted flashcards from API response", async () => {
    // Arrange
    const topic = "React Basics"
    const count = 2

    // Act
    const result = await generateFlashcards(topic, count)

    // Assert
    expect(OpenAI).toHaveBeenCalled()
    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty("question", "What is React?")
    expect(result[0]).toHaveProperty("answer", "A JavaScript library for building user interfaces")
  })
})
