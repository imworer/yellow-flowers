import { useCallback, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { FlowerData } from '../types/flower'
import { Flower } from './Flower'
import { HeartFlowerAnimation } from './HeartFlowerAnimation'

type FlowerFieldProps = {
  enabled: boolean
  finalImageUrl?: string
}

const FINALE_CLICK = 5

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function createFlower(x: number, y: number): FlowerData {
  return {
    id: crypto.randomUUID(),
    x,
    y,
    rotation: randomBetween(-16, 16),
    scale: randomBetween(0.78, 1.12),
  }
}

export function FlowerField({ enabled, finalImageUrl }: FlowerFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const clickCountRef = useRef(0)
  const hasTriggeredFinaleRef = useRef(false)
  const [flowers, setFlowers] = useState<FlowerData[]>([])
  const [clickCount, setClickCount] = useState(0)
  const [hasTriggeredFinale, setHasTriggeredFinale] = useState(false)

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!enabled || event.button !== 0) {
        return
      }

      const field = fieldRef.current
      if (!field) {
        return
      }

      event.preventDefault()

      const rect = field.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      clickCountRef.current += 1
      const nextCount = clickCountRef.current

      setFlowers((current) => [...current, createFlower(x, y)])
      setClickCount(nextCount)

      if (nextCount === FINALE_CLICK && !hasTriggeredFinaleRef.current) {
        hasTriggeredFinaleRef.current = true
        setHasTriggeredFinale(true)
      }
    },
    [enabled],
  )

  const showCounter =
    enabled && clickCount > 0 && clickCount < FINALE_CLICK && !hasTriggeredFinale

  return (
    <div
      ref={fieldRef}
      className="flower-field"
      onPointerDown={handlePointerDown}
      onContextMenu={(event) => event.preventDefault()}
      aria-label="Campo de flores amarillas. Toca la pantalla para recibir una flor."
    >
      <div className="flower-field-layer">
        {flowers.map((flower) => (
          <Flower key={flower.id} flower={flower} />
        ))}
      </div>

      {showCounter ? (
        <p className="click-progress" aria-live="polite">
          {clickCount} / {FINALE_CLICK}
        </p>
      ) : null}

      {hasTriggeredFinale ? (
        <HeartFlowerAnimation finalImageUrl={finalImageUrl} />
      ) : null}
    </div>
  )
}
