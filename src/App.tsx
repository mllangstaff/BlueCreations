import Dashboard from '@/components/Dashboard'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="bluecreations-theme">
      <Dashboard />
      <Toaster />
    </ThemeProvider>
  )
}

export default App
