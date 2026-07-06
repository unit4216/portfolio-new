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
          I&rsquo;m a software engineer who has several years of experience building full-stack internal tools and data infrastructure.
        </p>
        <p className="m-0 text-[16px] leading-[1.7] text-text-body">
          Over the past four years, I&rsquo;ve grown from junior developer to lead at my current role, building
          applications and data pipelines end to end. These days I split my time between hands-on engineering and
          day-to-day leadership of a small team, working mostly in TypeScript, React, Node, and GCP.
        </p>
      </Reveal>
    </section>
  )
}
