import { useEffect, useId, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  createExperienceFromImage,
  type Experience,
} from '../lib/experiences'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }

  return 'No se pudo crear la experiencia. Inténtalo de nuevo.'
}

export function CreateExperience() {
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const copiedTimeoutRef = useRef<number | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [experience, setExperience] = useState<Experience | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [previewUrl])

  const shareUrl = experience
    ? `${window.location.origin}/g/${experience.share_code}`
    : null

  const resetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setFile(null)
    setPreviewUrl(null)
    setLoading(false)
    setError(null)
    setExperience(null)
    setCopied(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setExperience(null)
    setCopied(false)
    setError(null)
    setFile(nextFile)
    setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!file || loading) {
      return
    }

    setLoading(true)
    setError(null)
    setCopied(false)

    try {
      const created = await createExperienceFromImage(file)
      setExperience(created)
    } catch (submitError) {
      setError(getErrorMessage(submitError))
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!shareUrl) {
      return
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)

      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current)
      }

      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false)
      }, 2200)
    } catch {
      setError('No se pudo copiar el enlace. Cópialo manualmente.')
    }
  }

  return (
    <main className="create-experience">
      <div className="create-experience-card">
        <p className="create-experience-mark" aria-hidden="true">
          ✿
        </p>
        <h1 className="create-experience-title">Crea tu experiencia 🌼</h1>
        <p className="create-experience-description">
          Sube una foto y genera un enlace para compartirla.
        </p>

        {experience && shareUrl ? (
          <section
            className="create-experience-success"
            aria-live="polite"
            aria-atomic="true"
          >
            <h2 className="create-experience-success-title">
              ¡Tu experiencia está lista! 🌼
            </h2>

            {previewUrl ? (
              <img
                className="create-experience-preview"
                src={previewUrl}
                alt="Vista previa de la foto subida"
              />
            ) : null}

            <p className="create-experience-share-label">Tu enlace</p>
            <p className="create-experience-share-url">{shareUrl}</p>

            <div className="create-experience-actions">
              <button
                type="button"
                className="create-experience-button"
                onClick={handleCopy}
              >
                Copiar enlace
              </button>
              <button
                type="button"
                className="create-experience-button create-experience-button--secondary"
                onClick={resetForm}
              >
                Crear otra
              </button>
            </div>

            {copied ? (
              <p className="create-experience-copied" role="status">
                ¡Enlace copiado!
              </p>
            ) : null}
          </section>
        ) : (
          <form className="create-experience-form" onSubmit={handleSubmit}>
            <div className="create-experience-field">
              <label className="create-experience-label" htmlFor={fileInputId}>
                Selecciona una foto
              </label>
              <label
                className={
                  file
                    ? 'create-experience-upload create-experience-upload--selected'
                    : 'create-experience-upload create-experience-upload--idle'
                }
                htmlFor={fileInputId}
              >
                <input
                  ref={fileInputRef}
                  id={fileInputId}
                  className="create-experience-file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <span className="create-experience-upload-copy" aria-hidden="true">
                  <span className="create-experience-upload-icon">✿</span>
                  <span className="create-experience-upload-title">
                    {file ? 'Foto seleccionada' : 'Subir archivo'}
                  </span>
                  <span className="create-experience-upload-subtitle">
                    {file ? file.name : 'Toca para elegir una imagen'}
                  </span>
                </span>
              </label>
              <p className="create-experience-hint">
                JPG, PNG, WEBP o GIF. Máximo 6 MB.
              </p>
            </div>

            {previewUrl ? (
              <img
                className="create-experience-preview"
                src={previewUrl}
                alt="Vista previa de la imagen seleccionada"
              />
            ) : null}

            {error ? (
              <p className="create-experience-error" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="create-experience-button"
              disabled={!file || loading}
              aria-busy={loading}
            >
              {loading ? 'Creando experiencia…' : 'Crear experiencia'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
