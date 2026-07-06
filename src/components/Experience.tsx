import { experience } from '../data/portfolio'
import { Reveal } from './Reveal'

export function Experience() {
  return (
    <section className="grid grid-cols-1 gap-5 border-t border-border px-[clamp(24px,6vw,88px)] py-[clamp(48px,8vw,80px)] sm:grid-cols-[200px_1fr] sm:gap-12">
      <Reveal className="font-mono text-[12px] tracking-[0.06em] text-text-muted">EXPERIENCE</Reveal>
      <Reveal delay={80} className="min-w-0">
        {experience.map((entry, i) => (
          <div
            key={entry.company}
            className={
              i === experience.length - 1
                ? 'py-[22px]'
                : 'border-b border-border py-[22px]'
            }
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <div>
                <div className="font-serif text-[23px]">{entry.company}</div>
                <div className="mt-[4px] text-[14px] text-text-muted">{entry.location}</div>
              </div>
              <span className="whitespace-nowrap font-mono text-[12px] text-text-muted">
                {entry.range}
              </span>
            </div>

            <ol className="mt-[16px] ml-[3px] flex flex-col gap-[10px] border-l border-border pl-[20px]">
              {entry.roles.map((r, j) => (
                <li
                  key={r.role}
                  className="relative flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-[0.55em] left-[-24px] h-[7px] w-[7px] -translate-y-1/2 rounded-full border ${
                      j === 0
                        ? 'border-accent bg-accent'
                        : 'border-text-muted bg-bg'
                    }`}
                  />
                  <span className="text-[15px]">{r.role}</span>
                  {entry.roles.length > 1 && (
                    <span className="whitespace-nowrap font-mono text-[12px] text-text-muted">
                      {r.range}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
