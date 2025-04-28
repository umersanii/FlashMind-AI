import testCases from "../test-cases"

export default function Page() {
  return (
    <div>
      <h1>User Registration Form Test Cases</h1>
      <ul>
        {testCases.map((testCase) => (
          <li key={testCase.id}>
            <strong>{testCase.id}:</strong> {testCase.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
