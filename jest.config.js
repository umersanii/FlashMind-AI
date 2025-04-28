const nextJest = require("next/jest")

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/app/(.*)$": "<rootDir>/app/$1",
    "^@/models/(.*)$": "<rootDir>/models/$1",
    "^@/utils/(.*)$": "<rootDir>/utils/$1",
    "^@/api/(.*)$": "<rootDir>/api/$1",
  },
  collectCoverage: true,
  collectCoverageFrom: ["models/**/*.js", "utils/**/*.js", "api/**/*.js", "!**/*.d.ts", "!**/node_modules/**"],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
module.exports = createJestConfig(customJestConfig)
