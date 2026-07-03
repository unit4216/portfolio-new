import { motion } from 'framer-motion'
import styles from './Hero.module.css'

const FALL_DELAY = 1

function FallingWord({
  text,
  letterClassName,
  startIndex,
}: {
  text: string
  letterClassName?: string
  startIndex: number
}) {
  return (
    <span aria-label={text}>
      {text.split('').map((letter, i) => (
        <motion.span
          key={i}
          className={`${styles.letter} ${letterClassName ?? ''}`}
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={{ y: '110%', rotate: (i % 2 === 0 ? 1 : -1) * (20 + i * 6), opacity: 0 }}
          transition={{
            delay: FALL_DELAY + (startIndex + i) * 0.04,
            duration: 0.9,
            ease: [0.55, 0, 1, 0.45],
          }}
          aria-hidden="true"
        >
          {letter === ' ' ? ' ' : letter}
        </motion.span>
      ))}
    </span>
  )
}

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.eyebrow}>
        <span className={styles.eyebrowDot} />
        FULL-STACK ENGINEER
      </div>
      <h1 className={styles.heading}>
        <FallingWord text="Pablo" letterClassName={styles.nameSoft} startIndex={0} />
        <br />
        <FallingWord text="Paliza" letterClassName={styles.nameAccent} startIndex={5} />
        <br />
        <FallingWord text="Carre" letterClassName={styles.nameAccent} startIndex={11} />
      </h1>
      <p className={styles.tagline}>Database to pixel — software built to last.</p>
      <div className={styles.meta}>
        <span>SAN FRANCISCO</span>
        <span className={styles.metaDot} />
        <span>AVAILABLE Q3 2026</span>
      </div>
    </section>
  )
}
