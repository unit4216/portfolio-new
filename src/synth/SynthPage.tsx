import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '../theme/ThemeContext'
import { Link } from '../router'
import { DEFAULT_PARAMS, midiToFreq, SynthEngine, type SynthParams, type Wave } from './engine'
import { Knob } from './Knob'
import { Fader } from './Fader'
import { Oscilloscope } from './Oscilloscope'

const WAVES: Wave[] = ['Sine', 'Saw', 'Square', 'Triangle']
const WAVE_SHORT: Record<Wave, string> = { Sine: 'SINE', Saw: 'SAW', Square: 'SQUARE', Triangle: 'TRI' }
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const BASE_MIDI = 48 // C3
const WHITE_OFFSETS = [0, 2, 4, 5, 7, 9, 11]
const BLACK_OFFSETS = [1, 3, 6, 8, 10]

// QWERTY → MIDI, two octaves from C3.
const KEY_TO_MIDI: Record<string, number> = {
  a: 48, w: 49, s: 50, e: 51, d: 52, f: 53, t: 54, g: 55, y: 56, h: 57, u: 58, j: 59,
  k: 60, o: 61, l: 62, p: 63, ';': 64, "'": 65,
}
const MIDI_TO_KEY: Record<number, string> = Object.fromEntries(
  Object.entries(KEY_TO_MIDI).map(([k, m]) => [m, k.toUpperCase()]),
)

// Shared utility-class recipes.
const chip =
  'cursor-pointer rounded-full border border-tag-border bg-transparent px-3 py-[6px] font-mono text-[11px] tracking-[0.06em] text-text-muted transition-colors duration-200 hover:border-accent hover:text-text'
const scopeGrid =
  'pointer-events-none absolute inset-0 bg-[linear-gradient(var(--syn-grid)_1px,transparent_1px),linear-gradient(90deg,var(--syn-grid)_1px,transparent_1px)] bg-[length:32px_24px]'
const scopeBg =
  'bg-[repeating-linear-gradient(135deg,var(--syn-scope-bg1)_0_11px,var(--syn-scope-bg2)_11px_22px)]'
const shapeCommon =
  'w-[74px] cursor-pointer border px-0 py-[5px] font-mono text-[10px] tracking-[0.08em] transition-colors duration-150 first:rounded-t-[4px]'
const shape = `${shapeCommon} border-tag-border bg-transparent text-text-muted hover:text-text`
const shapeActive = `${shapeCommon} border-accent bg-accent text-white`
const whiteKeyBase =
  'relative flex-1 cursor-pointer touch-none rounded-b-[5px] border border-[var(--syn-white-border)] p-0 shadow-[var(--syn-white-shadow)] transition-[background] duration-[50ms]'
const whiteKey = `${whiteKeyBase} bg-[image:var(--syn-white)]`
const whiteKeyActive = `${whiteKeyBase} bg-[linear-gradient(rgba(var(--color-accent-rgb),0.32),rgba(var(--color-accent-rgb),0.14))]`
const blackKeyBase =
  'absolute top-0 z-[2] flex h-[62%] w-[38px] cursor-pointer touch-none items-end justify-center rounded-b-[4px] border-none p-0 pb-[8px] shadow-[0_4px_6px_rgba(40,32,20,0.4)]'
const blackKey = `${blackKeyBase} bg-[image:var(--syn-black)]`
const blackKeyActive = `${blackKeyBase} bg-[linear-gradient(rgba(var(--color-accent-rgb),0.85),rgba(var(--color-accent-rgb),0.55))]`

interface WhiteKey {
  midi: number
  whiteIndex: number
}
interface BlackKey {
  midi: number
  leftWhites: number
}

