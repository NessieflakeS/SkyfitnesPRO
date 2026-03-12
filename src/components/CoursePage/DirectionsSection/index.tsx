import styles from './style.module.css'

type Props = {
  directions: string[]
}

export function DirectionsSection({ directions }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Направления</h2>
      <div className={styles.card}>
        <div className={styles.grid}>
          {directions.map((name) => (
            <div key={name} className={styles.item}>
              <img
                src="/Icon_star.svg"
                alt=""
                className={styles.star}
                width={24}
                height={24}
                aria-hidden
              />
              <span className={styles.name}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
