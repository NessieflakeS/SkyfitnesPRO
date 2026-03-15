import styles from './style.module.css'

type Props = {
  items: string[]
  compactTabletText?: boolean
}

export function FittingSection({ items, compactTabletText = false }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Подойдет для вас, если:</h2>
      <div className={styles.list}>
        {items.map((text, i) => (
          <div key={i} className={styles.card}>
            <span className={styles.index} aria-hidden>
              {i + 1}
            </span>
            <p
              className={`${styles.text} ${compactTabletText ? styles.textCompactTablet : ''}`}
            >
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