function buildKeyboard() {
  const whites: WhiteKey[] = []
  const blacks: BlackKey[] = []
  for (let o = 0; o < 2; o++) {
    const base = BASE_MIDI + o * 12
    WHITE_OFFSETS.forEach((off, k) => whites.push({ midi: base + off, whiteIndex: o * 7 + k }))
    BLACK_OFFSETS.forEach((bo) => {
      const leftWhites = o * 7 + WHITE_OFFSETS.filter((w) => w < bo).length
      blacks.push({ midi: base + bo, leftWhites })
    })
  }
  return { whites, blacks, totalWhites: 14 }
}

function noteLabel(midi: number): string {
  return `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`
}

export function SynthPage() {
  const { theme, toggleTheme } = useTheme()
  const engineRef = useRef<SynthEngine | null>(null)
  if (!engineRef.current) engineRef.current = new SynthEngine()
  const engine = engineRef.current

  const [params, setParams] = useState<SynthParams>({ ...DEFAULT_PARAMS })
  const [active, setActive] = useState<Set<number>>(() => new Set())
  const [lastMidi, setLastMidi] = useState<number | null>(null)
  const [showQwerty, setShowQwerty] = useState(true)

  const keyboard = useMemo(buildKeyboard, [])

  const setParam = useCallback(
    <K extends keyof SynthParams>(key: K, value: SynthParams[K]) => {
      setParams((prev) => {
        const next = { ...prev, [key]: value }
        engine.setParams({ [key]: value } as Partial<SynthParams>)
        return next
      })
    },
    [engine],
  )

  const noteOn = useCallback(
    (midi: number) => {
      engine.noteOn(midi)
      setLastMidi(midi)
      setActive((prev) => {
        if (prev.has(midi)) return prev
        const next = new Set(prev)
        next.add(midi)
        return next
      })
    },
    [engine],
  )

  const noteOff = useCallback(
    (midi: number) => {
      engine.noteOff(midi)
      setActive((prev) => {
        if (!prev.has(midi)) return prev
        const next = new Set(prev)
        next.delete(midi)
        return next
      })
    },
    [engine],
  )

  // QWERTY control
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      const midi = KEY_TO_MIDI[e.key.toLowerCase()]
      if (midi === undefined) return
      e.preventDefault()
      noteOn(midi)
    }
    const up = (e: KeyboardEvent) => {
      const midi = KEY_TO_MIDI[e.key.toLowerCase()]
      if (midi === undefined) return
      noteOff(midi)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [noteOn, noteOff])

  // Silence everything on unmount.
  useEffect(() => () => engine.allNotesOff(), [engine])

  const freq = lastMidi === null ? 440 : midiToFreq(lastMidi + params.tune)
  const freqNote = lastMidi === null ? 'A4' : noteLabel(lastMidi)

  const adsrPoints = useMemo(() => {
    const bot = 72
    const top = 6
    const usable = 210
    const sum = params.attack + params.decay + params.release || 1
    const wa = (params.attack / sum) * usable
    const wd = (params.decay / sum) * usable
    const wr = (params.release / sum) * usable
    const hold = 60
    const xA = 2 + wa
    const xD = xA + wd
    const xH = xD + hold
    const xR = xH + wr
    const sy = bot - params.sustain * (bot - top)
    return `2,${bot} ${xA.toFixed(1)},${top} ${xD.toFixed(1)},${sy.toFixed(1)} ${xH.toFixed(1)},${sy.toFixed(1)} ${xR.toFixed(1)},${bot}`
  }, [params.attack, params.decay, params.release, params.sustain])

  const keyLabel = (midi: number) => (showQwerty ? MIDI_TO_KEY[midi] : undefined)

  return (
    <div
      className="min-h-screen bg-bg px-[clamp(16px,4vw,60px)] pt-[clamp(20px,4vw,48px)] pb-24 text-text"
      data-theme={theme}
    >
      <header className="mx-auto mb-7 flex max-w-[1080px] items-center justify-between gap-4 font-mono text-[12px] tracking-[0.04em] text-text-muted">
        <Link to="/" className="text-text no-underline transition-colors duration-200 hover:text-accent">
          ← PPC
        </Link>
        <div className="flex flex-1 justify-center gap-[10px]">
          <span>WEB SYNTHESIZER</span>
          <span className="text-tag-border">·</span>
          <span>WARM ANALOG MONO</span>
        </div>
        <div className="flex gap-[10px]">
          <button type="button" className={chip} onClick={() => setShowQwerty((v) => !v)} aria-pressed={showQwerty}>
            KEYS {showQwerty ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            className={chip}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? 'DARK' : 'LIGHT'}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1080px] overflow-hidden border border-border bg-bg shadow-[var(--syn-panel-shadow)]">
        {/* top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-[clamp(20px,4vw,56px)] py-6">
          <div className="flex items-baseline gap-[14px]">
            <span className="inline-flex items-center gap-[9px] font-mono text-[13px] tracking-[0.14em] text-text">
              <span className="h-[7px] w-[7px] animate-led rounded-full bg-accent" />
              MONOLITH
            </span>
            <span className="font-serif text-[16px] italic text-text-muted">analog voice</span>
          </div>
          <div className="flex gap-[20px] font-mono text-[11px] tracking-[0.08em] text-text-muted">
            <span>INIT · PORTAMENTO</span>
            <span className="text-tag-border">|</span>
            <span>MONO</span>
            <span className="text-tag-border">|</span>
            <span>MIDI CH 01</span>
          </div>
        </div>

        {/* oscilloscope */}
        <div className="grid grid-cols-1 items-stretch border-b border-border min-[900px]:grid-cols-[150px_1fr_190px]">
          <div className="flex flex-col justify-center gap-[6px] pl-[clamp(20px,4vw,56px)] pr-[clamp(20px,4vw,56px)] pt-5 pb-0 min-[900px]:pr-0 min-[900px]:pt-6 min-[900px]:pb-6">
            <div className="font-mono text-[11px] tracking-[0.1em] text-accent">OSCILLOSCOPE</div>
            <div className="font-serif text-[15px] text-text-muted">Waveform monitor</div>
          </div>
          <div className={`relative mx-6 my-5 min-h-[120px] overflow-hidden border border-border ${scopeBg}`}>
            <div className={scopeGrid} />
            <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--syn-grid)]" />
            <Oscilloscope engine={engine} wave={params.wave} />
          </div>
          <div className="flex flex-col items-end justify-start gap-[34px] pl-[clamp(20px,4vw,56px)] pr-[clamp(20px,4vw,56px)] pt-0 pb-5 font-mono text-[11px] text-text-muted min-[900px]:flex-col min-[900px]:justify-center min-[900px]:gap-[14px] min-[900px]:pt-6 min-[900px]:pb-6 max-[900px]:flex-row">
            <div className="text-right">
              <div className="font-serif text-[26px] leading-none text-text">
                {Math.round(freq)}
                <span className="text-accent">Hz</span>
              </div>
              <div className="mt-[4px] tracking-[0.08em]">FREQ · {freqNote}</div>
            </div>
            <div className="text-right">
              <div className="font-serif text-[21px] leading-none text-text whitespace-nowrap">{WAVE_SHORT[params.wave]}</div>
              <div className="mt-[4px] tracking-[0.08em]">WAVE</div>
            </div>
          </div>
        </div>

        {/* module row A */}
        <div className="flex flex-wrap items-stretch border-b border-border">
          <Module num="01" title="OSCILLATOR" grow={1.15}>
            <div className="flex items-start justify-center gap-[22px]">
              <div className="flex flex-col items-center gap-[6px]">
                {WAVES.map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={w === params.wave ? shapeActive : shape}
                    onClick={() => setParam('wave', w)}
                  >
                    {WAVE_SHORT[w]}
                  </button>
                ))}
                <div className="mt-[4px] font-mono text-[10px] tracking-[0.1em] text-text-muted">SHAPE</div>
              </div>
              <Knob
                label="TUNE"
                value={params.tune}
                min={-12}
                max={12}
                onChange={(v) => setParam('tune', Math.round(v))}
                readout={`${params.tune > 0 ? '+' : ''}${Math.round(params.tune)}st`}
              />
              <Knob
                label="FINE"
                value={params.fine}
                min={-50}
                max={50}
                onChange={(v) => setParam('fine', Math.round(v))}
                readout={`${params.fine > 0 ? '+' : ''}${Math.round(params.fine)}c`}
              />
            </div>
          </Module>

          <Module num="02" title="FILTER" grow={0.85}>
            <div className="flex justify-center gap-[22px]">
              <Knob
                label="CUTOFF"
                value={params.cutoff}
                min={120}
                max={9000}
                onChange={(v) => setParam('cutoff', v)}
                readout={params.cutoff >= 1000 ? `${(params.cutoff / 1000).toFixed(1)}k` : `${Math.round(params.cutoff)}`}
              />
              <Knob
                label="RESO"
                value={params.reso}
                min={0}
                max={20}
                onChange={(v) => setParam('reso', v)}
                readout={`Q${params.reso.toFixed(1)}`}
              />
            </div>
          </Module>

          <Module num="03" title="ENVELOPE · ADSR" grow={1.4}>
            <div className={`relative mb-[18px] h-[74px] overflow-hidden border border-border ${scopeBg}`}>
              <div className={scopeGrid} />
              <svg viewBox="0 0 300 74" preserveAspectRatio="none" className="relative block h-[74px] w-full">
                <polyline
                  points={adsrPoints}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <polygon points={`${adsrPoints} 298,72`} fill="rgba(var(--color-accent-rgb),0.08)" />
              </svg>
            </div>
            <div className="flex justify-between gap-[14px] [&>*]:flex-1">
              <Fader label="A" value={params.attack} min={0} max={2} onChange={(v) => setParam('attack', v)} height={64} />
              <Fader label="D" value={params.decay} min={0} max={2} onChange={(v) => setParam('decay', v)} height={64} />
              <Fader label="S" value={params.sustain} min={0} max={1} onChange={(v) => setParam('sustain', v)} height={64} />
              <Fader label="R" value={params.release} min={0} max={3} onChange={(v) => setParam('release', v)} height={64} />
            </div>
          </Module>

          <Module num="04" title="LFO" grow={0.85} last>
            <div className="flex justify-center gap-[22px]">
              <Knob
                label="RATE"
                value={params.lfoRate}
                min={0.1}
                max={16}
                onChange={(v) => setParam('lfoRate', v)}
                readout={`${params.lfoRate.toFixed(1)}Hz`}
              />
              <Knob
                label="DEPTH"
                value={params.lfoDepth}
                min={0}
                max={1}
                onChange={(v) => setParam('lfoDepth', v)}
                readout={`${Math.round(params.lfoDepth * 100)}%`}
              />
            </div>
          </Module>
        </div>

        {/* module row B */}
        <div className="flex flex-wrap items-stretch border-b border-border">
          <Module num="05" title="MIXER" grow={1.5}>
            <div className="flex justify-center gap-[34px]">
              <Fader label="OSC 1" value={params.mixOsc1} min={0} max={1} onChange={(v) => setParam('mixOsc1', v)} />
              <Fader label="OSC 2" value={params.mixOsc2} min={0} max={1} onChange={(v) => setParam('mixOsc2', v)} />
              <Fader label="SUB" value={params.mixSub} min={0} max={1} onChange={(v) => setParam('mixSub', v)} />
              <Fader label="NOISE" value={params.mixNoise} min={0} max={1} onChange={(v) => setParam('mixNoise', v)} />
            </div>
          </Module>

          <Module num="06" title="FX" grow={1}>
            <div className="flex justify-center gap-[22px]">
              <Knob
                label="REVERB"
                value={params.reverb}
                min={0}
                max={1}
                onChange={(v) => setParam('reverb', v)}
                readout={`${Math.round(params.reverb * 100)}%`}
              />
              <Knob
                label="DELAY"
                value={params.delay}
                min={0}
                max={1}
                onChange={(v) => setParam('delay', v)}
                readout={`${Math.round(params.delay * 100)}%`}
              />
            </div>
          </Module>

          <Module num="07" title="MASTER" grow={1} last>
            <div className="flex items-start justify-center gap-[28px]">
              <Knob
                label="VOLUME"
                value={params.volume}
                min={0}
                max={1}
                size={72}
                onChange={(v) => setParam('volume', v)}
                readout={`${Math.round(params.volume * 100)}%`}
              />
              <Fader label="GAIN" value={params.volume} min={0} max={1} onChange={(v) => setParam('volume', v)} accent />
            </div>
          </Module>
        </div>

        {/* keyboard */}
        <div className="px-[clamp(20px,4vw,56px)] pt-7 pb-10">
          <div className="mb-[18px] flex items-center justify-between font-mono text-[11px] tracking-[0.08em] text-text-muted">
            <span>
              <span className="mr-2 text-accent">08</span> KEYBOARD · 2 OCTAVES
            </span>
            <span>{lastMidi === null ? 'C3 — B4' : `PLAYING ${noteLabel(lastMidi)}`}</span>
          </div>
          <div className="relative flex h-[172px] gap-[4px]">
            {keyboard.whites.map((wk) => (
              <button
                key={wk.midi}
                type="button"
                className={active.has(wk.midi) ? whiteKeyActive : whiteKey}
                onPointerDown={(e) => {
                  e.preventDefault()
                  noteOn(wk.midi)
                }}
                onPointerUp={() => noteOff(wk.midi)}
                onPointerLeave={() => active.has(wk.midi) && noteOff(wk.midi)}
                onPointerCancel={() => noteOff(wk.midi)}
              >
                {keyLabel(wk.midi) && (
                  <span className="pointer-events-none absolute bottom-[12px] left-1/2 -translate-x-1/2 font-mono text-[11px] text-text-muted">
                    {keyLabel(wk.midi)}
                  </span>
                )}
              </button>
            ))}
            {keyboard.blacks.map((bk) => (
              <button
                key={bk.midi}
                type="button"
                className={active.has(bk.midi) ? blackKeyActive : blackKey}
                style={{ left: `calc(100% / ${keyboard.totalWhites} * ${bk.leftWhites} - 19px)` }}
                onPointerDown={(e) => {
                  e.preventDefault()
                  noteOn(bk.midi)
                }}
                onPointerUp={() => noteOff(bk.midi)}
                onPointerLeave={() => active.has(bk.midi) && noteOff(bk.midi)}
                onPointerCancel={() => noteOff(bk.midi)}
              >
                {keyLabel(bk.midi) && (
                  <span className="pointer-events-none font-mono text-[10px] text-[#a89e8d]">{keyLabel(bk.midi)}</span>
                )}
              </button>
            ))}
          </div>
          <div className="mt-[22px] max-w-[60ch] font-mono text-[11px] tracking-[0.02em] text-text-muted">
            Play with your mouse or the highlighted keyboard keys. Drag knobs and faders vertically to shape the
            sound.
          </div>
        </div>
      </div>
    </div>
  )
}

function Module({
  num,
  title,
  grow,
  last,
  children,
}: {
  num: string
  title: string
  grow: number
  last?: boolean
  children: React.ReactNode
}) {
  const base =
    'min-w-[220px] px-[clamp(20px,2.5vw,34px)] pt-7 pb-8 max-[900px]:!basis-full max-[900px]:border-b max-[900px]:border-r-0 max-[900px]:border-border'
  return (
    <div className={last ? base : `${base} border-r border-border`} style={{ flexGrow: grow, flexBasis: 0 }}>
      <div className="mb-6 font-mono text-[11px] tracking-[0.1em] text-text-muted">
        <span className="mr-2 text-accent">{num}</span> {title}
      </div>
      {children}
    </div>
  )
}
