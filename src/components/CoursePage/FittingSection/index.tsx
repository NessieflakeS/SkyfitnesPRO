import styles from './style.module.css'

type Props = {
  items: string[]
}

export function FittingSection({ items }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Подойдет для вас, если:</h2>
      <div className={styles.list}>
        {items.map((text, i) => (
          <div key={i} className={styles.card}>
            <span className={styles.index} aria-hidden>
              {i + 1}
            </span>
            <p className={styles.text}>{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
