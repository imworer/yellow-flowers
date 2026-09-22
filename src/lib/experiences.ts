import { supabase } from './supabase'

export type Experience = {
  id: string
  share_code: string
  image_url: string
  image_source: 'upload' | 'url'
  created_at: string
}

const EXPERIENCE_IMAGES_BUCKET = 'experience-images'
const MAX_IMAGE_BYTES = 6 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

function getFileExtension(file: File): string {
  const nameExtension = file.name.includes('.')
    ? file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase()
    : ''

  if (nameExtension) {
    return nameExtension
  }

  switch (file.type) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    case 'image/gif':
      return 'gif'
    default:
      return 'bin'
  }
}

function validateExperienceImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      'Invalid image type. Allowed formats: JPEG, PNG, WebP, and GIF.',
    )
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image exceeds the maximum size of 6 MB.')
  }
}

export async function fetchExperiencesPreview() {
  const { data, error } = await supabase
    .from('experiences')
    .select('id, share_code')
    .limit(1)

  return { data, error }
}

export async function uploadExperienceImage(file: File): Promise<string> {
  validateExperienceImage(file)

  const extension = getFileExtension(file)
  const objectPath = `${crypto.randomUUID()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from(EXPERIENCE_IMAGES_BUCKET)
    .upload(objectPath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage
    .from(EXPERIENCE_IMAGES_BUCKET)
    .getPublicUrl(objectPath)

  if (!data.publicUrl) {
    throw new Error('Failed to obtain the public URL for the uploaded image.')
  }

  return data.publicUrl
}

export async function createExperienceFromImage(
  file: File,
): Promise<Experience> {
  const imageUrl = await uploadExperienceImage(file)

  const { data, error } = await supabase
    .from('experiences')
    .insert({
      image_url: imageUrl,
      image_source: 'upload',
    })
    .select('id, share_code, image_url, image_source, created_at')
    .single()

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error('Experience was not created.')
  }

  return data as Experience
}

export async function getExperienceByShareCode(
  shareCode: string,
): Promise<Experience | null> {
  const trimmedCode = shareCode.trim()

  if (!trimmedCode) {
    return null
  }

  const { data, error } = await supabase.rpc('get_experience_by_code', {
    requested_share_code: trimmedCode,
  })

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  const experience = Array.isArray(data) ? (data[0] ?? null) : data

  return (experience as Experience | null) ?? null
}
