import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type FinalMediaProps = {
  active: boolean
  finalImageUrl?: string
}

export function FinalMedia({ active, finalImageUrl }: FinalMediaProps) {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const photoSrc = finalImageUrl ?? '/us.jpg'

  useEffect(() => {
    if (!active || visible) {
      return
    }
    setVisible(true)
  }, [active, visible])

  return (
    <div className="finale-media" aria-live="polite">
      <AnimatePresence>
        {visible ? (
          <motion.div
            key="photo"
            className="finale-media-frame finale-media-photo"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.9 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0.3 : 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <img
              className="finale-media-element"
              src={photoSrc}
              alt="Foto de la experiencia"
              draggable={false}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
