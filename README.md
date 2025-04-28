# FlashMind AI Testing Guide

## Running Tests

To run all tests:
\`\`\`bash
npm test
\`\`\`

To run tests with coverage report:
\`\`\`bash
npm run test:coverage
\`\`\`

To run tests in watch mode during development:
\`\`\`bash
npm run test:watch
\`\`\`

## Test Structure

- **Black Box Tests**: Located in `tests/blackbox/`
  - Test cases documented in `test-cases.md`
  - Implementation in `test-execution.js`

- **White Box Tests**: Located in `tests/`
  - Model tests: `tests/models/`
  - API tests: `tests/api/`
  - Utility tests: `tests/utils/`

## Coverage Requirements

We aim for at least 70% coverage across all metrics:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

## Adding New Tests

When adding new features, please follow these guidelines:
1. Add black box test cases to `tests/blackbox/test-cases.md`
2. Implement corresponding test execution in appropriate test files
3. Ensure all edge cases are covered
4. Run coverage report to verify adequate coverage
