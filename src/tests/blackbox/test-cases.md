# Black Box Test Cases for FlashMind AI

## Equivalence Class Partitioning (ECP)

### 1. Flashcard Creation Input Testing

**Input Parameter: Flashcard Content Length**
- **Valid Classes**: 
  - EC1: Short content (1-50 characters)
  - EC2: Medium content (51-500 characters)
  - EC3: Long content (501-2000 characters)
- **Invalid Classes**:
  - EC4: Empty content (0 characters)
  - EC5: Extremely long content (>2000 characters)

**Input Parameter: Flashcard Type**
- **Valid Classes**:
  - EC6: Text-only flashcards
  - EC7: Flashcards with images
  - EC8: Flashcards with code snippets
- **Invalid Classes**:
  - EC9: Unsupported media types

**Input Parameter: AI-Generated Content**
- **Valid Classes**:
  - EC10: Simple factual queries
  - EC11: Complex conceptual queries
  - EC12: Code explanation queries
- **Invalid Classes**:
  - EC13: Inappropriate/harmful content requests
  - EC14: Extremely vague queries

### 2. User Authentication Testing

**Input Parameter: Email Format**
- **Valid Classes**:
  - EC15: Standard email format (user@domain.com)
- **Invalid Classes**:
  - EC16: Missing @ symbol
  - EC17: Missing domain
  - EC18: Invalid characters

**Input Parameter: Password Strength**
- **Valid Classes**:
  - EC19: Strong passwords (8+ chars with mix of letters, numbers, symbols)
- **Invalid Classes**:
  - EC20: Too short passwords (<8 chars)
  - EC21: Weak passwords (only letters)

### 3. Deck Management Testing

**Input Parameter: Deck Size**
- **Valid Classes**:
  - EC22: Small decks (1-10 cards)
  - EC23: Medium decks (11-100 cards)
  - EC24: Large decks (101-500 cards)
- **Invalid Classes**:
  - EC25: Empty decks (0 cards)
  - EC26: Extremely large decks (>500 cards)

## Boundary Value Analysis (BVA)

### 1. Flashcard Content Length

- **Lower Boundary**: 1 character (min valid), 0 characters (invalid)
- **Upper Boundary**: 2000 characters (max valid), 2001 characters (invalid)

### 2. Password Length

- **Lower Boundary**: 8 characters (min valid), 7 characters (invalid)
- **Upper Boundary**: 64 characters (max valid), 65 characters (invalid)

### 3. Deck Size

- **Lower Boundary**: 1 card (min valid), 0 cards (invalid)
- **Upper Boundary**: 500 cards (max valid), 501 cards (invalid)

### 4. API Rate Limits

- **Lower Boundary**: 1 request (min valid)
- **Upper Boundary**: 100 requests per minute (max valid), 101 requests (invalid)

## Test Cases

| ID | Test Case | Input | Expected Output | Test Type | Class/Boundary |
|----|-----------|-------|-----------------|-----------|----------------|
| TC1 | Create flashcard with valid short content | 25 character text | Flashcard created successfully | ECP | EC1 |
| TC2 | Create flashcard with valid medium content | 250 character text | Flashcard created successfully | ECP | EC2 |
| TC3 | Create flashcard with valid long content | 1500 character text | Flashcard created successfully | ECP | EC3 |
| TC4 | Create flashcard with empty content | Empty string | Error message: "Content cannot be empty" | ECP | EC4 |
| TC5 | Create flashcard with extremely long content | 2500 character text | Error message: "Content exceeds maximum length" | ECP | EC5 |
| TC6 | Create text-only flashcard | Text without media | Flashcard created successfully | ECP | EC6 |
| TC7 | Create flashcard with image | Text + valid image | Flashcard with image created successfully | ECP | EC7 |
| TC8 | Create flashcard with code snippet | Valid code block | Flashcard with formatted code created successfully | ECP | EC8 |
| TC9 | Create flashcard with unsupported media | Text + unsupported file | Error message about unsupported media | ECP | EC9 |
| TC10 | Generate content with simple query | "What is photosynthesis?" | AI generates relevant content | ECP | EC10 |
| TC11 | Sign up with valid email | user@example.com | Account created successfully | ECP | EC15 |
| TC12 | Sign up with invalid email (no @) | userexample.com | Error message about invalid email | ECP | EC16 |
| TC13 | Sign up with strong password | "P@ssw0rd123!" | Account created successfully | ECP | EC19 |
| TC14 | Sign up with short password | "abc123" | Error message about password length | ECP | EC20 |
| TC15 | Create deck with minimum cards | 1 card | Deck created successfully | BVA | Lower boundary |
| TC16 | Create deck with no cards | 0 cards | Error message about empty deck | BVA | Lower boundary (invalid) |
| TC17 | Create deck with maximum cards | 500 cards | Deck created successfully | BVA | Upper boundary |
| TC18 | Create deck exceeding maximum | 501 cards | Warning or performance issue notification | BVA | Upper boundary (invalid) |
| TC19 | Create flashcard with boundary content length | 2000 characters | Flashcard created successfully | BVA | Upper boundary |
| TC20 | Create flashcard exceeding max length | 2001 characters | Error message about exceeding length | BVA | Upper boundary (invalid) |
