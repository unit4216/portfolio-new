import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '../theme/ThemeContext'
import { Link } from '../router'
import { DEFAULT_PARAMS, midiToFreq, SynthEngine, type SynthParams, type Wave } from './engine'
import { Knob } from './Knob'
import { Fader } from './Fader'
import { Oscilloscope } from './Oscilloscope'
import styles from './SynthPage.module.css'

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
    <div className={styles.page} data-theme={theme}>
      <header className={styles.chrome}>
        <Link to="/" className={styles.back}>
          ← PPC
        </Link>
        <div className={styles.chromeMeta}>
          <span>WEB SYNTHESIZER</span>
          <span className={styles.chromeDivider}>·</span>
          <span>WARM ANALOG MONO</span>
        </div>
        <div className={styles.chromeRight}>
          <button
            type="button"
            className={styles.chip}
            onClick={() => setShowQwerty((v) => !v)}
            aria-pressed={showQwerty}
          >
            KEYS {showQwerty ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            className={styles.chip}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? 'DARK' : 'LIGHT'}
          </button>
        </div>
      </header>

      <div className={styles.panel}>
        {/* top bar */}
        <div className={styles.topBar}>
          <div className={styles.brand}>
            <span className={styles.brandName}>
              <span className={styles.led} />
              MONOLITH
            </span>
            <span className={styles.brandSub}>analog voice</span>
          </div>
          <div className={styles.status}>
            <span>INIT · PORTAMENTO</span>
            <span className={styles.statusDivider}>|</span>
            <span>MONO</span>
            <span className={styles.statusDivider}>|</span>
            <span>MIDI CH 01</span>
          </div>
        </div>

        {/* oscilloscope */}
        <div className={styles.scopeRow}>
          <div className={styles.scopeLabel}>
            <div className={styles.scopeTitle}>OSCILLOSCOPE</div>
            <div className={styles.scopeSub}>Waveform monitor</div>
          </div>
          <div className={styles.scope}>
            <div className={styles.scopeGrid} />
            <div className={styles.scopeMid} />
            <Oscilloscope engine={engine} wave={params.wave} />
            <div className={styles.scan} />
          </div>
          <div className={styles.scopeReadouts}>
            <div className={styles.readoutBlock}>
              <div className={styles.readoutBig}>
                {Math.round(freq)}
                <span className={styles.readoutUnit}>Hz</span>
              </div>
              <div className={styles.readoutCap}>FREQ · {freqNote}</div>
            </div>
            <div className={styles.readoutBlock}>
              <div className={styles.readoutMed}>{WAVE_SHORT[params.wave]}</div>
              <div className={styles.readoutCap}>WAVE</div>
            </div>
          </div>
        </div>

        {/* module row A */}
        <div className={styles.rowA}>
          <Module num="01" title="OSCILLATOR" grow={1.15}>
            <div className={styles.oscControls}>
              <div className={styles.shapeSelect}>
                {WAVES.map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={w === params.wave ? styles.shapeActive : styles.shape}
                    onClick={() => setParam('wave', w)}
                  >
                    {WAVE_SHORT[w]}
                  </button>
                ))}
                <div className={styles.shapeCap}>SHAPE</div>
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
            <div className={styles.knobRow}>
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
            <div className={styles.envGraph}>
              <div className={styles.scopeGrid} />
              <svg viewBox="0 0 300 74" preserveAspectRatio="none" className={styles.envSvg}>
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
            <div className={styles.faderRow}>
              <Fader label="A" value={params.attack} min={0} max={2} onChange={(v) => setParam('attack', v)} height={64} />
              <Fader label="D" value={params.decay} min={0} max={2} onChange={(v) => setParam('decay', v)} height={64} />
              <Fader label="S" value={params.sustain} min={0} max={1} onChange={(v) => setParam('sustain', v)} height={64} />
              <Fader label="R" value={params.release} min={0} max={3} onChange={(v) => setParam('release', v)} height={64} />
            </div>
          </Module>

          <Module num="04" title="LFO" grow={0.85} last>
            <div className={styles.knobRow}>
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
        <div className={styles.rowB}>
          <Module num="05" title="MIXER" grow={1.5}>
            <div className={styles.faderRowWide}>
              <Fader label="OSC 1" value={params.mixOsc1} min={0} max={1} onChange={(v) => setParam('mixOsc1', v)} />
              <Fader label="OSC 2" value={params.mixOsc2} min={0} max={1} onChange={(v) => setParam('mixOsc2', v)} />
              <Fader label="SUB" value={params.mixSub} min={0} max={1} onChange={(v) => setParam('mixSub', v)} />
              <Fader label="NOISE" value={params.mixNoise} min={0} max={1} onChange={(v) => setParam('mixNoise', v)} />
            </div>
          </Module>

          <Module num="06" title="FX" grow={1}>
            <div className={styles.knobRow}>
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
            <div className={styles.masterRow}>
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
        <div className={styles.keyboardSection}>
          <div className={styles.keyboardHead}>
            <span>
              <span className={styles.kbNum}>08</span> KEYBOARD · 2 OCTAVES
            </span>
            <span>{lastMidi === null ? 'C3 — B4' : `PLAYING ${noteLabel(lastMidi)}`}</span>
          </div>
          <div className={styles.keyboard}>
            {keyboard.whites.map((wk) => (
              <button
                key={wk.midi}
                type="button"
                className={active.has(wk.midi) ? styles.whiteKeyActive : styles.whiteKey}
                onPointerDown={(e) => {
                  e.preventDefault()
                  noteOn(wk.midi)
                }}
                onPointerUp={() => noteOff(wk.midi)}
                onPointerLeave={() => active.has(wk.midi) && noteOff(wk.midi)}
                onPointerCancel={() => noteOff(wk.midi)}
              >
                {keyLabel(wk.midi) && <span className={styles.keyCap}>{keyLabel(wk.midi)}</span>}
              </button>
            ))}
            {keyboard.blacks.map((bk) => (
              <button
                key={bk.midi}
                type="button"
                className={active.has(bk.midi) ? styles.blackKeyActive : styles.blackKey}
                style={{ left: `calc(100% / ${keyboard.totalWhites} * ${bk.leftWhites} - 19px)` }}
                onPointerDown={(e) => {
                  e.preventDefault()
                  noteOn(bk.midi)
                }}
                onPointerUp={() => noteOff(bk.midi)}
                onPointerLeave={() => active.has(bk.midi) && noteOff(bk.midi)}
                onPointerCancel={() => noteOff(bk.midi)}
              >
                {keyLabel(bk.midi) && <span className={styles.keyCapBlack}>{keyLabel(bk.midi)}</span>}
              </button>
            ))}
          </div>
          <div className={styles.hint}>
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
  return (
    <div className={last ? styles.moduleLast : styles.module} style={{ flexGrow: grow, flexBasis: 0 }}>
      <div className={styles.moduleTitle}>
        <span className={styles.moduleNum}>{num}</span> {title}
      </div>
      {children}
    </div>
  )
}
