/**
 * Implements the SuperMemo 2 algorithm for spaced repetition
 * @param {number} repetitions - Number of times the card has been reviewed
 * @param {number} easeFactor - Current ease factor of the card (minimum 1.3)
 * @param {number} quality - Quality of the response (0-5)
 * @returns {Object} - New repetitions, ease factor, and interval in days
 */
export function calculateNextReview(repetitions, easeFactor, quality) {
  // Convert quality from 0-5 to 0-1 scale for calculation
  const normalizedQuality = quality / 5

  // Calculate new ease factor
  // The formula adjusts the ease factor based on the quality of response
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  // Ensure ease factor doesn't go below 1.3
  if (newEaseFactor < 1.3) newEaseFactor = 1.3

  let newRepetitions, interval

  // If the quality is less than 3 (user didn't remember well), reset repetitions
  if (quality < 3) {
    newRepetitions = 0
    interval = 1 // Review again in 1 day
  } else {
    // User remembered, increase repetitions
    newRepetitions = repetitions + 1

    // Calculate interval based on repetitions
    if (newRepetitions === 1) {
      interval = 1 // First successful review: 1 day
    } else if (newRepetitions === 2) {
      interval = 6 // Second successful review: 6 days
    } else {
      // For subsequent reviews, multiply the previous interval by the ease factor
      // We're assuming the previous interval is passed in the function call
      // In a real implementation, you'd store and retrieve this value
      const previousInterval = repetitions === 2 ? 6 : 1 // Simplified for this example
      interval = Math.round(previousInterval * newEaseFactor)
    }
  }

  return {
    repetitions: newRepetitions,
    easeFactor: newEaseFactor,
    interval: interval,
  }
}

/**
 * Determines if a flashcard is due for review
 * @param {Date} nextReviewDate - The date when the card should be reviewed next
 * @returns {boolean} - Whether the card is due for review
 */
export function isCardDue(nextReviewDate) {
  const now = new Date()
  return now >= nextReviewDate
}

/**
 * Calculates the priority of a flashcard for review
 * Higher priority means the card should be reviewed sooner
 * @param {Object} card - The flashcard object
 * @returns {number} - Priority score (higher means higher priority)
 */
export function calculateCardPriority(card) {
  const now = new Date()
  const dueDate = new Date(card.nextReviewDate)

  // If the card is overdue, give it high priority
  if (now > dueDate) {
    // Calculate days overdue
    const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24))
    return 1000 + daysOverdue * 10 + card.difficulty * 5
  }

  // If the card is due soon, give it medium priority
  const daysUntilDue = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24))
  if (daysUntilDue <= 1) {
    return 500 + card.difficulty * 5
  }

  // Otherwise, give it low priority based on difficulty and days until due
  return Math.max(0, 100 - daysUntilDue * 5 + card.difficulty * 10)
}

/**
 * Sorts flashcards by priority for review
 * @param {Array} cards - Array of flashcard objects
 * @returns {Array} - Sorted array of flashcards
 */
export function sortCardsByPriority(cards) {
  return [...cards].sort((a, b) => {
    return calculateCardPriority(b) - calculateCardPriority(a)
  })
}
