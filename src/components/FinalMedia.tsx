import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type FinalMediaProps = {
  active: boolean
}

type MediaStage = 'idle' | 'video' | 'photo'

export function FinalMedia({ active }: FinalMediaProps) {
  const reduceMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stage, setStage] = useState<MediaStage>('idle')

  useEffect(() => {
    if (!active || stage !== 'idle') {
      return
    }
    setStage('video')
  }, [active, stage])

  useEffect(() => {
    if (stage !== 'video') {
      return
    }

    const video = videoRef.current
    if (!video) {
      return
    }

    video.muted = true
    video.playsInline = true
    video.currentTime = 0

    const playAttempt = video.play()
    if (playAttempt !== undefined) {
      playAttempt.catch(() => {
        // Autoplay can still fail on some mobile browsers even when muted.
      })
    }
  }, [stage])

  const handleEnded = () => {
    setStage('photo')
  }

  return (
    <div className="finale-media" aria-live="polite">
      <AnimatePresence mode="wait">
        {stage === 'video' ? (
          <motion.div
            key="video"
            className="finale-media-frame finale-media-video"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.85 }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96 }
            }
            transition={{
              duration: reduceMotion ? 0.25 : 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <video
              ref={videoRef}
              className="finale-media-element"
              src="/floresamarillas.mp4"
              autoPlay
              muted
              playsInline
              controls={false}
              loop={false}
              preload="auto"
              onEnded={handleEnded}
              aria-label="Video especial"
            />
          </motion.div>
        ) : null}

        {stage === 'photo' ? (
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
              duration: reduceMotion ? 0.3 : 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <img
              className="finale-media-element"
              src="/us.jpg"
              alt="Nosotros"
              draggable={false}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
