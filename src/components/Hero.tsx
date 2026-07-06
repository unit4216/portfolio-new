const riseIn = 'animate-[fp-rise-in_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]'
const nameLine =
  'inline-block translate-y-[32px] opacity-0 animate-[fp-rise-in_0.9s_cubic-bezier(0.16,1,0.3,1)_forwards]'
const nameAccent =
  'animate-grad bg-[linear-gradient(90deg,var(--color-accent-soft),var(--color-accent),var(--color-accent-soft))] bg-[length:200%_auto] bg-clip-text text-transparent'

export function Hero() {
  return (
    <section className="px-[clamp(24px,6vw,88px)] pt-[clamp(80px,16vh,150px)] pb-[clamp(70px,14vh,140px)] text-center">
      <div
        className={`mb-[40px] inline-flex translate-y-[20px] items-center gap-[10px] font-mono text-[12px] tracking-[0.14em] text-accent opacity-0 ${riseIn}`}
      >
        <span className="h-[7px] w-[7px] animate-pulse-dot rounded-full bg-accent" />
        FULL-STACK ENGINEER
      </div>
      <h1 className="m-0 font-serif text-[clamp(48px,9vw,108px)] font-normal leading-[0.94] tracking-[-0.03em]">
        <span className={`${nameLine} [animation-delay:100ms]`}>
          <span className="text-accent-soft">Pablo</span>
        </span>
        <br />
        <span className={`${nameLine} [animation-delay:220ms]`}>
          <span className={nameAccent}>Paliza</span>
        </span>
        <br />
        <span className={`${nameLine} [animation-delay:340ms]`}>
          <span className={nameAccent}>Carre</span>
        </span>
      </h1>
      <p
        className={`mx-auto mt-[36px] translate-y-[20px] font-serif text-[clamp(17px,2.4vw,24px)] italic tracking-[0.01em] text-text-muted opacity-0 ${riseIn} [animation-delay:460ms]`}
      >
        Database to pixel — software built to last.
      </p>
      <div
        className={`mt-[44px] flex translate-y-[16px] items-center justify-center gap-[20px] font-mono text-[12px] tracking-[0.06em] text-text-muted opacity-0 ${riseIn} [animation-delay:560ms]`}
      >
        <span>SAN FRANCISCO</span>
        <span className="h-[4px] w-[4px] animate-pulse-dot rounded-full bg-accent" />
        <span>AVAILABLE Q3 2026</span>
      </div>
      <div className="mt-[40px]">
        <a
          href="/Pablo_Paliza-Carre_Resume.pdf"
          download
          className={`inline-flex translate-y-[16px] items-center gap-[10px] rounded-full border border-tag-border px-[22px] py-[11px] font-mono text-[12px] tracking-[0.08em] text-text-muted no-underline opacity-0 transition-colors ${riseIn} [animation-delay:660ms] hover:border-accent hover:text-accent`}
        >
          DOWNLOAD RÉSUMÉ
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  )
}
