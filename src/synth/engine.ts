export type Wave = 'Sine' | 'Saw' | 'Square' | 'Triangle'

const WAVE_TYPE: Record<Wave, OscillatorType> = {
  Sine: 'sine',
  Saw: 'sawtooth',
  Square: 'square',
  Triangle: 'triangle',
}

export interface SynthParams {
  wave: Wave
  tune: number // semitones, -12..12
  fine: number // cents, -50..50
  cutoff: number // Hz
  reso: number // Q, 0..20
  attack: number // s
  decay: number // s
  sustain: number // 0..1
  release: number // s
  lfoRate: number // Hz
  lfoDepth: number // 0..1 (modulation amount on cutoff)
  mixOsc1: number // 0..1
  mixOsc2: number // 0..1
  mixSub: number // 0..1
  mixNoise: number // 0..1
  reverb: number // 0..1 wet
  delay: number // 0..1 wet
  volume: number // 0..1
}

export const DEFAULT_PARAMS: SynthParams = {
  wave: 'Saw',
  tune: 0,
  fine: 0,
  cutoff: 2600,
  reso: 6,
  attack: 0.01,
  decay: 0.28,
  sustain: 0.6,
  release: 0.35,
  lfoRate: 4,
  lfoDepth: 0.25,
  mixOsc1: 0.78,
  mixOsc2: 0.54,
  mixSub: 0.4,
  mixNoise: 0.18,
  reverb: 0.28,
  delay: 0.2,
  volume: 0.72,
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

interface Voice {
  midi: number
  gain: GainNode
  stop: () => void
}

/**
 * A small subtractive synth built on the Web Audio API. Voices are summed into
 * a shared filter → FX (delay + reverb) → master → analyser chain, so filter,
 * LFO, FX and master controls all respond live while notes are held.
 */
export class SynthEngine {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private filter!: BiquadFilterNode
  private analyser!: AnalyserNode
  private lfo!: OscillatorNode
  private lfoGain!: GainNode
  private delay!: DelayNode
  private delayFeedback!: GainNode
  private delayWet!: GainNode
  private reverb!: ConvolverNode
  private reverbWet!: GainNode
  private noiseBuffer!: AudioBuffer
  private voices = new Map<number, Voice>()

  params: SynthParams = { ...DEFAULT_PARAMS }

  /** Lazily create the AudioContext — must happen inside a user gesture. */
  ensure(): AudioContext {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return this.ctx
    }
    const AC: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AC()
    this.ctx = ctx

    this.master = ctx.createGain()
    this.master.gain.value = this.params.volume

    this.analyser = ctx.createAnalyser()
    this.analyser.fftSize = 2048
    this.analyser.smoothingTimeConstant = 0.1

    this.master.connect(this.analyser)
    this.analyser.connect(ctx.destination)

    // Shared filter
    this.filter = ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.value = this.params.cutoff
    this.filter.Q.value = this.params.reso
    this.filter.connect(this.master)

    // Delay send
    this.delay = ctx.createDelay(1.0)
    this.delay.delayTime.value = 0.28
    this.delayFeedback = ctx.createGain()
    this.delayFeedback.gain.value = 0.38
    this.delayWet = ctx.createGain()
    this.delayWet.gain.value = this.params.delay
    this.filter.connect(this.delay)
    this.delay.connect(this.delayFeedback)
    this.delayFeedback.connect(this.delay)
    this.delay.connect(this.delayWet)
    this.delayWet.connect(this.master)

    // Reverb send
    this.reverb = ctx.createConvolver()
    this.reverb.buffer = this.makeImpulse(ctx, 2.4, 2.6)
    this.reverbWet = ctx.createGain()
    this.reverbWet.gain.value = this.params.reverb
    this.filter.connect(this.reverb)
    this.reverb.connect(this.reverbWet)
    this.reverbWet.connect(this.master)

    // LFO → filter cutoff
    this.lfo = ctx.createOscillator()
    this.lfo.type = 'sine'
    this.lfo.frequency.value = this.params.lfoRate
    this.lfoGain = ctx.createGain()
    this.lfoGain.gain.value = this.lfoAmount()
    this.lfo.connect(this.lfoGain)
    this.lfoGain.connect(this.filter.frequency)
    this.lfo.start()

    this.noiseBuffer = this.makeNoise(ctx)
    return ctx
  }

  private makeNoise(ctx: AudioContext): AudioBuffer {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }

  private makeImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * seconds)
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch)
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
      }
    }
    return impulse
  }

  private lfoAmount(): number {
    // Depth scales cutoff modulation up to roughly ±cutoff.
    return this.params.lfoDepth * Math.min(this.params.cutoff, 4000)
  }

  setParams(partial: Partial<SynthParams>) {
    this.params = { ...this.params, ...partial }
    if (!this.ctx) return
    const now = this.ctx.currentTime
    this.master.gain.setTargetAtTime(this.params.volume, now, 0.02)
    this.filter.frequency.setTargetAtTime(this.params.cutoff, now, 0.02)
    this.filter.Q.setTargetAtTime(this.params.reso, now, 0.02)
    this.lfo.frequency.setTargetAtTime(this.params.lfoRate, now, 0.02)
    this.lfoGain.gain.setTargetAtTime(this.lfoAmount(), now, 0.02)
    this.delayWet.gain.setTargetAtTime(this.params.delay, now, 0.02)
    this.reverbWet.gain.setTargetAtTime(this.params.reverb, now, 0.02)
  }

  getAnalyser(): AnalyserNode | null {
    return this.ctx ? this.analyser : null
  }

  isActive(): boolean {
    return this.voices.size > 0
  }

  noteOn(midi: number) {
    const ctx = this.ensure()
    if (this.voices.has(midi)) return
    const p = this.params
    const now = ctx.currentTime
    const freq = midiToFreq(midi + p.tune)

    const voiceGain = ctx.createGain()
    voiceGain.gain.value = 0
    voiceGain.connect(this.filter)

    const sources: AudioScheduledSourceNode[] = []
    const addOsc = (f: number, level: number, detune: number, type: OscillatorType) => {
      if (level <= 0) return
      const osc = ctx.createOscillator()
      osc.type = type
      osc.frequency.value = f
      osc.detune.value = detune
      const g = ctx.createGain()
      g.gain.value = level
      osc.connect(g)
      g.connect(voiceGain)
      osc.start(now)
      sources.push(osc)
    }

    const type = WAVE_TYPE[p.wave]
    addOsc(freq, p.mixOsc1, p.fine, type)
    addOsc(freq, p.mixOsc2, p.fine + 7, type) // osc 2, lightly detuned
    addOsc(freq / 2, p.mixSub, 0, 'sine') // sub oscillator, one octave down

    if (p.mixNoise > 0) {
      const noise = ctx.createBufferSource()
      noise.buffer = this.noiseBuffer
      noise.loop = true
      const g = ctx.createGain()
      g.gain.value = p.mixNoise * 0.6
      noise.connect(g)
      g.connect(voiceGain)
      noise.start(now)
      sources.push(noise)
    }

    // ADSR amp envelope
    const peak = 0.9
    voiceGain.gain.cancelScheduledValues(now)
    voiceGain.gain.setValueAtTime(0, now)
    voiceGain.gain.linearRampToValueAtTime(peak, now + Math.max(0.001, p.attack))
    voiceGain.gain.linearRampToValueAtTime(
      Math.max(0.0001, peak * p.sustain),
      now + Math.max(0.001, p.attack) + Math.max(0.001, p.decay),
    )

    this.voices.set(midi, {
      midi,
      gain: voiceGain,
      stop: () => sources.forEach((s) => s.stop()),
    })
  }

  noteOff(midi: number) {
    const voice = this.voices.get(midi)
    if (!voice || !this.ctx) return
    this.voices.delete(midi)
    const now = this.ctx.currentTime
    const rel = Math.max(0.02, this.params.release)
    voice.gain.gain.cancelScheduledValues(now)
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now)
    voice.gain.gain.linearRampToValueAtTime(0.0001, now + rel)
    window.setTimeout(() => voice.stop(), rel * 1000 + 60)
  }

  allNotesOff() {
    for (const midi of [...this.voices.keys()]) this.noteOff(midi)
  }
}
