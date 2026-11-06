import { useEffect, useRef } from 'react'
import { sampleTrail } from '../lib/rippleTrail'
import type { Point } from '../lib/rippleTrail'

const cellWidth = 12
const cellHeight = 20
type Ripple = { x: number; y: number; born: number; duration: number; click: boolean }
const crests = ['.', ':', '~', '+', '*', 'o']
const troughs = ['.', ',', '-', '=', '~', '+']

export function AsciiMargins() {
  const left = useRef<HTMLPreElement>(null)
  const right = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const wide = matchMedia('(min-width: 961px)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let fields: { element: HTMLPreElement; rect: DOMRect; columns: number; rows: number; resting: string }[] = []
    let animation = 0
    let lastDraw = 0
    let ripples: Ripple[] = []
    let lastPointer: Point | null = null
    let trailRemainder = 0

    const rest = () => {
      cancelAnimationFrame(animation)
      animation = 0
      ripples = []
      lastPointer = null
      trailRemainder = 0
      for (const field of fields) field.element.textContent = field.resting
    }

    const measure = () => {
      rest()
      fields = []
      if (!wide.matches) return
      for (const element of [left.current, right.current]) {
        if (!element) continue
        const rect = element.getBoundingClientRect()
        const columns = Math.floor(rect.width / cellWidth)
        const rows = Math.ceil(rect.height / cellHeight)
        const resting = Array.from({ length: rows }, () => '.'.repeat(columns)).join('\n')
        fields.push({ element, rect, columns, rows, resting })
        element.textContent = resting
      }
    }

    const draw = (now: number) => {
      animation = 0
      ripples = ripples.filter(ripple => now - ripple.born < ripple.duration)
      if (!ripples.length || document.hidden || reduced.matches) { rest(); return }
      // Cap text updates at 30 fps. There is no rendering loop while idle.
      if (now - lastDraw >= 1000 / 30) {
        lastDraw = now
        const waves = ripples.map(ripple => {
          const age = now - ripple.born
          return {
            ...ripple,
            radius: age * (ripple.click ? 0.12 : 0.1),
            width: ripple.click ? 55 : 30,
            amplitude: (ripple.click ? 1.25 : 0.65) * (0.55 + 0.45 * Math.min(1, age / 60)) * (1 - age / ripple.duration),
          }
        })
        for (const field of fields) {
          const lines: string[] = []
          for (let row = 0; row < field.rows; row++) {
            let line = ''
            for (let column = 0; column < field.columns; column++) {
              const x = field.rect.left + column * cellWidth + cellWidth / 2
              const y = field.rect.top + row * cellHeight + cellHeight / 2
              let height = 0
              for (const wave of waves) {
                // A traveling wave packet leaves its origin behind. Signed
                // heights let overlapping rings reinforce or cancel each other.
                const offset = Math.hypot(x - wave.x, y - wave.y) - wave.radius
                if (Math.abs(offset) > wave.width * 2) continue
                const envelope = Math.exp(-((offset / wave.width) ** 2))
                height += Math.cos(offset / 9) * envelope * wave.amplitude
              }
              const density = Math.min(5, Math.floor(Math.abs(height) * 7))
              line += (height >= 0 ? crests : troughs)[density]
            }
            lines.push(line)
          }
          field.element.textContent = lines.join('\n')
        }
      }
      animation = requestAnimationFrame(draw)
    }

    const inMargin = (x: number, y: number) => fields.some(({ rect }) =>
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom)

    const emit = (x: number, y: number, click: boolean) => {
      if (reduced.matches || !wide.matches || document.hidden || !inMargin(x, y)) return
      // Keep interaction costs bounded, including rapid clicks. Preserve the
      // longer click waves when replacing old pointer-movement ripples.
      const limit = click ? 4 : 24
      if (ripples.filter(ripple => ripple.click === click).length >= limit) {
        ripples.splice(ripples.findIndex(ripple => ripple.click === click), 1)
      }
      ripples.push({ x, y, born: performance.now(), duration: click ? 3200 : 1500, click })
      if (!animation) animation = requestAnimationFrame(draw)
    }

    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || reduced.matches || !wide.matches || document.hidden) return
      const coalesced = event.getCoalescedEvents?.() ?? []
      const samples = coalesced.length ? [...coalesced, event] : [event]
      for (const sample of samples) {
        const point = { x: sample.clientX, y: sample.clientY }
        if (lastPointer) {
          const trail = sampleTrail(lastPointer, point, trailRemainder)
          for (const position of trail.points) emit(position.x, position.y, false)
          trailRemainder = trail.remainder
        } else {
          emit(point.x, point.y, false)
        }
        // Track the whole path, including the center; only emit in the margins.
        lastPointer = point
      }
    }

    const leave = () => { lastPointer = null; trailRemainder = 0 }

    const click = (event: MouseEvent) => {
      if (event.button === 0) emit(event.clientX, event.clientY, true)
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('click', click, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('blur', rest)
    document.addEventListener('visibilitychange', rest)
    wide.addEventListener('change', measure)
    reduced.addEventListener('change', rest)
    return () => {
      rest()
      window.removeEventListener('resize', measure)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('click', click)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', rest)
      document.removeEventListener('visibilitychange', rest)
      wide.removeEventListener('change', measure)
      reduced.removeEventListener('change', rest)
    }
  }, [])

  return <div className="ascii-margins" aria-hidden="true">
    <pre className="ascii-margin ascii-margin-left" ref={left} />
    <pre className="ascii-margin ascii-margin-right" ref={right} />
  </div>
}
