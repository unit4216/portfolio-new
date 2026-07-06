import { projects } from '../data/portfolio'
import { Link } from '../router'
import { Reveal } from './Reveal'

const shotBase =
  'relative mt-[26px] flex h-[280px] items-center justify-center overflow-hidden bg-[repeating-linear-gradient(135deg,var(--color-shot-stripe-1)_0_11px,var(--color-shot-stripe-2)_11px_22px)] text-center font-mono text-[12px] tracking-[0.05em] text-shot-text transition-[translate,box-shadow,color] duration-[350ms] group-hover:-translate-y-1 group-hover:shadow-[0_24px_40px_-28px_rgba(0,0,0,0.35)]'
const shotDiv = `${shotBase} max-sm:h-[180px]`
const shotLink = `${shotBase} cursor-pointer border border-tag-border no-underline group-hover:border-accent group-hover:text-accent`
const shotSweep =
  'absolute left-0 top-0 h-[60px] w-[60%] -translate-x-[120%] bg-[linear-gradient(90deg,transparent,rgba(var(--color-accent-rgb),0.16),transparent)] group-hover:animate-[fp-sweep_1.1s_ease-in-out]'

export function SelectedWork() {
  return (
    <section
      id="work"
      className="border-t border-border px-[clamp(24px,6vw,88px)] pt-[clamp(48px,8vw,80px)] pb-10"
    >
      <div className="mb-[56px] flex items-baseline justify-between">
        <h2 className="m-0 font-serif text-[clamp(28px,4vw,40px)] font-normal tracking-[-0.01em]">Selected work</h2>
        <span className="font-mono text-[12px] text-text-muted">2021—2026</span>
      </div>

      {projects.map((project, i) => (
        <Reveal
          key={project.title}
          delay={i * 80}
          className={i === projects.length - 1 ? 'pb-[8px]' : 'mb-[52px] border-b border-border pb-[52px]'}
        >
          <div className="group flex gap-5 sm:gap-10">
            <span className="flex-shrink-0 pt-[8px] font-mono text-[13px] text-text-muted">{project.index}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="m-0 font-serif text-[clamp(24px,3.5vw,34px)] font-normal tracking-[-0.01em]">
                  {project.title}
                </h3>
                <span className="whitespace-nowrap font-mono text-[12px] text-text-muted">{project.year}</span>
              </div>
              <p className="mt-[14px] mb-5 max-w-[62ch] text-[16px] leading-[1.65] text-text-body">
                {project.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-[10px] font-mono text-[11px] text-text-muted">
                  {project.tags.map((tag) => (
                    <span key={tag} className="border border-tag-border px-[10px] py-[4px]">
                      {tag}
                    </span>
                  ))}
                </div>
                {project.githubHref && (
                  <a
                    href={project.githubHref}
                    className="inline-block flex-shrink-0 border-b border-tag-border pb-[2px] font-mono text-[11px] tracking-[0.05em] text-text-muted no-underline transition hover:border-accent hover:text-accent"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GITHUB ↗
                  </a>
                )}
              </div>
              {project.href && project.external ? (
                <a
                  href={project.href}
                  className={shotLink}
                  aria-label={`Open ${project.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={shotSweep} aria-hidden="true" />
                  {project.shotLabel}
                </a>
              ) : project.href ? (
                <Link to={project.href} className={shotLink} aria-label={`Open ${project.title}`}>
                  <span className={shotSweep} aria-hidden="true" />
                  {project.shotLabel}
                </Link>
              ) : (
                <div className={shotDiv}>
                  <span className={shotSweep} aria-hidden="true" />
                  {project.shotLabel}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  )
}
