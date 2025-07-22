import { useState } from 'react'
import { Button } from '@/components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card p-8 rounded-lg shadow-lg border">
        <h1 className="text-3xl font-bold text-foreground mb-4">Vite + React + TailwindCSS + ShadCN</h1>
        <div className="mb-6">
          <Button 
            onClick={() => setCount((count) => count + 1)}
            className="mr-2"
          >
            count is {count}
          </Button>
          <Button variant="outline">
            ShadCN Button
          </Button>
        </div>
        <p className="text-muted-foreground">
          Edit <code className="bg-muted px-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default App
