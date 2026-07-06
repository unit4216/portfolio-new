import { useCallback, useRef } from 'react'

interface KnobProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  size?: number
  /** Optional readout shown under the label (e.g. formatted value). */
  readout?: string
}

const MIN_ANGLE = -135
const MAX_ANGLE = 135

export function Knob({ label, value, min, max, onChange, size = 60, readout }: KnobProps) {
  const dragging = useRef<{ startY: number; startValue: number } | null>(null)

  const norm = (value - min) / (max - min)
  const angle = MIN_ANGLE + norm * (MAX_ANGLE - MIN_ANGLE)

  const applyDelta = useCallback(
    (clientY: number) => {
      const state = dragging.current
      if (!state) return
      const dy = state.startY - clientY
      const range = max - min
      const next = state.startValue + (dy / 200) * range
      onChange(Math.min(max, Math.max(min, next)))
    },
    [max, min, onChange],
  )

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    dragging.current = { startY: e.clientY, startValue: value }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) applyDelta(e.clientY)
  }

  const endDrag = (e: React.PointerEvent) => {
    dragging.current = null
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* pointer may already be released */
    }
  }

  const onWheel = (e: React.WheelEvent) => {
    const range = max - min
    const step = range / 60
    const next = value - Math.sign(e.deltaY) * step
    onChange(Math.min(max, Math.max(min, next)))
  }

  return (
    <div className="flex flex-col items-center gap-[10px]">
      <div
        className="relative flex-shrink-0 cursor-ns-resize touch-none rounded-full border border-[var(--syn-knob-border)] bg-[radial-gradient(circle_at_38%_30%,var(--syn-knob-hi),var(--syn-knob-lo))] shadow-[var(--syn-knob-shadow)] transition-shadow duration-150 focus-visible:shadow-[var(--syn-knob-shadow),0_0_0_2px_var(--color-accent)] focus-visible:outline-none"
        style={{ width: size, height: size }}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(value * 100) / 100}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        onKeyDown={(e) => {
          const range = max - min
          if (e.key === 'ArrowUp' || e.key === 'ArrowRight') onChange(Math.min(max, value + range / 40))
          if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') onChange(Math.max(min, value - range / 40))
        }}
      >
        <div className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
          <div className="absolute left-1/2 top-[6px] h-[34%] w-[2px] -translate-x-1/2 rounded-[2px] bg-accent" />
        </div>
      </div>
      <div className="font-mono text-[10px] tracking-[0.1em] text-text-muted">{label}</div>
      {readout && <div className="mt-[-4px] font-mono text-[10px] tracking-[0.04em] text-accent">{readout}</div>}
    </div>
  )
}
