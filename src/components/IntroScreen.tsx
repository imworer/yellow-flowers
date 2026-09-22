import { motion, useReducedMotion } from 'framer-motion'

type IntroScreenProps = {
  onStart: () => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1 }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -12, filter: 'blur(6px)' }
      }
      transition={{ duration: reduceMotion ? 0.2 : 0.55, ease: 'easeOut' }}
    >
      <button
        type="button"
        className="intro-button"
        onClick={onStart}
        aria-label="Dale 5 clicks a la pantalla para comenzar la experiencia de flores amarillas."
      >
        <motion.div
          className="intro-content"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.8, ease: 'easeOut' }}
        >
          <span className="intro-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" className="intro-bloom">
              <g transform="translate(16 16)">
                <ellipse cx="0" cy="-8" rx="3.2" ry="8" fill="#E8B422" transform="rotate(22)" />
                <ellipse cx="0" cy="-8" rx="3.2" ry="8" fill="#E8B422" transform="rotate(67)" />
                <ellipse cx="0" cy="-8" rx="3.2" ry="8" fill="#E8B422" transform="rotate(112)" />
                <ellipse cx="0" cy="-8" rx="3.2" ry="8" fill="#E8B422" transform="rotate(157)" />
                <ellipse cx="0" cy="-8" rx="3.4" ry="8.2" fill="#F4C430" transform="rotate(0)" />
                <ellipse cx="0" cy="-8" rx="3.4" ry="8.2" fill="#F4C430" transform="rotate(45)" />
                <ellipse cx="0" cy="-8" rx="3.4" ry="8.2" fill="#F4C430" transform="rotate(90)" />
                <ellipse cx="0" cy="-8" rx="3.4" ry="8.2" fill="#F4C430" transform="rotate(135)" />
                <circle r="4.2" fill="#E07A2F" />
              </g>
            </svg>
          </span>
          <h1 className="intro-title">Dale 5 clicks a la pantalla</h1>
          <span className="intro-hint">Toca para comenzar</span>
        </motion.div>
      </button>
    </motion.div>
  )
}
