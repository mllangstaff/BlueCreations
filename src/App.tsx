import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">
          BlueCreations
        </h1>
        <p className="text-lg text-blue-700 mb-8">
          AI Hyper-Personalization Agent
        </p>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Count is {count}
        </button>
      </div>
    </div>
  )
}

export default App