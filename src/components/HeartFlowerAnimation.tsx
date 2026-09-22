import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { HeartAnimationFlower } from '../types/flower'
import { generateHeartPoints } from '../utils/heart'
import { Flower } from './Flower'
import { FinalMedia } from './FinalMedia'

type Phase = 'exploding' | 'forming'

type ViewportSize = {
  width: number
  height: number
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function readViewport(): ViewportSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

function heartBounds(viewport: ViewportSize) {
  const isMobile = viewport.width < 768

  return {
    width: viewport.width * (isMobile ? 0.88 : 0.74),
    height: viewport.height * (isMobile ? 0.8 : 0.74),
  }
}

function createAnimationFlowers(
  count: number,
  viewport: ViewportSize,
): HeartAnimationFlower[] {
  const bounds = heartBounds(viewport)
  const heartPoints = generateHeartPoints(count, bounds.width, bounds.height)

  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 + randomBetween(-0.28, 0.28)
    const radiusX = randomBetween(0.34, 0.56) * viewport.width
    const radiusY = randomBetween(0.34, 0.56) * viewport.height
    const heart = heartPoints[index] ?? { x: 0, y: 0 }

    return {
      id: crypto.randomUUID(),
      scale: randomBetween(0.62, 0.92),
      rotation: randomBetween(-18, 18),
      burstRotation: randomBetween(-36, 36),
      heartRotation: randomBetween(-22, 22),
      startX: randomBetween(-18, 18),
      startY: randomBetween(-18, 18),
      burstX: Math.cos(angle) * radiusX,
      burstY: Math.sin(angle) * radiusY,
      heartX: heart.x + randomBetween(-4, 4),
      heartY: heart.y + randomBetween(-4, 4),
      appearDelay: randomBetween(0, 0.28),
      burstDuration: randomBetween(0.85, 1.25),
      formDelay: randomBetween(0, 0.35),
      formDuration: randomBetween(0.95, 1.45),
    }
  })
}

function AnimatedHeartFlower({
  flower,
  phase,
  reduceMotion,
}: {
  flower: HeartAnimationFlower
  phase: Phase
  reduceMotion: boolean | null
}) {
  const target =
    phase === 'exploding'
      ? {
          x: flower.burstX,
          y: flower.burstY,
          rotate: flower.burstRotation,
          scale: flower.scale,
          opacity: 1,
        }
      : {
          x: flower.heartX,
          y: flower.heartY,
          rotate: flower.heartRotation,
          scale: flower.scale,
          opacity: 1,
        }

  return (
    <motion.div
      className="heart-anim-item"
      initial={
        reduceMotion
          ? {
              x: flower.heartX,
              y: flower.heartY,
              opacity: 0,
              scale: flower.scale,
              rotate: flower.heartRotation,
            }
          : {
              x: flower.startX,
              y: flower.startY,
              opacity: 0,
              scale: flower.scale * 0.45,
              rotate: flower.rotation,
            }
      }
      animate={
        reduceMotion
          ? {
              x: flower.heartX,
              y: flower.heartY,
              opacity: 1,
              scale: flower.scale,
              rotate: flower.heartRotation,
            }
          : target
      }
      transition={
        reduceMotion
          ? { duration: 0.45, delay: flower.appearDelay * 0.2 }
          : phase === 'exploding'
            ? {
                duration: flower.burstDuration,
                delay: flower.appearDelay,
                ease: [0.22, 0.85, 0.28, 1],
              }
            : {
                duration: flower.formDuration,
                delay: flower.formDelay,
                ease: [0.33, 0.9, 0.28, 1],
              }
      }
    >
      <Flower
        flower={{
          id: flower.id,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
        }}
        className="flower--embedded"
        showSparks={false}
        animateEntrance={false}
      />
    </motion.div>
  )
}

export function HeartFlowerAnimation({
  finalImageUrl,
}: {
  finalImageUrl?: string
}) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('exploding')
  const [mediaActive, setMediaActive] = useState(false)

  const flowers = useMemo(() => {
    const count = Math.round(randomBetween(34, 42))
    return createAnimationFlowers(count, readViewport())
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setPhase('forming')
      const mediaTimer = window.setTimeout(() => setMediaActive(true), 700)
      return () => window.clearTimeout(mediaTimer)
    }

    setPhase('exploding')

    const formTimer = window.setTimeout(() => setPhase('forming'), 1100)
    // Reveal photo after the heart has mostly settled.
    const mediaTimer = window.setTimeout(() => setMediaActive(true), 2600)

    return () => {
      window.clearTimeout(formTimer)
      window.clearTimeout(mediaTimer)
    }
  }, [reduceMotion])

  return (
    <div className="heart-anim" aria-hidden="true">
      <div className="heart-anim-flowers">
        {flowers.map((flower) => (
          <AnimatedHeartFlower
            key={flower.id}
            flower={flower}
            phase={phase}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      <FinalMedia active={mediaActive} finalImageUrl={finalImageUrl} />
    </div>
  )
}
