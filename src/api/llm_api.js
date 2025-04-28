import OpenAI from "openai"

export async function generateFlashcards(topic, count = 5) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `Generate ${count} flashcards about ${topic}. Each flashcard should have a 'front' with a question and a 'back' with the answer. Return the result as a JSON array.`

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates educational flashcards." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    })

    // Parse the response content as JSON
    const content = response.choices[0].message.content
    const flashcards = JSON.parse(content)

    return flashcards
  } catch (error) {
    console.error("Error generating flashcards:", error)
    throw error
  }
}
