import { Reveal } from './Reveal'

export function About() {
  return (
    <section
      id="about"
      className="grid grid-cols-1 gap-5 border-t border-border px-[clamp(24px,6vw,88px)] py-[clamp(48px,8vw,72px)] sm:grid-cols-[200px_1fr] sm:gap-12"
    >
      <Reveal className="font-mono text-[12px] tracking-[0.06em] text-text-muted">ABOUT</Reveal>
      <Reveal delay={80} className="max-w-[60ch]">
        <p className="mt-0 mb-[22px] font-serif text-[clamp(20px,3vw,27px)] font-normal leading-[1.4] tracking-[-0.01em]">
          I like the unglamorous middle of the stack — the queues, the migrations, the edge cases — because
          that&rsquo;s where reliability is really decided.
        </p>
        <p className="m-0 text-[16px] leading-[1.7] text-text-body">
          Previously I led platform teams building payments and analytics tooling. Today I split my time between
          hands-on engineering and helping small teams get their architecture right before they scale.
        </p>
      </Reveal>
    </section>
  )
}
