import { projects } from '../data/portfolio'
import { Link } from '../router'
import { Reveal } from './Reveal'
import styles from './SelectedWork.module.css'

export function SelectedWork() {
  return (
    <section id="work" className={styles.work}>
      <div className={styles.headingRow}>
        <h2 className={styles.heading}>Selected work</h2>
        <span className={styles.range}>2021—2026</span>
      </div>

      {projects.map((project, i) => (
        <Reveal
          key={project.title}
          delay={i * 80}
          className={i === projects.length - 1 ? styles.projectLast : styles.project}
        >
          <div className={styles.projectInner}>
            <span className={styles.index}>{project.index}</span>
            <div className={styles.content}>
              <div className={styles.titleRow}>
                <h3 className={styles.title}>{project.title}</h3>
                <span className={styles.year}>{project.year}</span>
              </div>
              <p className={styles.description}>{project.description}</p>
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              {project.href ? (
                <Link to={project.href} className={styles.shotLink} aria-label={`Open ${project.title}`}>
                  <span className={styles.shotSweep} aria-hidden="true" />
                  {project.shotLabel}
                </Link>
              ) : (
                <div className={styles.shot}>
                  <span className={styles.shotSweep} aria-hidden="true" />
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
