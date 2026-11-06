import { useEffect, useRef, useState } from 'react'
import sculpture from '../generated/platypus.json'

// Decode once; playback only swaps a text node.
const frames = sculpture.frames.map(frame => frame.replace(/~(\d+)~/g, (_, count: string) => ' '.repeat(Number(count))))

export function AsciiPlatypus() {
  const figure = useRef<HTMLElement>(null)
  const text = useRef<HTMLPreElement>(null)
  const frame = useRef(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let timer: ReturnType<typeof setInterval> | undefined
    const stop = () => { clearInterval(timer); timer = undefined }
    const sync = () => {
      stop()
      setReducedMotion(preference.matches)
      if (preference.matches) {
        frame.current = 0
        if (text.current) text.current.textContent = frames[0]
      }
      if (paused || preference.matches || !visible || document.hidden) return
      timer = setInterval(() => {
        frame.current = (frame.current + 1) % frames.length
        if (text.current) text.current.textContent = frames[frame.current]
      }, 1000 / sculpture.fps)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    }, { threshold: 0.1 })
    if (figure.current) observer.observe(figure.current)
    preference.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => {
      stop()
      observer.disconnect()
      preference.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [paused])

  return (
    <figure className="ascii-sculpture" ref={figure} aria-labelledby="sculpture-caption">
      <div className="ascii-stage" role="img" aria-label="A three-dimensional ASCII platypus with a broad duck bill, rounded body, four webbed feet, and a flat paddle tail. It gently turns and breathes.">
        <pre ref={text} aria-hidden="true">{frames[0]}</pre>
      </div>
      <figcaption id="sculpture-caption">
        <span>A platypus, because it’s a cool animal.</span>
        <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} disabled={reducedMotion}>
          {reducedMotion ? 'Still / reduced motion' : paused ? 'Play motion' : 'Pause motion'}
        </button>
      </figcaption>
    </figure>
  )
}
