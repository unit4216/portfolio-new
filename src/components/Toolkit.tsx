import { toolkit } from '../data/portfolio'
import { Reveal } from './Reveal'

export function Toolkit() {
  return (
    <section className="grid grid-cols-1 gap-5 border-t border-border px-[clamp(24px,6vw,88px)] py-[clamp(48px,8vw,80px)] sm:grid-cols-[200px_1fr] sm:gap-12">
      <Reveal className="font-mono text-[12px] tracking-[0.06em] text-text-muted">TOOLKIT</Reveal>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-10">
        {toolkit.map((group, i) => (
          <Reveal key={group.label} delay={i * 80}>
            <div className="mb-[14px] font-mono text-[11px] tracking-[0.08em] text-accent">{group.label}</div>
            <div className="text-[15px] leading-[2] text-text-body">
              {group.items.map((item, j) => (
                <span key={item}>
                  {item}
                  {j < group.items.length - 1 && <br />}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
