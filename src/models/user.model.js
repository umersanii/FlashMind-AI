import AImodel from "../models/ai.model";
import Deck from "../models/deck.model";
import FlashCard from "../models/flashcard.model";

class User {
  constructor(clerkUser) {
    this.id = clerkUser.id;
    this.firstName = clerkUser.firstName;
    this.lastName = clerkUser.lastName;
    this.emailAddresses = clerkUser.emailAddresses;
    this.primaryEmailAddress = clerkUser.primaryEmailAddress;
    this.profileImageUrl = clerkUser.profileImageUrl;
    this.publicMetadata = clerkUser.publicMetadata || {};
    this.privateMetadata = clerkUser.privateMetadata || {};
    this.flashcardSets = [];
  }

  async generateFlashcardSet(text) {

    console.log("Generating flashcard set for text");
    // const myAPIKey = process.env.LLAMA8B_API_KEY;
    // console.log("my api", myAPIKey);
    const model = new AImodel();
    const response = await model.genrateFlashcardSet(text);
    console.log("AI response:", response);
    const flashcardsData = response.flashcards || [];

    const flashcards = flashcardsData.map((card) => new FlashCard(card.front, card.back));

    const deckName = this.firstName ? `${this.firstName}'s Deck` : "Default Deck";
    const deckDescription = "Generated Flashcards";
    const deckId = `deck-${Date.now()}`;

    const deck = new Deck(deckId, deckName, deckDescription);

    flashcards.forEach((flashcard) => deck.addFlashcard(flashcard));

    this.flashcardSets.push(deck);

    return deck;
  }
}

export default User;
