import { motion, useReducedMotion } from 'framer-motion'
import type { FlowerData } from '../types/flower'

type FlowerProps = {
  flower: FlowerData
  className?: string
  showSparks?: boolean
  animateEntrance?: boolean
}

const PETAL_COUNT = 8

function sparkOffsets(rotation: number) {
  return Array.from({ length: 5 }, (_, index) => {
    const angle = ((index / 5) * 360 + rotation) * (Math.PI / 180)
    const distance = 20 + (index % 2) * 8
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 8,
    }
  })
}

function FlowerGraphic({ id }: { id: string }) {
  const petalFill = `petal-${id}`
  const centerFill = `center-${id}`

  return (
    <svg
      className="flower-graphic"
      viewBox="0 0 100 140"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={petalFill} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE56A" />
          <stop offset="55%" stopColor="#F4C430" />
          <stop offset="100%" stopColor="#E3A91A" />
        </linearGradient>
        <radialGradient id={centerFill} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#F0A04A" />
          <stop offset="70%" stopColor="#E07A2F" />
          <stop offset="100%" stopColor="#C45E1A" />
        </radialGradient>
      </defs>

      <path
        d="M50 52 C47 86, 54 108, 50 136"
        fill="none"
        stroke="#6F8F4E"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <ellipse
        cx="33"
        cy="96"
        rx="14"
        ry="6.5"
        fill="#7FA35C"
        transform="rotate(-38 33 96)"
      />
      <ellipse
        cx="67"
        cy="110"
        rx="12"
        ry="5.5"
        fill="#88AB62"
        transform="rotate(42 67 110)"
      />

      <g transform="translate(50 36)">
        {Array.from({ length: PETAL_COUNT }, (_, index) => (
          <ellipse
            key={`back-${index}`}
            cx="0"
            cy="-19"
            rx="7.5"
            ry="17"
            fill="#E8B422"
            transform={`rotate(${index * 45 + 22.5})`}
          />
        ))}
        {Array.from({ length: PETAL_COUNT }, (_, index) => (
          <ellipse
            key={`front-${index}`}
            cx="0"
            cy="-17"
            rx="6.5"
            ry="15"
            fill={`url(#${petalFill})`}
            transform={`rotate(${index * 45})`}
          />
        ))}
        <circle r="11" fill={`url(#${centerFill})`} />
        <circle r="5.5" fill="#C45E1A" opacity="0.55" />
      </g>
    </svg>
  )
}

export function Flower({
  flower,
  className,
  showSparks = true,
  animateEntrance = true,
}: FlowerProps) {
  const reduceMotion = useReducedMotion()
  const { id, x, y, rotation, scale } = flower
  const sparks = sparkOffsets(rotation)
  const shouldAnimate = animateEntrance && !reduceMotion
  const classes = className ? `flower ${className}` : 'flower'

  return (
    <div
      className={classes}
      style={{
        left: x,
        top: y,
        ['--flower-scale' as string]: scale,
        ['--flower-rotate' as string]: `${rotation}deg`,
      }}
    >
      <motion.div
        className="flower-grow"
        initial={
          shouldAnimate
            ? { opacity: 0, scaleX: 0.45, scaleY: 0.12, y: 18 }
            : animateEntrance
              ? { opacity: 0 }
              : false
        }
        animate={{ opacity: 1, scaleX: 1, scaleY: 1, y: 0 }}
        transition={
          shouldAnimate
            ? { duration: 0.72, ease: [0.22, 1.1, 0.32, 1] }
            : { duration: animateEntrance ? 0.2 : 0 }
        }
      >
        <div className="flower-pose">
          <div className="flower-sway">
            <FlowerGraphic id={id} />
          </div>
        </div>
      </motion.div>

      {reduceMotion || !showSparks
        ? null
        : sparks.map((spark, index) => (
            <motion.span
              key={`${id}-spark-${index}`}
              className="flower-spark"
              initial={{ opacity: 0.85, x: 0, y: 0, scale: 0.35 }}
              animate={{ opacity: 0, x: spark.x, y: spark.y, scale: 1 }}
              transition={{ duration: 0.75, ease: 'easeOut', delay: 0.08 }}
            />
          ))}
    </div>
  )
}
