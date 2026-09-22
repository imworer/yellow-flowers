import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FlowerField } from './FlowerField'
import { IntroScreen } from './IntroScreen'

type YellowFlowerExperienceProps = {
  finalImageUrl?: string
}

/**
 * Existing yellow-flowers interactive experience.
 * Optional finalImageUrl overrides the default /us.jpg photo.
 */
export function YellowFlowerExperience({
  finalImageUrl,
}: YellowFlowerExperienceProps) {
  const [hasStarted, setHasStarted] = useState(false)

  const start = useCallback(() => {
    setHasStarted(true)
  }, [])

  return (
    <main className="experience">
      <FlowerField enabled={hasStarted} finalImageUrl={finalImageUrl} />
      <AnimatePresence>
        {hasStarted ? null : <IntroScreen key="intro" onStart={start} />}
      </AnimatePresence>
    </main>
  )
}
