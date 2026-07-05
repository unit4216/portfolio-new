import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.eyebrow}>
        <span className={styles.eyebrowDot} />
        FULL-STACK ENGINEER
      </div>
      <h1 className={styles.heading}>
        <span className={styles.nameLine}>
          <span className={styles.nameSoft}>Pablo</span>
        </span>
        <br />
        <span className={`${styles.nameLine} ${styles.nameLineDelay1}`}>
          <span className={styles.nameAccent}>Paliza</span>
        </span>
        <br />
        <span className={`${styles.nameLine} ${styles.nameLineDelay2}`}>
          <span className={styles.nameAccent}>Carre</span>
        </span>
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
