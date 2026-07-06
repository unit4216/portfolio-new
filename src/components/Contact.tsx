import { contact } from '../data/portfolio'
import { Reveal } from './Reveal'

export function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-border bg-contact-bg px-[clamp(24px,6vw,88px)] pt-[clamp(56px,12vh,104px)] pb-[clamp(56px,10vh,96px)] text-contact-text"
    >
      <Reveal className="mb-[28px] font-mono text-[12px] tracking-[0.14em] text-contact-accent">CONTACT</Reveal>
      <Reveal delay={80}>
        <h2 className="mb-[44px] max-w-[16ch] font-serif text-[clamp(34px,6vw,64px)] font-normal leading-[1.05] tracking-[-0.02em]">
          Let&rsquo;s build something worth maintaining.
        </h2>
      </Reveal>
      <Reveal
        delay={160}
        className="flex flex-wrap items-center gap-[clamp(20px,5vw,56px)] font-mono text-[13px] tracking-[0.03em]"
      >
        <a
          href={`mailto:${contact.email}`}
          className="border-b border-contact-accent pb-[4px] text-inherit no-underline"
        >
          {contact.email}
          <span aria-hidden="true">&nbsp;→</span>
        </a>
        {contact.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#a89e8d] no-underline transition hover:text-contact-accent"
          >
            {link.label}
          </a>
        ))}
      </Reveal>
    </section>
  )
}
