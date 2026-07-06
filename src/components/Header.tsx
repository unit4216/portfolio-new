import { useTheme } from '../theme/ThemeContext'

const navLink =
  "relative pb-[2px] text-inherit no-underline after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:content-[''] hover:text-text hover:after:origin-left hover:after:scale-x-100"

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-[clamp(24px,6vw,88px)] py-[34px]">
        <span className="inline-flex items-center gap-[9px] font-mono text-[13px] tracking-[0.12em]">
          <span className="h-[7px] w-[7px] rounded-full bg-accent" />
          PPC
        </span>
        <nav className="flex items-center gap-[clamp(16px,3vw,34px)] font-mono text-[12px] tracking-[0.04em] text-text-muted">
        <a className={navLink} href="#work">
          WORK
        </a>
        <a className={navLink} href="#about">
          ABOUT
        </a>
        <a className={navLink} href="#contact">
          CONTACT
        </a>
        <button
          type="button"
          className="cursor-pointer rounded-full border border-tag-border bg-transparent px-3 py-[6px] font-mono text-[11px] tracking-[0.06em] text-text-muted transition hover:-translate-y-px hover:border-accent hover:text-text active:scale-[0.94]"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span key={theme} className="inline-block animate-toggle-fade">
            {theme === 'light' ? 'DARK' : 'LIGHT'}
          </span>
        </button>
        </nav>
      </div>
    </header>
  )
}
