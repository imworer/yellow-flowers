import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FlowerField } from './components/FlowerField'
import { IntroScreen } from './components/IntroScreen'

export default function App() {
  const [hasStarted, setHasStarted] = useState(false)

  const start = useCallback(() => {
    setHasStarted(true)
  }, [])

  return (
    <main className="experience">
      <FlowerField enabled={hasStarted} />
      <AnimatePresence>
        {hasStarted ? null : <IntroScreen key="intro" onStart={start} />}
      </AnimatePresence>
    </main>
  )
}
