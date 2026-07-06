import { useCallback, useRef } from 'react'

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
    <div className="flex flex-col items-center gap-[10px]">
      <div
        ref={trackRef}
        className="relative w-[8px] cursor-ns-resize touch-none rounded-[6px] bg-[var(--syn-slot)] focus-visible:shadow-[0_0_0_2px_var(--color-accent)] focus-visible:outline-none"
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
          className={`absolute inset-x-0 bottom-0 rounded-[6px] ${accent ? 'bg-accent' : 'bg-accent-soft'}`}
          style={{ height: `${norm * 100}%` }}
        />
        <div
          className="pointer-events-none absolute left-1/2 h-[13px] w-[26px] -translate-x-1/2 rounded-[3px] border border-[var(--syn-knob-border)] bg-[image:var(--syn-thumb)] shadow-[var(--syn-thumb-shadow)]"
          style={{ bottom: `calc(${norm * 100}% - 6px)` }}
        />
      </div>
      <div className="font-mono text-[10px] tracking-[0.08em] text-text-muted">{label}</div>
    </div>
  )
}
