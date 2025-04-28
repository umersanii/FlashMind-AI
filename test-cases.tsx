/**
 * Test Case Template
 *
 * Test Case ID: Unique identifier
 * Test Case Description: Brief description of what is being tested
 * Test Priority: High/Medium/Low
 * Pre-conditions: Conditions that must be met before test execution
 * Test Steps: Step-by-step procedure
 * Expected Result: What should happen when test is executed
 * Actual Result: What actually happened (filled after execution)
 * Status: Pass/Fail (filled after execution)
 * Notes: Any additional information
 */

// Example Test Cases for User Registration Form

const testCases = [
  {
    id: "TC-001",
    description: "Register with valid username, email, age, and password",
    priority: "High",
    preconditions: "Registration page is accessible",
    steps: [
      "Enter username 'user123'",
      "Enter email 'user@example.com'",
      "Enter age '25'",
      "Enter password 'Password123'",
      "Click Register button",
    ],
    expectedResult: "User is registered successfully and redirected to dashboard",
    actualResult: "",
    status: "",
    notes: "Valid input test case (ECP)",
  },
  {
    id: "TC-002",
    description: "Register with username at minimum length boundary",
    priority: "Medium",
    preconditions: "Registration page is accessible",
    steps: [
      "Enter username with exactly 5 characters 'user5'",
      "Enter valid email, age, and password",
      "Click Register button",
    ],
    expectedResult: "User is registered successfully",
    actualResult: "",
    status: "",
    notes: "Boundary value test case (BVA)",
  },
  {
    id: "TC-003",
    description: "Register with username at maximum length boundary",
    priority: "Medium",
    preconditions: "Registration page is accessible",
    steps: [
      "Enter username with exactly 15 characters 'user123456789012'",
      "Enter valid email, age, and password",
      "Click Register button",
    ],
    expectedResult: "User is registered successfully",
    actualResult: "",
    status: "",
    notes: "Boundary value test case (BVA)",
  },
  {
    id: "TC-004",
    description: "Register with username below minimum length",
    priority: "Medium",
    preconditions: "Registration page is accessible",
    steps: ["Enter username with 4 characters 'usr4'", "Enter valid email, age, and password", "Click Register button"],
    expectedResult: "Error message indicating username is too short",
    actualResult: "",
    status: "",
    notes: "Invalid input test case (BVA)",
  },
  {
    id: "TC-005",
    description: "Register with age at minimum boundary",
    priority: "Medium",
    preconditions: "Registration page is accessible",
    steps: ["Enter valid username and email", "Enter age '18'", "Enter valid password", "Click Register button"],
    expectedResult: "User is registered successfully",
    actualResult: "",
    status: "",
    notes: "Boundary value test case (BVA)",
  },
  {
    id: "TC-006",
    description: "Register with age below minimum boundary",
    priority: "Medium",
    preconditions: "Registration page is accessible",
    steps: ["Enter valid username and email", "Enter age '17'", "Enter valid password", "Click Register button"],
    expectedResult: "Error message indicating user is too young",
    actualResult: "",
    status: "",
    notes: "Invalid input test case (BVA)",
  },
  {
    id: "TC-007",
    description: "Register with invalid email format",
    priority: "High",
    preconditions: "Registration page is accessible",
    steps: [
      "Enter valid username",
      "Enter invalid email 'user@example'",
      "Enter valid age and password",
      "Click Register button",
    ],
    expectedResult: "Error message indicating invalid email format",
    actualResult: "",
    status: "",
    notes: "Invalid input test case (ECP)",
  },
  {
    id: "TC-008",
    description: "Register with password missing required character types",
    priority: "High",
    preconditions: "Registration page is accessible",
    steps: [
      "Enter valid username, email, and age",
      "Enter password without uppercase 'password123'",
      "Click Register button",
    ],
    expectedResult: "Error message indicating password requirements not met",
    actualResult: "",
    status: "",
    notes: "Invalid input test case (ECP)",
  },
  {
    id: "TC-009",
    description: "Register with password at minimum length boundary",
    priority: "Medium",
    preconditions: "Registration page is accessible",
    steps: [
      "Enter valid username, email, and age",
      "Enter password with exactly 8 characters 'Pass123!'",
      "Click Register button",
    ],
    expectedResult: "User is registered successfully",
    actualResult: "",
    status: "",
    notes: "Boundary value test case (BVA)",
  },
  {
    id: "TC-010",
    description: "Register with all fields empty",
    priority: "High",
    preconditions: "Registration page is accessible",
    steps: ["Leave all fields empty", "Click Register button"],
    expectedResult: "Error messages for all required fields",
    actualResult: "",
    status: "",
    notes: "Invalid input test case (ECP)",
  },
]

export default testCases
