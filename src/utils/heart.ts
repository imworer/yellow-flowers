export type Point = {
  x: number
  y: number
}

/**
 * Classic heart parametric curve, normalized to fit width × height
 * and centered at (0, 0). Outline only — leave the center free for media.
 */
export function generateHeartPoints(
  count: number,
  width: number,
  height: number,
): Point[] {
  const raw: Point[] = []

  for (let index = 0; index < count; index += 1) {
    const t = (index / count) * Math.PI * 2
    const x = 16 * Math.sin(t) ** 3
    const y = -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    )
    raw.push({ x, y })
  }

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (const point of raw) {
    minX = Math.min(minX, point.x)
    maxX = Math.max(maxX, point.x)
    minY = Math.min(minY, point.y)
    maxY = Math.max(maxY, point.y)
  }

  const spanX = maxX - minX || 1
  const spanY = maxY - minY || 1
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  return raw.map((point) => ({
    x: ((point.x - centerX) / spanX) * width,
    y: ((point.y - centerY) / spanY) * height,
  }))
}
