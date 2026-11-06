export type Point = { x: number; y: number }

// Sample distance rather than event frequency, carrying short movements forward.
// Fast sweeps get intermediate points even when the browser skips pointer events.
export function sampleTrail(from: Point, to: Point, remainder: number) {
  const spacing = 36
  const distance = Math.hypot(to.x - from.x, to.y - from.y)
  const points: Point[] = []
  if (distance === 0) return { points, remainder }
  for (let offset = spacing - remainder; offset <= distance; offset += spacing) {
    const fraction = offset / distance
    points.push({ x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction })
  }
  return { points, remainder: (remainder + distance) % spacing }
}
