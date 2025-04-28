module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/models/**/*.{js,jsx,ts,tsx}",
    "src/utils/validation.js",
    "src/utils/firebase.js",
    "src/api/llm_api.js",
    "!src/**/*.d.ts",
  ],
  coverageThreshold: {
    global: {
      statements: 30,
      branches: 30,
      functions: 30,
      lines: 30,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
}
