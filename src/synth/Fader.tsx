import { useCallback, useRef } from 'react'
import styles from './Fader.module.css'

interface FaderProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  height?: number
  /** Accent the fill with the master colour rather than the soft colour. */
  accent?: boolean
}

export function Fader({ label, value, min, max, onChange, height = 120, accent = false }: FaderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)

  const norm = Math.min(1, Math.max(0, (value - min) / (max - min)))

  const setFromClientY = useCallback(
    (clientY: number) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const n = 1 - (clientY - rect.top) / rect.height
      onChange(min + Math.min(1, Math.max(0, n)) * (max - min))
    },
    [max, min, onChange],
  )

  const dragging = useRef(false)

  return (
    <div className={styles.wrap}>
      <div
        ref={trackRef}
        className={styles.track}
        style={{ height }}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(value * 100) / 100}
        tabIndex={0}
        onPointerDown={(e) => {
          e.preventDefault()
          ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
          dragging.current = true
          setFromClientY(e.clientY)
        }}
        onPointerMove={(e) => dragging.current && setFromClientY(e.clientY)}
        onPointerUp={(e) => {
          dragging.current = false
          try {
            ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
          } catch {
            /* already released */
          }
        }}
        onKeyDown={(e) => {
          const range = max - min
          if (e.key === 'ArrowUp') onChange(Math.min(max, value + range / 40))
          if (e.key === 'ArrowDown') onChange(Math.max(min, value - range / 40))
        }}
      >
        <div
          className={accent ? styles.fillAccent : styles.fill}
          style={{ height: `${norm * 100}%` }}
        />
        <div className={styles.thumb} style={{ bottom: `calc(${norm * 100}% - 6px)` }} />
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  )
}
