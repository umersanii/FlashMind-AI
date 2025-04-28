// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

// Mock console.error to avoid cluttering test output
const originalConsoleError = console.error
console.error = (...args) => {
  if (args[0] && typeof args[0] === "string" && (args[0].includes("Warning:") || args[0].includes("Error:"))) {
    return
  }
  originalConsoleError(...args)
}
