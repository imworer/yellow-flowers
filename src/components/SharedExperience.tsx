import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getExperienceByShareCode,
  type Experience,
} from '../lib/experiences'
import { YellowFlowerExperience } from './YellowFlowerExperience'

type LoadState =
  | { status: 'loading' }
  | { status: 'not_found' }
  | { status: 'error' }
  | { status: 'ready'; experience: Experience }

export function SharedExperience() {
  const { shareCode } = useParams<{ shareCode: string }>()
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    if (!shareCode) {
      setState({ status: 'not_found' })
      return
    }

    setState({ status: 'loading' })

    getExperienceByShareCode(shareCode)
      .then((experience) => {
        if (cancelled) {
          return
        }

        if (!experience) {
          setState({ status: 'not_found' })
          return
        }

        setState({ status: 'ready', experience })
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: 'error' })
        }
      })

    return () => {
      cancelled = true
    }
  }, [shareCode])

  if (state.status === 'ready') {
    return (
      <YellowFlowerExperience finalImageUrl={state.experience.image_url} />
    )
  }

  return (
    <main className="shared-experience">
      <div className="shared-experience-card">
        {state.status === 'loading' ? (
          <p className="shared-experience-status" role="status">
            Preparando tu experiencia... 🌼
          </p>
        ) : null}

        {state.status === 'not_found' ? (
          <p className="shared-experience-status" role="alert">
            Esta experiencia no existe o el enlace ya no es válido.
          </p>
        ) : null}

        {state.status === 'error' ? (
          <p className="shared-experience-status" role="alert">
            Ha ocurrido un problema al cargar la experiencia.
          </p>
        ) : null}

        {state.status !== 'loading' ? (
          <Link className="shared-experience-link" to="/">
            Volver a crear una experiencia
          </Link>
        ) : null}
      </div>
    </main>
  )
}
