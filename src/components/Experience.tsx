import { experience } from '../data/portfolio'
import { Reveal } from './Reveal'

const row =
  'flex flex-col gap-1 py-[22px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-4'

export function Experience() {
  return (
    <section className="grid grid-cols-1 gap-5 border-t border-border px-[clamp(24px,6vw,88px)] py-[clamp(48px,8vw,80px)] sm:grid-cols-[200px_1fr] sm:gap-12">
      <Reveal className="font-mono text-[12px] tracking-[0.06em] text-text-muted">EXPERIENCE</Reveal>
      <Reveal delay={80} className="min-w-0">
        {experience.map((entry, i) => (
          <div
            key={entry.role}
            className={i === experience.length - 1 ? row : `${row} border-b border-border`}
          >
            <div>
              <div className="font-serif text-[23px]">{entry.role}</div>
              <div className="mt-[4px] text-[14px] text-text-muted">{entry.detail}</div>
            </div>
            <span className="whitespace-nowrap font-mono text-[12px] text-text-muted">{entry.range}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
