import { POST } from "../api/llm_api.js";


class AImodel {
  async genrateFlashcardSet(text) {
    const systemPrompt = `
    You are an intelligent flashcard generator for a SaaS platform. Your task is to create concise, informative, and effective flashcards based on user input. Each flashcard should include a question or term on the front and a clear, detailed answer or explanation on the back. Ensure that the content is accurate, educational, and appropriate for the target audience, which may vary from students to professionals. Format your responses in a way that is easy to read and understand, and strive to make each flashcard as useful as possible for learning and retention.

    return in the following JSON format 
    {
      "flashcards":[
      {
        "front": "Front of the card",
        "back": "Back of the card"
      }
      ]
    }
    just return the JSON do not return any thing extra
    `;

    const myAPIKey = process.env.NEXT_PUBLIC_LLAMA8B_API_KEY;

    const response = await POST(text, systemPrompt,myAPIKey);
    const flashcards = JSON.parse(response);
    // console.log("AI response:", flashcards);

    return flashcards;
  }
}

export default AImodel;
