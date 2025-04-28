export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validatePassword(password) {
  return password && password.length >= 6
}

export function validateFlashcard(flashcard) {
  if (!flashcard.front || !flashcard.back) {
    return false
  }

  if (flashcard.front.length > 200 || flashcard.back.length > 500) {
    return false
  }

  return true
}
