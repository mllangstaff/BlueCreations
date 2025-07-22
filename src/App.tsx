import Dashboard from '@/components/Dashboard'
import { ThemeProvider } from '@/contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="bluecreations-theme">
      <Dashboard />
    </ThemeProvider>
  )
}

export default App
