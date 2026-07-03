import { useEffect, useRef } from 'react'
import type { SynthEngine, Wave } from './engine'
import styles from './SynthPage.module.css'

interface Props {
  engine: SynthEngine
  wave: Wave
}

/** Idealised single-cycle waveform, used when no note is sounding. */
function idealSample(wave: Wave, phase: number): number {
  const t = phase * 2 * Math.PI
  switch (wave) {
    case 'Sine':
      return Math.sin(t)
    case 'Square':
      return Math.sin(t) >= 0 ? 1 : -1
    case 'Triangle':
      return (2 / Math.PI) * Math.asin(Math.sin(t))
    default:
      return 1 - 2 * (phase % 1) // Saw
  }
}

export function Oscilloscope({ engine, wave }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const waveRef = useRef(wave)
  waveRef.current = wave

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const buffer = new Uint8Array(2048)

    const draw = () => {
      raf = requestAnimationFrame(draw)
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const w = Math.max(1, Math.floor(rect.width * dpr))
      const h = Math.max(1, Math.floor(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      ctx.clearRect(0, 0, w, h)

      const accent =
        getComputedStyle(canvas).getPropertyValue('--color-accent').trim() || '#b8501f'
      ctx.lineWidth = 2 * dpr
      ctx.strokeStyle = accent
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.beginPath()

      const analyser = engine.getAnalyser()
      const mid = h / 2
      if (analyser && engine.isActive()) {
        analyser.getByteTimeDomainData(buffer)
        const n = buffer.length
        for (let i = 0; i < n; i++) {
          const x = (i / (n - 1)) * w
          const v = (buffer[i] - 128) / 128
          const yy = mid - v * (h * 0.42)
          if (i === 0) ctx.moveTo(x, yy)
          else ctx.lineTo(x, yy)
        }
      } else {
        const periods = 4
        const N = 240
        for (let i = 0; i <= N; i++) {
          const x = (i / N) * w
          const v = idealSample(waveRef.current, (i / N) * periods)
          const yy = mid - v * (h * 0.42)
          if (i === 0) ctx.moveTo(x, yy)
          else ctx.lineTo(x, yy)
        }
      }
      ctx.stroke()
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [engine])

  return <canvas ref={canvasRef} className={styles.scopeCanvas} aria-hidden="true" />
}
